import { useState, useEffect, useRef } from "react";
import './NavBar.css';
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { RotatingText } from 'rotating-text';
import 'rotating-text/dist/index.css';
import { Twirl as Hamburger } from 'hamburger-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from "@uidotdev/usehooks";
import WebsiteLogo from "../WebsiteLogo/WebsiteLogo";
import redirect_icon from "../../assets/icons/recruiter/redirect.json";
import { useSiteMode } from "../../context/SiteModeContext";

const RECRUITER_NAV_ITEMS = [
    { content: "ABOUT", dest: "about-section" },
    { content: "JOURNEY", dest: "experience-section" },
    { content: "PROJECTS", dest: "projects-section" },
    { content: "CERTIFICATES", dest: "certificates-section" },
];

const FREELANCE_NAV_ITEMS = [
    { content: "WORKS", dest: "works-section" },
    { content: "ABOUT", dest: "about-section" },
    { content: "PROCESS", dest: "process-section" },
    { content: "TESTIMONIALS", dest: "testimonials-section" },
];

// ==================== MODE TOGGLE ====================

const ModeToggle = () => {
    const { isFreelance, toggleMode } = useSiteMode();

    return (
        <div className="mode-toggle" onClick={toggleMode} role="switch" aria-checked={isFreelance}>
            <motion.div
                className="mode-toggle-indicator"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{ left: isFreelance ? '50%' : '4px' }}
            />
            <span className={`mode-toggle-label ${!isFreelance ? 'active' : ''}`}>
                Recruiter
            </span>
            <span className={`mode-toggle-label ${isFreelance ? 'active' : ''}`}>
                Freelance
            </span>
        </div>
    );
};

const NavBar = () => {
    const size = useWindowSize();
    const isMobile = size.width < 1000;

    if (isMobile)
        return <MobileNavBar />;
    else
        return <DesktopNavBar />;
}

// ==================== DESKTOP ====================

const DesktopNavBar = () => {
    const { isFreelance } = useSiteMode();
    const navItems = isFreelance ? FREELANCE_NAV_ITEMS : RECRUITER_NAV_ITEMS;

    return (
        <div id="navbar">
            <Link
                to="welcome-section"
                className="desktop-logo-link"
                smooth={true}
                duration={500}
            >
                <WebsiteLogo />
            </Link>
            <div id="navlist-full">
                {navItems.map(item => (
                    <DesktopNavItem
                        key={item.content}
                        content={item.content}
                        dest={item.dest}
                    />
                ))}
            </div>
            {!isFreelance && (
                <div id="blog-nav-item-container">
                    <DesktopBlogItem />
                </div>
            )}
            <div id="mode-toggle-desktop-container">
                <ModeToggle />
            </div>
        </div>
    );
}

const DesktopNavItem = ({ content, dest }) => {
    return (
        <Link
            to={dest}
            className="navlistItem"
            activeClass="activeTab"
            spy={true}
            smooth={true}
            duration={500}
        >
            <RotatingText
                text={content}
                stagger={0.1}
                timing={0.5}
                className="rotating-text"
                styles={{ fontSize: '100px', whiteSpace: 'pre' }}
            />
        </Link>
    );
}

const DesktopBlogItem = () => {
    return (
        <RouterLink to="/blogs" className="blogNavItem">
            <RotatingText
                text="BLOGS"
                stagger={0.1}
                timing={0.5}
                className="rotating-text"
                styles={{ fontSize: '100px', whiteSpace: 'pre' }}
            />
            <AnimatedIcon icon={redirect_icon} class_name="nocss" icon_size={16} />
        </RouterLink>
    );
}

// ==================== MOBILE ====================

const MobileNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { primaryColor } = useSiteMode();

    return (
        <div id="navbar">
            <Link
                to="welcome-section"
                smooth={true}
                duration={500}
                className="navbar-logo-link"
                onClick={() => setIsOpen(false)}
            >
                <WebsiteLogo />
            </Link>
            <div id="hamburger-icon">
                <Hamburger
                    color={primaryColor}
                    toggled={isOpen}
                    toggle={setIsOpen}
                    rounded
                    size={22}
                />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <FullScreenNav
                        setIsOpen={setIsOpen}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const FullScreenNav = ({ setIsOpen }) => {
    const { isFreelance } = useSiteMode();
    const navItems = isFreelance ? FREELANCE_NAV_ITEMS : RECRUITER_NAV_ITEMS;

    const handleItemClick = () => {
        setTimeout(() => setIsOpen(false), 300);
    };

    return (
        <motion.div
            id="fullscreen-nav"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <nav className="fullscreen-nav-list">
                {navItems.map(item => (
                    <Link
                        key={item.content}
                        to={item.dest}
                        className="fullscreen-nav-item"
                        activeClass="fullscreen-nav-item-active"
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={handleItemClick}
                    >
                        {item.content}
                    </Link>
                ))}
                {!isFreelance && (
                    <RouterLink
                        to="/blogs"
                        className="fullscreen-nav-item fullscreen-nav-blog-item"
                        onClick={handleItemClick}
                    >
                        BLOGS
                        <AnimatedIcon icon={redirect_icon} class_name="nocss" icon_size={18} />
                    </RouterLink>
                )}
                <div className="fullscreen-nav-toggle-container">
                    <ModeToggle />
                </div>
            </nav>
        </motion.div>
    );
}

// ==================== SCROLL-TO-TOP ON MODE SWITCH ====================

export function useScrollToTopOnModeSwitch() {
    const { mode } = useSiteMode();
    const prevMode = useRef(mode);

    useEffect(() => {
        if (prevMode.current !== mode) {
            // Sections that exist in recruiter mode
            const recruiterSections = ['experience-section', 'projects-section', 'certificates-section'];
            // Sections that exist in freelance mode
            const freelanceSections = ['works-section', 'process-section', 'testimonials-section', 'about-section'];

            const removedSections = mode === 'freelance' ? recruiterSections : freelanceSections;

            // Check if user is currently viewing a section that won't exist in the new mode
            const scrollY = window.scrollY;
            const shouldScroll = removedSections.some(id => {
                const el = document.getElementById(id);
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.top <= window.innerHeight / 2 && rect.bottom >= 0;
            });

            if (shouldScroll) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            prevMode.current = mode;
        }
    }, [mode]);
}

export default NavBar;