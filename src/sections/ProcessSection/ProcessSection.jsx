import { motion } from 'framer-motion';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import ChatIcon from "../../assets/svg/ChatIcon";
import AdviceIcon from "../../assets/svg/AdviceIcon";
import ScopeIcon from "../../assets/svg/ScopeIcon";
import BuildIcon from "../../assets/svg/BuildIcon";
import ReviewIcon from "../../assets/svg/ReviewIcon";
import DeliverIcon from "../../assets/svg/DeliverIcon";
import InfoIcon from "../../assets/svg/InfoIcon";
import './ProcessSection.css';

const ProcessSection = ({ steps }) => {
    const ProgressIcon = ({ type }) => {
        const size = 28;
        switch (type) {
            case 'chat': return <ChatIcon size={size} />;
            case 'advice': return <AdviceIcon size={size} />;
            case 'scope': return <ScopeIcon size={size} />;
            case 'build': return <BuildIcon size={size} />;
            case 'review': return <ReviewIcon size={size} />;
            case 'deliver': return <DeliverIcon size={size} />;
            default: return <InfoIcon size={size} />;
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

                            <div className="step-number-bg">{step.step}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProcessSection;