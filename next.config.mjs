/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: undefined,
  },
  // เพิ่ม security headers และ CORS สำหรับ OAuth/mobile
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Referrer-Policy",
  //           value: "strict-origin-when-cross-origin",
  //         },
  //         {
  //           key: "X-Frame-Options",
  //           value: "SAMEORIGIN",
  //         },
  //         {
  //           key: "X-Content-Type-Options",
  //           value: "nosniff",
  //         },
  //         {
  //           key: "X-XSS-Protection",
  //           value: "1; mode=block",
  //         },
  //         {
  //           key: "Cross-Origin-Opener-Policy",
  //           value: "same-origin",
  //         },
  //         {
  //           key: "Cross-Origin-Resource-Policy",
  //           value: "same-origin",
  //         },
  //         {
  //           key: "Cross-Origin-Embedder-Policy",
  //           value: "require-corp",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
