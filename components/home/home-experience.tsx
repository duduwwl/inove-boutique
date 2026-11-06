"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, MapPin, Play, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Arabesque, Monogram } from "@/components/monogram";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { nextThursdayAtEight } from "@/lib/checkout";
import { formatPrice } from "@/lib/shop";
import { useShopStore } from "@/store/shop-store";

const weekly = products.slice(0, 7);
const tops = products.filter((product) => ["Regatas & Blusas", "Croppeds", "Bodies"].includes(product.category)).slice(0, 4);
const bottoms = products.filter((product) => ["Shorts", "Saias", "Calças"].includes(product.category)).slice(0, 4);
const swatches = weekly.flatMap((product) => product.colors).filter((color, index, list) => list.findIndex((entry) => entry.name === color.name) === index).slice(0, 7);

function BrandLoader() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { if (sessionStorage.getItem("inove-seen")) return; sessionStorage.setItem("inove-seen", "1"); } catch { return; }
    const show = window.setTimeout(() => setVisible(true), 0);
    const hide = window.setTimeout(() => setVisible(false), 820);
    return () => { window.clearTimeout(show); window.clearTimeout(hide); };
  }, []);
  return visible ? <div className="brand-loader" aria-hidden="true"><Monogram /><span>A edição abre em instantes</span></div> : null;
}

function Countdown() {
  const [label, setLabel] = useState("Quinta, 20h");
  useEffect(() => {
    const update = () => { const diff = Math.max(0, nextThursdayAtEight().getTime() - Date.now()); const days = Math.floor(diff / 86400000); const hours = Math.floor(diff / 3600000) % 24; const minutes = Math.floor(diff / 60000) % 60; setLabel(`${days}d ${hours}h ${minutes}min`); };
    update(); const timer = window.setInterval(update, 60000); return () => window.clearInterval(timer);
  }, []);
  return <time>{label}</time>;
}

