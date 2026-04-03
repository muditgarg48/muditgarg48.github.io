import React, { useState, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './AboutSection.css';
import { TypeAnimation } from "react-type-animation";
import Marquee from "react-fast-marquee";
import { Ribbon, RibbonContainer } from "react-ribbons";

import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import EducationSection from "../EducationSection/EducationSection";
import did_you_know_icon from "../../assets/icons/interesting.json";

const AboutSection = ({ facts, education_history, skills, about_me }) => {

    const intro_para = about_me['intro_para'];
    const basic_info = about_me['basic_info'];
    const currently = about_me['currently'];
    const recently_concluded = about_me['recently_concluded'];
    const outer_para = about_me['outer_para'];
    const my_portrait_link = about_me['portrait_link'];
    const my_quote = about_me['my_quote'];

    return (
        <div id="about-section">
            <div id="about-section-content">
                <SectionHeading section_name="ABOUT" />
                <div id="my-description">
                    <TypeAnimation
                        className="about_me"
                        style={{ whiteSpace: 'pre-line', display: 'block' }}
                        speed={100}
                        cursor={false}
                        sequence={[
                            intro_para,
                            500
                        ]}
                        repeat={0}
                    />
                    <MoreAboutMeSection
                        currently={currently}
                        recently_concluded={recently_concluded}
                    />
                    <TypeAnimation
                        className="about_me"
                        style={{ whiteSpace: 'pre-line', display: 'block' }}
                        speed={100}
                        sequence={[
                            2500,
                            outer_para,
                        ]}
                        repeat={0}
                    />
                </div>
                <div id="myself-subsection">
                    <div id="my-quote">
                        <span id="quotation-mark" className="highlight">"</span>
                        &nbsp;
                        <span id="quote">{my_quote}</span>
                    </div>
                    <div id="myself-visual">
                        <img id="my-potrait" src={my_portrait_link} alt="My Portrait" />
                        <div id="basic_info">
                            {
                                basic_info.map((item, index) => {
                                    return (
                                        <BasicInfoItem
                                            key={index}
                                            title={item.title}
                                            content={item.content}
                                            footer={item.footer || null}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                &nbsp;
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <span>⚒️ - Professional</span>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <span>⭐ - Proficient</span>
                </div>
                &nbsp;
                <SkillSection skills={skills} />
                &nbsp;
                <DidYouKnowSection facts={facts} />
                <EducationSection education_history={education_history} />
                &nbsp;
            </div>
        </div>
    );
}

const MoreAboutMeSection = ({ currently, recently_concluded }) => {
    const [expanded, setExpanded] = useState(null);

    const toggleSection = (section) => {
        setExpanded(current => current === section ? null : section);
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

    const ChevronIcon = ({ isOpen }) => (
        <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );

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
                        <div className="accordion_icon">
                            <ChevronIcon isOpen={expanded === section.id} />
                        </div>
                        <div className="tab_indicator"></div>
                    </div>
                ))}
            </div>

            <div className="accordion_content_row">
                <AnimatePresence mode="wait">
                    {expanded && (
                        <motion.div
                            key={expanded} /* forces re-animation if switching directly */
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
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

    return (
        <div id="did-you-know-subsection">
            <div id="dyk-heading-section">
                <h3 id="dyk-heading">
                    <AnimatedIcon icon={did_you_know_icon} link="" />
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

const SkillSection = memo(({ skills }) => {
    const skillSubsections = useMemo(() => {
        return Object.keys(skills).map((key, index) => {
            return (
                <SkillSubSection
                    key={key}
                    skills={skills[key]}
                    section_name={key}
                    dir={index % 2 === 0 ? "right" : "left"} />
            );
        });
    }, [skills]);

    return (
        <div id="skills-subsection">
            {/* <div class="subsection-heading">
                My Skillset
            </div> */}
            {skillSubsections}
        </div>
    );
});

const SkillSubSection = memo(({ skills, section_name, dir }) => {
    const skillElements = useMemo(() => {
        return skills.map((skill, index) => {
            if ("ribbon" in skill) {
                return (
                    <RibbonContainer key={skill.name || index}>
                        <Ribbon
                            side="right"
                            type="edge"
                            size="normal"
                            backgroundColor="transparent"
                            withStripes={false}
                        >
                            {skill.ribbon}
                        </Ribbon>
                        <Skill icon={skill.icon} name={skill.name} key={skill.name} />
                    </RibbonContainer>
                );
            } else {
                return (
                    <Skill icon={skill.icon} name={skill.name} key={skill.name || index} />
                );
            }
        });
    }, [skills]);

    return (
        <div className="skill_subsection">
            <div style={{ display: "flex", justifyContent: "center" }}>{section_name}</div>
            <Marquee pauseOnHover speed={70} direction={dir}>
                {skillElements}
            </Marquee>
        </div>
    );
});

const Skill = memo(({ icon = null, name = '' }) => {

    const [showName, setShowName] = useState(false);

    const handleMouseEnter = useCallback(() => setShowName(true), []);
    const handleMouseLeave = useCallback(() => setShowName(false), []);

    return (
        <div className="single_skill" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <img src={icon} alt={name}></img>
            &nbsp;
            {showName && <>{name}</>}
            {!showName && <>&nbsp;</>}
        </div>
    );
});

export default AboutSection;