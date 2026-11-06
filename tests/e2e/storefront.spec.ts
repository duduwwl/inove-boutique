import { expect, test, type Page } from "@playwright/test";

async function addFirstProduct(page: Page) {
  await page.goto("/produto/regata-canelada-essencial");
  await page.getByRole("button", { name: "P", exact: true }).click();
  await page.getByRole("button", { name: "Adicionar à sacola" }).click();
  await expect(page.getByRole("dialog", { name: "Sua sacola" })).toBeVisible();
  await page.getByRole("link", { name: "Ir para o checkout" }).click();
}

async function identifyAndDeliver(page: Page) {
  await page.getByLabel("Nome completo").fill("Maria Teste");
  await page.getByLabel("E-mail").fill("maria@example.com");
  await page.getByLabel("Celular").fill("(35) 99999-9999");
  await page.getByLabel("CPF").fill("529.982.247-25");
  await page.getByRole("button", { name: "Continuar para entrega" }).click();
  await page.getByRole("button", { name: "Continuar para pagamento" }).click();
}

test("filtra, abre produto, adiciona, edita sacola e aplica cupom", async ({ page }) => {
  await page.goto("/loja");
  await page.getByRole("button", { name: "Shorts", exact: true }).click();
  await expect(page.getByText("4 peças na arara")).toBeVisible();
  const productLink = page.locator(".product-card").first().getByRole("link").first();
  const productHref = await productLink.getAttribute("href");
  await productLink.click();
  await page.waitForURL(`**${productHref}`);
  await page.getByRole("button", { name: "P", exact: true }).click();
  await page.getByRole("button", { name: "Adicionar à sacola" }).click();
  await page.getByRole("link", { name: "Ver sacola completa" }).click();
  await page.getByLabel("Cupom demonstrativo").fill("INOVE10");
  await expect(page.getByText("Desconto")).toBeVisible();
});

for (const payment of ["Pix", "Crédito", "Débito"] as const) {
  test(`conclui checkout demonstrativo com ${payment}`, async ({ page }) => {
    await addFirstProduct(page);
    await identifyAndDeliver(page);
    await page.getByRole("tab", { name: payment }).click();
    if (payment !== "Pix") {
      await page.getByLabel("Número").fill("4111111111111111");
      await page.getByLabel("Nome no cartão").fill("MARIA TESTE");
      await page.getByLabel("Validade").fill("12/30");
      await page.getByLabel("CVV").fill("123");
      if (payment === "Crédito") await page.getByLabel("Parcelas").selectOption("3");
    }
    await page.getByRole("button", { name: "Revisar pedido" }).click();
    await page.getByRole("button", { name: "Finalizar pedido demonstrativo" }).click();
    await expect(page.getByText("Pedido demonstrativo confirmado")).toBeVisible({ timeout: 10_000 });
  });
}

test("bloqueia entrega e cartão incompletos", async ({ page }) => {
  await addFirstProduct(page);
  await page.getByLabel("Nome completo").fill("Maria Teste");
  await page.getByLabel("E-mail").fill("maria@example.com");
  await page.getByLabel("Celular").fill("(35) 99999-9999");
  await page.getByLabel("CPF").fill("529.982.247-25");
  await page.getByRole("button", { name: "Continuar para entrega" }).click();
  await page.getByText("Motoboy Varginha").click();
  await page.getByRole("button", { name: "Continuar para pagamento" }).click();
  await expect(page.getByText("Preencha e valide o CEP para entrega.")).toBeVisible();
  await page.getByText("Retirar na loja").click();
  await page.getByRole("button", { name: "Continuar para pagamento" }).click();
  await page.getByRole("tab", { name: "Crédito" }).click();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await expect(page.getByText("Confira número, nome, validade e CVV do cartão.")).toBeVisible();
});

test("ignora persistência corrompida", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("inove-shop", JSON.stringify({ state: { cart: "quebrado", favorites: 42, coupon: null }, version: 1 })));
  await page.goto("/loja");
  await expect(page.getByRole("button", { name: "Abrir sacola com 0 itens" })).toBeVisible();
  await expect(page.getByText("36 peças na arara")).toBeVisible();
});

test("rotas públicas respondem sem erro", async ({ page }) => {
  for (const route of ["/", "/loja", "/produto/regata-canelada-essencial", "/sacola", "/favoritos", "/sobre", "/trocas", "/pedido/IB47-DEMO", "/nao-existe"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBeLessThan(500);
  }
});
