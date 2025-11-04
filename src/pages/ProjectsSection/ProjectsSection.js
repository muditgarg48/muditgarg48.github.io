import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from "axios";
import './ProjectsSection.css';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";

const ActivityTag = ({lastUpdated}) => {
    if(lastUpdated === "Fetching...") return null;
    const date = new Date(lastUpdated);
    const now = new Date();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(now.getMonth() - 6);

    const yearAgo = new Date();
    yearAgo.setFullYear(now.getFullYear() - 1);

    return (
        <div className="active-tag">
            {
                (date >= oneMonthAgo && date <= now)? "🟢 Actively developed":
                (date < oneMonthAgo && date >= sixMonthAgo)? "🟡 Recently updated":
                (date <= yearAgo)? "⚪ Archived":
                null
            }
        </div>
    );
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit'};
    return new Date(dateString).toLocaleDateString('en-US', options);
}

const ProjectKPIs = ({kpis}) => {
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
}

const ProjectTechStack = ({tech_stack}) => {
    return (
        <div className="project-tech">
            {
                tech_stack && tech_stack.map((tech, index)=> (
                    <span key={index} className="tech">{tech}</span>
                ))
            }
        </div>
    );
}

const ProjectImage = ({image, name}) => {
    return (
        <div className="project-image">
            <img src={image} alt={name}/>
        </div>
    );
}

const ComingSoonProject = ({ name, desc, speciality, image, tech_stack, planned_tasks, github, deployment, other_btns }) => {

    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');

    const [lastUpdated, setLastUpdated] = useState("Fetching...");
    const [latestCommitHistory, setLatestCommitHistory] = useState([]);

    useEffect(() => {
        if (!github || !github.repo_owner || !github.repo_name || !github.repo_branch) return;

        axios.get(`https://api.github.com/repos/${github.repo_owner}/${github.repo_name}/branches/${github.repo_branch}`)
            .then(res => setLastUpdated(formatDate(res.data.commit.commit.committer.date)));

        axios.get(`https://api.github.com/repos/${github.repo_owner}/${github.repo_name}/commits?per_page=7`)
            .then(async res => {
                const commits = res.data;

                const detailedCommits = await Promise.all(
                    commits.map(async (commit) => {
                        const detailRes = await axios.get(commit.url);
                        return { ...commit, details: detailRes.data };
                    })
                );

                setLatestCommitHistory(detailedCommits);
            });
    }, [github]);

    const ProjectHeadline = () => {
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
                        if (btn.link != "")
                            return (<a href={btn.link} key={index} target="_blank" rel="noopener noreferrer" className="other-btn">{btn.text}</a>)
                    })}
                </div>
                <ActivityTag lastUpdated={lastUpdated}/>
            </div>
        );
    }

    const ProjectTech = () => {
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
    }

    const ProjectPlannedTasks = () => {
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
    }

    const SingleCommit = ({ commit }) => {
        const details = commit.details;
        const message = commit.commit.message;
        const redirectUrl = commit.html_url;
        const commitId = commit.sha.substring(0, 7);

        const stats = details ? details.stats : { total: 0, additions: 0, deletions: 0 };
        const filesChanged = details ? details.files.length : 0;
        const commitDate = details ? formatDate(details.commit.committer.date) : "";

        return (
            <div className="latest-commit">
                <div className="commit-msg">
                    <a href={redirectUrl} target="_blank" rel="noopener noreferrer" className="commit-id">{commitId}</a> &nbsp; {message}
                </div>
                <div className="commit-details">
                    <span className="commit-stats">
                        <span>{filesChanged} files changed</span>
                        &nbsp;
                        <span className="commit-additions">+ {stats.additions}</span>
                        &nbsp;
                        <span className="commit-deletions">- {stats.deletions}</span>
                    </span>
                    &nbsp;
                    &nbsp;
                    <span className="commit-date">{commitDate}</span>
                </div>
            </div>
        );
    };

    const ProjectCommitHistory = () => {
        if (!latestCommitHistory.length) return null;
        return (
            <div className="coming-soon-commit-history">
                <div className="coming-soon-mini-section-heading">
                    Last 7 Commits:
                </div>
                {
                    latestCommitHistory.map((commit, index) => <SingleCommit key={index} commit={commit}/>)
                }
            </div>
        );
    }

    return (
        <div className="coming-soon-project-component">
            {/* <ProjectImage/> */}
            <div className="coming-soon-project-details">
                <ProjectHeadline/>
                <h3>{name}</h3>
                <div className="project-last-updated">
                    Last Updated: {lastUpdated}
                </div>
                <p className="project-desc">{desc}</p>
                <ProjectTech/>
                &nbsp;
                <ProjectPlannedTasks/>
                <ProjectCommitHistory/>
            </div>
        </div>
    );
};

