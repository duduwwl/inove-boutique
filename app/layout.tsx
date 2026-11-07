import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/components/shop-provider";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site-url";

const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Inove Boutique · A Arara da Semana", template: "%s · Inove Boutique" },
  description: "Novidades toda semana e atendimento exclusivo em Varginha-MG.",
  openGraph: { title: "Inove Boutique", description: "A Arara da Semana · Edição nº 47", images: ["/images/inove/instagram/post-02.webp"], locale: "pt_BR", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth" className={`${bodoni.variable} ${hanken.variable}`}><body><ShopProvider><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader /><main id="conteudo">{children}</main></ShopProvider></body></html>;
}

