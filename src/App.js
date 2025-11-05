import React, {useEffect, useState} from 'react';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import NavBar from './components/NavBar/NavBar';
// import CustomCursor from './components/CustomCursor/CustomCursor';
import WelcomeSection from './pages/WelcomeSection/WelcomeSection';
import AboutSection from './pages/AboutSection/AboutSection';
import ExperienceSection from './pages/ExperienceSection/ExperienceSection';
import ProjectsSection from './pages/ProjectsSection/ProjectsSection';
import CertificatesSection from './pages/CertificatesSection/CertificatesSection';
import Footer from './pages/Footer/Footer';
import FloatingButton from './components/FloatingButton/FloatingButton';
import Modal from './components/Modal/Modal';
import ChatWindowContainer from './pages/ChatbotSection/ChatWindowContainer';

const DATA_ENDPOINT = 'https://muditgarg48.github.io/portfolio_data/data/';
const DOCUMENT_ENDPOINT = 'https://muditgarg48.github.io/portfolio_data/documents/';
const RESUME_ENDPOINT = 'My Resume.pdf';

const DATA_FILES = {
  facts: 'facts_data.json',
  projects: 'projects_data.json',
  certificates: 'certificates_data.json',
  experience: 'experience_data.json',
  education: 'education_history.json',
  skills: 'skills.json',
  about: 'about_data.json'
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);

  const [factsData, setFactsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [certificatesData, setCertificatesData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [educationHistoryData, setEducationHistoryData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [aboutMeData, setAboutMeData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const fetchPromises = Object.values(DATA_FILES).map(file => 
        fetch(`${DATA_ENDPOINT}${file}`).then(res => res.json())
      );

      try {
        const [
          factsData,
          projectsData,
          certificatesData,
          experienceData,
          educationHistoryData,
          skillsData,
          aboutMeData
        ] = await Promise.all(fetchPromises);

        setFactsData(factsData);
        setProjectsData(projectsData);
        setCertificatesData(certificatesData);
        setExperienceData(experienceData);
        setEducationHistoryData(educationHistoryData);
        setSkillsData(skillsData);
        setAboutMeData(aboutMeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="App">
      {/* <CustomCursor/> */}
      {loading ? (
        <LoadingScreen/>
      ) : (
        <>
        <NavBar/>
        <WelcomeSection my_resume={`${DOCUMENT_ENDPOINT}${RESUME_ENDPOINT}`}/>
        <AboutSection facts={factsData} education_history={educationHistoryData} skills={skillsData} about_me={aboutMeData}/>
        <ExperienceSection experience_data={experienceData}/>
        <ProjectsSection projects_data={projectsData}/>
        <CertificatesSection certificates_data={certificatesData}/>
        <Footer/>
        <FloatingButton 
          onClick={() => setIsChatbotModalOpen(true)} 
          isVisible={!isChatbotModalOpen}
          text="Ask A.L.F.R.E.D."
          title="Chat with A.L.F.R.E.D."
        />
        <Modal 
          isOpen={isChatbotModalOpen} 
          onClose={() => setIsChatbotModalOpen(false)} 
          onMinimize
        >
          <ChatWindowContainer />
        </Modal>
        </>
      )}
    </div>
  );
}

export default App;