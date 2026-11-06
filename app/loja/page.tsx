import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopGrid } from "@/components/shop/shop-grid";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title:"Loja", description:"Peças da edição nº 47 da Inove Boutique." };
export default function ShopPage(){return <><header className="page-hero"><p>Edição nº 47</p><h1 className="display">Peças que chegaram</h1><p>Novidades toda semana. Se gostou, não deixa na arara.</p></header><Suspense fallback={<p className="container">Organizando a arara…</p>}><ShopGrid /></Suspense><SiteFooter /></>}
