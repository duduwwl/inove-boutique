"use client";

import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, Instagram, MapPin, Play, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Monogram } from "@/components/monogram";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { nextThursdayAtEight } from "@/lib/checkout";
import { formatPrice } from "@/lib/shop";
import { useShopStore } from "@/store/shop-store";

const rackProducts = products.slice(0, 5);
const topProducts = products.filter((product) => ["Croppeds", "Regatas & Blusas", "Bodies"].includes(product.category));
const bottomProducts = products.filter((product) => ["Shorts", "Vestidos"].includes(product.category));
const palette = [
  { name: "Cinza", hex: "#8F9091" }, { name: "Verde-água", hex: "#A8CDC5" },
  { name: "Manteiga", hex: "#E9D96F" }, { name: "Nude", hex: "#D5B29D" },
  { name: "Chocolate", hex: "#6E4435" }, { name: "Royal", hex: "#3956B5" },
  { name: "Preto", hex: "#1D1B1B" },
];
const shortNames: Record<string, string> = {
  "cropped-suplex-poliamida-nadador": "Cropped Nadador",
  "shorts-crepe": "Shorts Crepe",
  "regata-viscomalha-almofadada": "Regata Almofadada",
  "cropped-cirre-com-bojo": "Cropped Cirrê",
  "body-ana-ruga-com-bojo": "Body Ana",
  "vestido-camisetao-bolsos-manga": "Vestido Camisetão",
};

function BrandLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("inove-seen")) return;
      sessionStorage.setItem("inove-seen", "1");
    } catch {
      return;
    }
    const show = window.setTimeout(() => setVisible(true), 0);
    const timer = window.setTimeout(() => setVisible(false), 520);
    return () => { window.clearTimeout(show); window.clearTimeout(timer); };
  }, []);

  return <AnimatePresence>{visible ? <motion.div className="brand-loader" initial={{ opacity: 1 }} exit={{ opacity: 0, y: "-100%" }} transition={{ duration: .24 }} aria-hidden="true"><Monogram /><span>A edição abre agora</span></motion.div> : null}</AnimatePresence>;
}

function Countdown() {
  const [label, setLabel] = useState("Quinta, 20h");

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, nextThursdayAtEight().getTime() - Date.now());
      setLabel(`${Math.floor(diff / 86_400_000)}d ${Math.floor(diff / 3_600_000) % 24}h ${Math.floor(diff / 60_000) % 60}min`);
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return <time>{label}</time>;
}

function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const addItem = useShopStore((state) => state.addItem);
  if (!product) return null;
  const size = product.sizes.find((entry) => product.stock[entry] > 0) ?? product.sizes[0];

  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="quick-view-overlay" />
      <Dialog.Content className="quick-view-content">
        <Dialog.Close className="quick-view-close" aria-label="Fechar"><X /></Dialog.Close>
        <div className="quick-view-photo"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
        <div className="quick-view-copy">
          <p>{product.category} · publicação real</p>
          <Dialog.Title>{product.name}</Dialog.Title>
          <Dialog.Description>{product.sourceCaption}</Dialog.Description>
          <strong>{formatPrice(product.price)}</strong>
          <div>
            <button className="button-primary" onClick={() => { addItem({ productId: product.id, size, color: product.colors[0].name }); toast.success("Peça adicionada à sacola."); }}><ShoppingBag size={18} /> Separa pra mim</button>
            <Link className="button-secondary" href={`/produto/${product.slug}`}>Ver detalhes</Link>
          </div>
          <a className="source-link" href={product.sourceUrl} target="_blank" rel="noreferrer"><Instagram size={16} /> Ver post original</a>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function OutfitPicker({ items, viewport, previous, next }: { items: Product[]; viewport: (node: HTMLDivElement | null) => void; previous: () => void; next: () => void }) {
  return <div className="outfit-picker">
    <button onClick={previous} aria-label="Peça anterior"><ArrowUp /></button>
    <div className="outfit-viewport" ref={viewport}><div className="outfit-carousel">{items.map((item) => <div className="outfit-slide" key={item.id} style={{ backgroundColor: item.colors[0].hex, color: ["#1D1B1B", "#6E4435", "#3956B5"].includes(item.colors[0].hex) ? "white" : "black" }}><strong>{shortNames[item.slug]}</strong><small>{formatPrice(item.price)} · {item.category}</small></div>)}</div></div>
    <button onClick={next} aria-label="Próxima peça"><ArrowDown /></button>
  </div>;
}

