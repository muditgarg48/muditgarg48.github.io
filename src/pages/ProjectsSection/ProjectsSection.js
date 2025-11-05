import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './ProjectsSection.css';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import { getBranchInfo, getCommitsList, getCommitDetails } from "../../services/githubCache";

const ActivityTag = memo(({lastUpdated}) => {
    const tag = useMemo(() => {
        if(lastUpdated === "Fetching...") return null;
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

    if (!tag) return null;

    return (
        <div className="active-tag">
            {tag}
        </div>
    );
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit'};
    return new Date(dateString).toLocaleDateString('en-US', options);
}

const ProjectKPIs = memo(({kpis}) => {
    return (
        <div className="project-kpis">
        {
            kpis && kpis.map((kpi, index) => (
                <div key={index} className="kpi">
                    {kpi}
                </div>
            ))
        }
        </div>
    );
});

const ProjectTechStack = memo(({tech_stack}) => {
    return (
        <div className="project-tech">
            {
                tech_stack && tech_stack.map((tech, index)=> (
                    <span key={index} className="tech">{tech}</span>
                ))
            }
        </div>
    );
});

const ProjectImage = memo(({image, name}) => {
    return (
        <div className="project-image">
            <img src={image} alt={name} loading="lazy" decoding="async"/>
        </div>
    );
});

const ErrorMessage = memo(({ error, className = "" }) => {
    if (!error) return null;
    
    const getErrorMessage = (error) => {
        if (typeof error === 'string') return error;
        if (error.message) return error.message;
        if (error.includes?.('rate limit')) return error;
        return 'Failed to fetch data from GitHub';
    };
    
    return (
        <div className={`github-error-message ${className}`}>
            <span className="error-icon">⚠️</span>
            <span className="error-text">{getErrorMessage(error)}</span>
        </div>
    );
});

const ComingSoonProjectHeadline = memo(({ github, deployment, other_btns, lastUpdated }) => {
    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');
    
    return (
        <div className="project-headline">
            <div className="project-links">
                {github && github.repo_link && (
                    <AnimatedIcon icon={git_repo} link={github.repo_link} class_name="nocss"/>
                )}
                {
                    deployment &&
                    <AnimatedIcon icon={redirect} link={deployment} class_name="nocss" icon_size={25}/>
                }
                {other_btns && other_btns.map((btn, index) => {
                    if (btn.link !== "")
                        return (<a href={btn.link} key={index} target="_blank" rel="noopener noreferrer" className="other-btn">{btn.text}</a>)
                    return null;
                })}
            </div>
            <ActivityTag lastUpdated={lastUpdated}/>
        </div>
    );
});

const ComingSoonProjectTech = memo(({ tech_stack }) => {
    return (
        <div className="project-tech">
        {
            tech_stack.map((tech, index)=> (
                <div key={index} className="tech">
                    {tech}
                </div>
            ))
        }
        </div>
    );
});

const ComingSoonProjectPlannedTasks = memo(({ planned_tasks }) => {
    return (
        <div className="coming-soon-mini-section">
            <div className="coming-soon-mini-section-heading">
                Planned Tasks:
            </div>
            <ul className="planned-tasks">
            {
                planned_tasks.map((task, index) => (
                    <li key={index} className="planned-task">
                        {task}
                    </li>
                ))
            }
            </ul>
        </div>
    );
});

const SingleCommit = memo(({ commit }) => {
    const details = commit.details;
    const message = commit.commit.message;
    const redirectUrl = commit.html_url;
    const commitId = commit.sha.substring(0, 7);

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

const ComingSoonProject = memo(({ name, desc, tech_stack, planned_tasks, github, deployment, other_btns }) => {

    const [lastUpdated, setLastUpdated] = useState("Fetching...");
    const [lastUpdatedError, setLastUpdatedError] = useState(null);
    const [latestCommitHistory, setLatestCommitHistory] = useState([]);
    const [isLoadingCommits, setIsLoadingCommits] = useState(false);
    const [commitsExpanded, setCommitsExpanded] = useState(false);
    const [commitsError, setCommitsError] = useState(null);

    useEffect(() => {
        if (!github || !github.repo_owner || !github.repo_name || !github.repo_branch) return;

        getBranchInfo(github.repo_owner, github.repo_name, github.repo_branch)
            .then(data => {
                setLastUpdated(formatDate(data.commit.commit.committer.date));
                setLastUpdatedError(null);
            })
            .catch(error => {
                console.error('Error fetching branch info:', error);
                setLastUpdatedError(error.message || error.toString());
            });
    }, [github]);

    // Fetch commit history on demand (only when expanded)
    const fetchCommitHistory = useCallback(async () => {
        if (!github || !github.repo_owner || !github.repo_name || latestCommitHistory.length > 0) return;
        
        setIsLoadingCommits(true);
        setCommitsError(null);
        try {
            const commits = await getCommitsList(github.repo_owner, github.repo_name, 7);
            
            // Fetch commit details in batches to avoid overwhelming the API
            const detailedCommits = await Promise.all(
                commits.map(async (commit) => {
                    try {
                        const details = await getCommitDetails(commit.url);
                        return { ...commit, details };
                    } catch (error) {
                        console.error('Error fetching commit details:', error);
                        // Return commit without details instead of failing completely
                        return { ...commit, details: null, error: error.message || error.toString() };
                    }
                })
            );
            
            setLatestCommitHistory(detailedCommits);
        } catch (error) {
            console.error('Error fetching commit history:', error);
            setCommitsError(error.message || error.toString());
        } finally {
            setIsLoadingCommits(false);
        }
    }, [github, latestCommitHistory.length]);

    // Fetch commits when user expands the section
    useEffect(() => {
        if (commitsExpanded && latestCommitHistory.length === 0) {
            fetchCommitHistory();
        }
    }, [commitsExpanded, fetchCommitHistory, latestCommitHistory.length]);

    const commitsUrl = useMemo(() => {
        return github && github.repo_owner && github.repo_name 
            ? `https://github.com/${github.repo_owner}/${github.repo_name}/commits/${github.repo_branch || 'main'}`
            : null;
    }, [github]);
    
    const handleToggle = useCallback(() => {
        setCommitsExpanded(prev => !prev);
    }, []);

    return (
        <div className="coming-soon-project-component">
            <div className="coming-soon-project-details">
                <ComingSoonProjectHeadline 
                    github={github} 
                    deployment={deployment} 
                    other_btns={other_btns} 
                    lastUpdated={lastUpdated}
                />
                <h3>{name}</h3>
                <div className="project-last-updated">
                    {lastUpdatedError ? (
                        <ErrorMessage error={lastUpdatedError} />
                    ) : (
                        <>Last Updated: {lastUpdated}</>
                    )}
                </div>
                <p className="project-desc">{desc}</p>
                <ComingSoonProjectTech tech_stack={tech_stack}/>
                &nbsp;
                <ComingSoonProjectPlannedTasks planned_tasks={planned_tasks}/>
                <ComingSoonProjectCommitHistory
                    commitsExpanded={commitsExpanded}
                    isLoadingCommits={isLoadingCommits}
                    commitsError={commitsError}
                    latestCommitHistory={latestCommitHistory}
                    commitsUrl={commitsUrl}
                    onToggle={handleToggle}
                />
            </div>
        </div>
    );
});

const ComingSoonProjectCommitHistory = memo(({ 
    commitsExpanded, 
    isLoadingCommits, 
    commitsError, 
    latestCommitHistory, 
    commitsUrl, 
    onToggle 
}) => {
    return (
        <div className={`coming-soon-commit-history ${commitsExpanded ? 'expanded' : 'collapsed'}`}>
            <div 
                className="coming-soon-mini-section-heading commit-history-header"
                onClick={onToggle}
                style={{ cursor: 'pointer' }}
            >
                <span>Last 7 Commits:</span>
                <span className="expand-indicator">
                    {isLoadingCommits ? '⏳' : commitsExpanded ? '▼' : '▶'}
                </span>
            </div>
            <div className={`commit-list ${commitsExpanded ? 'expanded' : 'collapsed'}`}>
                {isLoadingCommits && (
                    <div style={{ padding: '10px', textAlign: 'center' }}>Loading commits...</div>
                )}
                {commitsError && (
                    <ErrorMessage error={commitsError} className="commit-error" />
                )}
                {!isLoadingCommits && !commitsError && latestCommitHistory.length === 0 && commitsExpanded && (
                    <div style={{ padding: '10px', textAlign: 'center' }}>No commits found</div>
                )}
                {!isLoadingCommits && !commitsError && latestCommitHistory.map((commit) => (
                    <SingleCommit key={commit.sha} commit={commit}/>
                ))}
                {commitsExpanded && commitsUrl && !isLoadingCommits && (
                    <div className="view-full-history-btn-container">
                        <a 
                            href={commitsUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="view-full-history-btn"
                        >
                            View Full History
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
});

const MajorProjectHeadline = memo(({ speciality, lastUpdated }) => {
    return (
        <div className="project-headline">
            <p><strong>{speciality}</strong></p>
            <ActivityTag lastUpdated={lastUpdated}/>
        </div>
    );
});

const MajorProjectLinks = memo(({ github, deployment, other_btns }) => {
    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');
    
    return (
        <div className="project-links">
            {github && github.repo_link && (
                <AnimatedIcon icon={git_repo} link={github.repo_link} class_name="nocss"/>
            )}
            {
                deployment &&
                <AnimatedIcon icon={redirect} link={deployment} class_name="nocss" icon_size={25}/>
            }
            {other_btns && other_btns.map((btn, index) => (
                <a href={btn.link} key={index} target="_blank" rel="noopener noreferrer" className="other-btn">{btn.text}</a>
            ))}
        </div>
    );
});

const MajorProject = memo(({ name, desc, speciality, image, tech_stack, kpis, github, deployment, other_btns }) => {

    const [lastUpdated, setLastUpdated] = useState("Fetching...");
    const [lastUpdatedError, setLastUpdatedError] = useState(null);

    useEffect(()=> {
        if (!github || !github.repo_owner || !github.repo_name || !github.repo_branch) return;
        
        getBranchInfo(github.repo_owner, github.repo_name, github.repo_branch)
            .then(data => {
                setLastUpdated(formatDate(data.commit.commit.committer.date));
                setLastUpdatedError(null);
            })
            .catch(error => {
                console.error('Error fetching branch info:', error);
                setLastUpdatedError(error.message || error.toString());
            });
    }, [github]);

    return (
        <div className="major-project-component">
            <ProjectImage image={image} name={name}/>
            <div className="project-details">
                <MajorProjectHeadline speciality={speciality} lastUpdated={lastUpdated}/>
                <h3>{name}</h3>
                <div className="project-last-updated">
                    {lastUpdatedError ? (
                        <ErrorMessage error={lastUpdatedError} />
                    ) : (
                        <>Last Updated: {lastUpdated}</>
                    )}
                </div>
                <p className="project-desc">{desc}</p>
                <ProjectKPIs kpis={kpis}/>
                <ProjectTechStack tech_stack={tech_stack}/>
                <MajorProjectLinks github={github} deployment={deployment} other_btns={other_btns}/>
            </div>
        </div>
    );
});

const MinorProjectLinks = memo(({ github, deployment, other_btns, lastUpdated }) => {
    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');
    
    return (
        <div className="minor-project-links">
            <ActivityTag lastUpdated={lastUpdated}/>
            <div className="project-links">
                {github && github.repo_link && (
                    <AnimatedIcon icon={git_repo} link={github.repo_link} class_name="nocss"/>
                )}
                {
                    deployment &&
                    <AnimatedIcon icon={redirect} link={deployment} class_name="nocss" icon_size={25}/>
                }
                {other_btns && other_btns.map((btn, index) => (
                    <a href={btn.link} key={index} target="_blank" rel="noopener noreferrer" className="other-btn">{btn.text}</a>
                ))}
            </div>
        </div>
    );
});

const MinorProject = memo(({ name, desc, tech_stack, kpis, github, deployment, other_btns }) => {
    
    const [lastUpdated, setLastUpdated] = useState("Fetching...");
    const [lastUpdatedError, setLastUpdatedError] = useState(null);

    useEffect(()=> {
        if (!github || !github.repo_owner || !github.repo_name || !github.repo_branch) return;
        
        getBranchInfo(github.repo_owner, github.repo_name, github.repo_branch)
            .then(data => {
                setLastUpdated(formatDate(data.commit.commit.committer.date));
                setLastUpdatedError(null);
            })
            .catch(error => {
                console.error('Error fetching branch info:', error);
                setLastUpdatedError(error.message || error.toString());
            });
    }, [github]);

    return (
        <div className="minor-project-component">
            <MinorProjectLinks 
                github={github} 
                deployment={deployment} 
                other_btns={other_btns} 
                lastUpdated={lastUpdated}
            />
            <h3>{name}</h3>
            <div className="project-last-updated">
                {lastUpdatedError ? (
                    <ErrorMessage error={lastUpdatedError} />
                ) : (
                    <>Last Updated: {lastUpdated}</>
                )}
            </div>
            <p className="project-desc">{desc}</p>
            <ProjectKPIs kpis={kpis}/>
            <ProjectTechStack tech_stack={tech_stack}/>
        </div>
    );
});

const ProjectsSection = memo(({projects_data}) => {
    // Memoize filtered arrays to prevent recalculation on every render
    const comingSoonProjects = useMemo(() => {
        if (!projects_data) return [];
        return projects_data.filter(project => project.speciality === "COMING SOON");
    }, [projects_data]);

    const majorProjects = useMemo(() => {
        if (!projects_data) return [];
        return projects_data.filter(project => project.speciality !== "COMING SOON" && project.speciality !== "");
    }, [projects_data]);

    const minorProjects = useMemo(() => {
        if (!projects_data) return [];
        return projects_data.filter(project => project.speciality === "");
    }, [projects_data]);

    return (
        <div id="projects-section">
            <SectionHeading section_name="PROJECTS"/>
            {projects_data && <Tabs id="projects-tabs">
                <TabList>
                    <Tab>🚧 COMING SOON</Tab>
                    <Tab>⭐ FEATURED</Tab>
                    <Tab>🧩 OTHERS</Tab>
                </TabList>
                <TabPanel>
                    <div id="major-projects">
                    {
                        comingSoonProjects.map((project) => (
                            <ComingSoonProject key={project.name || project.github?.repo_name} {...project} />
                        ))
                    }
                    </div>            
                </TabPanel>
                <TabPanel>
                    <div id="major-projects">
                    {
                        majorProjects.map((project) => (
                            <MajorProject key={project.name || project.github?.repo_name} {...project} />
                        ))
                    }
                    </div>   
                </TabPanel>
                <TabPanel> 
                    <div id="minor-projects">
                    {
                        minorProjects.map((project) => (
                            <MinorProject key={project.name || project.github?.repo_name} {...project} />
                        ))
                    }
                    </div>
                </TabPanel>
            </Tabs>}
        </div>
    );
});

export default ProjectsSection;