# Inove Boutique — Direção de arte

## Ideia

**A Arara da Semana** transforma o site numa revista que muda toda quinta-feira.
Na página, a arara real da Inove vira o quadro fixo da direção `The pinned poster` (seed `1011693746`); produtos, cores e looks passam por ela como novas capas da mesma edição.

O gesto interativo central é arrastar a arara, balançar os cabides e abrir a peça sem sair da edição.

## Inventário próprio

- Inove Boutique, monograma `IB` e arabesco do selo.
- Rua Presidente Antônio Carlos, 378, Centro, Varginha-MG.
- Ritual semanal: quinta-feira, novidades e live às 20h.
- Edição demonstrativa nº 47.
- Arara com cabides transparentes.
- Concreto escuro e luz quente das fotos de modelo.
- Parede branca 3D e folhagem verde da loja.
- Atendimento curto e pessoal por WhatsApp.
- Básicos premium em cartela ampla.
- Frases locais: “Separa pra mim” e “Te atendo no zap”.

## Argumento e prova

1. **Toda quinta muda:** hero e edição fixam o ritual semanal.
2. **A novidade está na arara:** interação mostra as peças e abre quick view.
3. **As cores montam a semana:** cartela muda o campo e destaca o produto.
4. **A loja ajuda a combinar:** Monte seu Look calcula e leva o conjunto.
5. **Cada peça vive num look:** sequência editorial apresenta usos reais.
6. **A live aproxima:** contagem e Instagram mostram o canal recorrente.
7. **Comprar é conversa:** WhatsApp encurta a decisão.
8. **A loja é de Varginha:** endereço, mapa e horário ancoram o negócio.

## Paleta

- Vinho Monograma `#5B1E2D`: ação, foco e marca.
- Dourado Selo `#C6A15B`: números, filetes e selo; nunca gradiente.
- Linho `#F3EDE4`: campo principal.
- Concreto `#8C8781`: texto secundário e superfícies.
- Grafite `#1E1C1B`: texto e capítulos escuros.
- Papel `#FFFDF9`: campos e formulários.

Proporção alvo: 70% linho/papel, 20% grafite/foto, 8% vinho, 2% dourado.

## Tipografia

- **Bodoni Moda:** títulos, preços, edição e palavras editoriais em itálico.
- **Hanken Grotesk:** texto, navegação, controles e formulários.
- Escala: `clamp(3.4rem, 9vw, 9rem)`, `clamp(2.2rem, 5vw, 5.4rem)`, `1.5rem`, `1rem`, `0.8125rem`.
- Título em até duas linhas; corpo entre 45 e 70 caracteres.
- Números usam variantes old-style quando disponíveis.

## Grid e composição

- Margens: `16px` em 360–430, `24px` em tablet, `32px` em desktop.
- Desktop: 12 colunas; tablet: 8; mobile: 4.
- Mídia mantém cantos retos; controles usam raio máximo de `2px`.
- O hero divide “Chegou” e “quinta.” por uma moldura vertical.
- A home alterna quadro fixo, campo de cor, colunas desalinhadas e faixa horizontal.
- A loja usa grade funcional; um painel editorial rompe o ritmo a cada oito produtos.

```text
DESKTOP
┌ logo ─ nav ─ ações ────────────────────────────┐
│ CHEGOU       [ foto vertical fixa ]     quinta.│
│ texto curto  [ capas mudam no scroll ]         │
└────────────────────────────────────────────────┘

MOBILE
┌ logo ─ menu ┐
│ CHEGOU      │
│ [ foto 4:5 ]│
│      quinta.│
│ ação        │
└─────────────┘
```

## Motion

- Movimento assinatura: quadro fixo com capas mudando por scroll nativo.
- Cabides: mola curta, `duration: 0.5`, `bounce: 0.16`.
- Controles: `100–180ms`; drawers e dialogs: `220–360ms`.
- Curvas: `cubic-bezier(0.23, 1, 0.32, 1)` e `cubic-bezier(0.32, 0.72, 0, 1)`.
- Animar apenas `transform`, `opacity`, `clip-path` e cor.
- `prefers-reduced-motion` remove pins, parallax, deslocamentos e autoplay; conteúdo permanece.
- Hover só em `@media (hover: hover) and (pointer: fine)`.

## Voz

Português brasileiro curto, próximo e confiante. Sem slogans genéricos.

- Hero: “Chegou quinta.”
- Apoio: “Básicos premium, combinações novas e atendimento do seu jeito.”
- Primária: “Ver a arara”
- Produto: “Separa pra mim”
- Atendimento: “Te atendo no direct ou no zap.”
- Vazio: “Essa peça já saiu da arara.”

## Regras de experiência

- Alvos de toque mínimos de `44×44px`.
- Contraste AA e foco vinho/dourado visível.
- Labels persistentes; erros ao lado do campo.
- Carrinho e favoritos persistem com esquema versionado e `try/catch`.
- Nenhum cartão é enviado ou armazenado.
- Todo pagamento e frete são demonstrativos.
- Sem gradiente, glassmorphism, glow, depoimento inventado, emoji ou cards repetidos.

## Conteúdo substituível

Fotos editoriais geradas ou licenciadas são demonstração até a loja fornecer imagens próprias.
Horário, estoque, preços, fretes, políticas, live e “provador em casa” são conteúdo demonstrativo.

