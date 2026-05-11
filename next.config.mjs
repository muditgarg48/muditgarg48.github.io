/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for GitHub Pages builds
  output: process.env.GITHUB_ACTIONS ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@lordicon/react"],
};

export default nextConfig;