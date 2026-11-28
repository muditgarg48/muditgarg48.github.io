"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GraphCanvas, Icon, Sphere, darkTheme } from 'reagraph';
import { useReducedMotion } from 'framer-motion';
import { useSitePaneWidth } from '../../hooks/sitePane';
import './SkillGraph.css';

const DOMAIN_COLORS = {
    frontend: '#00abf0',
    backend: '#6d8bff',
    data: '#2dd4bf',
    'ai-ml': '#a78bfa',
    mobile: '#f472b6',
    'cloud-devops': '#7dd3fc',
    embedded: '#fb923c',
    automation: '#a3e635',
};
const CORE_COLOR = '#d8e6f0';
const FALLBACK_COLOR = '#8fa3b3';

// Unit-sphere points (Fibonacci lattice) for the dotted domain shells.
const SHELL_DOTS = (() => {
    const n = 260, pts = new Float32Array(n * 3), golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = golden * i;
        pts.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
    }
    return pts;
})();

const theme = {
    ...darkTheme,
    canvas: { fog: '#0a1219' }, // no background: the section's own surface shows through
    node: {
        ...darkTheme.node,
        activeFill: '#f4f8fb',
        inactiveOpacity: 0.15,
        label: { color: '#8fa3b3', stroke: '#0a1219', activeColor: '#f4f8fb' },
    },
    edge: { ...darkTheme.edge, fill: '#2a3a47', activeFill: '#00abf0', opacity: 0.6, inactiveOpacity: 0.08 },
};

const DomainShell = ({ color, size, opacity }) => (
    <group>
        {/* Not hit-testable: each dot under the cursor would count as a separate hit and fire the node's
            click once per dot, toggling the domain an unpredictable number of times. The core sphere is the click target. */}
        <points scale={size} raycast={() => null}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[SHELL_DOTS, 3]} />
            </bufferGeometry>
            <pointsMaterial color={color} size={0.9} transparent opacity={0.85 * opacity} depthWrite={false} />
        </points>
        {/* faint core: the glow and the click target */}
        <mesh>
            <sphereGeometry args={[size * 0.92, 32, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.07 * opacity} depthWrite={false} />
        </mesh>
    </group>
);

const renderNode = (props) => {
    const { node } = props;
    if (node.data.kind === 'domain') return <DomainShell {...props} />;
    // The icon is the node; only icon-less skills get a sphere.
    return node.icon ? <Icon {...props} image={node.icon} size={props.size + 6} /> : <Sphere {...props} />;
};

const AXES = [['X', [1, 0, 0], '#f87171'], ['Y', [0, 1, 0], '#4ade80'], ['Z', [0, 0, 1], '#60a5fa']];

// World axis -> camera space: rotate by the inverse of the camera quaternion.
const toView = ({ x, y, z, w }, [vx, vy, vz]) => {
    const qx = -x, qy = -y, qz = -z;
    const tx = 2 * (qy * vz - qz * vy), ty = 2 * (qz * vx - qx * vz), tz = 2 * (qx * vy - qy * vx);
    return [vx + w * tx + (qy * tz - qz * ty), vy + w * ty + (qz * tx - qx * tz), vz + w * tz + (qx * ty - qy * tx)];
};

// Axis indicator that follows the camera; clicking it resets the view and the drill-down.
const AxisGizmo = ({ graphRef, onReset }) => {
    const [quat, setQuat] = useState({ x: 0, y: 0, z: 0, w: 1 });
    useEffect(() => {
        let frame, controls;
        const sync = () => setQuat(controls.camera.quaternion.clone());
        const attach = () => {
            controls = graphRef.current?.getControls();
            if (!controls) { frame = requestAnimationFrame(attach); return; } // controls appear after the canvas mounts
            controls.addEventListener('update', sync);
            sync();
        };
        attach();
        return () => { cancelAnimationFrame(frame); controls?.removeEventListener('update', sync); };
    }, [graphRef]);

    const axes = AXES.map(([label, v, color]) => {
        const [x, y, z] = toView(quat, v);
        return { label, color, x: x * 15, y: -y * 15, z };
    }).sort((a, b) => a.z - b.z); // far axes first, near ones drawn on top

    return (
        <button type="button" className="skill-graph-gizmo" onClick={onReset} aria-label="Reset view">
            <svg viewBox="-22 -22 44 44" width="44" height="44" aria-hidden="true">
                {axes.map(({ label, color, x, y, z }) => (
                    <g key={label} opacity={z < 0 ? 0.45 : 1}>
                        <line x1="0" y1="0" x2={x} y2={y} stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <text x={x * 1.3} y={y * 1.3} fill={color} fontSize="8" fontWeight="600" textAnchor="middle" dominantBaseline="central">{label}</text>
                    </g>
                ))}
            </svg>
            <span className="skill-graph-gizmo-tip" role="tooltip">Reset view</span>
        </button>
    );
};

