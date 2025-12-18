import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import HomePage from './pages/HomePage/HomePage';
import BlogWall from './pages/BlogWall/BlogWall';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import BlogPublish from './pages/BlogPublish/BlogPublish';

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
  const [isChatbotMainModalOpen, setIsChatbotMainModalOpen] = useState(false);
  const [isChatbotMiniModalOpen, setIsChatbotMiniModalOpen] = useState(false);

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

  const resumeUrl = `${DOCUMENT_ENDPOINT}${RESUME_ENDPOINT}`;

  return (
    <div className="App">
      {/* <CustomCursor/> */}
      {loading ? (
        <LoadingScreen/>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route 
              path="/blogs/publish" 
              element={<BlogPublish />} 
            />
            <Route 
              path="/blogs/:id" 
              element={<BlogDetail />} 
            />
            <Route 
              path="/blogs" 
              element={<BlogWall />} 
            />
            <Route 
              path="/" 
              element={
                <HomePage
                  factsData={factsData}
                  projectsData={projectsData}
                  certificatesData={certificatesData}
                  experienceData={experienceData}
                  educationHistoryData={educationHistoryData}
                  skillsData={skillsData}
                  aboutMeData={aboutMeData}
                  resumeUrl={resumeUrl}
                  isChatbotMainModalOpen={isChatbotMainModalOpen}
                  setIsChatbotMainModalOpen={setIsChatbotMainModalOpen}
                  isChatbotMiniModalOpen={isChatbotMiniModalOpen}
                  setIsChatbotMiniModalOpen={setIsChatbotMiniModalOpen}
                />
              } 
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;