const MajorProject = ({ name, desc, speciality, image, tech_stack, kpis, github, deployment, other_btns }) => {

    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');

    const [lastUpdated, setLastUpdated] = useState("Fetching...");

    useEffect(()=> {
        if (!github || !github.repo_owner || !github.repo_name || !github.repo_branch) return;
        
        axios.get(`https://api.github.com/repos/${github.repo_owner}/${github.repo_name}/branches/${github.repo_branch}`)
            .then(response => response.data)
            .then(data => {
                setLastUpdated(formatDate(data.commit.commit.committer.date))
            });
    }, [github]);

    const ProjectHeadline = () => {
        return (
            <div className="project-headline">
                <p><strong>{speciality}</strong></p>
                <ActivityTag lastUpdated={lastUpdated}/>
            </div>
        );
    }

    const ProjectLinks = () => {
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
    }

    return (
        <div className="major-project-component">
            <ProjectImage image={image} name={name}/>
            <div className="project-details">
                <ProjectHeadline/>
                <h3>{name}</h3>
                <div className="project-last-updated">
                    Last Updated: {lastUpdated}
                </div>
                <p className="project-desc">{desc}</p>
                <ProjectKPIs kpis={kpis}/>
                <ProjectTechStack tech_stack={tech_stack}/>
                <ProjectLinks/>
            </div>
        </div>
    );
};

const MinorProject = ({ name, desc, tech_stack, kpis, github, deployment, other_btns }) => {

    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');
    
    const [lastUpdated, setLastUpdated] = useState("Fetching...");

    useEffect(()=> {
        if (!github || !github.repo_owner || !github.repo_name || !github.repo_branch) return;
        
        axios.get(`https://api.github.com/repos/${github.repo_owner}/${github.repo_name}/branches/${github.repo_branch}`)
            .then(response => response.data)
            .then(data => {
                setLastUpdated(formatDate(data.commit.commit.committer.date))
            });
    }, [github]);

    const ProjectLinks = () => {
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
    }

    return (
        <div className="minor-project-component">
            <ProjectLinks/>
            <h3>{name}</h3>
            <div className="project-last-updated">
                Last Updated: {lastUpdated}
            </div>
            <p className="project-desc">{desc}</p>
            <ProjectKPIs kpis={kpis}/>
            <ProjectTechStack tech_stack={tech_stack}/>
        </div>
    );
};

const ProjectsSection = ({projects_data}) => {

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
                        projects_data.map((project, index) => {
                            if (project.speciality === "COMING SOON")
                                return (<ComingSoonProject key={index} {...project} />)
                        })
                    }
                    </div>            
                </TabPanel>
                <TabPanel>
                    <div id="major-projects">
                    {
                        projects_data.map((project, index) => {
                            if (project.speciality !== "COMING SOON" && project.speciality !== "")
                                return (<MajorProject key={index} {...project} />)
                        })
                    }
                    </div>   
                </TabPanel>
                <TabPanel> 
                    <div id="minor-projects">
                    {
                        projects_data.map((project, index) => {
                            if (project.speciality === "")
                                return (<MinorProject key={index} {...project} />)
                        })
                    }
                    </div>
                </TabPanel>
            </Tabs>}
        </div>
    );
}

export default ProjectsSection;