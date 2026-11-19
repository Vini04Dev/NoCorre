import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O indicador de desenvolvimento fica no topo para não cobrir a navegação inferior.
  devIndicators: { position: "top-right" },
  // Só no desenvolvimento: abrir por 127.0.0.1 (cookies separados de localhost)
  // permite ver a landing deslogado numa aba e o app logado em outra.
  allowedDevOrigins: ["127.0.0.1"],
  // Cada deploy da Vercel tem um id. Com ele, quem está com o app aberto (o PWA
  // do iPhone fica dias na memória) e navega depois de uma atualização recarrega
  // a página inteira, em vez de pedir pedaços da versão antiga que não existem
  // mais (o que dava tela de erro). Fora da Vercel fica vazio e nada muda.
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
};

export default nextConfig;
