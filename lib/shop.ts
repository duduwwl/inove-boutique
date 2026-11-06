import type { Product } from "@/data/products";

export type ProductFilters = { category?: string; size?: string; color?: string; min?: string; max?: string; search?: string; weekly?: boolean; inStock?: boolean };

export function applyCoupon(subtotal: number, input: string) {
  const code = input.trim().toUpperCase();
  if (code === "INOVE10") return { code, discount: subtotal * 0.1 };
  if (code === "PRIMEIRA") return { code, discount: subtotal * 0.15 };
  return { code: null, discount: 0 };
}

export function cartTotals(subtotal: number, couponDiscount = 0, shippingCost = 0, payment: "pix" | "credit" | "debit" = "credit") {
  const shipping = subtotal >= 299 ? 0 : shippingCost;
  const paymentDiscount = payment === "pix" ? (subtotal - couponDiscount) * 0.05 : 0;
  return { subtotal, couponDiscount, shipping, paymentDiscount, total: subtotal - couponDiscount - paymentDiscount + shipping };
}

export function filterProducts(items: Product[], filters: ProductFilters) {
  const min = Number(filters.min);
  const max = Number(filters.max);
  const hasMin = Number.isFinite(min) && min >= 0;
  const hasMax = Number.isFinite(max) && max >= 0;
  const search = filters.search?.trim().toLocaleLowerCase("pt-BR");
  return items.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.size && !product.sizes.includes(filters.size)) return false;
    if (filters.color && !product.colors.some((color) => color.name === filters.color)) return false;
    if (hasMin && product.price < min) return false;
    if (hasMax && product.price > max) return false;
    if (filters.weekly && !product.tags.includes("novidade")) return false;
    if (filters.inStock && !Object.values(product.stock).some((value) => value > 0)) return false;
    if (search && !`${product.name} ${product.category} ${product.colors.map((color) => color.name).join(" ")}`.toLocaleLowerCase("pt-BR").includes(search)) return false;
    return true;
  });
}

export const formatPrice = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
