"use client";

import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUp, Instagram, MapPin, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Monogram } from "@/components/monogram";
import Floating, { FloatingElement } from "@/components/fancy/image/parallax-floating";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/shop";
import { useShopStore } from "@/store/shop-store";

const rackProducts = products.slice(0, 5);
const topProducts = products.filter((product) => ["Croppeds", "Regatas & Blusas", "Bodies"].includes(product.category));
const bottomProducts = products.filter((product) => ["Shorts", "Vestidos"].includes(product.category));
const palette = [
  { name: "Cinza", hex: "#8F9091", src: "/images/inove/palette/cinza.webp", alt: "Cropped nadador cinza" },
  { name: "Verde-água", hex: "#A8CDC5", src: "/images/inove/palette/verde-agua.webp", alt: "Cropped nadador verde-água" },
  { name: "Manteiga", hex: "#E9D96F", src: "/images/inove/palette/manteiga.webp", alt: "Cropped nadador manteiga" },
  { name: "Nude", hex: "#D5B29D", src: "/images/inove/palette/nude.webp", alt: "Cropped nadador nude" },
  { name: "Chocolate", hex: "#6E4435", src: "/images/inove/palette/chocolate.webp", alt: "Cropped nadador chocolate" },
  { name: "Royal", hex: "#3956B5", src: "/images/inove/palette/royal.webp", alt: "Cropped nadador azul royal" },
  { name: "Preto", hex: "#1D1B1B", src: "/images/inove/palette/preto.webp", alt: "Cropped nadador preto" },
];
const heroPhotos = [
  { src: "/images/inove/hero-v2/produto-cropped-verde.webp", alt: "Cropped verde-água", depth: .5, className: "hero-float-1" },
  { src: "/images/inove/hero-v2/produto-shorts-royal.webp", alt: "Shorts azul royal", depth: 1, className: "hero-float-2" },
  { src: "/images/inove/hero-v2/modelo-regata-manteiga.webp", alt: "Modelo usando regata manteiga", depth: 2, className: "hero-float-3" },
  { src: "/images/inove/hero-v2/produto-regata-manteiga.webp", alt: "Regata manteiga", depth: 1, className: "hero-float-4" },
  { src: "/images/inove/hero-v2/produto-cropped-preto.webp", alt: "Cropped preto de cirrê", depth: 1, className: "hero-float-5" },
  { src: "/images/inove/hero-v2/modelo-body-preto.webp", alt: "Modelo usando body preto", depth: 2, className: "hero-float-6" },
  { src: "/images/inove/hero-v2/produto-body-nude.webp", alt: "Body nude canelado", depth: 4, className: "hero-float-7" },
  { src: "/images/inove/hero-v2/modelo-vestido-cinza.webp", alt: "Modelo usando vestido cinza", depth: 1, className: "hero-float-8" },
  { src: "/images/inove/hero-v2/modelo-cropped-cinza.webp", alt: "Modelo usando cropped cinza", depth: 1.5, className: "hero-float-9" },
  { src: "/images/inove/hero-v2/modelo-shorts-chocolate.webp", alt: "Modelo usando shorts chocolate", depth: .75, className: "hero-float-10" },
  { src: "/images/inove/hero-v2/modelo-cropped-preto.webp", alt: "Modelo usando cropped preto", depth: 2.5, className: "hero-float-11" },
];
const collagePhotos = [
  { src: "/images/inove/collage-v2/feed-01.webp", alt: "Modelo usando cropped nadador cinza" },
  { src: "/images/inove/collage-v2/feed-02.webp", alt: "Cropped nadador verde-água" },
  { src: "/images/inove/collage-v2/feed-03.webp", alt: "Modelo usando shorts crepe chocolate" },
  { src: "/images/inove/collage-v2/feed-04.webp", alt: "Shorts crepe azul royal" },
  { src: "/images/inove/collage-v2/feed-05.webp", alt: "Modelo usando regata manteiga" },
  { src: "/images/inove/collage-v2/feed-06.webp", alt: "Regata manteiga com ombros estruturados" },
  { src: "/images/inove/collage-v2/feed-07.webp", alt: "Modelo usando cropped cirrê preto" },
  { src: "/images/inove/collage-v2/feed-08.webp", alt: "Cropped cirrê preto" },
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

function FloatingHero() {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controls = animate(".floating-hero-photo", { opacity: [0, 1] }, { duration: reduceMotion ? 0 : .5, delay: reduceMotion ? 0 : stagger(.15) });
    return () => controls.stop();
  }, [animate, reduceMotion]);

  return <section className="floating-hero" aria-labelledby="hero-title" ref={scope}>
    <motion.div className="floating-hero-copy" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .88, delay: reduceMotion ? 0 : 1.5 }}>
      <h1 id="hero-title">Inove.</h1>
      <a href="#arara">Ver novidades</a>
    </motion.div>
    <Floating sensitivity={-1} className="floating-hero-scene">
      {heroPhotos.map((photo) => <FloatingElement key={photo.src} depth={photo.depth} className={photo.className}>
        <motion.img className="floating-hero-photo" initial={{ opacity: 0 }} src={photo.src} alt={photo.alt} />
      </FloatingElement>)}
    </Floating>
  </section>;
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
    <div className="outfit-viewport" ref={viewport}><div className="outfit-carousel">{items.map((item) => <div className="outfit-slide" key={item.id}><Image src={item.images[0].src} alt={item.images[0].alt} fill sizes="(max-width: 700px) 42vw, 24vw" /><div className="outfit-slide-copy"><strong>{shortNames[item.slug]}</strong><small>{formatPrice(item.price)} · {item.category}</small></div></div>)}</div></div>
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
  const palettePhoto = useMemo(() => ({ src: activeColor.src, alt: activeColor.alt }), [activeColor]);
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

  return <>
    <BrandLoader />
    <FloatingHero />

    <section className="rack-section section" id="arara" aria-labelledby="rack-title"><div className="container"><div className="rack-intro"><h2 id="rack-title" className="section-title">Puxe a arara.</h2><p>Arraste. Toque num cabide. Abra a peça sem perder a edição.</p></div>
      <div className="interactive-rack" ref={rackRef}><div className="rack-bar" /><motion.div className="rack-drag" drag="x" dragConstraints={rackRef} dragElastic={.08}>{rackProducts.map((product) => <motion.button key={product.id} className="motion-hanger" whileHover={reduceMotion ? undefined : { rotate: -2, y: -12 }} whileTap={{ scale: .98 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} onClick={() => setQuickView(product)}><span className="hanger-hook" aria-hidden="true" /><span className="hanger-photo"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 700px) 58vw, 23vw" /></span><span className="hanger-copy"><strong>{product.name}</strong><small>{formatPrice(product.price)}</small></span></motion.button>)}</motion.div></div>
    </div></section>

    <section className="palette-section section" aria-labelledby="palette-title"><div className="container"><div className="palette-photo"><Image src={palettePhoto.src} alt={palettePhoto.alt} fill sizes="(max-width: 700px) 88vw, 38vw" /></div><div><h2 id="palette-title" className="section-title">A cor muda tudo.</h2><p>Escolha uma cartela. Só a roupa muda.</p><div className="swatch-list">{palette.map((color) => <button key={color.name} className={activeColor.name === color.name ? "active" : ""} onPointerEnter={() => setActiveColor(color)} onFocus={() => setActiveColor(color)} onClick={() => setActiveColor(color)}><span style={{ backgroundColor: color.hex }} />{color.name}</button>)}</div></div></div></section>

    <OutfitBuilder />

    <section className="rising-lookbook" id="lookbook" ref={lookbookRef} aria-labelledby="lookbook-title"><div className="lookbook-stage"><div className="lookbook-heading"><h2 id="lookbook-title" className="section-title">Três formas de chegar.</h2><p>Produtos reais. Enquadramentos do feed. Nenhuma foto repetida.</p></div><div className="lookbook-triptych"><figure className="lookbook-photo"><Image src="/images/inove/lookbook/cropped-cirre-hq.webp" alt="Modelo usando cropped cirrê preto" fill sizes="30vw" /><figcaption>Cropped Cirrê · R$ 29,99</figcaption></figure><figure className="lookbook-photo"><Image src="/images/inove/lookbook/vestido-camisetao-hq.webp" alt="Modelo usando vestido camisetão cinza" fill sizes="40vw" /><figcaption>Vestido Camisetão · R$ 39,99</figcaption></figure><figure className="lookbook-photo"><Image src="/images/inove/lookbook/body-ana-hq.webp" alt="Modelo usando body Ana preto" fill sizes="30vw" /><figcaption>Body Ana · R$ 29,99</figcaption></figure></div></div></section>

    <section className="service-contact section" id="atendimento" aria-labelledby="service-title"><div className="container"><h2 id="service-title">Separa pra mim.</h2><div className="service-place"><MapPin /><span><strong>Loja Inove Boutique</strong><br />Rua Presidente Antônio Carlos, 378<br />Centro, Varginha — MG<br /><a href="https://www.google.com/maps/search/?api=1&query=Inove+Boutique+Rua+Presidente+Antonio+Carlos+378+Varginha+MG" target="_blank" rel="noreferrer">Abrir localização no Google Maps</a></span></div><div><p>Te atendemos no direct ou no WhatsApp antes que a peça acabe.</p><a href="https://wa.me/5535992582086?text=Oi%2C%20vi%20a%20edi%C3%A7%C3%A3o%2047%20e%20quero%20separar%20uma%20pe%C3%A7a.">WhatsApp</a><a href="https://www.instagram.com/inoveboutique_/">Instagram</a><small>Estoque e medidas sob consulta.</small></div></div></section>

    <section className="instagram-collage section" aria-labelledby="feed-title"><div className="container"><div className="collage-heading"><div><p className="eyebrow">@inoveboutique_</p><h2 id="feed-title" className="section-title">Quadro da semana.</h2></div><a className="button-secondary" href="https://www.instagram.com/inoveboutique_/" target="_blank" rel="noreferrer"><Instagram size={17} /> Ver Instagram</a></div><div className="collage-grid">{collagePhotos.map((photo, index) => <a href="https://www.instagram.com/inoveboutique_/" target="_blank" rel="noreferrer" key={photo.src}><Image src={photo.src} alt={photo.alt} width={1280} height={1280} /><span>{String(index + 1).padStart(2, "0")}</span></a>)}</div></div></section>

    <QuickView product={quickView} onClose={() => setQuickView(null)} />
  </>;
}
