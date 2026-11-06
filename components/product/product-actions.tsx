"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useShopStore } from "@/store/shop-store";

export function ProductActions({ product }: { product: Product }) {
  const [color,setColor]=useState(product.colors[0].name); const [size,setSize]=useState(""); const [quantity,setQuantity]=useState(1); const addItem=useShopStore((state)=>state.addItem);
  const add=()=>{if(!size){toast.error("Escolha um tamanho.");return;} addItem({productId:product.id,size,color},quantity);toast.success("Peça adicionada à sacola.");};
  const whatsapp=`https://wa.me/5535992582086?text=${encodeURIComponent(`Oi, quero separar ${product.name}, cor ${color}, tamanho ${size||"a confirmar"}.`)}`;
  return <div className="product-actions"><fieldset><legend>Cor: <strong>{color}</strong></legend><div className="color-options">{product.colors.map((entry)=><button key={entry.name} onClick={()=>setColor(entry.name)} className={color===entry.name?"active":""} aria-label={entry.name} style={{background:entry.hex}} />)}</div></fieldset><fieldset><legend>Tamanho</legend><div className="size-options">{product.sizes.map((entry)=><button key={entry} disabled={!product.stock[entry]} onClick={()=>setSize(entry)} className={size===entry?"active":""}>{entry}</button>)}</div><button className="text-link size-guide" onClick={()=>toast.info("Guia demonstrativo: busto, cintura e quadril variam 4 cm entre tamanhos.")}>Guia de medidas</button></fieldset><label>Quantidade <select value={quantity} onChange={(event)=>setQuantity(Number(event.target.value))}>{[1,2,3,4].map((value)=><option key={value}>{value}</option>)}</select></label><button className="button-primary" onClick={add}>Adicionar à sacola</button><a className="button-secondary" href={whatsapp}>Comprar pelo WhatsApp</a></div>;
}
