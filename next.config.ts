import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O indicador de desenvolvimento fica no topo para não cobrir a navegação inferior.
  devIndicators: { position: "top-right" },
  // Só no desenvolvimento: abrir por 127.0.0.1 (cookies separados de localhost)
  // permite ver a landing deslogado numa aba e o app logado em outra.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
