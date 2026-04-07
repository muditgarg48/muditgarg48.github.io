import { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteMode } from '../../context/SiteModeContext';
import { useScrollToTopOnModeSwitch } from '../../components/NavBar/NavBar';
import NavBar from '../../components/NavBar/NavBar';
import WelcomeSection from '../WelcomeSection/WelcomeSection';
import AboutSection from '../AboutSection/AboutSection';
import ExperienceSection from '../ExperienceSection/ExperienceSection';
import ProjectsSection from '../ProjectsSection/ProjectsSection';
import CertificatesSection from '../CertificatesSection/CertificatesSection';
import Footer from '../Footer/Footer';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import Modal from '../../components/Modal/Modal';
import ChatWindowContainer from '../ChatbotSection/ChatWindowContainer';
import WorksSection from '../WorksSection/WorksSection';
import ProcessSection from '../ProcessSection/ProcessSection';
import TestimonialsSection from '../TestimonialsSection/TestimonialsSection';
import './HomePage.css';


const HomePage = ({
  factsData,
  projectsData,
  certificatesData,
  experienceData,
  educationHistoryData,
  skillsData,
  aboutMeData,
  welcomeData,
  // Freelance
  freelanceProjectsData,
  freelanceProcessData,
  freelanceAboutData,
  freelanceServicesData,
  freelanceWelcomeData,
  freelanceTestimonialsData,
  isChatbotMainModalOpen,
  setIsChatbotMainModalOpen,
  isChatbotMiniModalOpen,
  setIsChatbotMiniModalOpen
}) => {
  const { isFreelance, mode } = useSiteMode();
  const prevModeRef = useRef(mode);

  // Activate scroll-to-top on mode switch
  useScrollToTopOnModeSwitch();

  // Determine slide direction: switching TO freelance = slide left, TO recruiter = slide right
  const direction = useMemo(() => {
    const dir = mode === 'freelance' ? 1 : -1;
    prevModeRef.current = mode;
    return dir;
  }, [mode]);

  const sectionVariants = {
    enter: (dir) => ({
      x: dir * 120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir * -120,
      opacity: 0,
    }),
  };

  const transition = {
    duration: 0.5,
    ease: "easeInOut",
  };

  return (
    <>
      <NavBar/>

      {/* WelcomeSection — mode-specific, animated */}
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

      {/* Mode-specific sections */}
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
            <ProjectsSection projects_data={projectsData}/>
            <CertificatesSection certificates_data={certificatesData}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot — common, no animation */}
      <Footer/>
      <FloatingButton 
        onClick={() => setIsChatbotMainModalOpen(true)} 
        isVisible={!isChatbotMainModalOpen && !isChatbotMiniModalOpen}
        text="Ask A.L.F.R.E.D."
        title="Chat with A.L.F.R.E.D."
      />
      {!isChatbotMiniModalOpen && (
        <Modal 
          isOpen={isChatbotMainModalOpen} 
          onClose={() => setIsChatbotMainModalOpen(false)} 
          onMinimize
        >
          <ChatWindowContainer 
            onPopup={() => {
              setIsChatbotMainModalOpen(false);
              setIsChatbotMiniModalOpen(true);
            }}
          />
        </Modal>
      )}
      {isChatbotMiniModalOpen && (
        <div className="chat-popup-container">
          <ChatWindowContainer 
            onClose={() => setIsChatbotMiniModalOpen(false)}
            onPopup={() => {
              setIsChatbotMiniModalOpen(false);
              setIsChatbotMainModalOpen(true);
            }}
          />
        </div>
      )}
    </>
  );
};

export default HomePage;