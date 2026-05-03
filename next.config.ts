import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jspdf", "canvg", "html2canvas"],
  outputFileTracingIncludes: {
    "/api/**": ["./stocksense.db"],
  },
};

export default nextConfig;
