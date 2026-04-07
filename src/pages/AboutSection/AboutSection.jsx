import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './AboutSection.css';
import { useSiteMode } from '../../context/SiteModeContext';

import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import did_you_know_icon from "../../assets/icons/recruiter/interesting.json";
import skillset_icon from "../../assets/icons/recruiter/skillset.json";
import services_offered_icon from "../../assets/icons/freelance/services_offered.json";
import credentials_icon from "../../assets/icons/freelance/credentials.json";

const DATA_ENDPOINT = 'https://muditgarg48.github.io/portfolio_data/data/';

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
            case 'graduation':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5L2 10L12 15L22 10Z"/><path d="M6 12.5V16C6 16 8.5 19 12 19C15.5 19 18 16 18 16V12.5"/></svg>;
            case 'industry':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" ry="2"/><path d="M9 21V9h6v12"/><path d="M12 5h.01"/><path d="M12 9h.01"/><path d="M12 13h.01"/><path d="M12 17h.01"/></svg>;
            case 'performance':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
            case 'robot':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>;
            default:
                return null;
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
            case 'web':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
            case 'mobile':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
            case 'ai':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/><path d="M11 2h2"/></svg>;
            case 'backend':
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
            default:
                return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
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

    const RefreshIcon = () => (
        <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="dyk-refresh-icon"
        >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    )

    return (
        <div id="did-you-know-subsection">
            <div id="dyk-heading-section">
                <h3 className="about-subheading">
                    <AnimatedIcon icon={did_you_know_icon} link="" icon_size={24} />
                    DID YOU KNOW
                </h3>
                <div id="refresh-dyk" onClick={generateRandomNumber} aria-label="Refresh Fact">
                    <RefreshIcon />
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