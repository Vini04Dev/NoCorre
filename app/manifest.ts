import type { MetadataRoute } from "next";

/**
 * Manifest do PWA: é o que permite instalar o app na tela inicial e abrir em
 * tela cheia, sem a barra do navegador. O Next serve em /manifest.webmanifest
 * e coloca o <link> no <head> sozinho.
 *
 * Sem service worker por enquanto: para instalar não é preciso funcionar
 * offline, e um cache mal configurado mostraria saldos desatualizados.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "No Corre!",
    short_name: "No Corre!",
    description: "Controle de entregas, corridas e receita para motoboys e entregadores.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f9fafb",
    theme_color: "#2b2d42",
    icons: [
      { src: "/icones-app/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icones-app/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icones-app/icone-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