function OutfitBuilder() {
  const [topViewport, topApi] = useEmblaCarousel({ axis: "y", loop: true });
  const [bottomViewport, bottomApi] = useEmblaCarousel({ axis: "y", loop: true });
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const addItem = useShopStore((state) => state.addItem);
  const top = topProducts[topIndex];
  const bottom = bottomProducts[bottomIndex];

  useEffect(() => {
    if (!topApi) return;
    const select = () => setTopIndex(topApi.selectedScrollSnap());
    topApi.on("select", select);
    select();
    return () => { topApi.off("select", select); };
  }, [topApi]);

  useEffect(() => {
    if (!bottomApi) return;
    const select = () => setBottomIndex(bottomApi.selectedScrollSnap());
    bottomApi.on("select", select);
    select();
    return () => { bottomApi.off("select", select); };
  }, [bottomApi]);

  const addLook = () => {
    for (const product of [top, bottom]) {
      const size = product.sizes.find((entry) => product.stock[entry] > 0) ?? product.sizes[0];
      addItem({ productId: product.id, size, color: product.colors[0].name });
    }
    toast.success("Look completo na sacola.");
  };

  return <section className="outfit-section section" aria-labelledby="outfit-title"><div className="container">
    <div className="outfit-copy"><h2 id="outfit-title" className="section-title">Monte seu look.</h2><p>Deslize duas peças reais da edição e veja o total mudar.</p><motion.strong key={top.id + bottom.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>{formatPrice(top.price + bottom.price)}</motion.strong><button className="button-primary" onClick={addLook}><ShoppingBag size={18} /> Levar o look</button></div>
    <div className="outfit-pickers"><OutfitPicker items={topProducts} viewport={topViewport} previous={() => topApi?.scrollPrev()} next={() => topApi?.scrollNext()} /><span className="outfit-plus">+</span><OutfitPicker items={bottomProducts} viewport={bottomViewport} previous={() => bottomApi?.scrollPrev()} next={() => bottomApi?.scrollNext()} /></div>
  </div></section>;
}

export function HomeExperience() {
  const reduceMotion = useReducedMotion();
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [activeColor, setActiveColor] = useState(palette[0]);
  const rackRef = useRef<HTMLDivElement>(null);
  const lookbookRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    let lenis: { destroy: () => void; raf: (time: number) => void } | undefined;
    let frame = 0;
    let cancelled = false;
    const start = () => {
      void import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ lerp: .09, smoothWheel: true });
        const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
        frame = requestAnimationFrame(raf);
      });
    };
    window.addEventListener("wheel", start, { once: true, passive: true });
    window.addEventListener("touchmove", start, { once: true, passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("wheel", start);
      window.removeEventListener("touchmove", start);
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!lookbookRef.current || reduceMotion || window.matchMedia("(max-width: 900px)").matches) return;
    const lookbook = lookbookRef.current;
    let cleanup = () => undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const cards = lookbook.querySelectorAll(".lookbook-photo");
        const timeline = gsap.timeline({ scrollTrigger: { trigger: lookbook, start: "top top", end: "+=100%", scrub: .7, pin: true } });
        timeline.fromTo(cards, { yPercent: 60 }, { yPercent: 0, stagger: .08, ease: "none" });
        cleanup = () => { timeline.scrollTrigger?.kill(); timeline.kill(); };
      });
    }, { rootMargin: "100% 0px" });
    observer.observe(lookbook);
    return () => { observer.disconnect(); cleanup(); };
  }, [reduceMotion]);

  const heroTransition = useMemo(() => ({ duration: reduceMotion ? 0 : .9, ease: [0.23, 1, 0.32, 1] as const }), [reduceMotion]);

  return <>
    <BrandLoader />
    <section className="editorial-hero" aria-labelledby="hero-title">
      <div className="hero-small-photo"><Image src="/images/inove/instagram/post-04.webp" alt="Modelo da Inove usando shorts crepe chocolate" fill priority sizes="25vw" /></div>
      <h1 id="hero-title">
        <span><motion.i initial={{ y: reduceMotion ? 0 : "110%" }} animate={{ y: 0 }} transition={heroTransition}>Chegou</motion.i></span>
        <span><motion.i initial={{ y: reduceMotion ? 0 : "110%" }} animate={{ y: 0 }} transition={{ ...heroTransition, delay: .11 }}>quinta.</motion.i></span>
      </h1>
      <div className="hero-main-photo"><Image src="/images/inove/instagram/post-02.webp" alt="Modelo da Inove usando cropped suplex cinza" fill priority unoptimized decoding="sync" fetchPriority="high" sizes="(max-width: 700px) 72vw, 28vw" /></div>
      <motion.div className="hero-intro" initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...heroTransition, delay: .45 }}><p>Peças reais do feed, preços publicados e atendimento de perto em Varginha.</p><a className="button-primary" href="#arara">Abrir a arara</a></motion.div>
      <div className="edition-seal"><span>Edição nº 47<br />Novidades toda semana</span><Monogram /></div>
    </section>

    <section className="rack-section section" id="arara" aria-labelledby="rack-title"><div className="container"><div className="rack-intro"><h2 id="rack-title" className="section-title">Puxe a arara.</h2><p>Arraste. Toque num cabide. Abra a peça sem perder a edição.</p></div>
      <div className="interactive-rack" ref={rackRef}><div className="rack-bar" /><motion.div className="rack-drag" drag="x" dragConstraints={rackRef} dragElastic={.08}>{rackProducts.map((product) => <motion.button key={product.id} className="motion-hanger" whileHover={reduceMotion ? undefined : { rotate: -2, y: -12 }} whileTap={{ scale: .98 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} onClick={() => setQuickView(product)}><span className="hanger-hook" aria-hidden="true" /><span className="hanger-photo"><Image src={product.images[1]?.src ?? product.images[0].src} alt={product.images[1]?.alt ?? product.images[0].alt} fill sizes="(max-width: 700px) 58vw, 23vw" /></span><span className="hanger-copy"><strong>{product.name}</strong><small>{formatPrice(product.price)}</small></span></motion.button>)}</motion.div></div>
    </div></section>

    <section className="palette-section section" style={{ backgroundColor: activeColor.hex, color: ["Chocolate", "Royal", "Preto"].includes(activeColor.name) ? "white" : "#1e1c1b" }} aria-labelledby="palette-title"><div className="container"><div className="palette-photo"><Image src="/images/inove/instagram/post-06.webp" alt="Modelo da Inove usando regata viscomalha manteiga" fill sizes="(max-width: 700px) 88vw, 38vw" /></div><div><h2 id="palette-title" className="section-title">A cor muda tudo.</h2><p>Escolha uma cartela. O campo responde na hora.</p><div className="swatch-list">{palette.map((color) => <button key={color.name} className={activeColor.name === color.name ? "active" : ""} onPointerEnter={() => setActiveColor(color)} onFocus={() => setActiveColor(color)} onClick={() => setActiveColor(color)}><span style={{ backgroundColor: color.hex }} />{color.name}</button>)}</div></div></div></section>

    <OutfitBuilder />

    <section className="rising-lookbook" id="lookbook" ref={lookbookRef} aria-labelledby="lookbook-title"><div className="lookbook-stage"><div className="lookbook-heading"><h2 id="lookbook-title" className="section-title">Três formas de chegar.</h2><p>Produtos reais. Enquadramentos do feed. Nenhuma foto repetida.</p></div><div className="lookbook-triptych"><figure className="lookbook-photo"><Image src="/images/inove/instagram/post-08.webp" alt="Modelo usando cropped cirrê preto" fill sizes="30vw" /><figcaption>Cropped Cirrê · R$ 29,99</figcaption></figure><figure className="lookbook-photo"><Image src="/images/inove/instagram/post-12.webp" alt="Modelo usando vestido camisetão cinza" fill sizes="40vw" /><figcaption>Vestido Camisetão · R$ 39,99</figcaption></figure><figure className="lookbook-photo"><Image src="/images/inove/instagram/post-10.webp" alt="Modelo usando body Ana preto" fill sizes="30vw" /><figcaption>Body Ana · R$ 29,99</figcaption></figure></div></div></section>

    <section className="live-section section" id="live" aria-labelledby="live-title"><div className="container"><div className="live-poster"><Image src="/images/inove/instagram/post-01.webp" alt="Publicação da Inove anunciando live" fill sizes="(max-width: 700px) 90vw, 34vw" /></div><div><h2 id="live-title" className="section-title">A live voltou.</h2><div className="live-mark" aria-hidden="true"><span /><Play fill="currentColor" /></div><div className="live-time"><Countdown /><span>até a próxima live</span></div><p>Live Inove: novidades, medidas e combinações em tempo real no Instagram.</p><button className="button-primary" onClick={() => toast.success("Lembrete demonstrativo ativado.")}>Me avisa</button></div></div></section>

    <section className="service-contact section" id="atendimento" aria-labelledby="service-title"><div className="container"><h2 id="service-title">Separa pra mim.</h2><div className="service-place"><MapPin /><span>Rua Presidente Antônio Carlos, 378<br />Centro · Varginha-MG</span></div><div><p>Te atendemos no direct ou no zap antes que a peça acabe.</p><a href="https://wa.me/5535992582086?text=Oi%2C%20vi%20a%20edi%C3%A7%C3%A3o%2047%20e%20quero%20separar%20uma%20pe%C3%A7a.">WhatsApp</a><a href="https://www.instagram.com/inoveboutique_/">Instagram</a><small>Site demonstrativo · estoque sob consulta</small></div></div></section>

    <section className="instagram-ledger section" aria-labelledby="feed-title"><div className="container"><h2 id="feed-title" className="section-title">Direto do feed.</h2><div>{products.map((product) => <a href={product.sourceUrl} target="_blank" rel="noreferrer" key={product.id}><span>{product.name}</span><span>{formatPrice(product.price)}</span><Instagram /></a>)}</div></div></section>

    <QuickView product={quickView} onClose={() => setQuickView(null)} />
  </>;
}

