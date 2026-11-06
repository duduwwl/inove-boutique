import { describe, expect, it } from "vitest";
import { products } from "@/data/products";

describe("catálogo da edição 47", () => {
  it("oferece 36 produtos com slugs únicos e imagens dimensionadas", () => {
    expect(products).toHaveLength(36);
    expect(new Set(products.map((product) => product.slug)).size).toBe(36);
    expect(products.every((product) => product.images.every((image) => image.width > 0 && image.height > 0))).toBe(true);
  });

  it("mantém preços realistas por categoria", () => {
    const ranges: Record<string, [number, number]> = {
      "Regatas & Blusas": [59.9, 89.9], Croppeds: [69.9, 99.9], Shorts: [119.9, 139.9],
      Calças: [159.9, 219.9], Vestidos: [169.9, 259.9], Conjuntos: [229.9, 329.9],
    };
    for (const product of products) {
      const range = ranges[product.category];
      if (range) expect(product.price).toBeGreaterThanOrEqual(range[0]);
      if (range) expect(product.price).toBeLessThanOrEqual(range[1]);
    }
  });
});
