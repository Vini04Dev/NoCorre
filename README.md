# No Corre!

**De entregador para entregador.**

Aplicativo web instalável (PWA) para motoboys, mototaxistas e entregadores
controlarem receitas, despesas, agenda e metas do dia a dia. Pensado para quem
trabalha por aplicativo, por central ou fixo em um estabelecimento, com uma
interface simples e direta no celular.

> Projeto em desenvolvimento. Esta página será completada com prints, arquitetura
> e decisões técnicas conforme as funcionalidades forem entregues.

## Stack

- [Next.js](https://nextjs.org) (App Router) com TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com): Postgres, autenticação, Row Level Security e Storage
- [TanStack Query](https://tanstack.com/query) para cache de dados
- Deploy na [Vercel](https://vercel.com)

## Rodando localmente

Requisitos: Node.js 20 ou superior e um projeto no Supabase.

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a Publishable key do Supabase
npm run dev
```

O app abre em http://localhost:3000.

## Documentação

- `docs/der-fisico.md`: modelo físico do banco, regras de segurança e decisões
- `docs/der-fisico.png`: diagrama original do banco de dados
- `supabase/migrations/`: SQL versionado do banco
