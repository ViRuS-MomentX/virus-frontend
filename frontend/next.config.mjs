/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // старые адреса со времён статических .html — ссылки на них
    // уже разошлись по телеграму и дискорду, пусть продолжают работать
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/gallery.html', destination: '/gallery', permanent: true },
      { source: '/projects.html', destination: '/projects', permanent: true },
      { source: '/posts.html', destination: '/posts', permanent: true },
      { source: '/admin.html', destination: '/admin', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'https://virus-backend-nine.vercel.app/api/:path*' },
    ];
  },
};

export default nextConfig;
