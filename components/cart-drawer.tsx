"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { products } from "@/data/products";
import { applyCoupon, formatPrice } from "@/lib/shop";
import { useShopStore } from "@/store/shop-store";

export function CartDrawer() {
  const { cart, cartOpen, coupon, setCartOpen, setCoupon, updateItem, removeItem } = useShopStore();
  const lines = cart.flatMap((item) => { const product = products.find((entry) => entry.id === item.productId); return product ? [{ ...item, product }] : []; });
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = applyCoupon(subtotal, coupon).discount;
  const remaining = Math.max(0, 299 - subtotal);
  return <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content className="cart-drawer">
        <div className="drawer-heading"><Dialog.Title>Sua sacola</Dialog.Title><Dialog.Close className="icon-button" aria-label="Fechar sacola"><X /></Dialog.Close></div>
        <Dialog.Description>{remaining ? `Faltam ${formatPrice(remaining)} para o frete grátis.` : "Seu frete é grátis."}</Dialog.Description>
        <div className="shipping-progress"><span style={{ width: `${Math.min(100, subtotal / 2.99)}%` }} /></div>
        <div className="cart-lines">{lines.length ? lines.map((item) => <article className="cart-line" key={`${item.productId}-${item.size}-${item.color}`}>
          <Image src={item.product.images[0].src} alt="" width={96} height={120} />
          <div><h3>{item.product.name}</h3><p>{item.color} · {item.size}</p><strong>{formatPrice(item.product.price * item.quantity)}</strong>
            <div className="quantity"><button onClick={() => updateItem(item.productId, item.size, item.color, item.quantity - 1)} aria-label="Diminuir quantidade"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateItem(item.productId, item.size, item.color, item.quantity + 1)} aria-label="Aumentar quantidade"><Plus size={14} /></button><button className="remove" onClick={() => removeItem(item.productId, item.size, item.color)}>Remover</button></div>
          </div>
        </article>) : <div className="empty-state"><p>Essa arara está livre.</p><Link href="/loja" onClick={() => setCartOpen(false)}>Ver peças da semana</Link></div>}</div>
        {lines.length ? <div className="drawer-total"><label htmlFor="drawer-coupon">Cupom demonstrativo</label><input id="drawer-coupon" value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} placeholder="INOVE10" /><p><span>Subtotal</span><strong>{formatPrice(subtotal - discount)}</strong></p><Link className="button-primary" href="/checkout" onClick={() => setCartOpen(false)}>Ir para o checkout</Link><Link className="text-link" href="/sacola" onClick={() => setCartOpen(false)}>Ver sacola completa</Link></div> : null}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
