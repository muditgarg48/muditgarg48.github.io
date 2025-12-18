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
import WebsiteLogo from "../WebsiteLogo/WebsiteLogo";

const NavBar =  () => {

    const size = useWindowSize();

    const home_icon = require('../../assets/icons/home.json');
    const about_icon = require('../../assets/icons/about.json');
    const experience_icon = require('../../assets/icons/experience.json');
    const projects_icon = require('../../assets/icons/projects.json');
    const certificates_icon = require('../../assets/icons/certificates.json');
    const blog_icon = require('../../assets/icons/blogwall.json');

    const NavBarItems = [
        <NavBarItem content="HOME" dest="welcome-section" icon={home_icon} key="HOME"></NavBarItem>,
        <NavBarItem content="ABOUT" dest="about-section" icon={about_icon} key="ABOUT"></NavBarItem>,
        <NavBarItem content="EXPERIENCES" dest="experience-section" icon={experience_icon} key="EXPERIENCES"></NavBarItem>,
        <NavBarItem content="PROJECTS" dest="projects-section" icon={projects_icon} key="PROJECTS"></NavBarItem>,
        <NavBarItem content="CERTIFICATES" dest="certificates-section" icon={certificates_icon} key="CERTIFICATES"></NavBarItem>,
    ];

    const BlogItem = <BlogNavBarItem content="BLOG" dest="/blogs" icon={blog_icon} key="BLOG"></BlogNavBarItem>;

    if(size.width < 1000)
        return(<SideNavBar regularItems={NavBarItems} blogItem={BlogItem}></SideNavBar>);
    else
        return (<TopNavBar regularItems={NavBarItems} blogItem={BlogItem}></TopNavBar>);
}

const SideNavBar = ({regularItems, blogItem}) => {
    
    const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

    if(!sideBarIsOpen) {
        return (
            <div id="navbar">
                <div id="website_logo">
                    <span className="highlight_text">M</span>udit<span className="highlight_text">.</span>
                </div>
                <div id="hamburger-icon">
                    <Hamburger 
                        color="#00abf0" 
                        toggled={sideBarIsOpen} 
                        toggle={setSideBarIsOpen}
                        rounded
                    />
                </div>
            </div>
        );
    } else {
        return (
            <FullScreenNavigation navscreenState={sideBarIsOpen} setNavscreenState={setSideBarIsOpen} regularItems={regularItems} blogItem={blogItem}>
            </FullScreenNavigation>
        );
    }
}

const FullScreenNavigation = ({navscreenState, setNavscreenState, regularItems, blogItem}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);
    const itemsCount = React.Children.count(regularItems);
    
    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "100%" },
    }

    const scrollToItem = (index) => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        
        const items = carousel.children;
        if (items[index]) {
            const item = items[index];
            // Use scrollIntoView for better scroll-snap compatibility
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    };

    // Find active navbar item when menu opens
    useEffect(() => {
        if (!navscreenState) return; // Only when menu is open
        
        const carousel = carouselRef.current;
        if (!carousel) return;
        
        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            const items = carousel.children;
            if (items.length === 0) return;
            
            // Find which item has the activeTab class
            let activeItemIndex = 0;
            Array.from(items).forEach((item, index) => {
                if (item.classList.contains('activeTab')) {
                    activeItemIndex = index;
                }
            });
            
            // Scroll to the active item
            scrollToItem(activeItemIndex);
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [navscreenState, itemsCount]);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const handleScroll = () => {
            const items = carousel.children;
            if (items.length === 0) return;
            
            const scrollLeft = carousel.scrollLeft;
            const clientWidth = carousel.clientWidth;
            const centerPoint = scrollLeft + clientWidth / 2;
            
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            Array.from(items).forEach((item, index) => {
                const itemLeft = item.offsetLeft;
                const itemWidth = item.offsetWidth;
                const itemCenter = itemLeft + itemWidth / 2;
                const distance = Math.abs(centerPoint - itemCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            setActiveIndex(closestIndex);
        };

        carousel.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
        
        // Also handle resize
        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(carousel);
        
        return () => {
            carousel.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [itemsCount]);

    const handleDotClick = (index) => {
        scrollToItem(index);
    };

    const handleItemClick = (e, index) => {
        scrollToItem(index);
        // Close menu after a short delay to allow navigation to start
        setTimeout(() => {
            setNavscreenState(false);
        }, 400);
    };

    return (
        <motion.div 
            id="full-screen-navscreen"
            animate={navscreenState ? "open" : "closed"}
            variants={variants}
            transition={{duration: 5, delay: 0.5, ease: "linear" }}
        >
            <div id="full-screen-navscreen-top">
                <WebsiteLogo/>
                <div id="hamburger-icon">
                    <Hamburger 
                        color="#00abf0" 
                        toggled={navscreenState} 
                        toggle={setNavscreenState}
                        rounded
                    />
                </div>
            </div>
            <div id="full-screen-navscreen-carousel-container">
                <div 
                    id="full-screen-navscreen-carousel" 
                    ref={carouselRef}
                >
                    {React.Children.map(regularItems, (item, index) => 
                        React.cloneElement(item, {
                            onClick: (e) => handleItemClick(e, index)
                        })
                    )}
                </div>
                <div id="full-screen-navscreen-dots">
                    {Array.from({ length: itemsCount }).map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to item ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div id="full-screen-navscreen-blog" onClick={() => setNavscreenState(false)}>
                {blogItem}
            </div>
        </motion.div>
    );
}

const TopNavBar = ({regularItems, blogItem}) => {
    return (
        <div id="navbar">
            <WebsiteLogo/>
            <div id="navlist-full">
                {regularItems}
            </div>
            <div id="blog-nav-item-container">
                {blogItem}
            </div>
        </div>
    );
}

const NavBarItem = ({content, dest, icon=null, onClick}) => {
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
            <AnimatedIcon icon={icon}/>
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

const BlogNavBarItem = ({content, dest, icon=null}) => {
    return (
        <RouterLink to={dest} className="blogNavItem">
            <AnimatedIcon icon={icon}/>
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