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
import ChatbotSection from './pages/ChatbotSection/ChatbotSection';

function App() {
  
  let [loading, setLoading] = useState(true);

  const dataEndPoint = 'https://muditgarg48.github.io/portfolio_data/data/';
  const factsEndPoint = 'facts_data.json';
  const projectsDataEndPoint = 'projects_data.json';
  const certificatesDataEndPoint = 'certificates_data.json';
  const experienceDataEndPoint = 'experience_data.json';
  const educationHistoryDataEndPoint = 'education_history.json';
  const skillsDataEndPoint = 'skills.json';
  const aboutMeDataEndPoint = 'about_data.json';

  const documentEndPoint = 'https://muditgarg48.github.io/portfolio_data/documents/';
  const resumeEndPoint = 'My Resume.pdf';

  let [factsData, setFactsData] = useState([]);
  let [projectsData, setProjectsData] = useState([]);
  let [certificatesData, setCertificatesData] = useState([]);
  let [experienceData, setExperienceData] = useState([]);
  let [educationHistoryData, setEducationHistoryData] = useState([]);
  let [skillsData, setSkillsData] = useState([]);
  let [aboutMeData, setAboutMeData] = useState({});

  useEffect(() => {
    const getData = async () => {
      // Fetch all data in parallel instead of sequentially
      const [
        factsResponse,
        projectsResponse,
        certificatesResponse,
        experienceResponse,
        educationResponse,
        skillsResponse,
        aboutMeResponse
      ] = await Promise.all([
        fetch(dataEndPoint+factsEndPoint),
        fetch(dataEndPoint+projectsDataEndPoint),
        fetch(dataEndPoint+certificatesDataEndPoint),
        fetch(dataEndPoint+experienceDataEndPoint),
        fetch(dataEndPoint+educationHistoryDataEndPoint),
        fetch(dataEndPoint+skillsDataEndPoint),
        fetch(dataEndPoint+aboutMeDataEndPoint)
      ]);

      const [
        factsData,
        projectsData,
        certificatesData,
        experienceData,
        educationHistoryData,
        skillsData,
        aboutMeData
      ] = await Promise.all([
        factsResponse.json(),
        projectsResponse.json(),
        certificatesResponse.json(),
        experienceResponse.json(),
        educationResponse.json(),
        skillsResponse.json(),
        aboutMeResponse.json()
      ]);

      setFactsData(factsData);
      setProjectsData(projectsData);
      setCertificatesData(certificatesData);
      setExperienceData(experienceData);
      setEducationHistoryData(educationHistoryData);
      setSkillsData(skillsData);
      setAboutMeData(aboutMeData);
  
      setLoading(false);
    }
  
    getData();
  }, []);

  return (
    <div className="App">
      {/* <CustomCursor/> */}
      {loading === true? 
      <LoadingScreen/>: 
      <>
        <NavBar/>
        <WelcomeSection my_resume={documentEndPoint+resumeEndPoint}/>
        <AboutSection facts={factsData} education_history={educationHistoryData} skills={skillsData} about_me={aboutMeData}/>
        <ExperienceSection experience_data={experienceData}/>
        <ProjectsSection projects_data={projectsData}/>
        <CertificatesSection certificates_data={certificatesData}/>
        <ChatbotSection/>
        <Footer/>
      </>
      }
    </div>
  );
}

export default App;