// Devicon SVGs only carry a viewBox; WebGL can't upload an image with no intrinsic size, so give them one.
const useSizedIcons = (skills) => {
    const [icons, setIcons] = useState({});
    useEffect(() => {
        let cancelled = false;
        Promise.all(Object.entries(skills).filter(([, s]) => s.icon).map(async ([id, s]) => {
            try {
                const svg = (await (await fetch(s.icon)).text()).replace('<svg', '<svg width="256" height="256"');
                return [id, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`];
            } catch {
                return [id, undefined]; // no icon: falls back to a plain sphere
            }
        })).then((entries) => !cancelled && setIcons(Object.fromEntries(entries)));
        return () => { cancelled = true; };
    }, [skills]);
    return icons;
};

// Domains are always visible; an expanded, visible node makes its children visible.
const revealFrom = (roots, children, open) => {
    const seen = new Set(roots);
    const queue = [...roots];
    while (queue.length) {
        const id = queue.shift();
        if (!open.includes(id)) continue;
        for (const c of children[id] || []) if (!seen.has(c)) { seen.add(c); queue.push(c); }
    }
    return seen;
};

// Shortest undirected path between two nodes (ids, inclusive), or [] if they aren't connected.
const shortestPath = (neighbours, from, to) => {
    const prev = { [from]: null };
    const queue = [from];
    while (queue.length) {
        const id = queue.shift();
        if (id === to) break;
        for (const n of neighbours[id] || []) if (!(n in prev)) { prev[n] = id; queue.push(n); }
    }
    if (!(to in prev)) return [];
    const path = [];
    for (let id = to; id !== null; id = prev[id]) path.push(id);
    return path;
};

// Search: the skills matching any term, plus the shortest chain between every pair of matches, so related skills
// connect naturally ("supabase react" -> Supabase - PostgreSQL - Prisma - TypeScript - React). A single match brings
// its direct neighbours for context. Returns null when there's nothing to search for.
const searchSubgraph = (allNodes, neighbours, query) => {
    const terms = query.toLowerCase().split(/[\s,]+/).filter((t) => t.length >= 2);
    if (!terms.length) return null;
    const matches = allNodes.filter((n) => terms.some((t) => n.data.name.toLowerCase().includes(t))).map((n) => n.id);
    const keep = new Set(matches);
    if (matches.length === 1) (neighbours[matches[0]] || []).forEach((id) => keep.add(id));
    for (let i = 0; i < matches.length; i++) {
        for (let j = i + 1; j < matches.length; j++) shortestPath(neighbours, matches[i], matches[j]).forEach((id) => keep.add(id));
    }
    return { matches, keep };
};

// skills.json groups skills by category with each skill's links on it (`leads_to`), so the same file gives the RAG
// backend one self-contained chunk per skill. Flatten it into { domains, skills, graph } for the graph view.
const toGraph = (data) => {
    const domains = {}, skills = {}, graph = {};
    Object.entries(data._meta.domains).forEach(([id, d]) => {
        domains[id] = d.name;
        if (d.leads_to?.length) graph[id] = d.leads_to;
    });
    Object.values(data.skills).flat().forEach(({ id, leads_to: leadsTo, ...skill }) => {
        skills[id] = skill;
        if (leadsTo?.length) graph[id] = leadsTo;
    });
    return { domains, skills, graph };
};

const SkillGraph = ({ graph: data }) => {
    const graph = useMemo(() => toGraph(data), [data]);
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();
    const icons = useSizedIcons(graph.skills);

    const { allNodes, allEdges, parents, domains, descendantsOf, neighbours } = useMemo(() => {
        const children = graph.graph;
        const descendants = (id, seen = new Set()) => {
            (children[id] || []).forEach((c) => { if (!seen.has(c)) { seen.add(c); descendants(c, seen); } });
            return seen;
        };
        const domains = Object.entries(graph.domains);
        const allEdges = Object.entries(children).flatMap(([source, targets]) =>
            targets.map((target) => ({ id: `${source}->${target}`, source, target })));
        const neighbours = {}; // undirected, for search paths
        allEdges.forEach(({ source, target }) => {
            (neighbours[source] ??= []).push(target);
            (neighbours[target] ??= []).push(source);
        });
        return {
            allNodes: [
                ...domains.map(([id, name]) => ({
                    id, label: name.toUpperCase(), size: 22,
                    fill: DOMAIN_COLORS[id] || FALLBACK_COLOR, data: { kind: 'domain', name },
                })),
                ...Object.entries(graph.skills).map(([id, s]) => ({
                    id, label: s.name, icon: icons[id], size: 9,
                    fill: s.domain ? DOMAIN_COLORS[s.domain] || FALLBACK_COLOR : CORE_COLOR, data: { kind: 'skill', name: s.name },
                })),
            ],
            allEdges,
            parents: Object.keys(children),
            domains,
            descendantsOf: Object.fromEntries(Object.keys(children).map((id) => [id, descendants(id)])),
            neighbours,
        };
    }, [graph, icons]);

    // Drill-down: only the domains show at first; expanding a node reveals its children.
    const [expanded, setExpanded] = useState([]);
    const reveal = (open) => revealFrom(domains.map(([id]) => id), graph.graph, open);
    const toggle = (id) => {
        if (!parents.includes(id)) return;
        setExpanded((e) => {
            if (!e.includes(id)) return [...e, id];
            const next = e.filter((x) => x !== id);
            const stillVisible = reveal(next);
            return next.filter((x) => stillVisible.has(x)); // forget expansions that just went out of view
        });
    };

    const [query, setQuery] = useState('');
    const [is3d, setIs3d] = useState(true);

    // Narrow screens: pull nodes closer (defaults: nodeStrength -250, linkDistance 50) so the fitted graph,
    // and its labels, come out bigger instead of shrinking to fit a wide spread.
    const narrow = useSitePaneWidth() <= 1000;
    const layoutOverrides = useMemo(() => (narrow ? { nodeStrength: -110, linkDistance: 32 } : undefined), [narrow]);
    const search = useMemo(() => searchSubgraph(allNodes, neighbours, query), [allNodes, neighbours, query]);
    const searching = search?.matches.length > 0;

    // Every link between two visible nodes is drawn, so a newly revealed node joins everything already on screen.
    // Memoized: new arrays on every render (e.g. on hover) would make reagraph re-run the layout.
    const { nodes, edges } = useMemo(() => {
        if (searching) {
            return {
                nodes: allNodes.filter((n) => search.keep.has(n.id)),
                edges: allEdges.filter((e) => search.keep.has(e.source) && search.keep.has(e.target)),
            };
        }
        const visible = revealFrom(domains.map(([id]) => id), graph.graph, expanded);
        const hiddenUnder = (id) => [...(descendantsOf[id] || [])].filter((x) => !visible.has(x)).length;
        return {
            // "React (4)": how many skills are still hidden beneath a node, so viewers know there's more to explore.
            nodes: allNodes.filter((n) => visible.has(n.id)).map((n) => {
                const hidden = hiddenUnder(n.id);
                return hidden ? { ...n, label: `${n.label} (${hidden})` } : n;
            }),
            edges: allEdges.filter((e) => visible.has(e.source) && visible.has(e.target)),
        };
    }, [allNodes, allEdges, domains, descendantsOf, graph, expanded, searching, search]);

    // Re-frame once the layout has settled after the graph changes, so new nodes aren't cut off.
    useEffect(() => {
        const t = setTimeout(() => ref.current?.fitNodesInView(), 900);
        return () => clearTimeout(t);
    }, [nodes, is3d]);

    // Hover highlight: the hovered node, its neighbours and their links. Derived from the *current* edges,
    // so nodes revealed by clicking the hovered node light up too (reagraph's useSelection snapshots
    // neighbours on pointer-over, which left freshly revealed nodes dimmed until the pointer moved away).
    const [hoveredId, setHoveredId] = useState(null);
    const actives = useMemo(() => {
        if (!hoveredId) return [];
        const linked = edges.filter((e) => e.source === hoveredId || e.target === hoveredId);
        return [hoveredId, ...linked.flatMap((e) => [e.id, e.source, e.target])];
    }, [hoveredId, edges]);

    const [fullscreen, setFullscreen] = useState(false);
    useEffect(() => {
        if (!fullscreen) return;
        const onKey = (e) => e.key === 'Escape' && setFullscreen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [fullscreen]);
    // Re-frame for the new canvas size when entering or leaving the popup.
    useEffect(() => {
        const t = setTimeout(() => ref.current?.fitNodesInView(), 300);
        return () => clearTimeout(t);
    }, [fullscreen]);

    const graphView = (
        <div
            className={`skill-graph${fullscreen ? ' is-fullscreen' : ''}${narrow ? ' is-narrow' : ''}`}
            role={fullscreen ? 'dialog' : undefined}
            aria-modal={fullscreen || undefined}
            aria-label={fullscreen ? 'Skill graph' : undefined}
        >
            <div className="skill-graph-toolbar">
                <label className={`skill-graph-search${query && !searching ? ' no-match' : ''}`}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
                    </svg>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={narrow ? 'Search skills' : 'Search, e.g. supabase react'}
                        aria-label="Search skills"
                        aria-invalid={Boolean(query && !searching)}
                    />
                </label>
                <div className="skill-graph-dims" role="group" aria-label="View">
                    <button type="button" className={is3d ? '' : 'on'} aria-pressed={!is3d} onClick={() => setIs3d(false)}>2D</button>
                    <button type="button" className={is3d ? 'on' : ''} aria-pressed={is3d} onClick={() => setIs3d(true)}>3D</button>
                </div>
                <button
                    type="button"
                    className="skill-graph-icon-btn"
                    onClick={() => { setQuery(''); setExpanded(parents); }}
                    aria-label="Expand all"
                    title="Expand all"
                >
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22v-6M12 8V2M4 12h16M15 19l-3 3-3-3M15 5l-3-3-3 3" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="skill-graph-icon-btn"
                    onClick={() => setFullscreen((f) => !f)}
                    aria-label={fullscreen ? 'Close full screen' : 'Open full screen'}
                    title={fullscreen ? 'Close (Esc)' : 'Full screen'}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {fullscreen
                            ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
                            : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
                    </svg>
                </button>
            </div>
            <AxisGizmo
                graphRef={ref}
                onReset={() => {
                    setQuery('');
                    setExpanded([]);
                    ref.current?.resetControls(true);
                }}
            />
            <p className="skill-graph-hint">
                {searching
                    ? 'Showing your search and how those skills connect. Clear it to go back to exploring.'
                    : query
                        ? 'No skills match that search.'
                        : narrow
                            ? 'Tap a node to reveal what’s under it. Search two skills to see how they connect.'
                            : `Click a node to reveal what’s under it; the number is how much is left. Drag to ${is3d ? 'rotate' : 'pan'}, scroll to zoom.`}
            </p>
            <div className="skill-graph-canvas">
                <GraphCanvas
                    ref={ref}
                    nodes={nodes}
                    edges={edges}
                    theme={theme}
                    layoutType={is3d ? 'forceDirected3d' : 'forceDirected2d'}
                    cameraMode={is3d ? 'rotate' : 'pan'}
                    layoutOverrides={layoutOverrides}
                    sizingType="default"
                    labelType="nodes"
                    edgeArrowPosition="none"
                    actives={actives}
                    animated={!reduceMotion}
                    renderNode={renderNode}
                    onNodeClick={(node) => !searching && toggle(node.id)}
                    onNodePointerOver={(node) => setHoveredId(node.id)}
                    onNodePointerOut={() => setHoveredId(null)}
                />
            </div>
        </div>
    );

    // Portal to <body>: transformed ancestors (Reveal, mode slide) would otherwise trap position: fixed.
    if (!fullscreen) return graphView;
    return (
        <>
            <div className="skill-graph-placeholder" aria-hidden="true" />
            {createPortal(
                <div className="skill-graph-backdrop" onClick={(e) => e.target === e.currentTarget && setFullscreen(false)}>
                    {graphView}
                </div>,
                document.body,
            )}
        </>
    );
};

export default SkillGraph;
