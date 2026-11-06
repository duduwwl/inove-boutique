import { describe, expect, it } from "vitest";
import { cardBrand, isValidCpf, isValidLuhn, nextThursdayAtEight } from "@/lib/checkout";

describe("checkout demonstrativo", () => {
  it("valida CPF, Luhn e reconhece bandeiras", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidLuhn("4111 1111 1111 1111")).toBe(true);
    expect(cardBrand("4111111111111111")).toBe("Visa");
    expect(cardBrand("5555555555554444")).toBe("Mastercard");
  });

  it("agenda a próxima quinta às 20h sem retornar data passada", () => {
    const now = new Date("2026-11-05T21:00:00-03:00");
    expect(nextThursdayAtEight(now).toISOString()).toBe("2026-11-12T23:00:00.000Z");
  });
});
