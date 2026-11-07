/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // старые адреса со времён статических .html — ссылки на них
    // уже разошлись по телеграму и дискорду, пусть продолжают работать
    return [
      { source: '/index.html', destination: '/', permanent: true },
      // галерею убрали — старые ссылки на неё ведут в ленту.
      // permanent: false, чтобы браузеры не запомнили редирект навсегда,
      // если галерея когда-нибудь вернётся
      { source: '/gallery.html', destination: '/posts', permanent: false },
      { source: '/gallery', destination: '/posts', permanent: false },
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
