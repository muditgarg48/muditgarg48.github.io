import React from 'react';
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

const HomePage = ({
  factsData,
  projectsData,
  certificatesData,
  experienceData,
  educationHistoryData,
  skillsData,
  aboutMeData,
  resumeUrl,
  isChatbotMainModalOpen,
  setIsChatbotMainModalOpen,
  isChatbotMiniModalOpen,
  setIsChatbotMiniModalOpen
}) => {
  return (
    <>
      <NavBar/>
      <WelcomeSection my_resume={resumeUrl}/>
      <AboutSection 
        facts={factsData} 
        education_history={educationHistoryData} 
        skills={skillsData} 
        about_me={aboutMeData}
      />
      <ExperienceSection experience_data={experienceData}/>
      <ProjectsSection projects_data={projectsData}/>
      <CertificatesSection certificates_data={certificatesData}/>
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

