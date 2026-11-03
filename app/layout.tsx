import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Provedores } from "./provedores";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
});

// Usada só no seletor Dia / Semana / Mês, como no Figma.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["600"],
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
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Provedores>{children}</Provedores>
      </body>
    </html>
  );
}
