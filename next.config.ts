import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  serverExternalPackages: ["@resvg/resvg-js"],
};

export default nextConfig;
