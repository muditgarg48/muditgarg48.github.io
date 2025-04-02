import React, { useState } from "react";
import './AboutSection.css';
import { TypeAnimation } from "react-type-animation";
import Marquee from "react-fast-marquee";
import { Ribbon, RibbonContainer,  RightCornerRibbon } from "react-ribbons";

import ScrollFurther from "../../components/ScrollFurther/ScrollFurther";
import SectionHeading from "../../components/SectionHeading/SectionHeading.js";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import EducationSection from "../EducationSection/EducationSection.js";

const AboutSection = ({facts, education_history, skills, about_me}) => {

    const intro_para = about_me['intro_para'];
    const basic_info = about_me['basic_info'];
    const currently = about_me['currently'];
    const recently_concluded = about_me['recently_concluded'];
    const outer_para = about_me['outer_para'];
    const my_portrait_link = about_me['portrait_link'];
    const my_quote = about_me['my_quote'];

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
                            intro_para,
                            500
                        ]}
                        repeat={0}
                    />
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
                    <img id="my-potrait" src={my_portrait_link} alt="My Potrait"/>
                    <div id="my-quote">
                        <span id="quotation-mark" className="highlight">"</span>
                        <span id="quote">{my_quote}</span>
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
                <ScrollFurther next="experience-section" side="right" text="Skip to Experience section"/>
                &nbsp;
                <DidYouKnowSection facts={facts}/>
                <EducationSection education_history={education_history}/>
                &nbsp;
            </div>
        </div>
    );
}

const MoreAboutMeSection = ({currently, recently_concluded}) => {
    
    const BulletPoints = ({className, points}) => {
        return (
            <ul className={"bullet_points "+className}>
            {
                points.map((item, index) => {
                    return (
                    <div key={index}>
                        <li>{item["text"]}</li>
                        {
                            item["links"].length > 0 &&
                            item["links"].map((link, i) => {
                                return (
                                    <div key={i}>
                                        <a className="more_links" href={link} rel="noopener noreferrer">
                                            Link {i+1}
                                        </a>
                                        &nbsp;
                                        &nbsp;
                                    </div>
                                )
                            })
                        }
                    </div>
                )})
            }
            </ul>
        );
    }

    return (
        <div>
            <div>
                <h3>Currently</h3>
                <BulletPoints className="currently" points={currently}/>
            </div>
            <div>
                <h3>Recently concluded</h3>
                <BulletPoints className="concluded" points={recently_concluded}/>
            </div>
        </div>
    );
}

const BasicInfoItem = ({title, content, footer=""}) => {
    return (
        <div className="basic_info_item">
            <div className="basic_info_title">{title}</div>
            <div className="basic_info_content">{content}</div>
            {footer && <div className="basic_info_footer">{footer}</div>}
        </div>
    )
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

const SkillSubSection = ({skills, section_name,dir}) => {
    return (
        <div className="skill_subsection">
            <div style={{display: "flex", justifyContent: "center"}}>{section_name}</div>
            <Marquee pauseOnHover speed={70} direction={dir}>
            {
                skills.map((skill, index) => {
                    if ("ribbon" in skill) {
                        return (
                            <RibbonContainer key={index}>
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