import { test } from "@playwright/test";
import path from "node:path";

const widths = [360, 390, 430, 768, 834, 1024, 1280, 1440, 1920];
const pages = [
  ["home", "/"], ["loja", "/loja"], ["produto", "/produto/cropped-suplex-poliamida-nadador"],
  ["sacola", "/sacola"], ["checkout", "/checkout"], ["favoritos", "/favoritos"],
  ["sobre", "/sobre"], ["trocas", "/trocas"], ["pedido", "/pedido/IB47-DEMO"], ["404", "/nao-existe"],
] as const;

test("captura páginas nas nove larguras", async ({ page }) => {
  test.setTimeout(300_000);
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    for (const [name, route] of pages) {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join("work", "visual-audit", `${name}-${width}.png`), fullPage: false });
    }
  }
});

