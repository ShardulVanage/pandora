/** @type {import('next').NextConfig} */
const nextConfig = {
  
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'illustrations.popsy.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
