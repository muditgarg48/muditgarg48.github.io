import HomePage from "../sections/HomePage/HomePage";
import { fetchAllFreelanceProjects } from "../services/freelanceUtils";

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
  // freelanceProjects: 'freelance_projects_data.json',
  freelanceProcess: 'freelance_process_data.json',
  freelanceAbout: 'freelance_about_data.json',
  freelanceServices: 'freelance_services_data.json',
  freelanceWelcome: 'freelance_welcome_data.json',
  freelanceTestimonials: 'freelance_testimonials_data.json'
};

async function getPortfolioData() {
  const keys = Object.keys(DATA_FILES);
  const fetchPromises = Object.values(DATA_FILES).map(file =>
    fetch(`${DATA_ENDPOINT}${file}`, { next: { revalidate: 3600 } }).then(res => res.json())
  );

  try {
    const results = await Promise.all(fetchPromises);
    const data = {};
    keys.forEach((key, index) => {
      data[key] = results[index];
    });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default async function Page() {
  const data = await getPortfolioData();

  if (!data) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <HomePage
      factsData={data.facts.facts}
      projectsData={data.projects.projects}
      certificatesData={data.certificates.certificates}
      experienceData={data.experience.experiences}
      educationHistoryData={data.education.educations}
      skillsData={data.skills.skills}
      aboutMeData={data.about.about}
      welcomeData={data.welcome.welcome}
      // Freelance data
      freelanceProjectsData={await fetchAllFreelanceProjects()}
      freelanceProcessData={data.freelanceProcess.process || []}
      freelanceAboutData={data.freelanceAbout.about || {}}
      freelanceServicesData={data.freelanceServices.services || []}
      freelanceWelcomeData={data.freelanceWelcome.welcome || {}}
      freelanceTestimonialsData={data.freelanceTestimonials.testimonials || []}
    />
  );
}