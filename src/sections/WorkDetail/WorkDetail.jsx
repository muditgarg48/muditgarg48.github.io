"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchFreelanceProjectById, fetchFreelanceTestimonials } from '../../services/freelanceUtils';
import ImageLoader from '../../components/LoadingLogo/ImageLoader';
import WebsiteLogo from '../../components/WebsiteLogo/WebsiteLogo';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { useSiteMode } from '../../context/SiteModeContext';
import TestimonialsSection from '../TestimonialsSection/TestimonialsSection';
import './WorkDetail.css';

// 1. LIGHTHOUSE RADIAL GAUGE
const RadialGauge = ({ value, before, after, title, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (parseInt(value) / 100) * circumference;

  return (
    <div className="kpi-card gauge-card">
      <div className="kpi-card-header">
        <h4>{title}</h4>
      </div>
      <div className="gauge-body">
        <div className="gauge-svg-wrapper">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} className="gauge-track" />
            <circle
              cx="50" cy="50" r={radius}
              className="gauge-progress"
              style={{
                stroke: color,
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />
            <text x="50" y="56" className="gauge-percentage" fill="var(--font-highlight-color)">
              {value}
            </text>
          </svg>
        </div>
        <div className="gauge-stats">
          <div className="comparison-row">
            <span className="compare-label">Baseline</span>
            <span className="compare-value">{before}</span>
          </div>
          <div className="comparison-divider"></div>
          <div className="comparison-row">
            <span className="compare-label">Optimized</span>
            <span className="compare-value" style={{ color }}>{after}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. BAR TREND COMPARISON
const BarTrend = ({ before, after, title, suffix, color, desc }) => {
  return (
    <div className="kpi-card trend-card">
      <div className="kpi-card-header">
        <h4>{title}</h4>
      </div>
      <div className="trend-body">
        <div className="trend-bar-chart">
          <div className="bar-column">
            <span className="bar-numeric-label">{before}</span>
            <div className="bar-pillar before-pillar" style={{ height: '35%' }}></div>
            <span className="bar-axis-label">Before</span>
          </div>
          <div className="bar-divider-arrow">⚡</div>
          <div className="bar-column">
            <span className="bar-numeric-label active-numeric" style={{ color }}>{after}{suffix}</span>
            <div className="bar-pillar after-pillar" style={{ height: '90%', background: color }}></div>
            <span className="bar-axis-label">Optimized</span>
          </div>
        </div>
        <p className="kpi-description-caption">{desc}</p>
      </div>
    </div>
  );
};

// 3. EFFICIENCY / TIME REDUCTION BLOCK
const EfficiencyBlocks = ({ before, after, title, desc, color }) => {
  return (
    <div className="kpi-card efficiency-card">
      <div className="kpi-card-header">
        <h4>{title}</h4>
      </div>
      <div className="efficiency-body">
        <div className="efficiency-blocks-grid">
          <div className="eff-box eff-before">
            <span className="eff-num">{before}</span>
            <span className="eff-lbl">Manual Effort</span>
          </div>
          <div className="eff-flow-arrow">➔</div>
          <div className="eff-box eff-after" style={{ borderColor: color }}>
            <span className="eff-num" style={{ color }}>{after}</span>
            <span className="eff-lbl">Automated Duration</span>
          </div>
        </div>
        <p className="kpi-description-caption">{desc}</p>
      </div>
    </div>
  );
};

// Main WorkDetail Case Study component
const WorkDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { setMode } = useSiteMode();
  const [project, setProject] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    if (setMode) {
      setMode('freelance');
    }
  }, [setMode]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProject = await fetchFreelanceProjectById(id);
        if (!fetchedProject) {
          setError('Case study not found');
        } else {
          setProject(fetchedProject);

          // Fetch and filter testimonials matching this project
          try {
            const allTestimonials = await fetchFreelanceTestimonials();
            const projectCode = fetchedProject.project_code || fetchedProject.id;
            const filtered = allTestimonials.filter(t => t.project_ref === projectCode);
            setTestimonials(filtered);
          } catch (tErr) {
            console.error('Error loading testimonials for project:', tErr);
          }
        }
      } catch (err) {
        console.error('Error loading project details:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  // Auto-change gallery images every 5 seconds
  useEffect(() => {
    if (!project || !project.gallery || project.gallery.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImgIndex((prevIndex) => (prevIndex + 1) % project.gallery.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [project, activeImgIndex]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !project) {
    return (
      <div className="work-detail-page error-page-wrapper">
        <div className="work-detail-error">
          <div
            className="work-detail-logo-inline"
            onClick={() => router.push('/')}
            title="Back to Portfolio"
          >
            <WebsiteLogo className="freelance-theme-logo" />
          </div>
          <h2 className="error-title">Oops!</h2>
          <p className="error-message-text">{error || 'Case study not found'}</p>
          <p className="error-desc-text">We couldn't find the freelance case study you were looking for. It might have been moved or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="work-detail-page">
      <div className="work-detail-container">
        {/* TOP ACTION ROW & HERO INTEGRATED */}
        <header className="work-detail-title-section">
          <div className="work-detail-integrated-heading">
            <div
              className="work-detail-logo-inline"
              onClick={() => router.push('/')}
              title="Back to Portfolio"
            >
              <WebsiteLogo className="freelance-theme-logo" />
            </div>

            <span className="work-detail-heading-separator">|</span>

            {project.deployment ? (
              <a
                href={project.deployment}
                target="_blank"
                rel="noopener noreferrer"
                className="work-detail-project-logo-link"
                title="Visit Live Website"
              >
                {project.project_logo ? (
                  <img
                    src={project.project_logo}
                    alt={`${project.name} logo`}
                    className="work-detail-project-logo-img"
                  />
                ) : (
                  <span className="work-detail-project-heading-text">{project.name}</span>
                )}
              </a>
            ) : (
              <div className="work-detail-project-logo-link no-link">
                {project.project_logo ? (
                  <img
                    src={project.project_logo}
                    alt={`${project.name} logo`}
                    className="work-detail-project-logo-img"
                  />
                ) : (
                  <span className="work-detail-project-heading-text">{project.name}</span>
                )}
              </div>
            )}
          </div>
          <p className="work-detail-catchphrase">{project.desc}</p>
        </header>

        {/* GRID STRUCTURE: LEFT SIDE MAIN, RIGHT SIDE STATS */}
        <div className="work-detail-layout-grid">
          {/* LEFT PANEL: GALLERY & TIMELINE */}
          <main className="detail-left-panel">
            {/* GALLERY COMPONENT */}
            {project.gallery && project.gallery.length > 0 && (
              <section className="detail-section gallery-section">
                <h3 className="section-title-label">Design & Screenshot Showcase</h3>
                <div className="gallery-viewport">
                  <ImageLoader
                    src={project.gallery[activeImgIndex].url}
                    alt={project.gallery[activeImgIndex].caption}
                    imgClassName="gallery-main-image"
                  />
                  <div className="gallery-caption-overlay">
                    <p>{project.gallery[activeImgIndex].caption}</p>
                  </div>
                </div>

                {project.gallery.length > 1 && (
                  <div className="gallery-thumbnails-grid">
                    {project.gallery.map((img, i) => (
                      <button
                        key={i}
                        className={`thumb-btn ${i === activeImgIndex ? 'selected-thumb' : ''}`}
                        onClick={() => setActiveImgIndex(i)}
                      >
                        <img src={img.url} alt={`Thumbnail preview ${i + 1}`} />
                        <div className="thumb-blur-overlay"></div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* PROCESS TIMELINE & PHASES */}
            {project.phases && project.phases.length > 0 && (
              <section className="detail-section timeline-section">
                <h3 className="section-title-label">Project Phases & Execution</h3>
                <div className="timeline-trail">
                  {project.phases.map((phase, idx) => (
                    <div className="node-content-card" key={idx}>
                      <div className="node-card-header">
                        <div className="node-card-title-group">
                          <h4>{phase.title}</h4>
                          {phase.status && (
                            <span className={`phase-status-pill phase-status-${phase.status.toLowerCase()}`}>
                              <span className="phase-pulse-indicator"></span>
                              {phase.status}
                            </span>
                          )}
                        </div>
                        <span className="node-timeline-range">{phase.timeline}</span>
                      </div>
                      <ul className="node-deliverables-list">
                        {phase.details.map((detail, dIdx) => (
                          <li key={dIdx}>{detail}</li>
                        ))}
                      </ul>

                      {/* PHASE PROPOSAL FILES */}
                      {phase.proposal && (
                        <div className="node-proposal-attachment">
                          <div className="proposal-file-card">
                            <div className="file-details-row">
                              <div className="file-name-meta">
                                <h5>{phase.proposal.title}</h5>
                                <p>{phase.proposal.subtitle}</p>
                              </div>
                              <a
                                href={phase.proposal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="proposal-download-btn"
                                onClick={(e) => {
                                  if (phase.proposal.url === "#") {
                                    e.preventDefault();
                                    alert("This is a demo setup: Redacted proposal is configured and will open a PDF in production.");
                                  }
                                }}
                              >
                                View PDF
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* RIGHT PANEL: TECH STACK & DYNAMIC KPIS */}
          <aside className="detail-right-panel">
            {/* TECH STACK LISTING */}
            <section className="detail-section right-section tech-section">
              <h3 className="section-title-label">Engineered With</h3>
              <div className="tech-pills-container">
                {project.tech_stack.map((tech, i) => (
                  <span className="tech-meta-pill" key={i}>{tech}</span>
                ))}
              </div>
            </section>

            {/* DYNAMIC METRIC CARDS */}
            {project.kpi_wins && project.kpi_wins.length > 0 && (
              <section className="detail-section right-section kpis-section">
                <h3 className="section-title-label">Business Outcomes & Wins</h3>
                <p className="kpi-summary-pitch">{project.primary_kpi_summary}</p>
                <div className="kpis-layout-stack">
                  {project.kpi_wins.map((kpi, i) => {
                    if (kpi.visual_type === "radial_gauge") {
                      return (
                        <RadialGauge
                          key={i}
                          value={kpi.metric_value}
                          before={kpi.before}
                          after={kpi.after}
                          title={kpi.metric_title}
                          color={kpi.color || "var(--primary-color)"}
                        />
                      );
                    }
                    if (kpi.visual_type === "bar_trend") {
                      return (
                        <BarTrend
                          key={i}
                          before={kpi.before}
                          after={kpi.after}
                          title={kpi.metric_title}
                          suffix={kpi.metric_suffix}
                          color={kpi.color || "var(--primary-color)"}
                          desc={kpi.description}
                        />
                      );
                    }
                    if (kpi.visual_type === "comparison_blocks") {
                      return (
                        <EfficiencyBlocks
                          key={i}
                          before={kpi.before}
                          after={kpi.after}
                          title={kpi.metric_title}
                          desc={kpi.description}
                          color={kpi.color || "var(--primary-color)"}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </section>
            )}
          </aside>
        </div>

        {/* CLIENT TESTIMONIALS */}
        {testimonials && testimonials.length > 0 && (
          <TestimonialsSection testimonials={testimonials} />
        )}

        {/* BOTTOM FOOTER CALL TO ACTION */}
        <footer className="work-detail-case-footer">
          <div className="footer-cta-card">
            <h4>{project.cta_footer?.title || "Need similar outcome-focused engineering?"}</h4>
            <p>{project.cta_footer?.subtitle || "Whether it's building clean, high-performance landing pages, custom client-facing content tools, or robust SEO architectures—I design and write software focused on real business value."}</p>
            {project.cta_footer?.button_link ? (
              <a
                href={project.cta_footer.button_link}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-contact-btn"
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                {project.cta_footer?.button_text || "Let's Discuss Your Project"}
              </a>
            ) : (
              <button
                className="cta-contact-btn"
                onClick={() => router.push('/#process-section')}
              >
                {project.cta_footer?.button_text || "Let's Discuss Your Project"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WorkDetail;