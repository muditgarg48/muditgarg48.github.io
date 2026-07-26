"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSiteMode } from '../../context/SiteModeContext';
import { useScrollToTopOnModeSwitch } from '../../components/NavBar/NavBar';
import NavBar from '../../components/NavBar/NavBar';
import { SITE_SCROLL_ID } from '../../hooks/sitePane';
import WelcomeSection from '../WelcomeSection/WelcomeSection';
import AboutSection from '../AboutSection/AboutSection';
import Footer from '../Footer/Footer';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import AlfredDock from '../../components/AlfredDock/AlfredDock';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './HomePage.css';

const ExperienceSection = dynamic(() => import('../ExperienceSection/ExperienceSection'));
const ProjectsSection = dynamic(() => import('../ProjectsSection/ProjectsSection'));
const WorksSection = dynamic(() => import('../WorksSection/WorksSection'));
const ProcessSection = dynamic(() => import('../ProcessSection/ProcessSection'));
const TestimonialsSection = dynamic(() => import('../TestimonialsSection/TestimonialsSection'));

const CertificatesSection = dynamic(() => import('../CertificatesSection/CertificatesSection'), {
  ssr: false,
});

const loadChatWindowContainer = () => import('../ChatbotSection/ChatWindowContainer');

const ChatWindowContainer = dynamic(loadChatWindowContainer, {
  ssr: false,
});

const ALFRED_DOCK_WIDTH = 420;
const ALFRED_MIN_SITE_WIDTH = 480;

const HomePage = ({
  factsData,
  projectsData,
  certificatesData,
  experienceData,
  educationHistoryData,
  skillsData,
  aboutMeData,
  welcomeData,
  freelanceProjectsData,
  freelanceProcessData,
  freelanceAboutData,
  freelanceServicesData,
  freelanceWelcomeData,
  freelanceTestimonialsData,
  portfolioDataLastUpdated,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAlfredOpen, setIsAlfredOpen] = useState(false);
  const [isAlfredMounted, setIsAlfredMounted] = useState(false);
  const [isAlfredFullscreen, setIsAlfredFullscreen] = useState(false);
  const { isFreelance, mode } = useSiteMode();
  const prevModeRef = useRef(mode);
  const shouldUnmountAlfredRef = useRef(false);
  const openAlfredRafRef = useRef(0);

  useScrollToTopOnModeSwitch();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const sync = () => {
      setIsAlfredFullscreen(window.innerWidth - ALFRED_DOCK_WIDTH < ALFRED_MIN_SITE_WIDTH);
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  useEffect(() => () => {
    if (openAlfredRafRef.current) {
      cancelAnimationFrame(openAlfredRafRef.current);
    }
  }, []);

  const direction = useMemo(() => {
    const dir = mode === 'freelance' ? 1 : -1;
    prevModeRef.current = mode;
    return dir;
  }, [mode]);

  const sectionVariants = {
    enter: (dir) => ({ x: dir * 120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir * -120, opacity: 0 }),
  };

  const transition = { duration: 0.5, ease: 'easeInOut' };

  const preloadAlfred = useCallback(() => {
    loadChatWindowContainer();
  }, []);

  const openAlfred = useCallback(() => {
    shouldUnmountAlfredRef.current = false;

    const reveal = () => {
      // Double rAF: paint the off-screen dock first, then slide in
      openAlfredRafRef.current = requestAnimationFrame(() => {
        openAlfredRafRef.current = requestAnimationFrame(() => {
          setIsAlfredOpen(true);
        });
      });
    };

    if (isAlfredMounted) {
      reveal();
      return;
    }

    setIsAlfredMounted(true);
    reveal();
  }, [isAlfredMounted]);

  // Yellow traffic light — hide dock, keep chat session mounted
  const minimizeAlfred = useCallback(() => {
    shouldUnmountAlfredRef.current = false;
    setIsAlfredOpen(false);
  }, []);

  const unmountAlfredSession = useCallback(() => {
    if (!shouldUnmountAlfredRef.current) return;
    shouldUnmountAlfredRef.current = false;
    setIsAlfredMounted(false);
  }, []);

  // Red traffic light — slide out, then tear down session after transform ends
  const closeAlfred = useCallback(() => {
    shouldUnmountAlfredRef.current = true;
    setIsAlfredOpen(false);

    // No transitionend when motion is reduced — unmount on the next frame
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(unmountAlfredSession);
    }
  }, [unmountAlfredSession]);

  const handleAlfredPaneTransitionEnd = useCallback((event) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== 'transform') return;
    if (isAlfredOpen) return;
    unmountAlfredSession();
  }, [isAlfredOpen, unmountAlfredSession]);

  // Safety net if transitionend is skipped by the browser
  useEffect(() => {
    if (isAlfredOpen || !isAlfredMounted || !shouldUnmountAlfredRef.current) return undefined;
    const timeoutId = window.setTimeout(unmountAlfredSession, 400);
    return () => window.clearTimeout(timeoutId);
  }, [isAlfredOpen, isAlfredMounted, unmountAlfredSession]);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={[
        'app-layout',
        isAlfredMounted && 'alfred-mounted',
        isAlfredOpen && 'alfred-open',
        isAlfredOpen && isAlfredFullscreen && 'alfred-fullscreen',
      ].filter(Boolean).join(' ')}
    >
      <div className="site-pane" id={SITE_SCROLL_ID}>
        <NavBar />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`welcome-${mode}`}
            custom={direction}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <WelcomeSection
              welcome_data={welcomeData}
              freelance_welcome_data={freelanceWelcomeData}
              forcedMode={mode}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          {isFreelance ? (
            <motion.div
              key="freelance-sections"
              custom={direction}
              variants={sectionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              <WorksSection projects={freelanceProjectsData} />
              <AboutSection
                facts={factsData}
                skills={skillsData}
                about_me={aboutMeData}
                freelance_about_me={freelanceAboutData}
                freelance_services={freelanceServicesData}
                forcedMode="freelance"
              />
              <ProcessSection steps={freelanceProcessData} />
              <TestimonialsSection testimonials={freelanceTestimonialsData} />
            </motion.div>
          ) : (
            <motion.div
              key="recruiter-sections"
              custom={direction}
              variants={sectionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              <AboutSection
                facts={factsData}
                skills={skillsData}
                about_me={aboutMeData}
                forcedMode="recruiter"
              />
              <ExperienceSection
                experience_data={experienceData}
                education_history={educationHistoryData}
              />
              <ProjectsSection projects_data={projectsData} />
              <CertificatesSection certificates_data={certificatesData} />
            </motion.div>
          )}
        </AnimatePresence>

        <Footer dataLastUpdated={portfolioDataLastUpdated} />

        <FloatingButton
          onClick={openAlfred}
          onPointerEnter={preloadAlfred}
          onFocus={preloadAlfred}
          isVisible={!isAlfredOpen}
          text="A.L.F.R.E.D."
          title="Chat with A.L.F.R.E.D."
        />
      </div>

      <div
        className="alfred-pane"
        aria-hidden={!isAlfredOpen}
        onTransitionEnd={handleAlfredPaneTransitionEnd}
      >
        {isAlfredMounted && (
          <AlfredDock onMinimize={minimizeAlfred}>
            <ChatWindowContainer onMinimize={minimizeAlfred} onClose={closeAlfred} />
          </AlfredDock>
        )}
      </div>
    </div>
  );
};

export default HomePage;
