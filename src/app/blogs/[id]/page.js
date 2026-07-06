import BlogDetail from "../../../sections/BlogDetail/BlogDetail";
import {
  fetchBlogById,
  fetchAllBlogs,
  fetchAuthorById,
  fetchAdjacentBlogs,
  getAuthorId,
  serializeBlogForTransfer,
} from "../../../services/blogUtils";

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
      title: "Not Found | BlogWall",
    };
  }

  return {
    title: blog.title,
    description: blog.subtitle || `Read ${blog.title} on Mudit Garg's portfolio.`,
    alternates: {
      canonical: `/blogs/${id}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.subtitle,
      url: `https://muditgarg48.github.io/blogs/${id}`,
      type: 'article',
      publishedTime: blog.createdAt?.toDate ? blog.createdAt.toDate().toISOString() : blog.createdAt,
      authors: ["Mudit Garg"],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return <BlogDetail notFound />;
  }

  const authorId = getAuthorId(blog);
  const [author, adjacentBlogs] = await Promise.all([
    authorId ? fetchAuthorById(authorId) : null,
    fetchAdjacentBlogs(blog),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.subtitle,
            "author": {
              "@type": "Person",
              "name": "Mudit Garg"
            },
            "datePublished": blog.createdAt?.toDate ? blog.createdAt.toDate().toISOString() : blog.createdAt,
            "url": `https://muditgarg48.github.io/blogs/${id}`
          })
        }}
      />
      <BlogDetail
        initialBlog={serializeBlogForTransfer(blog)}
        initialAuthor={author}
        initialPrevBlog={adjacentBlogs.prev}
        initialNextBlog={adjacentBlogs.next}
      />
    </>
  );
}