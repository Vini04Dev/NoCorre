import localFont from "next/font/local";

// Fontes só da landing: títulos com mais personalidade e mono para o terminal.
// O app continua só com Poppins. Os arquivos ficam no projeto (licença OFL,
// baixados do Google Fonts, só o alfabeto latino): o build não depende de
// baixar fonte na hora, o que já derrubou um deploy na Vercel.
const titulo = localFont({
  src: "./fontes/bricolage-grotesque-latin.woff2",
  variable: "--font-titulo",
  weight: "600 800",
  display: "swap",
});
const mono = localFont({
  src: "./fontes/jetbrains-mono-latin.woff2",
  variable: "--font-mono-landing",
  weight: "400 500",
  display: "swap",
});

/** Classes que ligam as variáveis de fonte da landing (usadas em app/globals.css). */
export const classeFontesLanding = `${titulo.variable} ${mono.variable}`;
