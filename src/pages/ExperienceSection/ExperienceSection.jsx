import React, { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './ExperienceSection.css';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import TestimonialCarousel from './TestimonialCarousel';

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

    const ChevronIcon = ({ isOpen }) => (
        <svg 
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );

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
                        <ChevronIcon isOpen={isExpanded} />
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
    const [filter, setFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = useMemo(() => {
        const exps = (experience_data || []).map(e => ({ ...e, category: 'experience' }));
        const edus = (education_history || []).map(e => ({ ...e, category: 'education' }));
        let list = [...exps, ...edus];

        // Filter by Category
        if (filter !== 'All') {
            const categoryMap = { 'Experiences': 'experience', 'Education': 'education' };
            list = list.filter(item => item.category === categoryMap[filter]);
        }

        // Search
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            list = list.filter(item => 
                item.name.toLowerCase().includes(lowSearch) ||
                (item.role && item.role.toLowerCase().includes(lowSearch)) ||
                (item.degree && item.degree.toLowerCase().includes(lowSearch)) ||
                (item.major && item.major.toLowerCase().includes(lowSearch)) ||
                (item.desc && item.desc.some(d => d.toLowerCase().includes(lowSearch)))
            );
        }

        // Sort
        list.sort((a, b) => {
            const dateA = parseDate(a.end);
            const dateB = parseDate(b.end);
            return sortBy === 'Newest' ? dateB - dateA : dateA - dateB;
        });

        return list;
    }, [experience_data, education_history, filter, searchTerm, sortBy]);

    const toggleExpand = (index) => {
        setExpandedIndex(current => current === index ? null : index);
    };

    return (
        <div id="experience-section">
            <SectionHeading section_name="JOURNEY" />

            <div className="filter-section">
                <div className="search-wrapper">
                    <div className="search-icon">🔍</div>
                    <input
                        type="text"
                        placeholder="Search journey..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="sort-wrapper">
                    <button
                        className={`sort-btn ${isSortOpen ? 'active' : ''}`}
                        onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                    >
                        Sort By: {sortBy} <span className="chevron"></span>
                    </button>
                    {isSortOpen && (
                        <div className="sort-dropdown">
                            {['Newest', 'Oldest'].map(s => (
                                <div
                                    key={s}
                                    className={`sort-option ${sortBy === s ? 'selected' : ''}`}
                                    onClick={() => { setSortBy(s); setIsSortOpen(false); }}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="filter-wrapper">
                    <button
                        className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                        onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                    >
                        Filter By: {filter} <span className="chevron"></span>
                    </button>
                    {isFilterOpen && (
                        <div className="filter-dropdown">
                            {['All', 'Experiences', 'Education'].map(f => (
                                <div
                                    key={f}
                                    className={`filter-option ${filter === f ? 'selected' : ''}`}
                                    onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                                >
                                    {f}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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