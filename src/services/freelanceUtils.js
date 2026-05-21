const DATA_ENDPOINT = 'https://muditgarg48.github.io/portfolio_data/data/freelance_projects_data.json';
const WELCOME_ENDPOINT = 'https://muditgarg48.github.io/portfolio_data/data/freelance_welcome_data.json';

/**
 * Fetches the WhatsApp contact link from the freelance welcome data
 */
export async function fetchWhatsAppLink() {
  try {
    const res = await fetch(WELCOME_ENDPOINT, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.welcome?.ctaLink || "https://wa.me/353892050748";
  } catch (e) {
    return "https://wa.me/353892050748"; // Safe fallback
  }
}

/**
 * Creates a URL friendly slug/ID from a project name
 */
function getSlug(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

/**
 * Fetches and processes all freelance projects directly from the live remote JSON data store
 */
export async function fetchAllFreelanceProjects() {
  try {
    const res = await fetch(DATA_ENDPOINT, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch freelance projects data");

    const data = await res.json();
    const rawProjects = data.projects || [];

    return rawProjects.map(project => {
      // Prioritize the user-defined project_code as webpage endpoint slug
      const slug = project.project_code || getSlug(project.name);

      return {
        id: slug,
        name: project.name,
        desc: project.desc,
        status: project.status === "Completed" ? "LIVE" : project.status.toUpperCase(),
        deployment: project.deployment || null,
        hero_image: project.image || null,
        project_logo: project.project_logo || null,
        project_code: project.project_code || null,

        gallery: project.gallery || [],
        tech_stack: project.tech_stack || [],
        primary_kpi_summary: project.primary_kpi_summary || "",
        kpi_wins: project.kpi_wins || [],

        // Dynamically map proposal availability based on PDF URLs in the data JSON
        phases: project.phases ? project.phases.map(phase => {
          if (phase.proposal) {
            return {
              ...phase,
              proposal: {
                ...phase.proposal,
                status: phase.proposal.url ? "available" : "nda_protected",
                nda_message: phase.proposal.nda_message || "Under strict Non-Disclosure Agreement. Private operations architecture & secrets protected."
              }
            };
          }
          return phase;
        }) : [],

        cta_footer: project.cta_footer || null
      };
    });
  } catch (error) {
    console.error("Error loading freelance projects in service layer:", error);
    return [];
  }
}

/**
 * Retrieves a single freelance project by its URL slug/id
 */
export async function fetchFreelanceProjectById(id) {
  const projects = await fetchAllFreelanceProjects();
  const project = projects.find(p => p.id === id) || null;

  if (project && project.cta_footer) {
    const whatsappLink = await fetchWhatsAppLink();
    project.cta_footer.button_link = project.cta_footer.button_link || whatsappLink;
  }

  return project;
}

/**
 * Fetches all freelance testimonials
 */
export async function fetchFreelanceTestimonials() {
  try {
    const res = await fetch('https://muditgarg48.github.io/portfolio_data/data/freelance_testimonials_data.json', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.testimonials || [];
  } catch (e) {
    return [];
  }
}