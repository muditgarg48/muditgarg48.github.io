import { motion } from 'framer-motion';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import './ProcessSection.css';

const ProcessSection = ({ steps }) => {
    const ProgressIcon = ({ type }) => {
        const size = 28;
        switch (type) {
            case 'chat': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
            case 'advice': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="m3.34 19 1.407-5.159a2 2 0 0 1 1.244-1.356L21 7l-5.5 12.5-3.5-3.5-4 4Z"/></svg>;
            case 'scope': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
            case 'build': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>;
            case 'review': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
            case 'deliver': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
            default: return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
        }
    };

    if (!steps || steps.length === 0) return null;

    return (
        <div id="process-section">
            <div className="process-content">
                <SectionHeading section_name="PROCESS" />
                
                <div className="process-timeline">
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index} 
                            className="process-step-box"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="step-number-bg">{step.step}</div>
                            
                            <div className="step-visual">
                                <div className="step-icon-container">
                                    <ProgressIcon type={step.icon} />
                                </div>
                                {index !== steps.length - 1 && <div className="step-connector" />}
                            </div>
                            
                            <div className="step-details">
                                <div className="step-header">
                                    <h3 className="step-title">{step.title}</h3>
                                    <span className="step-duration">{step.duration_hint}</span>
                                </div>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProcessSection;