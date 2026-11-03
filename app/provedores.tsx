"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Provedores({ children }: { children: React.ReactNode }) {
  // useState garante um QueryClient por aba do navegador, criado uma vez só,
  // em vez de um novo a cada renderização.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
