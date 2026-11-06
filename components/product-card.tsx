"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/shop";
import { useShopStore } from "@/store/shop-store";

export function ProductCard({ product, editorial = false }: { product: Product; editorial?: boolean }) {
  const favorite = useShopStore((state) => state.favorites.includes(product.id));
  const toggleFavorite = useShopStore((state) => state.toggleFavorite);
  const addItem = useShopStore((state) => state.addItem);
  const availableSize = product.sizes.find((size) => product.stock[size] > 0) ?? product.sizes[0];
  const add = () => { addItem({ productId: product.id, size: availableSize, color: product.colors[0].name }); toast.success(`${product.name} foi para a sacola.`); };
  return <article className={`product-card ${editorial ? "is-editorial" : ""}`}>
    <div className="product-media">
      <Link href={`/produto/${product.slug}`}><Image className="primary-image" src={product.images[0].src} alt={product.images[0].alt} width={product.images[0].width} height={product.images[0].height} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" /><Image className="secondary-image" src={product.images[1].src} alt="" width={product.images[1].width} height={product.images[1].height} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" /></Link>
      <button className="favorite-button" onClick={() => toggleFavorite(product.id)} aria-label={favorite ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`}><Heart fill={favorite ? "currentColor" : "none"} /></button>
      {product.tags.includes("novidade") ? <span className="edition-stamp">Edição nº 47</span> : null}
    </div>
    <div className="product-info"><div><h2><Link href={`/produto/${product.slug}`}>{product.name}</Link></h2><p>{product.colors.map((color) => color.name).join(" · ")}</p></div><div className="price"><strong>{formatPrice(product.price)}</strong><small>ou 3x sem juros</small></div></div>
    <div className="product-swatches" aria-label="Cores disponíveis">{product.colors.map((color) => <span key={color.name} title={color.name} style={{ background: color.hex }} />)}</div>
    <button className="quick-add" onClick={add}><ShoppingBag size={17} /> + sacola</button>
  </article>;
}
