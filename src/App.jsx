import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SiteModeProvider } from './context/SiteModeContext';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import HomePage from './pages/HomePage/HomePage';
import BlogWall from './pages/BlogWall/BlogWall';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import BlogPublish from './pages/BlogPublish/BlogPublish';

const DATA_ENDPOINT = 'https://muditgarg48.github.io/portfolio_data/data/';

const DATA_FILES = {
  facts: 'facts_data.json',
  projects: 'projects_data.json',
  certificates: 'certificates_data.json',
  experience: 'experience_data.json',
  education: 'education_history.json',
  skills: 'skills.json',
  about: 'about_data.json',
  welcome: 'welcome_data.json',
  // Freelance
  freelanceProjects: 'freelance_projects_data.json',
  freelanceProcess: 'freelance_process_data.json',
  freelanceAbout: 'freelance_about_data.json',
  freelanceServices: 'freelance_services_data.json',
  freelanceWelcome: 'freelance_welcome_data.json',
  freelanceTestimonials: 'freelance_testimonials_data.json'
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
  const [welcomeData, setWelcomeData] = useState({});

  // Freelance states
  const [freelanceProjectsData, setFreelanceProjectsData] = useState([]);
  const [freelanceProcessData, setFreelanceProcessData] = useState([]);
  const [freelanceAboutData, setFreelanceAboutData] = useState({});
  const [freelanceServicesData, setFreelanceServicesData] = useState([]);
  const [freelanceWelcomeData, setFreelanceWelcomeData] = useState([]);
  const [freelanceTestimonialsData, setFreelanceTestimonialsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = Object.keys(DATA_FILES);
      const fetchPromises = Object.values(DATA_FILES).map(file =>
        fetch(`${DATA_ENDPOINT}${file}`).then(res => res.json())
      );

      try {
        const results = await Promise.all(fetchPromises);
        const data = {};
        keys.forEach((key, index) => {
          data[key] = results[index];
        });

        // Map recruiter data
        setFactsData(data.facts.facts);
        setProjectsData(data.projects.projects);
        setCertificatesData(data.certificates.certificates);
        setExperienceData(data.experience.experiences);
        setEducationHistoryData(data.education.educations);
        setSkillsData(data.skills.skills);
        setAboutMeData(data.about.about);
        setWelcomeData(data.welcome.welcome);

        // Map freelance data
        setFreelanceProjectsData(data.freelanceProjects.projects || []);
        setFreelanceProcessData(data.freelanceProcess.process || []);
        setFreelanceAboutData(data.freelanceAbout.about || {});
        setFreelanceServicesData(data.freelanceServices.services || []);
        setFreelanceWelcomeData(data.freelanceWelcome.welcome || {});
        setFreelanceTestimonialsData(data.freelanceTestimonials.testimonials || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SiteModeProvider>
      <div className="App">
        {/* <CustomCursor/> */}
        {loading ? (
          <LoadingScreen />
        ) : (
          <BrowserRouter basename="/">
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
                    welcomeData={welcomeData}
                    // Freelance data
                    freelanceProjectsData={freelanceProjectsData}
                    freelanceProcessData={freelanceProcessData}
                    freelanceAboutData={freelanceAboutData}
                    freelanceServicesData={freelanceServicesData}
                    freelanceWelcomeData={freelanceWelcomeData}
                    freelanceTestimonialsData={freelanceTestimonialsData}
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
    </SiteModeProvider>
  );
}

export default App;