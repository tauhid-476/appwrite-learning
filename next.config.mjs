/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cloud.appwrite.io', 'your-other-allowed-domains.com'],
  },
};

export default nextConfig;
