import './WelcomeSection.css';
import { TypeAnimation } from 'react-type-animation';
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import linkedin_icon_recruiter from "../../assets/icons/recruiter/linkedin.json";
import gmail_icon_recruiter from "../../assets/icons/recruiter/gmail.json";
import github_icon_recruiter from "../../assets/icons/recruiter/github.json";

import linkedin_icon_freelance from "../../assets/icons/freelance/linkedin.json";
import gmail_icon_freelance from "../../assets/icons/freelance/gmail.json";
import github_icon_freelance from "../../assets/icons/freelance/github.json";
import hello_sequence from "../../assets/data/differentHellos.json";
import { useSiteMode } from '../../context/SiteModeContext';

const RedirectIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19Z" fill="currentColor" />
    </svg>
);

const WelcomeSection = ({ welcome_data, freelance_welcome_data, forcedMode }) => {
    const { isFreelance: contextIsFreelance } = useSiteMode();
    const isFreelance = forcedMode ? (forcedMode === 'freelance') : contextIsFreelance;

    const activeData = isFreelance ? freelance_welcome_data : welcome_data;
    const { brief, summary, ctaText, ctaLink } = activeData || {};

    const linkedin_icon = isFreelance ? linkedin_icon_freelance : linkedin_icon_recruiter;
    const github_icon = isFreelance ? github_icon_freelance : github_icon_recruiter;
    const gmail_icon = isFreelance ? gmail_icon_freelance : gmail_icon_recruiter;

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
                    {brief}
                </div>
                &nbsp;
                <div id="summary">
                    {summary}
                </div>
                &nbsp;
                <div id="contact">
                    <div id="contact_icons">
                        <AnimatedIcon icon={linkedin_icon} link="https://linkedin.com/in/muditgarg48" />
                        <AnimatedIcon icon={github_icon} link="https://github.com/muditgarg48" />
                        <AnimatedIcon icon={gmail_icon} link="mailto:gargmu@tcd.ie" />
                    </div>
                    <a href={ctaLink} id="resume_btn" target="_blank" rel="noreferrer">
                        <RedirectIcon size={20} />
                        &nbsp;
                        {ctaText}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default WelcomeSection;