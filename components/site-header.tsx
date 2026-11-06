"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/monogram";
import { useShopStore } from "@/store/shop-store";

const links = [["Novidades", "/loja?weekly=1"], ["Loja", "/loja"], ["Lookbook", "/#lookbook"], ["Live", "/#live"], ["Atendimento", "/#atendimento"]];

export function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const cartCount = useShopStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const favoriteCount = useShopStore((state) => state.favorites.length);
  const setCartOpen = useShopStore((state) => state.setCartOpen);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${solid ? "is-solid" : ""}`}>
      <Link className="brand-link" href="/" aria-label="Inove Boutique, página inicial"><Monogram /><span>INOVE<br />BOUTIQUE</span></Link>
      <nav className="desktop-nav" aria-label="Navegação principal">{links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link className="icon-button" href="/loja" aria-label="Buscar produtos"><Search size={20} strokeWidth={1.5} /></Link>
        <Link className="icon-button count-button" href="/favoritos" aria-label={`${favoriteCount} favoritos`}><Heart size={20} strokeWidth={1.5} /><span>{favoriteCount}</span></Link>
        <button className="icon-button count-button" onClick={() => setCartOpen(true)} aria-label={`Abrir sacola com ${cartCount} itens`}><ShoppingBag size={20} strokeWidth={1.5} /><span>{cartCount}</span></button>
        <button className="icon-button menu-button" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu size={22} /></button>
      </div>
      {menu ? <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
        <button className="icon-button mobile-close" onClick={() => setMenu(false)} aria-label="Fechar menu"><X /></button>
        <nav>{links.map(([label, href], index) => <Link key={label} href={href} onClick={() => setMenu(false)} style={{ transitionDelay: `${index * 45}ms` }}>{label}</Link>)}</nav>
        <p>Rua Presidente Antônio Carlos, 378<br />Centro · Varginha-MG</p>
      </div> : null}
    </header>
  );
}
