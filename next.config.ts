/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add external domains here
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'your-bucket.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
