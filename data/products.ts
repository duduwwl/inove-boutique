export const categories = [
  "Regatas & Blusas", "Croppeds", "Shorts", "Saias", "Calças", "Vestidos",
  "Conjuntos", "Bodies", "Básicos", "Peças da Semana",
] as const;

export type Category = (typeof categories)[number];
export type ProductColor = { name: string; hex: string };
export type ProductImage = { src: string; alt: string; width: number; height: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  stock: Record<string, number>;
  images: ProductImage[];
  tags: Array<"novidade" | "edição" | "essencial">;
  description: string;
  composition: string;
  care: string;
};

const palette: Record<string, string> = {
  Cinza: "#8C8781", "Verde-água": "#83AFA6", Manteiga: "#E8D487", Nude: "#C7A68D",
  Chocolate: "#56392D", Royal: "#2448A8", Terracota: "#A6543F", Preto: "#1E1C1B", "Off-white": "#F3EDE4",
};

const images = [
  { src: "/images/inove/hero-regata-linho.webp", alt: "Modelo com regata off-white e short de linho chocolate em escada de concreto", width: 1120, height: 1400 },
  { src: "/images/inove/look-regata-grafite.webp", alt: "Modelo com regata grafite e calça preta em ambiente de concreto", width: 1120, height: 1400 },
  { src: "/images/inove/arara-cartela.webp", alt: "Arara com peças da cartela semanal em cabides transparentes", width: 1120, height: 1400 },
  { src: "/images/inove/look-manteiga-linho.webp", alt: "Modelo com cropped manteiga e calça de linho off-white em escada de concreto", width: 1120, height: 1400 },
  { src: "/images/inove/vestido-royal.webp", alt: "Modelo com vestido midi azul royal em escada escura", width: 1120, height: 1400 },
  { src: "/images/inove/look-terracota-nude.webp", alt: "Modelo com blusa terracota e short nude no interior da boutique", width: 1120, height: 1400 },
] satisfies ProductImage[];

type Seed = [string, Category, number, string[]];
const seeds: Seed[] = [
  ["Regata Canelada Essencial", "Regatas & Blusas", 69.9, ["Cinza", "Manteiga", "Off-white"]],
  ["Regata Gola Alta", "Regatas & Blusas", 79.9, ["Chocolate", "Preto"]],
  ["Blusa Canelada Assimétrica", "Regatas & Blusas", 89.9, ["Terracota", "Nude"]],
  ["Blusa Manga Curta Premium", "Regatas & Blusas", 79.9, ["Verde-água", "Off-white"]],
  ["Cropped Nó Frontal", "Croppeds", 79.9, ["Manteiga", "Royal"]],
  ["Cropped Canelado Reto", "Croppeds", 69.9, ["Cinza", "Preto"]],
  ["Cropped Um Ombro", "Croppeds", 99.9, ["Terracota", "Off-white"]],
  ["Cropped Faixa", "Croppeds", 89.9, ["Chocolate", "Nude"]],
  ["Short Linho Amarração", "Shorts", 129.9, ["Chocolate", "Nude", "Off-white"]],
  ["Short Alfaiataria", "Shorts", 139.9, ["Preto", "Royal"]],
  ["Short Linho Pregas", "Shorts", 119.9, ["Manteiga", "Verde-água"]],
  ["Short Cintura Alta", "Shorts", 129.9, ["Terracota", "Cinza"]],
  ["Saia Midi Fenda", "Saias", 149.9, ["Preto", "Chocolate"]],
  ["Saia Curta Alfaiataria", "Saias", 129.9, ["Nude", "Royal"]],
  ["Saia Pareô Linho", "Saias", 139.9, ["Manteiga", "Terracota"]],
  ["Calça Pantalona", "Calças", 189.9, ["Preto", "Chocolate"]],
  ["Calça Alfaiataria Fluida", "Calças", 219.9, ["Royal", "Cinza"]],
  ["Calça Linho Reta", "Calças", 179.9, ["Nude", "Off-white"]],
  ["Calça Cenoura", "Calças", 159.9, ["Terracota", "Verde-água"]],
  ["Vestido Midi Canelado", "Vestidos", 189.9, ["Preto", "Chocolate"]],
  ["Vestido Alça Minimal", "Vestidos", 169.9, ["Royal", "Manteiga"]],
  ["Vestido Linho Transpasse", "Vestidos", 259.9, ["Terracota", "Off-white"]],
  ["Vestido Curto Faixa", "Vestidos", 219.9, ["Verde-água", "Nude"]],
  ["Conjunto Linho Quinta", "Conjuntos", 289.9, ["Chocolate", "Off-white"]],
  ["Conjunto Canelado Essencial", "Conjuntos", 229.9, ["Cinza", "Preto"]],
  ["Conjunto Alfaiataria Royal", "Conjuntos", 329.9, ["Royal", "Nude"]],
  ["Body Decote Quadrado", "Bodies", 109.9, ["Preto", "Manteiga"]],
  ["Body Ombro Único", "Bodies", 119.9, ["Terracota", "Off-white"]],
  ["Body Canelado", "Bodies", 99.9, ["Cinza", "Chocolate"]],
  ["T-shirt Algodão Premium", "Básicos", 89.9, ["Off-white", "Preto"]],
  ["Top Faixa Duplo", "Básicos", 59.9, ["Nude", "Manteiga"]],
  ["Camisa Ampla Linho", "Básicos", 159.9, ["Off-white", "Verde-água"]],
  ["Regata Manteiga da Semana", "Peças da Semana", 79.9, ["Manteiga"]],
  ["Short Chocolate da Semana", "Peças da Semana", 129.9, ["Chocolate"]],
  ["Vestido Royal da Semana", "Peças da Semana", 219.9, ["Royal"]],
  ["Conjunto Terracota da Semana", "Peças da Semana", 299.9, ["Terracota"]],
];

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const products: Product[] = seeds.map(([name, category, price, colorNames], index) => {
  const sizes = category === "Calças" ? ["36", "38", "40", "42", "44", "46"] : ["PP", "P", "M", "G", "GG"];
  return {
    id: `inove-${String(index + 1).padStart(2, "0")}`,
    slug: slugify(name),
    name,
    category,
    price,
    oldPrice: index % 7 === 0 ? Math.round((price * 1.22) * 10) / 10 : undefined,
    colors: colorNames.map((color) => ({ name: color, hex: palette[color] })),
    sizes,
    stock: Object.fromEntries(sizes.map((size, sizeIndex) => [size, (index + sizeIndex) % 4 === 0 ? 0 : 3 + sizeIndex])),
    images: [images[index % images.length], images[(index + 1) % images.length]],
    tags: index < 12 ? ["novidade", "edição"] : index % 3 === 0 ? ["edição"] : ["essencial"],
    description: `${name} com caimento limpo e acabamento premium. Uma base fácil para a arara desta semana.`,
    composition: category.includes("Linho") || name.includes("Linho") ? "55% linho, 45% viscose." : "96% viscose, 4% elastano.",
    care: "Lavar à mão, não alvejar e secar à sombra.",
  };
});

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
