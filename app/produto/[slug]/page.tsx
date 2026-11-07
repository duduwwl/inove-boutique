import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/product/product-actions";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { getProduct, products } from "@/data/products";
import { formatPrice } from "@/lib/shop";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description, openGraph: { images: [product.images[0].src] } } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  return <>
    <div className="product-page container">
      <div className="product-gallery">
        {product.images.map((image, index) => <Image
          key={image.src}
          src={image.src}
          alt={index ? `${product.name}, outra vista` : image.alt}
          width={image.width}
          height={image.height}
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
          sizes="(max-width: 800px) 100vw, 40vw"
        />)}
      </div>
      <section className="product-detail">
        <p>{product.category} · Edição nº 47</p>
        <h1 className="display">{product.name}</h1>
        <div className="product-price">
          <strong>{formatPrice(product.price)}</strong>
          {product.oldPrice ? <del>{formatPrice(product.oldPrice)}</del> : null}
          <span>ou 3x de {formatPrice(product.price / 3)} sem juros</span>
        </div>
        <p>{product.description}</p>
        <a className="source-link" href={product.sourceUrl} target="_blank" rel="noreferrer">Ver publicação original no Instagram</a>
        <ProductActions product={product} />
        <div className="product-accordions">
          <details open><summary>Descrição</summary><p>{product.description}</p></details>
          <details><summary>Composição</summary><p>{product.composition}</p></details>
          <details><summary>Cuidados</summary><p>{product.care}</p></details>
          <details><summary>Trocas</summary><p>Política demonstrativa de 30 dias, com etiqueta e sem sinais de uso.</p></details>
        </div>
      </section>
    </div>
    <section className="related section container">
      <h2 className="section-title">Complete o look</h2>
      <div>{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
    </section>
    <SiteFooter />
  </>;
}

