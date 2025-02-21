import React, { useState } from "react";
import './ExperienceSection.css';
import SectionHeading from '../../components/SectionHeading/SectionHeading';

const ExperienceSection = ({experience_data}) => {

    const [expIndex, setExpIndex] = useState(0);

    return (
        <div id="experience-section">
            <SectionHeading section_name="EXPERIENCES"/>
            <div id="experience-logos">
                {
                    experience_data.map((experience, index) => eachExperienceLogo(experience, index, expIndex, setExpIndex))
                }
                {
                    eachExperienceLogo({}, -1,expIndex, setExpIndex, true)
                }
            </div>
            <div id="experience_details">
            {
                expIndex !== -1?
                eachExperience(experience_data[expIndex]):
                finalExperience()
            }
            </div>
        </div>
    );
}

const eachExperienceLogo = (experience, index, expIndex, setExpIndex, isDefault=false) => {
    if (isDefault) {
        experience["name"]  = "Keep Learning";
        experience["domain"] = "questionmark.com";
    }
    const link = "https://cdn.brandfetch.io/"+experience.domain;
    const highlightedExpCSS = {
        border: "3px solid var(--font-primary-color)"
    };
    return(
        <div className="experience-logo" onClick={() => setExpIndex(index)} key={index}>
            <img 
                src={link} 
                alt={experience.name} 
                key={index} 
                style={index === expIndex? highlightedExpCSS: null}
            ></img>
        </div>
    );
}

const eachExperience = (experience) => {
    return (
        <>
            <div className="experience-headline">
                <h3>
                    {experience.role}
                    &nbsp; 
                    <span className="experience-company">
                        @
                        &nbsp;
                        <a href={experience.website} target="_blank" rel="noreferrer">
                            {experience.name}
                        </a>
                    </span>
                </h3>
                <div className="experience-period">
                    <span>{experience.start}</span> - <span>{experience.end}</span>
                </div>
            </div>
            <ul className="experience-desc">
                {
                    experience.desc.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))
                }
            </ul>
            &nbsp;
            <div className="experience-tech">
                {
                    experience.tech.map((tech, index) => (
                        <div className="tech" key={index}>{tech}</div>
                    ))
                }
            </div>
        </>
    );
}

const finalExperience = () => {
    return (
        <div id="experience-details" key={-1}>
            <h3>Keep Learning</h3>
            &nbsp;
            <ul className="experience-desc">
                <li>Open to learning new technologies and frameworks.</li>
                <li>Highly collaborative spirit with eagerness to help others.</li>
                <li>Particular focus on tackling corner scenarios and responsive design.</li>
                <li>Committed to making small issues matter even less.</li>
            </ul>
        </div>
    );
}

export default ExperienceSection;