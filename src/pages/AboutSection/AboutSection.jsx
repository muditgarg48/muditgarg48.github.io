import { useState, memo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './AboutSection.css';
import { useSiteMode } from '../../context/SiteModeContext';

import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import GraduationIcon from "../../assets/svg/GraduationIcon";
import IndustryIcon from "../../assets/svg/IndustryIcon";
import PerformanceIcon from "../../assets/svg/PerformanceIcon";
import RobotIcon from "../../assets/svg/RobotIcon";
import WebIcon from "../../assets/svg/WebIcon";
import MobileIcon from "../../assets/svg/MobileIcon";
import AIIcon from "../../assets/svg/AIIcon";
import BackendIcon from "../../assets/svg/BackendIcon";
import RefreshIcon from "../../assets/svg/RefreshIcon";
import InfoIcon from "../../assets/svg/InfoIcon";
import did_you_know_icon from "../../assets/icons/recruiter/interesting.json";
import skillset_icon from "../../assets/icons/recruiter/skillset.json";
import services_offered_icon from "../../assets/icons/freelance/services_offered.json";
import credentials_icon from "../../assets/icons/freelance/credentials.json";

const AboutSection = ({ facts, skills, about_me, freelance_about_me, freelance_services, forcedMode }) => {
    const { isFreelance: contextIsFreelance } = useSiteMode();
    const isFreelance = forcedMode ? (forcedMode === 'freelance') : contextIsFreelance;

    return (
        <div id="about-section">
            <div id="about-section-content">
                {isFreelance ? (
                    <FreelanceContent about_me={freelance_about_me} services={freelance_services} />
                ) : (
                    <RecruiterContent 
                        about_me={about_me} 
                        skills={skills} 
                        facts={facts} 
                    />
                )}
            </div>
        </div>
    );
};

// ==================== RECRUITER MODE ====================

const RecruiterContent = ({ about_me, skills, facts }) => {
    const {
        intro_para,
        basic_info,
        currently,
        recently_concluded,
        outer_para,
        portrait_link,
        my_quote
    } = about_me;

    return (
        <>
            <SectionHeading section_name="ABOUT" />
            <div id="about-top-layout">
                <div id="intro-text-container">
                    <div className="about_me" style={{ whiteSpace: 'pre-line' }}>
                        {intro_para}
                    </div>
                    <div className="about_me" style={{ whiteSpace: 'pre-line' }}>
                        {outer_para}
                    </div>
                </div>
                <div id="portrait-container">
                    <img id="my-potrait" src={portrait_link} alt="My Portrait" />
                </div>
            </div>

            <div id="my-quote">
                <span id="quotation-mark" className="highlight">"</span>
                &nbsp;
                <span id="quote">{my_quote}</span>
            </div>

            <div id="about-middle-layout">
                <div id="more-about-me-container">
                    <MoreAboutMeSection
                        currently={currently}
                        recently_concluded={recently_concluded}
                    />
                </div>
                <div id="basic_info">
                    {basic_info.map((item, index) => (
                        <BasicInfoItem
                            key={index}
                            title={item.title}
                            content={item.content}
                            footer={item.footer || null}
                        />
                    ))}
                </div>
            </div>
            &nbsp;
            <SkillSection skills={skills} />
            <DidYouKnowSection facts={facts} />
        </>
    );
};

// ==================== FREELANCE MODE ====================

const FreelanceContent = ({ about_me, services }) => {
    if (!about_me) {
        return null;
    }

    const {
        intro_para,
        outer_para,
        portrait_link,
        my_quote,
        credentials
    } = about_me;

    return (
        <>
            <SectionHeading section_name="ABOUT ME" />
            <div id="about-top-layout">
                <div id="intro-text-container">
                    <div className="about_me" style={{ whiteSpace: 'pre-line' }}>
                        {intro_para}
                    </div>
                    <div className="about_me" style={{ whiteSpace: 'pre-line' }}>
                        {outer_para}
                    </div>
                </div>
                <div id="portrait-container">
                    <img id="my-potrait" src={portrait_link} alt="My Portrait" />
                </div>
            </div>

            <div id="my-quote">
                <span id="quotation-mark" className="highlight">"</span>
                &nbsp;
                <span id="quote">{my_quote}</span>
            </div>

            <div className="freelance-about-extras">
                <CredentialsSection credentials={credentials} />
                {services && services.length > 0 && <ServicesSection services={services} />}
            </div>
        </>
    );
};

const CredentialsSection = ({ credentials }) => {
    if (!credentials || credentials.length === 0) return null;

    const CredIcon = ({ type }) => {
        const size = 32;
        switch (type) {
            case 'graduation': return <GraduationIcon size={size} />;
            case 'industry': return <IndustryIcon size={size} />;
            case 'performance': return <PerformanceIcon size={size} />;
            case 'robot': return <RobotIcon size={size} />;
            default: return null;
        }
    };

    return (
        <div className="credentials-wrapper">
             <h3 className="about-subheading">
                <AnimatedIcon icon={credentials_icon} link="" icon_size={24} />
                EXPERT CREDENTIALS
            </h3>
            <div className="credentials-grid">
                {credentials.map((cred) => (
                    <div key={cred.id} className="credential-card">
                        <div className="credential-header">
                            <div className="credential-icon-box">
                                <CredIcon type={cred.icon} />
                            </div>
                            <span className="credential-tag">{cred.tag}</span>
                        </div>
                        <div className="credential-body">
                            <h4 className="credential-value">{cred.value}</h4>
                            <p className="credential-institution">{cred.institution}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ServicesSection = ({ services }) => {
    const [activeService, setActiveService] = useState(services[0]?.id || '');

    const currentService = services.find(s => s.id === activeService) || services[0];

    const ServiceIcon = ({ type }) => {
        const size = 24;
        switch (type) {
            case 'web': return <WebIcon size={size} />;
            case 'mobile': return <MobileIcon size={size} />;
            case 'ai': return <AIIcon size={size} />;
            case 'backend': return <BackendIcon size={size} />;
            default: return <InfoIcon size={size} />;
        }
    };

    return (
        <div id="skills-section-wrapper" className="services-wrapper">
             <h3 className="about-subheading">
                <AnimatedIcon icon={services_offered_icon} link="" icon_size={24} />
                SERVICES OFFERED
            </h3>
            <div id="skills-layout-container">
                <div className="skills-vertical-tabs">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`skill-tab-item ${activeService === service.id ? 'active' : ''}`}
                            onClick={() => setActiveService(service.id)}
                        >
                            <span>{service.title}</span>
                            {activeService === service.id && (
                                <motion.div layoutId="service-tab-indicator" className="skill-tab-indicator" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="skills-content-panel service-panel">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeService}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="service-detail"
                        >
                            <div className="service-header">
                                <div className="service-icon-box">
                                    <ServiceIcon type={currentService.icon} />
                                </div>
                                <div className="service-titles">
                                    <h4>{currentService.subtitle}</h4>
                                </div>
                            </div>
                            <p className="service-description">{currentService.description}</p>
                            <div className="service-examples">
                                <h5>What I can assist with:</h5>
                                <div className="skills-grid">
                                    {currentService.examples.map((example, i) => (
                                        <div key={i} className="skill-minimal-pill service-pill">
                                            <span className="skill-pill-name">{example}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const MoreAboutMeSection = ({ currently, recently_concluded }) => {
    const [expanded, setExpanded] = useState('currently');

    const toggleSection = (section) => {
        setExpanded(section);
    };

    const BulletPoints = ({ points }) => {
        return (
            <div className="modern_bullet_points">
                {
                    points.map((item, index) => {
                        return (
                            <div key={index} className="modern_bullet_item">
                                <div className="modern_bullet_text">{item["text"]}</div>
                                {
                                    item["links"].length > 0 && (
                                        <div className="modern_bullet_links">
                                            {item["links"].map((link, i) => (
                                                <a key={i} className="modern_link_pill" href={link} target="_blank" rel="noopener noreferrer">
                                                    ↗ Link {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    const sections = [
        { id: 'currently', title: 'Currently', data: currently },
        { id: 'concluded', title: 'Recently concluded', data: recently_concluded }
    ];


    return (
        <div id="more-about-me-accordion">
            <div className="accordion_header_row">
                {sections.map(section => (
                    <div
                        key={section.id}
                        className={`accordion_tab ${expanded === section.id ? 'active' : ''}`}
                        onClick={() => toggleSection(section.id)}
                    >
                        <h3>{section.title}</h3>
                        <div className="tab_indicator"></div>
                    </div>
                ))}
            </div>

            <div className="accordion_content_row">
                <AnimatePresence mode="popLayout">
                    {expanded && (
                        <motion.div
                            key={expanded} /* forces re-animation if switching directly */
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="accordion_full_width_content"
                        >
                            <BulletPoints points={sections.find(s => s.id === expanded).data} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const BasicInfoItem = ({ title, content, footer = "" }) => {
    return (
        <div className="basic_info_item">
            <div className="basic_info_title">{title}</div>
            <div className="basic_info_content">{content}</div>
            {footer && <div className="basic_info_footer">{footer}</div>}
        </div>
    )
}

const DidYouKnowSection = ({ facts }) => {
    const [randomFactIndex, setRandomFactIndex] = useState(0);

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * facts.length);
        setRandomFactIndex(randomNumber)
    }

    const RefreshIconComp = () => (
        <RefreshIcon className="dyk-refresh-icon" />
    )

    return (
        <div id="did-you-know-subsection">
            <div id="dyk-heading-section">
                <h3 className="about-subheading">
                    <AnimatedIcon icon={did_you_know_icon} link="" icon_size={24} />
                    DID YOU KNOW
                </h3>
                <div id="refresh-dyk" onClick={generateRandomNumber} aria-label="Refresh Fact">
                    <RefreshIconComp />
                </div>
            </div>
            <div id="did-you-know">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={randomFactIndex}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {facts[randomFactIndex]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

const SkillSection = memo(({ skills }) => {
    const categories = Object.keys(skills);
    const [activeCategory, setActiveCategory] = useState(categories[0] || '');

    return (
        <div id="skills-section-wrapper">
            <h3 className="about-subheading">
                <AnimatedIcon icon={skillset_icon} link="" icon_size={24} />
                MY SKILLSET
            </h3>
            <div id="skills-layout-container">
                <div className="skills-vertical-tabs">
                    {categories.map((cat) => (
                        <div
                            key={cat}
                            className={`skill-tab-item ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            <span>{cat}</span>
                            {activeCategory === cat && (
                                <motion.div layoutId="skill-tab-indicator" className="skill-tab-indicator" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="skills-content-panel">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="skills-grid"
                        >
                            {activeCategory && skills[activeCategory] && skills[activeCategory].map((skill, index) => (
                                <div key={skill.name || index} className="skill-minimal-pill">
                                    <div className="skill-icon-wrapper">
                                        <img src={skill.icon} alt={skill.name} />
                                    </div>
                                    <span className="skill-pill-name">{skill.name}</span>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
});

export default AboutSection;