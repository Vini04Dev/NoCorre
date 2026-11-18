import type { Metadata, Viewport } from "next";
import { CSS_TEMAS_APP, SCRIPT_TEMA_APP } from "@/lib/tema-app";
import localFont from "next/font/local";
import { Provedores } from "./provedores";
import "./globals.css";

// Fontes guardadas no projeto (app/fontes, licença OFL, baixadas do Google
// Fonts, só o alfabeto latino). Assim o build não depende de baixar fonte na
// hora, o que já derrubou um deploy na Vercel.
const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "./fontes/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fontes/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fontes/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fontes/poppins-800.woff2", weight: "800", style: "normal" },
    { path: "./fontes/poppins-900.woff2", weight: "900", style: "normal" },
  ],
});

// Usada só no seletor Dia / Semana / Mês, como no Figma.
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: "./fontes/inter-latin.woff2",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "No Corre!",
  description: "Controle de entregas, corridas e receita para motoboys e entregadores.",
  applicationName: "No Corre!",
  // iPhone: o Safari/Chrome do iOS ignora parte do manifest. Isto faz o app
  // adicionado à Tela de Início abrir em tela cheia, com o nome certo.
  // "black-translucent": a página desenha por baixo da barra de status (com
  // "default" o iOS põe uma faixa branca no topo). O fundo vem do FaixaStatus.
  appleWebApp: {
    capable: true,
    title: "No Corre!",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2d42",
  // Ocupa a tela toda no iPhone com notch; os paddings com env(safe-area-inset-*)
  // já afastam o conteúdo das bordas.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: o script abaixo põe data-tema-app no <html> antes do React.
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA_APP }} />
        {/* Valores de cada tema, gerados de lib/tema-app.ts (a distribuição fica em globals.css). */}
        <style dangerouslySetInnerHTML={{ __html: CSS_TEMAS_APP }} />
      </head>
      <body className="min-h-full font-sans">
        <Provedores>{children}</Provedores>
      </body>
    </html>
  );
}
