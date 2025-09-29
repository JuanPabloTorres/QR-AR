import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ CONFIGURACIÓN PARA ARCHIVOS 3D GRANDES
  serverExternalPackages: [],

  // API configuration for CORS during development
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          // ✅ Headers adicionales para archivos grandes
          { key: "Connection", value: "keep-alive" },
          { key: "Keep-Alive", value: "timeout=60" },
        ],
      },
    ];
  },

  // API Proxy para desarrollo
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Proxy a la API .NET
      },
    ];
  },

  // Disable strict mode during development for better debugging
  reactStrictMode: true,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
