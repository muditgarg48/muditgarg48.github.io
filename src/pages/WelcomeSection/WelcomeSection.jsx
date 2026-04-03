import './WelcomeSection.css';
import { TypeAnimation } from 'react-type-animation';
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import linkedin_icon from "../../assets/icons/linkedin.json";
import gmail_icon from "../../assets/icons/gmail.json";
import github_icon from "../../assets/icons/github.json";
import hello_sequence from "../../assets/data/differentHellos.json";

const DownloadIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="currentColor" />
    </svg>
);

const WelcomeSection = ({my_resume}) => {

    return (
        <div id="welcome-section">
            <div className="welcome-content">
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
                            <DownloadIcon size={20} />
                            &nbsp;
                            RESUME
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeSection;