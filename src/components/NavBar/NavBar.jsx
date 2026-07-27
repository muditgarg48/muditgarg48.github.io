"use client";

import { useState, useEffect, useRef } from "react";
import './NavBar.css';
import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { RotatingText } from 'rotating-text';
import 'rotating-text/dist/index.css';
import { Twirl as Hamburger } from 'hamburger-react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsiteLogo from "../WebsiteLogo/WebsiteLogo";
import redirect_icon from "../../assets/icons/recruiter/redirect.json";
import { useSiteMode } from "../../context/SiteModeContext";
import { SITE_SCROLL_ID, useSitePaneWidth } from "../../hooks/sitePane";

export { SITE_SCROLL_ID };

const NAV_MOBILE_BREAKPOINT = 920;

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
    const isMobile = useSitePaneWidth() < NAV_MOBILE_BREAKPOINT;
    return isMobile ? <MobileNavBar /> : <DesktopNavBar />;
};

const DesktopNavBar = () => {
    const { isFreelance } = useSiteMode();
    const navItems = isFreelance ? FREELANCE_NAV_ITEMS : RECRUITER_NAV_ITEMS;

    return (
        <div className="navbar-sticky-slot">
            <div id="navbar">
                <ScrollLink
                    to="welcome-section"
                    className="desktop-logo-link"
                    containerId={SITE_SCROLL_ID}
                    smooth={true}
                    duration={500}
                >
                    <WebsiteLogo />
                </ScrollLink>
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
        </div>
    );
};

const DesktopNavItem = ({ content, dest }) => (
    <ScrollLink
        to={dest}
        className="navlistItem"
        activeClass="activeTab"
        containerId={SITE_SCROLL_ID}
        spy={true}
        smooth={true}
        duration={500}
    >
        <RotatingText
            text={content}
            stagger={0.1}
            timing={0.5}
            className="rotating-text"
        />
    </ScrollLink>
);

const DesktopBlogItem = () => (
    <Link href="/blogs" className="blogNavItem">
        <RotatingText
            text="BLOGS"
            stagger={0.1}
            timing={0.5}
            className="rotating-text"
        />
        <AnimatedIcon icon={redirect_icon} class_name="nocss" icon_size={14} />
    </Link>
);

const MobileNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { primaryColor } = useSiteMode();

    return (
        <div className="navbar-sticky-slot">
            <div id="navbar">
                <ScrollLink
                    to="welcome-section"
                    containerId={SITE_SCROLL_ID}
                    smooth={true}
                    duration={500}
                    className="navbar-logo-link"
                    onClick={() => setIsOpen(false)}
                >
                    <WebsiteLogo />
                </ScrollLink>
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
                    {isOpen && <FullScreenNav setIsOpen={setIsOpen} />}
                </AnimatePresence>
            </div>
        </div>
    );
};

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
                    <ScrollLink
                        key={item.content}
                        to={item.dest}
                        className="fullscreen-nav-item"
                        activeClass="fullscreen-nav-item-active"
                        containerId={SITE_SCROLL_ID}
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={handleItemClick}
                    >
                        {item.content}
                    </ScrollLink>
                ))}
                {!isFreelance && (
                    <Link
                        href="/blogs"
                        className="fullscreen-nav-item fullscreen-nav-blog-item"
                        onClick={handleItemClick}
                    >
                        BLOGS
                        <AnimatedIcon icon={redirect_icon} class_name="nocss" icon_size={18} />
                    </Link>
                )}
                <div className="fullscreen-nav-toggle-container">
                    <ModeToggle />
                </div>
            </nav>
        </motion.div>
    );
};

export function useScrollToTopOnModeSwitch() {
    const { mode } = useSiteMode();
    const prevMode = useRef(mode);

    useEffect(() => {
        if (prevMode.current === mode) return;

        const recruiterSections = ['experience-section', 'projects-section', 'certificates-section'];
        const freelanceSections = ['works-section', 'process-section', 'testimonials-section', 'about-section'];
        const removedSections = mode === 'freelance' ? recruiterSections : freelanceSections;

        const scroller = document.getElementById(SITE_SCROLL_ID);
        const viewportHeight = scroller?.clientHeight ?? window.innerHeight;
        const shouldScroll = removedSections.some(id => {
            const el = document.getElementById(id);
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top <= viewportHeight / 2 && rect.bottom >= 0;
        });

        if (shouldScroll) {
            (scroller ?? window).scrollTo({ top: 0, behavior: 'smooth' });
        }

        prevMode.current = mode;
    }, [mode]);
}

export default NavBar;
