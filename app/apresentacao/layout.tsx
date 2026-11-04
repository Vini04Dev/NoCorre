import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

// Fontes só da landing: títulos com mais personalidade e mono para selos e terminal.
// O app continua só com Poppins.
const titulo = Bricolage_Grotesque({ variable: "--font-titulo", subsets: ["latin"], weight: ["600", "700", "800"] });
const mono = JetBrains_Mono({ variable: "--font-mono-landing", subsets: ["latin"], weight: ["400", "500"] });

export default function LayoutApresentacao({ children }: LayoutProps<"/apresentacao">) {
  return <div className={`${titulo.variable} ${mono.variable}`}>{children}</div>;
}
