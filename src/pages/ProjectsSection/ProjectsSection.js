import React, {useState, useEffect} from "react";
import './ProjectsSection.css';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";

const ProjectsSection = () => {
    
    const major_projects = require('../../assets/data/projects_data.json');
    let minor_projects = [];

    const [showMinorProjects, setShowMinorProjects] = useState(false);

    return (
        <div id="projects-section">
            <SectionHeading section_name="PROJECTS"/>
            <div id="major-projects">
                {major_projects.map((project, index) => {
                    if (project.speciality === "") {
                        minor_projects.push(project);
                        return null;
                    }
                    return (<MajorProject key={index} {...project} />)
                })}
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div id="load-more" onClick={() => setShowMinorProjects(!showMinorProjects)}>
                    LOAD {showMinorProjects? "LESS": "MORE"}
                </div>
            </div>
            {
                showMinorProjects && <div id="minor-projects">
                    {
                        minor_projects.map((project, index) => {
                            return (<MinorProject key={index} {...project} />)
                        })
                    }
                </div>
            }
        </div>
    );
}

const MajorProject = ({ name, desc, speciality, image, tech_stack, github, deployment, other_btns }) => {

    const [projectImg, setProjectImg] = useState(null);

    useEffect(() => {
        const loadImg = async (img) => {
            const module = await import(`../../assets/imgs/project_imgs/${img}`);
            setProjectImg(module.default);
        };
        loadImg(image);
    }, [image]);

    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');

    return (
        <div className="major-project-component">
            <div className="project-image">
                <img src={projectImg} alt={name}/>
            </div>
            <div className="project-details">
                <div className="project-headline">
                    <p><strong>{speciality}</strong></p>
                </div>
                <h3>{name}</h3>
                <p>{desc}</p>
                <div className="project-tech">
                    {
                        tech_stack.map((tech, index)=> (
                            <div key={index} className="tech">
                                {tech}
                            </div>
                        ))
                    }
                </div>
                <div className="project-links">
                    <AnimatedIcon icon={git_repo} link={github} class_name="nocss"/>
                    {
                        deployment &&
                        <AnimatedIcon icon={redirect} link={deployment} class_name="nocss" icon_size={25}/>
                    }
                    {other_btns && other_btns.map((btn, index) => (
                        <a href={btn.github} key={index} target="_blank" rel="noopener noreferrer" className="other-btn">{btn.text}</a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MinorProject = ({ name, desc, tech_stack, github, deployment, other_btns }) => {
    const git_repo = require('../../assets/icons/repo.json');
    const redirect = require('../../assets/icons/redirect.json');
    return (
        <div className="minor-project-component">
            <div className="minor-project-links">
                <div className="project-links">
                    <AnimatedIcon icon={git_repo} link={github} class_name="nocss"/>
                    {
                        deployment &&
                        <AnimatedIcon icon={redirect} link={deployment} class_name="nocss" icon_size={25}/>
                    }
                    {other_btns && other_btns.map((btn, index) => (
                        <a href={btn.github} key={index} target="_blank" rel="noopener noreferrer" className="other-btn">{btn.text}</a>
                    ))}
                </div>
            </div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <div className="project-tech">
                {
                    tech_stack.map((tech, index)=> (
                        <span key={index} className="tech">{tech}</span>
                    ))
                }
            </div>
        </div>
    );
};

export default ProjectsSection;