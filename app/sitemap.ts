import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const pages: MetadataRoute.Sitemap = ["", "/loja", "/sobre", "/trocas", "/favoritos", "/sacola"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  const catalogue: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/produto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...pages, ...catalogue];
}
