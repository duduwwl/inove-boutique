# Plano — redesign interativo Inove Boutique

## Objetivo

Substituir o catálogo e as imagens inventadas por conteúdo público do `@inoveboutique_`, sem repetir imagens na mesma página, e transformar a home em uma edição semanal viva.

## Fonte real

- Perfil: `https://www.instagram.com/inoveboutique_/`
- 12 posts públicos atuais coletados em 6 de novembro de 2026.
- Cada produto mantém URL do post e legenda original no modelo de dados.
- Seis produtos reais: cropped suplex, shorts crepe, regata viscomalha, cropped cirrê, body Ana e vestido camisetão.

## Entrega

1. Trocar `data/products.ts` por catálogo real, com testes de URL, preço e unicidade das imagens.
2. Recriar home na direção “fotografias em tamanhos desiguais”.
3. Usar Motion na arara e no quick view, Embla no look, GSAP no lookbook, Lenis no scroll e Radix no diálogo.
4. Ajustar produto e loja para produtos com uma ou duas fotos.
5. Validar lint, testes, build, fluxos Playwright e screenshots responsivos.
6. Inspecionar com design-taste, corrigir, publicar e verificar produção.

## Limite conhecido

O Instagram libera somente os 12 posts mais recentes sem login. O site usa apenas esse material verificável; não inventa produtos para preencher volume.

