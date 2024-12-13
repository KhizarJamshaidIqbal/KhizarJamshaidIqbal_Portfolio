// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['*'], // This is just for development. In production, specify exact domains
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**',
//       },
//       {
//         protocol: 'http',
//         hostname: '**',
//       },
//     ],
//   },
// }

// module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'], // This is just for development. In production, specify exact domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  output: 'export', // Enable static export
  basePath: '/your-repo-name', // Replace 'your-repo-name' with your GitHub repository name
  trailingSlash: true, // Ensures proper routing
};

module.exports = nextConfig;
