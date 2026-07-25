"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSiteMode } from '../../context/SiteModeContext';
import { useScrollToTopOnModeSwitch, SITE_SCROLL_ID } from '../../components/NavBar/NavBar';
import NavBar from '../../components/NavBar/NavBar';
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

const ChatWindowContainer = dynamic(() => import('../ChatbotSection/ChatWindowContainer'), {
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
  const [isAlfredFullscreen, setIsAlfredFullscreen] = useState(false);
  const { isFreelance, mode } = useSiteMode();
  const prevModeRef = useRef(mode);

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

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  const closeAlfred = () => setIsAlfredOpen(false);

  return (
    <div
      className={[
        'app-layout',
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
          onClick={() => setIsAlfredOpen(true)}
          isVisible={!isAlfredOpen}
          text="A.L.F.R.E.D."
          title="Chat with A.L.F.R.E.D."
        />
      </div>

      <div className="alfred-pane">
        {isAlfredOpen && (
          <AlfredDock onClose={closeAlfred}>
            <ChatWindowContainer onClose={closeAlfred} />
          </AlfredDock>
        )}
      </div>
    </div>
  );
};

export default HomePage;
