import type { Metadata } from "next";
import { DetalheMeta } from "@/components/metas/DetalheMeta";

export const metadata: Metadata = { title: "Detalhe da meta | No Corre!" };

export default async function Pagina({ params }: PageProps<"/metas/[id]">) {
  const { id } = await params;
  return <DetalheMeta id={id} />;
}
