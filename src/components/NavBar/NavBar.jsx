import React, { useState, useRef, useEffect } from "react";
import './NavBar.css';
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import { RotatingText } from 'rotating-text'
import 'rotating-text/dist/index.css'
import { Divide as Hamburger } from 'hamburger-react'
import { motion } from 'framer-motion';
import { useWindowSize } from "@uidotdev/usehooks";
import useEmblaCarousel from 'embla-carousel-react';
import WebsiteLogo from "../WebsiteLogo/WebsiteLogo";
import about_icon from "../../assets/icons/about.json";
import experience_icon from "../../assets/icons/experience.json";
import projects_icon from "../../assets/icons/projects.json";
import certificates_icon from "../../assets/icons/certificates.json";
import redirect_icon from "../../assets/icons/redirect.json";

const NavBar = () => {

    const size = useWindowSize();

    const NavBarItems = [
        <NavBarItem content="ABOUT" dest="about-section" icon={about_icon} key="ABOUT" isMobile={size.width < 1200}></NavBarItem>,
        <NavBarItem content="EXPERIENCES" dest="experience-section" icon={experience_icon} key="EXPERIENCES" isMobile={size.width < 1200}></NavBarItem>,
        <NavBarItem content="PROJECTS" dest="projects-section" icon={projects_icon} key="PROJECTS" isMobile={size.width < 1200}></NavBarItem>,
        <NavBarItem content="CERTIFICATES" dest="certificates-section" icon={certificates_icon} key="CERTIFICATES" isMobile={size.width < 1200}></NavBarItem>,
    ];

    const BlogItem = <BlogNavBarItem content="BLOGS" dest="/blogs" icon={redirect_icon} key="BLOG"></BlogNavBarItem>;

    if (size.width < 1200)
        return (<SideNavBar regularItems={NavBarItems} blogItem={BlogItem}></SideNavBar>);
    else
        return (<TopNavBar regularItems={NavBarItems} blogItem={BlogItem}></TopNavBar>);
}

const SideNavBar = ({ regularItems, blogItem }) => {
    const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

    return (
        <div id="navbar">
            <Link
                to="welcome-section"
                smooth={true}
                duration={500}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <WebsiteLogo />
            </Link>
            <div id="hamburger-icon">
                <Hamburger
                    color="#00abf0"
                    toggled={sideBarIsOpen}
                    toggle={setSideBarIsOpen}
                    rounded
                    size={22}
                />
            </div>
            <FullScreenNavigation
                navscreenState={sideBarIsOpen}
                setNavscreenState={setSideBarIsOpen}
                regularItems={regularItems}
                blogItem={blogItem}
            />
        </div>
    );
}

const FullScreenNavigation = ({ navscreenState, setNavscreenState, regularItems, blogItem }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'center',
        skipSnaps: false,
    });

    const variants = {
        open: {
            opacity: 1,
            scale: 1,
            display: "flex",
            transition: { duration: 0.3, ease: "easeOut" }
        },
        closed: {
            opacity: 0,
            scale: 0.8,
            transitionEnd: { display: "none" },
            transition: { duration: 0.2, ease: "easeIn" }
        },
    }

    // Scroll to the active section on open
    useEffect(() => {
        if (navscreenState && emblaApi) {
            const timeoutId = setTimeout(() => {
                const container = emblaApi.containerNode();
                const slides = container.children;
                let activeIndexFound = 0;

                Array.from(slides).forEach((slide, index) => {
                    if (slide.querySelector('.activeTab')) {
                        activeIndexFound = index;
                    }
                });

                emblaApi.scrollTo(activeIndexFound, true);
                setActiveIndex(activeIndexFound);
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [navscreenState, emblaApi]);

    const onScroll = React.useCallback((emblaApi) => {
        const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
        setScrollProgress(progress * 100);
    }, []);

    const onSelect = React.useCallback((emblaApi) => {
        setActiveIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onScroll(emblaApi);
        emblaApi.on('scroll', onScroll);
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onScroll);
    }, [emblaApi, onScroll, onSelect]);

    const handleItemClick = (index) => {
        // Close menu after a short delay to allow navigation to start
        setTimeout(() => {
            setNavscreenState(false);
        }, 400);
    };

    return (
        <motion.div
            id="full-screen-navscreen"
            initial="closed"
            animate={navscreenState ? "open" : "closed"}
            variants={variants}
            style={{ originX: 1, originY: 0 }}
        >
            <div id="full-screen-navscreen-carousel-container">
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {React.Children.map(regularItems, (item, index) => (
                            <div className={`embla__slide ${index === activeIndex ? 'is-selected' : ''}`} key={index}>
                                {React.cloneElement(item, {
                                    onClick: () => handleItemClick(index)
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div id="full-screen-navscreen-controls">
                    <div className="carousel-nav-buttons">
                        <button
                            className="embla__prev"
                            onClick={() => emblaApi?.scrollPrev()}
                            aria-label="Previous slide"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            className="embla__next"
                            onClick={() => emblaApi?.scrollNext()}
                            aria-label="Next slide"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>

                    <div className="carousel-progress-wrapper">
                        <div
                            className="carousel-progress-bar"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>

                <div id="full-screen-navscreen-blog" onClick={() => setNavscreenState(false)}>
                    {blogItem}
                </div>
            </div>
        </motion.div>
    );
}

const TopNavBar = ({ regularItems, blogItem }) => {
    return (
        <div id="navbar">
            <Link
                to="welcome-section"
                smooth={true}
                duration={500}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <WebsiteLogo />
            </Link>
            <div id="navlist-full">
                {regularItems}
            </div>
            <div id="blog-nav-item-container">
                {blogItem}
            </div>
        </div>
    );
}

const NavBarItem = ({ content, dest, icon = null, onClick, isMobile = false }) => {
    return (
        <Link
            to={dest}
            className="navlistItem"
            activeClass="activeTab"
            spy={true}
            smooth={true}
            duration={500}
            onClick={onClick}
        >
            <AnimatedIcon icon={icon} />
            {isMobile ? (
                <span className="mobile-nav-text">{content}</span>
            ) : (
                <RotatingText
                    text={content}
                    stagger={0.1}
                    timing={0.5}
                    className="rotating-text"
                    styles={{ fontSize: '100px' }}
                />
            )}
        </Link>
    );
}

const BlogNavBarItem = ({ content, dest, icon = null }) => {
    return (
        <RouterLink to={dest} className="blogNavItem">
            <AnimatedIcon icon={icon} class_name="nocss" />
            <RotatingText
                text={content}
                stagger={0.1}
                timing={0.5}
                className="rotating-text"
                styles={{ fontSize: '100px' }}
            />
        </RouterLink>
    );
}

export default NavBar;