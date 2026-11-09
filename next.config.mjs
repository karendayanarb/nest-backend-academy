/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `npm run export` genera una versión estática en /out (ideal para GitHub Pages, Netlify, etc.)
  ...(process.env.STATIC_EXPORT ? { output: 'export', images: { unoptimized: true } } : {}),
};

export default nextConfig;
