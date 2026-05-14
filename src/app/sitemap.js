import { fetchAllBlogs } from "../services/blogUtils";

export default async function sitemap() {
  const baseUrl = "https://muditgarg48.github.io";

  // Fetch blogs to include in sitemap
  const blogs = await fetchAllBlogs();
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}