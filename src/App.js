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

  const documentEndPoint = 'https://muditgarg48.github.io/portfolio_data/documents/';
  const resumeEndPoint = 'My Resume.pdf';

  let [factsData, setFactsData] = useState([]);
  let [projectsData, setProjectsData] = useState([]);
  let [certificatesData, setCertificatesData] = useState([]);
  let [experienceData, setExperienceData] = useState([]);
  let [educationHistoryData, setEducationHistoryData] = useState([]);
  let [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let res = await fetch(dataEndPoint+factsEndPoint);
      let data = await res.json();
      setFactsData(data);
      res = await fetch(dataEndPoint+projectsDataEndPoint);
      data = await res.json();
      setProjectsData(data);
      res = await fetch(dataEndPoint+certificatesDataEndPoint);
      data = await res.json();
      setCertificatesData(data);
      res = await fetch(dataEndPoint+experienceDataEndPoint);
      data = await res.json();
      setExperienceData(data);
      res = await fetch(dataEndPoint+educationHistoryDataEndPoint);
      data = await res.json();
      setEducationHistoryData(data);
      res = await fetch(dataEndPoint+skillsDataEndPoint);
      data = await res.json();
      setSkillsData(data);
  
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
        <AboutSection facts={factsData} education_history={educationHistoryData} skills={skillsData}/>
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