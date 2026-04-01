import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import './ProjectsSection.css';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import { getBranchInfo, getCommitsList, getCommitDetails } from "../../services/githubCache";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import git_repo from "../../assets/icons/repo.json";
import redirect from "../../assets/icons/redirect.json";

const ActivityTag = memo(({ lastUpdated }) => {
    const tag = useMemo(() => {
        if (lastUpdated === "Fetching...") return null;
        const date = new Date(lastUpdated);
        const now = new Date();

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(now.getMonth() - 6);

        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);

        if (date >= oneMonthAgo && date <= now) return "🟢 Actively developed";
        if (date < oneMonthAgo && date >= sixMonthAgo) return "🟡 Recently updated";
        if (date <= yearAgo) return "⚪ Archived";
        return null;
    }, [lastUpdated]);

    return (
        <div className="item-status-meta">
            <div className="status-group">
                {tag && <div className="active-tag">{tag}</div>}
            </div>
            <div className="last-updated-text">Updated: {lastUpdated}</div>
        </div>
    );
});

const ProjectPill = memo(({ speciality }) => {
    if (!speciality || speciality === "") return null;

    let label = "🧩 Project";
    let className = "pill-other";

    if (speciality === "COMING SOON") {
        label = "🚧 Building";
        className = "pill-building";
    } else {
        label = `⭐ ${speciality}`;
        className = "pill-featured";
    }

    return (
        <div className="pill-line">
            <span className={`category-pill ${className}`}>{label}</span>
        </div>
    );
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function useGitHubData(github) {
    const [lastUpdated, setLastUpdated] = useState("Fetching...");
    const [lastUpdatedError, setLastUpdatedError] = useState(null);

    useEffect(() => {
        if (!github?.repo_owner || !github?.repo_name || !github?.repo_branch) return;

        getBranchInfo(github.repo_owner, github.repo_name, github.repo_branch)
            .then(data => {
                setLastUpdated(formatDate(data.commit.commit.committer.date));
            })
            .catch(error => {
                console.error('Error fetching branch info:', error);
                setLastUpdatedError(error.message || error.toString());
            });
    }, [github]);

    return { lastUpdated, lastUpdatedError };
}

const ProjectKPIs = memo(({ kpis }) => {
    if (!kpis || kpis.length === 0) return null;
    return (
        <div className="project-kpis">
            {
                kpis.map((kpi, index) => (
                    <div key={index} className="kpi-pill">
                        {kpi}
                    </div>
                ))
            }
        </div>
    );
});

const ProjectTechStack = memo(({ tech_stack }) => {
    if (!tech_stack || tech_stack.length === 0) return null;
    return (
        <div className="project-tech">
            {
                tech_stack.map((tech, index) => (
                    <span key={index} className="tech-pill">{tech}</span>
                ))
            }
        </div>
    );
});

const ErrorMessage = memo(({ error, className = "" }) => {
    if (!error) return null;

    const getErrorMessage = (error) => {
        if (typeof error === 'string') return error;
        if (error.message) return error.message;
        return 'Failed to fetch data from GitHub';
    };

    return (
        <div className={`github-error-message ${className}`}>
            <span className="error-icon">⚠️</span>
            <span className="error-text">{getErrorMessage(error)}</span>
        </div>
    );
});

const PrivateRibbon = memo(() => {
    return (
        <div className="private-ribbon">
            <span className="ribbon-icon">🔒</span>
            <span className="ribbon-text">PRIVATE</span>
        </div>
    );
});

const SingleCommit = memo(({ commit }) => {
    const message = commit.commit.message;
    const redirectUrl = commit.html_url;
    const commitId = commit.sha.substring(0, 7);
    const details = commit.details;

    const stats = details ? details.stats : { additions: 0, deletions: 0 };
    const filesChanged = details ? details.files.length : 0;
    const commitDate = details ? formatDate(details.commit.committer.date) : "";

    return (
        <div className="latest-commit">
            <div className="commit-msg">
                <a href={redirectUrl} target="_blank" rel="noopener noreferrer" className="commit-id">{commitId}</a> &nbsp; {message}
            </div>
            <div className="commit-details">
                <span className="commit-stats">
                    <span className="stat-enclosure files-changed">{filesChanged} files changed</span>
                    <span className="stat-enclosure commit-additions">+ {stats.additions}</span>
                    <span className="stat-enclosure commit-deletions">- {stats.deletions}</span>
                </span>
                <span className="commit-date">{commitDate}</span>
            </div>
        </div>
    );
});

const CommitHistory = memo(({
    commitsExpanded, isLoadingCommits, commitsError, latestCommitHistory, commitsUrl, onToggle
}) => {
    return (
        <div className={`commit-history-container ${commitsExpanded ? 'expanded' : 'collapsed'}`}>
            <div
                className="commit-history-header"
                onClick={onToggle}
            >
                <span>Latest Commits:</span>
                <span className="expand-indicator">
                    {isLoadingCommits ? '⏳' : commitsExpanded ? '▼' : '▶'}
                </span>
            </div>
            {commitsExpanded && (
                <div className="commit-list">
                    {isLoadingCommits && <div className="commit-loading">Loading commits...</div>}
                    {commitsError && <ErrorMessage error={commitsError} className="commit-error" />}
                    {!isLoadingCommits && !commitsError && latestCommitHistory.length === 0 && (
                        <div className="no-commits">No commits found</div>
                    )}
                    {!isLoadingCommits && !commitsError && latestCommitHistory.map((commit) => (
                        <SingleCommit key={commit.sha} commit={commit} />
                    ))}
                    {commitsUrl && !isLoadingCommits && (
                        <div className="view-full-history-btn-container">
                            <a href={commitsUrl} target="_blank" rel="noreferrer" className="view-full-history-btn">View Full History</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

const ProjectListItem = memo(({ project }) => {
    const { name, desc, speciality, tech_stack, kpis, github, deployment, other_btns, image, planned_tasks } = project;
    const { lastUpdated, lastUpdatedError } = useGitHubData(github);

    // Commit History Logic
    const [latestCommitHistory, setLatestCommitHistory] = useState([]);
    const [isLoadingCommits, setIsLoadingCommits] = useState(false);
    const [commitsExpanded, setCommitsExpanded] = useState(false);
    const [commitsError, setCommitsError] = useState(null);

    const isPrivate = useMemo(() => {
        if (github && github.repo_owner && github.repo_name) {
            if (lastUpdatedError) {
                const errorStr = lastUpdatedError.toString().toLowerCase();
                return errorStr.includes('404') || errorStr.includes('not found') || errorStr.includes('private') || errorStr.includes('access');
            }
        }
        return false;
    }, [github, lastUpdatedError]);

    const fetchCommitHistory = useCallback(async () => {
        if (!github || !github.repo_owner || !github.repo_name || latestCommitHistory.length > 0) return;
        setIsLoadingCommits(true);
        setCommitsError(null);
        try {
            const commits = await getCommitsList(github.repo_owner, github.repo_name, 5);
            const detailedCommits = await Promise.all(
                commits.map(async (commit) => {
                    try {
                        const details = await getCommitDetails(commit.url);
                        return { ...commit, details };
                    } catch (error) {
                        return { ...commit, details: null, error: error.message || error.toString() };
                    }
                })
            );
            setLatestCommitHistory(detailedCommits);
        } catch (error) {
            setCommitsError(error.message || error.toString());
        } finally {
            setIsLoadingCommits(false);
        }
    }, [github, latestCommitHistory.length]);

    useEffect(() => {
        if (commitsExpanded && latestCommitHistory.length === 0) fetchCommitHistory();
    }, [commitsExpanded, fetchCommitHistory, latestCommitHistory.length]);

    const commitsUrl = useMemo(() => {
        return github?.repo_owner && github?.repo_name
            ? `https://github.com/${github.repo_owner}/${github.repo_name}/commits/${github.repo_branch || 'main'}`
            : null;
    }, [github]);

    return (
        <div id={name} className={`project-list-item ${speciality === "COMING SOON" ? "list-item-building" : ""}`}>
            <div className="list-item-top">
                <div className="item-title-group">
                    <ProjectPill speciality={speciality} />
                    <h3 className="item-name">{name || github?.repo_name}</h3>
                </div>
                <div className="list-item-links">
                    {github?.repo_link && !isPrivate && (
                        <AnimatedIcon icon={git_repo} link={github.repo_link} class_name="nocss" icon_size={22} />
                    )}
                    {deployment && (
                        <AnimatedIcon icon={redirect} link={deployment} class_name="nocss" icon_size={22} />
                    )}
                    {other_btns && other_btns.map((btn, index) => (
                        <a href={btn.link} key={index} target="_blank" rel="noopener noreferrer" className="list-other-btn">{btn.text}</a>
                    ))}
                </div>
            </div>

            <div className="list-item-meta">
                {isPrivate ? <PrivateRibbon /> : (
                    lastUpdatedError ? <ErrorMessage error={lastUpdatedError} /> : (
                        <ActivityTag lastUpdated={lastUpdated} />
                    )
                )}
            </div>

            <div className="list-item-content">
                <p className="item-desc">{desc}</p>
                <div className="item-data-rows">
                    <ProjectKPIs kpis={kpis} />
                    <ProjectTechStack tech_stack={tech_stack} />
                </div>
                {planned_tasks && planned_tasks.length > 0 && (
                    <div className="list-planned-tasks">
                        <div className="planned-heading">Planned Tasks:</div>
                        <ul>{planned_tasks.map((task, i) => <li key={i}>{task}</li>)}</ul>
                    </div>
                )}
            </div>

            {!isPrivate && github?.repo_owner && (
                <CommitHistory
                    commitsExpanded={commitsExpanded}
                    isLoadingCommits={isLoadingCommits}
                    commitsError={commitsError}
                    latestCommitHistory={latestCommitHistory}
                    commitsUrl={commitsUrl}
                    onToggle={() => setCommitsExpanded(!commitsExpanded)}
                />
            )}
        </div>
    );
});

// --- Embla Carousel Implementation ---

const EmblaCarousel = memo(({ projects }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: 'center',
            skipSnaps: false,
            containScroll: 'trimSnaps'
        },
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [tweenValues, setTweenValues] = useState([]);

    const onScroll = useCallback((emblaApi) => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();

        const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[index];

            return slidesInSnap.map((slideIndex) => {
                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopPoint) => {
                        const target = loopPoint.target();

                        if (slideIndex === loopPoint.index && target !== 0) {
                            const sign = Math.sign(target);
                            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
                            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
                        }
                    });
                }

                // Focus & Scale logic (Optimized for 70% base width)
                const tweenScale = 1 - Math.abs(diffToTarget * 1.2);
                const scale = Math.max(0.8, Math.min(1.15, tweenScale)); // Max 1.15 * 70% = 80.5% fill
                const opacity = Math.max(0.4, Math.min(1, 1 - Math.abs(diffToTarget * 2)));
                return { scale, opacity };
            });
        });
        setTweenValues(styles.flat());
    }, []);

    const onSelect = useCallback((emblaApi) => {
        setActiveIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onScroll(emblaApi);
        emblaApi.on('reInit', onScroll);
        emblaApi.on('scroll', onScroll);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onScroll, onSelect]);

    const scrollToProject = useCallback((name) => {
        const element = document.getElementById(name);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    if (!projects.length) return null;

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {projects.map((project, index) => (
                        <div
                            className={`embla__slide ${index === activeIndex ? 'active' : ''}`}
                            key={project.name || index}
                            onClick={() => {
                                if (index === activeIndex) scrollToProject(project.name);
                                else emblaApi?.scrollTo(index);
                            }}
                        >
                            <div
                                className="embla__slide__inner"
                                style={{
                                    ...(tweenValues.length && {
                                        transform: `scale(${tweenValues[index]?.scale || 0.8})`,
                                        opacity: tweenValues[index]?.opacity || 0.5,
                                    })
                                }}
                            >
                                <div className="carousel-image-container">
                                    <img src={project.image} alt={project.name} loading="lazy" />
                                    <div className="carousel-overlay">
                                        <h4>{project.name}</h4>
                                        <span className="view-label">View Details</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-indicators">
                {projects.map((_, i) => (
                    <span
                        key={i}
                        className={`indicator ${i === activeIndex ? 'active' : ''}`}
                        onClick={() => emblaApi?.scrollTo(i)}
                    />
                ))}
            </div>
        </div>
    );
});

// --- Main Section ---

const ProjectsSection = memo(({ projects_data }) => {
    const [filter, setFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Default');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [projectDates, setProjectDates] = useState({});

    // Fetch all dates for sorting when "Last Updated" is selected or on load
    useEffect(() => {
        if (!projects_data) return;
        const fetchAllDates = async () => {
            const dates = { ...projectDates };
            await Promise.all(projects_data.map(async (p) => {
                if (p.github && p.github.repo_owner && p.github.repo_name && !dates[p.name]) {
                    try {
                        const data = await getBranchInfo(p.github.repo_owner, p.github.repo_name, p.github.repo_branch || 'main');
                        dates[p.name] = new Date(data.commit.commit.committer.date).getTime();
                    } catch (e) {
                        dates[p.name] = null; // Mark as null for error/missing
                    }
                }
            }));
            setProjectDates(dates);
        };
        fetchAllDates();
    }, [projects_data]);

    const featuredProjects = useMemo(() => {
        if (!projects_data) return [];
        return projects_data.filter(project => project.speciality !== "COMING SOON" && project.speciality !== "");
    }, [projects_data]);

    const filteredList = useMemo(() => {
        if (!projects_data) return [];
        let list = [...projects_data];

        // 1. Filtering
        if (filter === 'Featured') list = featuredProjects;
        else if (filter === 'Building') list = projects_data.filter(p => p.speciality === "COMING SOON");
        else if (filter === 'Others') list = projects_data.filter(p => p.speciality === "");

        // 2. Searching
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(lowSearch) ||
                p.desc.toLowerCase().includes(lowSearch) ||
                p.tech_stack?.some(t => t.toLowerCase().includes(lowSearch))
            );
        }

        // 3. Sorting
        if (sortBy === 'Category') {
            const getCategoryRank = (p) => {
                if (p.speciality === "COMING SOON") return 0;
                if (p.speciality !== "") return 1;
                return 2;
            };
            list.sort((a, b) => getCategoryRank(a) - getCategoryRank(b));
        } else if (sortBy === 'Last Updated') {
            list.sort((a, b) => {
                const dateA = projectDates[a.name];
                const dateB = projectDates[b.name];

                // Missing dates (null or undefined) go to the TOP
                if (dateA === undefined || dateA === null) {
                    if (dateB === undefined || dateB === null) return 0;
                    return -1;
                }
                if (dateB === undefined || dateB === null) return 1;

                // Descending (latest to oldest)
                return dateB - dateA;
            });
        }

        return list;
    }, [projects_data, filter, featuredProjects, sortBy, projectDates, searchTerm]);

    return (
        <div id="projects-section">
            <div className="projects-header">
                <SectionHeading section_name="PROJECTS" />
            </div>

            {featuredProjects.length > 0 && filter === 'All' && (
                <div className="projects-carousel-wrapper">
                    <EmblaCarousel projects={featuredProjects} />
                </div>
            )}

            <div className="filter-section">
                <div className="search-wrapper">
                    <div className="search-icon">🔍</div>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="sort-wrapper">
                    <button
                        className={`sort-btn ${isSortOpen ? 'active' : ''}`}
                        onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                    >
                        Sort By: {sortBy} <span className="chevron"></span>
                    </button>
                    {isSortOpen && (
                        <div className="sort-dropdown">
                            {['Default', 'Category', 'Last Updated'].map(s => (
                                <div
                                    key={s}
                                    className={`sort-option ${sortBy === s ? 'selected' : ''}`}
                                    onClick={() => { setSortBy(s); setIsSortOpen(false); }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="filter-wrapper">
                    <button
                        className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                        onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                    >
                        Filter By: {filter} <span className="chevron"></span>
                    </button>
                    {isFilterOpen && (
                        <div className="filter-dropdown">
                            {['All', 'Featured', 'Building', 'Others'].map(f => (
                                <div
                                    key={f}
                                    className={`filter-option ${filter === f ? 'selected' : ''}`}
                                    onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="projects-list-container" key={filter}>
                {
                    filteredList.map((project, index) => (
                        <ProjectListItem key={project.name || index} project={project} />
                    ))
                }
            </div>
        </div>
    );
});

export default ProjectsSection;