import { describe, expect, it } from "vitest";
import { applyCoupon, cartTotals, filterProducts } from "@/lib/shop";
import { products } from "@/data/products";
import { normalizePersistedShopState, useShopStore } from "@/store/shop-store";

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
    expect(filterProducts(products, { category: "Inválida", size: "XP", color: "Magenta" })).toHaveLength(36);
    const filtered = filterProducts(products, { category: "Shorts", size: "M", search: "linho" });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((product) => product.category === "Shorts" && product.sizes.includes("M"))).toBe(true);
  });

  it("descarta estado persistido corrompido", () => {
    expect(normalizePersistedShopState({ cart: "quebrado", favorites: 42, coupon: null })).toEqual({ cart: [], favorites: [], coupon: "" });
  });

  it("troca a variante de um item preservando a quantidade", () => {
    useShopStore.setState({ cart: [{ productId: "p1", size: "P", color: "Preto", quantity: 2 }] });
    useShopStore.getState().changeItem("p1", "P", "Preto", "M", "Nude");
    expect(useShopStore.getState().cart).toEqual([{ productId: "p1", size: "M", color: "Nude", quantity: 2 }]);
  });
});
