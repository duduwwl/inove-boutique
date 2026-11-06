# Inove Boutique Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar e publicar um e-commerce demonstrativo completo, editorial e responsivo para a Inove Boutique.

**Architecture:** Next.js App Router usa Server Components para páginas e dados estáticos, isolando interações em Client Components. Produtos tipados alimentam loja, produto, sacola, favoritos e checkout; Zustand persiste somente preferências e itens no navegador.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS v4, Motion, GSAP, Zustand, Zod, React Hook Form, Embla, Sonner, Lucide e Playwright.

**Spec:** `DESIGN.md`

## Global Constraints

- Preservar conteúdo, identidade, rotas, preços e dados exatos do briefing.
- Usar Bodoni Moda e Hanken Grotesk via `next/font`.
- Respeitar AA, teclado, `prefers-reduced-motion`, alvos de `44px` e safe areas.
- Marcar claramente todo pagamento, frete, horário e serviço fictício como demonstração.
- Nunca enviar nem persistir dados pessoais ou de cartão.
- Não reutilizar componentes, estrutura ou identidade de outros projetos.

## Review Focus

- `localStorage` indisponível ou corrompido mantém loja utilizável.
- Produto inválido e carrinho vazio terminam em estados úteis.
- Filtros inválidos na URL são ignorados sem quebrar resultados.
- CEP e cartão inválidos mostram erro local e não avançam etapa.
- Movimento reduzido mantém leitura e controle completos.

---

### Task 1: Fundação, identidade e dados

**Files:** `package.json`, `app/layout.tsx`, `app/globals.css`, `data/products.ts`, `lib/*`, `public/images/inove/*`

**Interfaces:** Produz `Product`, catálogo, formatadores e tokens usados nas demais tarefas.

- [ ] Criar testes de catálogo, preço e validações; confirmar falha.
- [ ] Inicializar Next.js, dependências mínimas, fontes, metadata, SVGs e imagens.
- [ ] Implementar 36 produtos tipados e utilitários; confirmar testes verdes.
- [ ] Rodar lint, testes e build; fazer commit.

### Task 2: Estado global e estrutura comercial

**Files:** `store/shop-store.ts`, `components/site-header.tsx`, `components/cart-drawer.tsx`, `components/product-card.tsx`, `app/sacola/page.tsx`, `app/favoritos/page.tsx`

**Interfaces:** Consome `Product`; produz ações de sacola/favoritos e componentes comerciais.

- [ ] Testar cupons, frete grátis, quantidades, persistência inválida e totais; confirmar falha.
- [ ] Implementar store versionada, header, drawer, cards, sacola e favoritos.
- [ ] Confirmar suíte verde, teclado e estados vazios; fazer commit.

### Task 3: Home editorial

**Files:** `app/page.tsx`, `components/home/*`, `components/brand-loader.tsx`

**Interfaces:** Consome catálogo e store; produz landing completa.

- [ ] Testar cálculo do look e próxima quinta; confirmar falha.
- [ ] Implementar hero, arara, cartela, Monte seu Look, lookbook, live, atendimento, loja, feed e footer.
- [ ] Implementar fallbacks de movimento e touch.
- [ ] Confirmar testes e screenshots base; fazer commit.

### Task 4: Loja e produto

**Files:** `app/loja/page.tsx`, `components/shop/*`, `app/produto/[slug]/page.tsx`, `components/product/*`

**Interfaces:** Consome catálogo/store; produz filtros URL, busca e detalhe de produto.

- [ ] Testar filtros, ordenação, busca e slug; confirmar falha.
- [ ] Implementar sidebar/drawer, grid editorial, quick view e estados vazios.
- [ ] Implementar galeria, escolhas, guia, WhatsApp, relacionados e vistos recentes.
- [ ] Confirmar testes, metadata e rotas; fazer commit.

### Task 5: Checkout demonstrativo

**Files:** `app/checkout/page.tsx`, `components/checkout/*`, `app/pedido/[id]/page.tsx`, `lib/checkout.ts`

**Interfaces:** Consome store; produz validações, fretes, descontos e confirmação local.

- [ ] Testar CPF, Luhn, bandeira, Pix e totais; confirmar falha.
- [ ] Implementar quatro etapas, ViaCEP, Pix, crédito, débito e revisão.
- [ ] Implementar confirmação sem persistir dados sensíveis.
- [ ] Confirmar suíte e fluxo Playwright; fazer commit.

### Task 6: Páginas, SEO e auditoria visual

**Files:** `app/sobre/page.tsx`, `app/trocas/page.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `tests/e2e/*`

**Interfaces:** Fecha navegação e descoberta pública.

- [ ] Criar testes de rotas e navegação; confirmar falha.
- [ ] Implementar páginas, metadata, sitemap, robots, manifest e 404.
- [ ] Rodar `design-taste-frontend` lint/inspect, screenshots e auditoria web.
- [ ] Corrigir falhas, rodar lint, testes, build e Playwright; fazer commit.

### Task 7: Publicação e verificação

**Files:** somente ajustes encontrados na produção.

**Interfaces:** Produz URL Vercel e repositório remoto quando autenticação existir.

- [ ] Revisar diff completo e requisitos.
- [ ] Executar verificação final limpa.
- [ ] Criar repositório/push quando GitHub CLI estiver autenticado.
- [ ] Publicar com Vercel CLI, testar produção e registrar links.

