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
  sourceUrl: `https://www.instagram.com/${string}`;
  sourceCaption: string;
};

const image = (number: number, alt: string, height = 640): ProductImage => ({
  src: `/images/inove/instagram/post-${String(number).padStart(2, "0")}.webp`,
  alt,
  width: 640,
  height,
});

const stock = (sizes: string[]) => Object.fromEntries(sizes.map((size, index) => [size, index === sizes.length - 1 ? 0 : 4 - index]));

export const products: Product[] = [
  {
    id: "instagram-dfxutzwhapt",
    slug: "cropped-suplex-poliamida-nadador",
    name: "Cropped Suplex Poliamida Nadador",
    category: "Croppeds",
    price: 19.99,
    colors: [{ name: "Cinza", hex: "#A6A5A4" }, { name: "Verde-água", hex: "#A8CDC5" }, { name: "Manteiga", hex: "#E9DEA0" }, { name: "Nude", hex: "#C8A990" }],
    sizes: ["P", "M", "G", "GG"],
    stock: stock(["P", "M", "G", "GG"]),
    images: [image(2, "Modelo usando cropped nadador cinza da Inove Boutique"), image(3, "Croppeds nadador em quatro cores na arara da Inove Boutique")],
    tags: ["novidade", "edição"],
    description: "Cropped nadador em suplex de poliamida, fotografado na edição atual da Inove.",
    composition: "Suplex de poliamida. Composição exata sob consulta à loja.",
    care: "Confirme as instruções de lavagem na etiqueta.",
    sourceUrl: "https://www.instagram.com/inoveboutique_/p/DfXuTzWhAPT/",
    sourceCaption: "Cropped suplex poliamida nadador (R$19,99)",
  },
  {
    id: "instagram-dfxtpyhbtvq",
    slug: "shorts-crepe",
    name: "Shorts Crepe",
    category: "Shorts",
    price: 19.99,
    colors: [{ name: "Chocolate", hex: "#6E4435" }, { name: "Royal", hex: "#3956B5" }, { name: "Preto", hex: "#1E1C1B" }],
    sizes: ["M", "G", "GG"],
    stock: stock(["M", "G", "GG"]),
    images: [image(4, "Modelo usando shorts crepe chocolate da Inove Boutique"), image(5, "Shorts crepe azul, preto e chocolate na arara da Inove Boutique", 639)],
    tags: ["novidade", "edição"],
    description: "Shorts de crepe com cós franzido e amarração, publicado nos tamanhos M, G e GG.",
    composition: "Crepe. Composição exata sob consulta à loja.",
    care: "Confirme as instruções de lavagem na etiqueta.",
    sourceUrl: "https://www.instagram.com/inoveboutique_/p/DfXtPyhBTVq/",
    sourceCaption: "Shorts crepe, tamanhos M, G e GG (R$19,99)",
  },
  {
    id: "instagram-dfxssnnheca",
    slug: "regata-viscomalha-almofadada",
    name: "Regata Viscomalha Almofadada",
    category: "Regatas & Blusas",
    price: 29.99,
    colors: [{ name: "Manteiga", hex: "#E9D96F" }, { name: "Cinza", hex: "#8F9091" }, { name: "Off-white", hex: "#F5F1E8" }],
    sizes: ["P", "M", "G"],
    stock: stock(["P", "M", "G"]),
    images: [image(6, "Modelo usando regata viscomalha manteiga da Inove Boutique"), image(7, "Regatas viscomalha cinza, manteiga e off-white na arara da Inove Boutique")],
    tags: ["novidade", "edição"],
    description: "Regata em viscomalha com ombros estruturados, vista no feed atual da loja.",
    composition: "Viscomalha. Composição exata sob consulta à loja.",
    care: "Confirme as instruções de lavagem na etiqueta.",
    sourceUrl: "https://www.instagram.com/inoveboutique_/p/DfXssnnhEca/",
    sourceCaption: "Regata viscomalha almofadada (R$29,99)",
  },
  {
    id: "instagram-dfxsaishdtq",
    slug: "cropped-cirre-com-bojo",
    name: "Cropped Cirrê com Bojo",
    category: "Croppeds",
    price: 29.99,
    colors: [{ name: "Preto", hex: "#1D1B1B" }, { name: "Nude", hex: "#D2A891" }],
    sizes: ["P", "M", "G"],
    stock: stock(["P", "M", "G"]),
    images: [image(8, "Modelo usando cropped cirrê preto com bojo da Inove Boutique", 639), image(9, "Croppeds cirrê preto e nude na arara da Inove Boutique")],
    tags: ["novidade", "edição"],
    description: "Cropped cirrê com bojo e alças finas, fotografado na edição atual.",
    composition: "Cirrê. Composição exata sob consulta à loja.",
    care: "Confirme as instruções de lavagem na etiqueta.",
    sourceUrl: "https://www.instagram.com/inoveboutique_/p/DfXsAIshTdq/",
    sourceCaption: "Cropped cirrê com bojo (R$29,99)",
  },
  {
    id: "instagram-dfxrqiyhp23",
    slug: "body-ana-ruga-com-bojo",
    name: "Body Ana Ruga com Bojo",
    category: "Bodies",
    price: 29.99,
    colors: [{ name: "Preto", hex: "#1D1B1B" }, { name: "Nude", hex: "#D5B29D" }, { name: "Off-white", hex: "#F5F1E8" }],
    sizes: ["P", "M", "G"],
    stock: stock(["P", "M", "G"]),
    images: [image(10, "Modelo usando body Ana preto com bojo da Inove Boutique"), image(11, "Bodies Ana preto, nude e off-white na arara da Inove Boutique")],
    tags: ["novidade", "edição"],
    description: "Body Ana com acabamento em ruga e bojo, publicado no feed atual da Inove.",
    composition: "Malha com elasticidade. Composição exata sob consulta à loja.",
    care: "Confirme as instruções de lavagem na etiqueta.",
    sourceUrl: "https://www.instagram.com/inoveboutique_/p/DfXrqIyhP23/",
    sourceCaption: "Body Ana ruga com bojo (R$29,99)",
  },
  {
    id: "instagram-dfxq2lchhak",
    slug: "vestido-camisetao-bolsos-manga",
    name: "Vestido Camisetão com Bolsos",
    category: "Vestidos",
    price: 39.99,
    colors: [{ name: "Cinza", hex: "#777879" }],
    sizes: ["M", "G", "GG"],
    stock: stock(["M", "G", "GG"]),
    images: [image(12, "Modelo usando vestido camisetão cinza com bolsos da Inove Boutique")],
    tags: ["novidade", "edição"],
    description: "Vestido camisetão cinza, com mangas e bolsos, publicado no feed atual da loja.",
    composition: "Malha. Composição exata sob consulta à loja.",
    care: "Confirme as instruções de lavagem na etiqueta.",
    sourceUrl: "https://www.instagram.com/inoveboutique_/p/DfXq2lchHAk/",
    sourceCaption: "Vestido camisetão bolsos manga (R$39,99)",
  },
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);

