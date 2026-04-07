import { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './ExperienceSection.css';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import FilterBar from "../../components/FilterBar/FilterBar";
import useFiltering from "../../hooks/useFiltering";
import TestimonialCarousel from './TestimonialCarousel';
import ChevronIcon from "../../assets/svg/ChevronIcon";

const ItemEyebrow = memo(({ start, end, category, location }) => {
    return (
        <div className="pill-line" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {category && (
                <span className={`category-pill pill-category ${category}`}>
                    {category}
                </span>
            )}
            {(start || end) && (
                <span className="category-pill pill-period">
                    {start ? `${start} - ` : ''}{end}
                </span>
            )}
            {location && (
                <span className="category-pill pill-location">
                    📍 {location}
                </span>
            )}
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

const ExperienceListItem = memo(({ item, isExpanded, onToggle }) => {
    const { category, name, domain, website, start, end, desc, tech, testimonials, location, logo } = item;

    let displayTitle = item.role;
    if (category === 'education') {
        displayTitle = item.major ? `${item.degree} in ${item.major}` : item.degree;
    }

    const logoLink = logo || (domain ? `https://cdn.brandfetch.io/${domain}` : null);

    return (
        <div className={`experience-list-item ${category}-item ${isExpanded ? 'active' : ''}`}>

            <div className="experience-content-wrapper">
                <div className="list-item-top" onClick={onToggle}>
                    {logoLink && (
                        <div className="experience-logo-container">
                            <img
                                src={logoLink}
                                alt={`${name} logo`}
                                className={`experience-logo-img ${category}-logo`}
                                loading="lazy"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}
                    <div className="item-title-group">
                        <ItemEyebrow start={start} end={end} category={category} location={location} />
                        <div className="item-title-wrapper">
                            <h3 className="item-role-title">
                                {displayTitle}
                            </h3>
                            {name && (
                                <h4 className="item-company-subtitle">
                                    {website ? (
                                        <a href={website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{name}</a>
                                    ) : (
                                        name
                                    )}
                                </h4>
                            )}
                        </div>
                    </div>
                    <div className="experience-chevron">
                        <ChevronIcon style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ overflow: 'hidden' }}
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
});

const parseDate = (dateStr) => {
    if (!dateStr) return -Infinity; // Early school dates often missing or just ""
    if (dateStr.toLowerCase() === 'present') return Infinity;
    const match = dateStr.match(/([a-zA-Z]+)\s*'(\d{2})/);
    if (match) {
        const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
        const monthStr = match[1].slice(0, 4).toLowerCase(); // 'sept' is 4 chars
        let monthIndex = monthMap[monthStr];
        if (monthIndex === undefined) monthIndex = monthMap[match[1].slice(0, 3).toLowerCase()] || 0;
        const year = 2000 + parseInt(match[2], 10);
        return new Date(year, monthIndex).getTime();
    }
    return 0; // Fallback if format is entirely unmatched
};

const ExperienceSection = ({ experience_data, education_history }) => {
    const [expandedIndex, setExpandedIndex] = useState(0);

    const unifiedData = useMemo(() => {
        const exps = (experience_data || []).map(e => ({ ...e, category: 'experience' }));
        const edus = (education_history || []).map(e => ({ ...e, category: 'education' }));
        return [...exps, ...edus];
    }, [experience_data, education_history]);

    const filteringConfig = useMemo(() => ({
        searchFields: ['name', 'role', 'degree', 'major', 'desc'],
        filterLogic: {
            'Experiences': (item) => item.category === 'experience',
            'Education': (item) => item.category === 'education'
        },
        sortLogic: {
            'Newest': (a, b) => parseDate(b.end) - parseDate(a.end),
            'Oldest': (a, b) => parseDate(a.end) - parseDate(b.end)
        }
    }), []);

    const {
        searchTerm, setSearchTerm,
        sortBy, setSortBy,
        filter, setFilter,
        filteredData
    } = useFiltering(unifiedData, filteringConfig);

    const toggleExpand = (index) => {
        setExpandedIndex(current => current === index ? null : index);
    };

    return (
        <div id="experience-section">
            <SectionHeading section_name="JOURNEY" />

            <FilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOptions={['Newest', 'Oldest']}
                filter={filter}
                setFilter={setFilter}
                filterOptions={['All', 'Experiences', 'Education']}
                placeholder="Search journey..."
            />

            <div className="experience-list-container" key={filter}>
                {filteredData.map((item, index) => (
                    <ExperienceListItem 
                        key={`${item.category}-${item.name}-${index}`} 
                        item={item} 
                        isExpanded={expandedIndex === index}
                        onToggle={() => toggleExpand(index)}
                    />
                ))}
                {filteredData.length === 0 && (
                    <div className="no-results">No journey items found matching your criteria.</div>
                )}
            </div>
        </div>
    );
};

export default ExperienceSection;