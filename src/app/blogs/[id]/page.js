import BlogDetail from "../../../sections/BlogDetail/BlogDetail";
import { fetchBlogById, fetchAllBlogs } from "../../../services/blogUtils";

export async function generateStaticParams() {
  const blogs = await fetchAllBlogs();
  return blogs.map((blog) => ({
    id: blog.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return {
      title: "Blog Not Found | Mudit Garg",
    };
  }

  return {
    title: `${blog.title} | Mudit Garg's Blog`,
    description: blog.subtitle || `Read ${blog.title} on Mudit Garg's portfolio.`,
    openGraph: {
      title: blog.title,
      description: blog.subtitle,
      type: 'article',
      publishedTime: blog.createdAt?.toDate ? blog.createdAt.toDate().toISOString() : blog.createdAt,
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetail />;
}