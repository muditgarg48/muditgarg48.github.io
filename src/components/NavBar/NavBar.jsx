import React, { useState } from "react";
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
import redirect_icon from "../../assets/icons/redirect.json";

const NAV_ITEMS = [
    { content: "ABOUT", dest: "about-section" },
    { content: "JOURNEY", dest: "experience-section" },
    { content: "PROJECTS", dest: "projects-section" },
    { content: "CERTIFICATES", dest: "certificates-section" },
];

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
                {NAV_ITEMS.map(item => (
                    <DesktopNavItem
                        key={item.content}
                        content={item.content}
                        dest={item.dest}
                    />
                ))}
            </div>
            <div id="blog-nav-item-container">
                <DesktopBlogItem />
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
                styles={{ fontSize: '100px' }}
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
                styles={{ fontSize: '100px' }}
            />
            <AnimatedIcon icon={redirect_icon} class_name="nocss" icon_size={16} />
        </RouterLink>
    );
}

// ==================== MOBILE ====================

const MobileNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                    color="#00abf0"
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
                {NAV_ITEMS.map(item => (
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
                <RouterLink
                    to="/blogs"
                    className="fullscreen-nav-item fullscreen-nav-blog-item"
                    onClick={handleItemClick}
                >
                    BLOGS
                    <AnimatedIcon icon={redirect_icon} class_name="nocss" icon_size={18} />
                </RouterLink>
            </nav>
        </motion.div>
    );
}

export default NavBar;