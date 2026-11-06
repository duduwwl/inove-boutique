import { describe, expect, it } from "vitest";
import { applyCoupon, cartTotals, filterProducts } from "@/lib/shop";
import { products } from "@/data/products";

describe("regras comerciais demonstrativas", () => {
  it("aplica INOVE10 e PRIMEIRA sem acumular descontos", () => {
    expect(applyCoupon(200, "INOVE10")).toEqual({ code: "INOVE10", discount: 20 });
    expect(applyCoupon(200, "PRIMEIRA")).toEqual({ code: "PRIMEIRA", discount: 30 });
    expect(applyCoupon(200, "OUTRO")).toEqual({ code: null, discount: 0 });
  });

  it("libera frete em R$ 299 e aplica Pix depois do cupom", () => {
    expect(cartTotals(300, 30, 12, "pix")).toEqual({ subtotal: 300, couponDiscount: 30, shipping: 0, paymentDiscount: 13.5, total: 256.5 });
    expect(cartTotals(250, 0, 12, "credit").total).toBe(262);
  });

  it("ignora filtros inválidos e combina categoria, tamanho e busca", () => {
    expect(filterProducts(products, { min: "x", max: "-1" })).toHaveLength(36);
    const filtered = filterProducts(products, { category: "Shorts", size: "M", search: "linho" });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((product) => product.category === "Shorts" && product.sizes.includes("M"))).toBe(true);
  });
});
