import React from "react";
import './WelcomeSection.css';
// import my_resume from '../../assets/pdfs/My Resume.pdf';
import { TypeAnimation } from 'react-type-animation';
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import ScrollFurther from "../../components/ScrollFurther/ScrollFurther";

const WelcomeSection = ({my_resume}) => {

    const linkedin_icon = require('../../assets/icons/linkedin.json');
    const gmail_icon = require('../../assets/icons/gmail.json');
    const github_icon = require('../../assets/icons/github.json');
    const resume_icon = require('../../assets/icons/resume.json');

    const hello_sequence = require('../../assets/data/differentHellos.json');

    return (
        <div id="welcome-section">
            <TypeAnimation
                sequence={hello_sequence}
                speed={50}
                repeat={Infinity}
                className="hello"
            />
            <div id="name">My name is <span>Mudit Garg</span></div>
            <div id="brief">
                I specialise in developing software solutions.
            </div>
            &nbsp;
            <div id="summary">
                A software engineer with a specialization in developing product focused applications tailored to address specific challenges and make life simpler.
            </div>
            &nbsp;
            <div id="contact">
                <div id="contact_icons">
                    <AnimatedIcon icon={linkedin_icon} link="https://linkedin.com/in/muditgarg48"/>
                    <AnimatedIcon icon={github_icon} link="https://github.com/muditgarg48"/>
                    <AnimatedIcon icon={gmail_icon} link="mailto:gargmu@tcd.ie"/>
                    <a href={my_resume} id="resume_btn" target="_blank" rel="noreferrer">
                        <AnimatedIcon icon={resume_icon} class_name="nocss"/>
                        &nbsp;
                        RESUME
                    </a>
                </div>
            </div>
            &nbsp;
            <ScrollFurther next="about-section"/>
        </div>
    );
}

export default WelcomeSection;