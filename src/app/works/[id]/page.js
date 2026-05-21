import WorkDetail from "../../../sections/WorkDetail/WorkDetail";
import { fetchFreelanceProjectById, fetchAllFreelanceProjects } from "../../../services/freelanceUtils";

export async function generateStaticParams() {
  const projects = await fetchAllFreelanceProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await fetchFreelanceProjectById(id);

  if (!project) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${project.name} Case Study`,
    description: project.desc || `Read about the technical execution and business wins of the ${project.name} by Mudit Garg.`,
    alternates: {
      canonical: `/works/${id}`,
    },
    openGraph: {
      title: `${project.name} Case Study`,
      description: project.primary_kpi_summary || project.desc,
      url: `https://muditgarg48.github.io/works/${id}`,
      type: 'website',
      siteName: "Mudit Garg Portfolio",
      images: project.hero_image ? [
        {
          url: project.hero_image,
          width: 1200,
          height: 630,
          alt: `${project.name} case study hero preview`,
        }
      ] : [],
    },
  };
}

export default async function WorkDetailPage({ params }) {
  const { id } = await params;
  const project = await fetchFreelanceProjectById(id);

  return (
    <>
      {project && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": project.name,
              "headline": `${project.name} - Freelance Development Case Study`,
              "description": project.desc,
              "image": project.hero_image,
              "author": {
                "@type": "Person",
                "name": "Mudit Garg"
              },
              "publisher": {
                "@type": "Person",
                "name": "Mudit Garg"
              },
              "keywords": project.tech_stack.join(", "),
              "url": `https://muditgarg48.github.io/works/${id}`
            })
          }}
        />
      )}
      <WorkDetail />
    </>
  );
}