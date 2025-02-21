import React, { useState } from "react";
import './AboutSection.css';
import { TypeAnimation } from "react-type-animation";
import Marquee from "react-fast-marquee";
import { Ribbon, RibbonContainer,  RightCornerRibbon } from "react-ribbons";

import ScrollFurther from "../../components/ScrollFurther/ScrollFurther";
import SectionHeading from "../../components/SectionHeading/SectionHeading.js";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import EducationSection from "../EducationSection/EducationSection.js";
import myself from '../../assets/imgs/myself.jpg';

const AboutSection = ({facts, education_history, skills}) => {
    return (
        <div id="about-section">
            <SectionHeading section_name="ABOUT"/>
            <div id="about-section-content">
                <div id="my-description">
                    <TypeAnimation
                        className="about_me"
                        style={{ whiteSpace: 'pre-line', display: 'block' }}
                        speed={100}
                        cursor={false}
                        sequence={[
                            `As an upcoming Software Engineer, I am passionate about building efficient and scalable solutions that measurably improve business outcomes, while also adopting a growth mindset and willingness to learn anything that makes me a better engineer. I have a proven track record of producing such improvements, both as an individual contributor and as a team collaborator. Due to my passion for my field, I have a strong work ethic which makes me a valuable asset to every team I join. I consistently strive toward perfection and always keep my codebase clean, readable, and modular. What I lack in experience, I make up in my industry-standard project work with a properly structured, modular codebase and well-documented repository.`,
                            500
                        ]}
                        repeat={0}
                    />
                    <div>
                        <h3>Currently,</h3>
                        <ul>
                            <li>
                                <u>Exploring opportunities to learn and grow</u> as a professional Software Engineer based in Dublin, Ireland.
                            </li>
                            <li>
                                Researching about <u>DevOps</u> and enhancing expertise in related tools and methodologies including:
                                <ul>
                                    <li>Docker</li>
                                    <li>Kubernetes</li>
                                    <li>Git</li>
                                    <li>CI/CD</li>
                                    <li>Telemetry</li>
                                </ul>
                            </li>
                            <li>
                                Grasping and adopting the use of <u>Golang</u> and its ecosystem.
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3>Recently concluded</h3>
                        <ul>
                            <li>
                                <u>My postgraduation</u> from Trinity College Dublin in 2024.
                            </li>
                            <li>
                                Exploration of Generative AI. First gained a solid theoretical background of how <u>LLMs and Generative AI</u> work using <u>Microsoft's Career Essentials in Generative AI</u>. Then gained some practical knowledge using <u>Oracle OCI Generative AI Certification</u>, diving into further depths and learning about <u>RAG systems</u> and their application. Then explored the ethics and concerns surrounding the use of Generative AI with the help of <u>Google's AI Essentials</u> course.
                            </li>
                            <li>
                                Solidification of the acquired knowledge on LLMs, RAG systems and Generative AI by implementation of a personal chatbot named <a href="#chatbot-section" style={{color: 'white'}}>A.L.F.R.E.D.</a> at the end of my portfolio website to provide human-like responses to queries about my professional background.
                            </li>
                        </ul>
                    </div>
                    <TypeAnimation
                        className="about_me"
                        style={{ whiteSpace: 'pre-line', display: 'block' }}
                        speed={100}
                        sequence={[
                            2500,
                            `I am always eager to collaborate on solving problems and contributing to the growth of a cause. Feel free to contact me via LinkedIn or email.`,
                        ]}
                        repeat={0}
                    />
                </div>
                <div id="myself-subsection">
                    <img id="my-potrait" src={myself} alt="My Potrait"/>
                    <div id="my-quote">
                        <span id="quotation-mark" className="highlight">"</span>
                        <span id="quote">Lets hope for the best and plan for the worst</span>
                    </div>
                </div>
                &nbsp;
                <div style={{display: "flex", justifyContent: "end"}}>
                    <span>⚒️ - Professional</span>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <span>⭐ - Proficient</span>
                </div>
                &nbsp;
                <SkillSection skills={skills}/>
                &nbsp;
                <ScrollFurther next="experience-section" side="right"/>
                &nbsp;
                <DidYouKnowSection facts={facts}/>
                <EducationSection education_history={education_history}/>
                &nbsp;
            </div>
        </div>
    );
}

const DidYouKnowSection = ({facts}) => {
    const did_you_know_icon = require('../../assets/icons/interesting.json');
    const [randomFactIndex, setRandomFactIndex] = useState(0);

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * facts.length);
        setRandomFactIndex(randomNumber)
    }
    
    return (
        <div id="did-you-know-subsection">
            <div id="dyk-heading-section">
                <h3 id="dyk-heading">
                    <AnimatedIcon icon={did_you_know_icon} link=""/>
                    DID YOU KNOW
                </h3>
                <div id="refresh-dyk" onClick={generateRandomNumber}>Refresh</div>
            </div>
            <div id="did-you-know">
               {facts[randomFactIndex]}
            </div>
        </div>
    );
}

const SkillSection = ({skills}) => {
    return (
        <div id="skills-subsection">
            {/* <div class="subsection-heading">
                My Skillset
            </div> */}
            {
                Object.keys(skills).map((key, index) => {
                    return (
                        <SkillSubSection
                            key={index}
                            skills={skills[key]}
                            section_name={key}
                            dir={index%2===0?"right":"left"}/>
                    );
                })
            }
        </div>
    );
}

const SkillSubSection = ({id, skills, section_name,dir}) => {
    return (
        <div id={id} className="skill_subsection">
            <div style={{display: "flex", justifyContent: "center"}}>{section_name}</div>
            <Marquee pauseOnHover speed={70} direction={dir}>
                {
                    skills.map((skill) => {
                        if ("ribbon" in skill) {
                            return (
                                <RibbonContainer>
                                    <Ribbon
                                        side="right"
                                        type="edge"
                                        size="normal"
                                        backgroundColor="transparent"
                                        withStripes={false}
                                    >
                                        {skill.ribbon}
                                    </Ribbon>
                                    <Skill icon={skill.icon} name={skill.name} key={skill.name}/>
                                </RibbonContainer>
                            );
                        } else {
                            return (
                                <Skill icon={skill.icon} name={skill.name} key={skill.name}/>
                            );
                        }
                    })
                }
            </Marquee>
        </div>
    );
}

const Skill = ({icon=null, name=''}) => {

    const [showName, setShowName] = useState(false);

    return (
        <div className="single_skill" onMouseEnter={()=>setShowName(true)} onMouseLeave={()=>setShowName(false)}>
            <img src={icon} alt={name}></img>
            &nbsp;
            {showName && <>{name}</>}
            {!showName && <>&nbsp;</>}
        </div>
    );
}

export default AboutSection;