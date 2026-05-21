import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import ImageLoader from "../../components/LoadingLogo/ImageLoader";
import './WorksSection.css';

const WorksSection = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <div id="works-section">
            <div className="works-content">
                <SectionHeading section_name="WORKS" />
                
                <div className="works-grid">
                    {projects.map((project, index) => (
                        <motion.div 
                            key={index} 
                            className="work-card-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/works/${project.id}`} className="work-card-link-container">
                                <div className="work-image-container">
                                    {project.hero_image ? (
                                        <ImageLoader src={project.hero_image} alt={project.name} imgClassName="work-image" />
                                    ) : (
                                        <div className="work-image-placeholder">
                                            <span>{project.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="work-status-tag">
                                        <span className="pulse-indicator-small"></span>
                                        {project.status}
                                    </div>
                                </div>
                                
                                <div className="work-info">
                                    <h3 className="work-title">{project.name}</h3>
                                    <p className="work-desc">{project.desc}</p>
                                    
                                    <div className="work-actions-row">
                                        <span className="case-study-action-btn">
                                            View Case Study ↗
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorksSection;