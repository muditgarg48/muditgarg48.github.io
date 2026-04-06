import { useState, memo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './AboutSection.css';
import { useSiteMode } from '../../context/SiteModeContext';

import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import did_you_know_icon from "../../assets/icons/recruiter/interesting.json";
import skillset_icon from "../../assets/icons/recruiter/skillset.json";

const AboutSection = ({ facts, skills, about_me }) => {
    const { isFreelance } = useSiteMode();

    return (
        <div id="about-section">
            <div id="about-section-content">
                {isFreelance ? (
                    <FreelanceContent about_me={about_me} />
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

const FreelanceContent = ({ about_me }) => {
    const {
        intro_para,
        outer_para,
        portrait_link,
        my_quote
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
                <div className="credential-badge">
                    Masters in Computer Engineering — Trinity College Dublin
                </div>
                <p className="services-sentence">
                    I work across web, mobile, AI tools, automation and internal systems.
                </p>
            </div>
        </>
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