import { motion } from 'framer-motion';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import ExternalLinkIcon from "../../assets/svg/ExternalLinkIcon";
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
                            className="work-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="work-image-container">
                                {project.image ? (
                                    <img src={project.image} alt={project.name} className="work-image" />
                                ) : (
                                    <div className="work-image-placeholder">
                                        <span>{project.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="work-status-tag">{project.status}</div>
                            </div>
                            
                            <div className="work-info">
                                <h3 className="work-title">{project.name}</h3>
                                <p className="work-desc">{project.desc}</p>
                                
                                {project.deployment && (
                                    <a 
                                        href={project.deployment} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="work-link"
                                    >
                                        Visit Live Site
                                        <ExternalLinkIcon className="external-link-icon" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorksSection;