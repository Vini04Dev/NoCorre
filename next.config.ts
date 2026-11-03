import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O indicador de desenvolvimento fica no topo para não cobrir a navegação inferior.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
