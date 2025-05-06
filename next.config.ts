/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: { remotePatterns: [{ protocol:'http', hostname:'localhost', pathname:'/tmp/**' }] }
};
module.exports = nextConfig;