export function HomeExperience() {
  const [activeColor, setActiveColor] = useState(swatches[0]);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const lookbookRef = useRef<HTMLDivElement>(null);
  const addItem = useShopStore((state) => state.addItem);
  const top = tops[topIndex]; const bottom = bottoms[bottomIndex];
  const total = useMemo(() => top.price + bottom.price, [top, bottom]);

  useEffect(() => {
    if (!lookbookRef.current || window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger); const track = lookbookRef.current?.querySelector(".lookbook-track"); if (!track) return;
      const tween = gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: "none", scrollTrigger: { trigger: lookbookRef.current, start: "top top", end: () => `+=${window.innerHeight * 2}`, scrub: .6, pin: true, invalidateOnRefresh: true } });
      cleanup = () => tween.kill();
    });
    return () => cleanup();
  }, []);

  const addLook = () => {
    const topSize = top.sizes.find((size) => top.stock[size] > 0) ?? top.sizes[0]; const bottomSize = bottom.sizes.find((size) => bottom.stock[size] > 0) ?? bottom.sizes[0];
    addItem({ productId: top.id, size: topSize, color: top.colors[0].name }); addItem({ productId: bottom.id, size: bottomSize, color: bottom.colors[0].name }); toast.success("Look completo na sacola.");
  };

  return <><BrandLoader />
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="hero-copy-left"><p>Edição nº 47 · Varginha</p><h1 id="hero-title" className="display">Chegou</h1><p className="hero-support">Básicos premium, combinações novas e atendimento do seu jeito.</p><a className="button-primary" href="#arara">Ver a arara</a></div>
      <div className="hero-reel"><div><Image src="/images/inove/hero-regata-linho.webp" alt="Modelo da edição com regata off-white e short de linho chocolate" priority fetchPriority="high" width={1120} height={1400} sizes="(max-width: 800px) 92vw, 38vw" /></div><p>Look 03, Regata Essencial + Short Linho Chocolate</p></div>
      <div className="hero-copy-right"><div className="edition-seal"><span>Edição nº 47<br/>Novidades toda semana</span><Monogram /></div><h2 className="display"><em>quinta.</em></h2></div>
    </section>

    <section className="rack-section section" id="arara" aria-labelledby="rack-title"><div className="container"><div className="rack-intro"><p>Drop desta quinta</p><h2 id="rack-title" className="section-title">A arara da semana</h2><p>Arraste, escolha e peça para separar. As quantidades são demonstrativas.</p></div>
      <div className="rack-track">
        <div className="rack-bar" />{weekly.map((product, index) => <article className="hanger" key={product.id}><div className="hanger-hook" aria-hidden="true" /><Link href={`/produto/${product.slug}`}><Image src={product.images[index % product.images.length].src} alt={product.name} width={300} height={390} /><h3>{product.name}</h3><p>{formatPrice(product.price)}</p></Link></article>)}</div>
    </div></section>

    <section className="palette-section section" style={{ backgroundColor: activeColor.hex }} aria-labelledby="palette-title"><div className="container"><div><h2 id="palette-title" className="section-title">Cartela da semana</h2><p>Uma base neutra. Sete pontos de cor.</p><div className="swatch-list">{swatches.map((color) => <button key={color.name} className={activeColor.name === color.name ? "active" : ""} onMouseEnter={() => setActiveColor(color)} onFocus={() => setActiveColor(color)} onClick={() => setActiveColor(color)}><span style={{ background:color.hex }} />{color.name}</button>)}</div></div><div><Image src="/images/inove/arara-cartela.webp" alt={`Peças da cartela com destaque ${activeColor.name}`} width={1120} height={1400} /></div></div></section>

    <section className="outfit-section section" aria-labelledby="outfit-title"><div className="container"><div><h2 id="outfit-title" className="section-title">Monte seu look</h2><p>Parte de cima, parte de baixo. Pronto.</p><div className="outfit-price"><span>Look completo</span><strong className="display">{formatPrice(total)}</strong></div><button className="button-primary" onClick={addLook}><ShoppingBag size={18} /> Levar o look completo</button></div><div className="outfit-pickers"><div><button onClick={() => setTopIndex((topIndex - 1 + tops.length) % tops.length)} aria-label="Parte de cima anterior">↑</button><Image src={top.images[0].src} alt={top.name} width={420} height={520} /><h3>{top.name}</h3><button onClick={() => setTopIndex((topIndex + 1) % tops.length)} aria-label="Próxima parte de cima">↓</button></div><span className="outfit-plus">+</span><div><button onClick={() => setBottomIndex((bottomIndex - 1 + bottoms.length) % bottoms.length)} aria-label="Parte de baixo anterior">↑</button><Image src={bottom.images[1].src} alt={bottom.name} width={420} height={520} /><h3>{bottom.name}</h3><button onClick={() => setBottomIndex((bottomIndex + 1) % bottoms.length)} aria-label="Próxima parte de baixo">↓</button></div></div></div></section>

    <section className="lookbook-section" id="lookbook" ref={lookbookRef} aria-labelledby="lookbook-title"><div className="lookbook-track"><div className="lookbook-title-card"><h2 id="lookbook-title" className="display">Lookbook</h2><p>Um quadro fixo. Seis capas da mesma quinta.</p></div>{products.slice(0,6).map((product,index) => <article key={product.id}><Image src={product.images[index%2].src} alt={product.images[index%2].alt} width={1120} height={1400} /><div><span>Look {String(index+1).padStart(2,"0")}</span><h3>{product.name.split(" ").slice(0,2).join(" ")}</h3><p>{product.colors[0].name} · {formatPrice(product.price)}</p></div></article>)}</div></section>

    <section className="live-section section" id="live" aria-labelledby="live-title"><div className="container"><div className="live-mark"><span /><Play fill="currentColor" /> AO VIVO</div><h2 id="live-title" className="section-title">Quinta tem Live Inove.</h2><div className="live-time"><span>Próxima live em</span><Countdown /></div><p>Novidades, medidas e combinações em tempo real no Instagram.</p><div><button className="button-primary" onClick={() => toast.success("Lembrete demonstrativo ativado.")}>Me avisa</button><a className="button-secondary" href="https://www.instagram.com/inoveboutique_/">Abrir Instagram</a></div></div></section>

    <section className="service-section section" id="atendimento" aria-labelledby="service-title"><div className="container"><div><h2 id="service-title" className="section-title">Atendimento de perto.</h2><p>“Separa pra mim”, prova com calma e decide. Te atendemos no direct ou no zap.</p><a className="button-primary" href="https://wa.me/5535992582086?text=Oi%2C%20vi%20a%20edi%C3%A7%C3%A3o%2047%20e%20quero%20separar%20uma%20pe%C3%A7a.">Chamar no WhatsApp</a><small>“Provador em casa” é serviço demonstrativo para esta apresentação.</small></div><Image src="/images/inove/look-regata-grafite.webp" alt="Modelo com regata grafite no lookbook da edição" width={1120} height={1400} /></div></section>

    <section className="store-section section" aria-labelledby="store-title"><div className="container"><div className="store-card"><MapPin /><h2 id="store-title">A loja em Varginha</h2><p>Rua Presidente Antônio Carlos, 378<br />Centro · Varginha-MG</p><dl><div><dt>Segunda a sexta</dt><dd>9h–18h</dd></div><div><dt>Sábado</dt><dd>9h–13h</dd></div></dl><small>Horário demonstrativo. Confirme pelo WhatsApp.</small><a className="button-primary" href="https://maps.google.com/?q=Rua+Presidente+Antonio+Carlos+378+Varginha+MG">Como chegar</a></div><iframe title="Mapa da Inove Boutique em Varginha" loading="lazy" src="https://www.google.com/maps?q=Rua%20Presidente%20Antonio%20Carlos%20378%20Varginha%20MG&output=embed" /></div></section>

    <section className="feed-section section" aria-labelledby="feed-title"><div className="container"><div><h2 id="feed-title" className="section-title">Na arara e no feed.</h2><a href="https://www.instagram.com/inoveboutique_/"><Instagram /> @inoveboutique_</a></div><div className="feed-grid">{products.slice(0,6).map((product,index) => <a key={product.id} href="https://www.instagram.com/inoveboutique_/" aria-label={`Ver ${product.name} no Instagram`}><Image src={product.images[index%2].src} alt={product.name} width={360} height={450} /><span><Instagram />{product.name}</span></a>)}</div></div></section>
  </>;
}
