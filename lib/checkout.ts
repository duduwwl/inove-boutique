export type CardBrand = "Visa" | "Mastercard" | "Elo" | "Amex" | "Hipercard" | "Cartão";

const digits = (value: string) => value.replace(/\D/g, "");

export function isValidCpf(value: string) {
  const cpf = digits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const check = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) sum += Number(cpf[index]) * (length + 1 - index);
    const rest = (sum * 10) % 11;
    return (rest === 10 ? 0 : rest) === Number(cpf[length]);
  };
  return check(9) && check(10);
}

export function isValidLuhn(value: string) {
  const number = digits(value);
  if (number.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let index = number.length - 1; index >= 0; index -= 1) {
    let current = Number(number[index]);
    if (double) { current *= 2; if (current > 9) current -= 9; }
    sum += current;
    double = !double;
  }
  return sum % 10 === 0;
}

type AddressFields = { cep: string; street: string; number: string; district: string; city: string; uf: string };
type CardFields = { number: string; name: string; expiry: string; cvv: string };

export function isCompleteAddress(address: AddressFields) {
  return digits(address.cep).length === 8 && [address.street, address.number, address.district, address.city].every((value) => value.trim().length > 0) && /^[A-Za-z]{2}$/.test(address.uf);
}

export function isValidCardDetails(card: CardFields, now = new Date()) {
  const expiry = card.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!expiry || !isValidLuhn(card.number) || card.name.trim().length < 3 || !/^\d{3,4}$/.test(card.cvv)) return false;
  const month = Number(expiry[1]);
  const year = 2000 + Number(expiry[2]);
  return new Date(year, month, 1) > now;
}

export function cardBrand(value: string): CardBrand {
  const number = digits(value);
  if (/^4/.test(number)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "Amex";
  if (/^(606282|637095|637568|637599|637609|637612)/.test(number)) return "Hipercard";
  if (/^(4011|4312|4389|4514|4573|5041|5067|509|6277|6362|6363)/.test(number)) return "Elo";
  return "Cartão";
}

export function nextThursdayAtEight(now = new Date()) {
  const localParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(localParts.find((item) => item.type === type)?.value);
  const localNoon = new Date(Date.UTC(part("year"), part("month") - 1, part("day"), 12));
  let days = (4 - localNoon.getUTCDay() + 7) % 7;
  let result = new Date(Date.UTC(localNoon.getUTCFullYear(), localNoon.getUTCMonth(), localNoon.getUTCDate() + days, 23));
  if (result <= now) {
    days += 7;
    result = new Date(Date.UTC(localNoon.getUTCFullYear(), localNoon.getUTCMonth(), localNoon.getUTCDate() + days, 23));
  }
  return result;
}

export const pixPayload = "00020126580014BR.GOV.BCB.PIX0136demo@inoveboutique.com.br5204000053039865802BR5914INOVE BOUTIQUE6008VARGINHA62070503***6304DEMO";
