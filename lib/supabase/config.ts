// Acesso direto (sem process.env[nome]) para o Next conseguir embutir os
// valores NEXT_PUBLIC_ no código do navegador durante o build.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !chave) {
  throw new Error(
    "Variáveis do Supabase ausentes. Copie .env.example para .env.local e preencha " +
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabaseUrl = url;
export const supabaseChave = chave;
