/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Required so that router.back() does not scroll to the top of the page.
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
