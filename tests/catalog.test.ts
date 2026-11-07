import { describe, expect, it } from "vitest";
import { products } from "@/data/products";

describe("catálogo da edição 47", () => {
  it("oferece somente produtos reais do Instagram, com slugs e imagens únicos", () => {
    expect(products).toHaveLength(6);
    expect(new Set(products.map((product) => product.slug)).size).toBe(6);
    expect(products.every((product) => product.images.every((image) => image.width > 0 && image.height > 0))).toBe(true);
    expect(products.every((product) => product.sourceUrl.startsWith("https://www.instagram.com/inoveboutique_/"))).toBe(true);
    const images = products.flatMap((product) => product.images.map((image) => image.src));
    expect(new Set(images).size).toBe(images.length);
  });

  it("mantém os preços publicados nas legendas", () => {
    expect(products.map((product) => product.price)).toEqual([19.99, 19.99, 29.99, 29.99, 29.99, 39.99]);
  });
});

