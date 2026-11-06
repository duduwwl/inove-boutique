"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Filter, Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories, products } from "@/data/products";
import { filterProducts } from "@/lib/shop";
import { ProductCard } from "@/components/product-card";

const sizes = ["PP", "P", "M", "G", "GG", "36", "38", "40", "42", "44", "46"];
const colors = ["Cinza", "Verde-água", "Manteiga", "Nude", "Chocolate", "Royal", "Terracota", "Preto", "Off-white"];

export function ShopGrid() {
  const searchParams = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const [search, setSearch] = useState(searchParams.get("search") ?? ""); const deferredSearch = useDeferredValue(search);
  const [drawer, setDrawer] = useState(false);
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const setParam = (key: string, value?: string) => { const next = new URLSearchParams(params); if (value) next.set(key,value); else next.delete(key); router.replace(`${pathname}?${next.toString()}`, { scroll:false }); };
  const filters = { category:params.get("category")??undefined,size:params.get("size")??undefined,color:params.get("color")??undefined,min:params.get("min")??undefined,max:params.get("max")??undefined,weekly:params.get("weekly")==="1",inStock:params.get("stock")==="1",search:deferredSearch };
  const ordering = params.get("order") ?? "relevance";
  const filtered = filterProducts(products,filters).toSorted((a,b) => ordering === "price-asc" ? a.price-b.price : ordering === "price-desc" ? b.price-a.price : ordering === "new" ? Number(b.tags.includes("novidade"))-Number(a.tags.includes("novidade")) : 0);
  const activeFilters = [
    categories.includes(filters.category as never) ? { key:"category", label:filters.category } : null,
    sizes.includes(filters.size ?? "") ? { key:"size", label:`Tam. ${filters.size}` } : null,
    colors.includes(filters.color ?? "") ? { key:"color", label:filters.color } : null,
    filters.min ? { key:"min", label:`Desde R$ ${filters.min}` } : null,
    filters.max ? { key:"max", label:`Até R$ ${filters.max}` } : null,
    filters.weekly ? { key:"weekly", label:"Novidades" } : null,
    filters.inStock ? { key:"stock", label:"Em estoque" } : null,
  ].filter((entry): entry is { key:string; label:string } => Boolean(entry?.label));
  const clear = () => { setSearch(""); router.replace(pathname); };
  const filterPanel = <div className="filter-panel">
    <div><h2>Categorias</h2>{categories.map((category) => <button key={category} className={filters.category===category?"active":""} onClick={() => setParam("category",filters.category===category?undefined:category)}>{category}</button>)}</div>
    <div><h2>Tamanho</h2><div className="filter-chips">{sizes.map((size) => <button key={size} className={filters.size===size?"active":""} onClick={() => setParam("size",filters.size===size?undefined:size)}>{size}</button>)}</div></div>
    <div><h2>Cor</h2><div className="filter-chips">{colors.map((color) => <button key={color} className={filters.color===color?"active":""} onClick={() => setParam("color",filters.color===color?undefined:color)}>{color}</button>)}</div></div>
    <fieldset className="price-filter"><legend>Faixa de preço</legend><label>Mínimo <output>{filters.min ? `R$ ${filters.min}` : "R$ 50"}</output><input type="range" min="50" max="330" step="10" value={filters.min ?? "50"} onChange={(event)=>setParam("min",event.target.value === "50" ? undefined : event.target.value)} /></label><label>Máximo <output>{filters.max ? `R$ ${filters.max}` : "R$ 330"}</output><input type="range" min="50" max="330" step="10" value={filters.max ?? "330"} onChange={(event)=>setParam("max",event.target.value === "330" ? undefined : event.target.value)} /></label></fieldset>
    <label className="check-label"><input type="checkbox" checked={filters.weekly} onChange={(event)=>setParam("weekly",event.target.checked?"1":undefined)} /> Só novidades da semana</label>
    <label className="check-label"><input type="checkbox" checked={filters.inStock} onChange={(event)=>setParam("stock",event.target.checked?"1":undefined)} /> Em estoque</label>
    <button className="text-link clear-filters" onClick={clear}>Limpar tudo</button>
  </div>;
  return <div className="shop-shell container"><aside>{filterPanel}</aside><div className="shop-results">
    <div className="shop-toolbar"><label className="search-field"><Search /><span className="sr-only">Buscar</span><input value={search} onChange={(event)=>setSearch(event.target.value)} onBlur={()=>setParam("search",search||undefined)} placeholder="Buscar por peça ou cor" /></label><button className="mobile-filter" onClick={()=>setDrawer(true)}><Filter /> Filtrar</button><label>Ordenar <select value={ordering} onChange={(event)=>setParam("order",event.target.value)}><option value="relevance">Relevância</option><option value="new">Novidades</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option></select></label></div>
    <p className="result-count">{filtered.length} peças na arara</p>
    {activeFilters.length ? <div className="active-filters" aria-label="Filtros ativos">{activeFilters.map((entry)=><button key={entry.key} onClick={()=>setParam(entry.key)}>{entry.label} <X size={14} /></button>)}</div> : null}
    {filtered.length ? <div className="product-grid">{filtered.map((product,index)=><ProductCard key={product.id} product={product} editorial={index>0 && index%8===0} />)}</div> : <div className="shop-empty"><h2>Essa combinação saiu da arara.</h2><p>Tire um filtro ou veja todas as peças da edição.</p><button className="button-primary" onClick={clear}>Ver todas</button></div>}
    <Dialog.Root open={drawer} onOpenChange={setDrawer}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="filter-drawer"><div className="drawer-heading"><Dialog.Title>Filtrar a arara</Dialog.Title><Dialog.Close className="icon-button" aria-label="Fechar filtros"><X /></Dialog.Close></div>{filterPanel}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </div></div>;
}
