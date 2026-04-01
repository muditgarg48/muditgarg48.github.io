import React, { memo } from "react";
import './ExperienceSection.css';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import TestimonialCarousel from './TestimonialCarousel';

const ExperiencePill = memo(({ start, end }) => {
    if (!start && !end) return null;
    return (
        <div className="pill-line">
            <span className="category-pill pill-period">
                {start} - {end}
            </span>
        </div>
    );
});

const ProjectTechStack = memo(({ tech_stack }) => {
    if (!tech_stack || tech_stack.length === 0) return null;
    return (
        <div className="experience-tech">
            {
                tech_stack.map((tech, index) => (
                    <span key={index} className="tech-pill">{tech}</span>
                ))
            }
        </div>
    );
});

const ExperienceListItem = memo(({ experience }) => {
    const { role, name, domain, website, start, end, desc, tech, testimonials } = experience;

    const logoLink = domain ? `https://cdn.brandfetch.io/${domain}` : null;

    return (
        <div className="experience-list-item">

            <div className="experience-content-wrapper">
                <div className="list-item-top">
                    {logoLink && (
                        <div className="experience-logo-container">
                            <img
                                src={logoLink}
                                alt={`${name} logo`}
                                className="experience-logo-img"
                                loading="lazy"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}
                    <div className="item-title-group">
                        <ExperiencePill start={start} end={end} />
                        <h3 className="item-role-title">
                            {role}
                            {name && (
                                <span className="experience-company">
                                    &nbsp;@&nbsp;
                                    {website ? (
                                        <a href={website} target="_blank" rel="noreferrer">{name}</a>
                                    ) : (
                                        name
                                    )}
                                </span>
                            )}
                        </h3>
                    </div>
                </div>

                <div className="list-item-content">
                    {desc && desc.length > 0 && (
                        <ul className="experience-desc">
                            {desc.map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                    )}

                    <ProjectTechStack tech_stack={tech} />

                    {testimonials && testimonials.length > 0 && (
                        <TestimonialCarousel testimonials={testimonials} />
                    )}
                </div>
            </div>
        </div>
    );
});

const ExperienceSection = ({ experience_data }) => {

    return (
        <div id="experience-section">
            <SectionHeading section_name="EXPERIENCES" />
            <div className="experience-list-container">
                {experience_data && experience_data.map((experience, index) => (
                    <ExperienceListItem key={index} experience={experience} />
                ))}
            </div>
        </div>
    );
};

export default ExperienceSection;