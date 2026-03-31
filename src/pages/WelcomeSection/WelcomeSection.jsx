import './WelcomeSection.css';
import { TypeAnimation } from 'react-type-animation';
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import linkedin_icon from "../../assets/icons/linkedin.json";
import gmail_icon from "../../assets/icons/gmail.json";
import github_icon from "../../assets/icons/github.json";
import resume_icon from "../../assets/icons/resume.json";
import hello_sequence from "../../assets/data/differentHellos.json";

const WelcomeSection = ({my_resume}) => {

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
                I specialise in engineering software solutions.
            </div>
            &nbsp;
            <div id="summary">
                A software engineer with a specialization in developing optimality-focused products tailored to address challenges and make life efficient.
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
        </div>
    );
}

export default WelcomeSection;