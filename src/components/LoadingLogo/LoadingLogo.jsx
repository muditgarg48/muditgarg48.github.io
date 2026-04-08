import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsiteLogo from '../WebsiteLogo/WebsiteLogo';
import './LoadingLogo.css';

import { useSiteMode } from '../../context/SiteModeContext';

const LoadingLogo = ({ isMajor = false, textArray = [] }) => {
    const { mode } = useSiteMode();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (textArray.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % textArray.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [textArray.length]);

    const animationClass = isMajor 
        ? (mode === 'freelance' ? 'logo-major-freelance' : 'logo-major-recruiter')
        : 'logo-minor';

    return (
        <div className="loading-wrapper">
            <WebsiteLogo className={animationClass} />
            
            <AnimatePresence mode="wait">
                {textArray.length > 0 && (
                    <motion.div 
                        key={currentIndex}
                        className="loading-text-container"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 0.7, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="loading-text">
                            {textArray[currentIndex]}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoadingLogo;