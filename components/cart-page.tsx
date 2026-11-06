"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { products } from "@/data/products";
import { applyCoupon, formatPrice } from "@/lib/shop";
import { useShopStore } from "@/store/shop-store";

export function CartPage() {
  const { cart, coupon, addItem, setCoupon, updateItem, changeItem, removeItem } = useShopStore();
  const lines = cart.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = applyCoupon(subtotal, coupon).discount;
  const couponInvalid = coupon.length > 0 && discount === 0;

  if (!lines.length) return <div className="standalone-empty"><h1 className="display">Sua arara está livre.</h1><p>As peças da quinta ainda estão esperando.</p><Link className="button-primary" href="/loja">Ver novidades</Link></div>;

  return <div className="cart-page container">
    <section>
      <h1 className="display">Sacola</h1>
      {lines.map((item) => <article key={`${item.productId}-${item.size}-${item.color}`}>
        <Image src={item.product.images[0].src} alt="" width={150} height={188} />
        <div>
          <h2>{item.product.name}</h2>
          <strong>{formatPrice(item.product.price)}</strong>
          <div className="cart-variants">
            <label>Tamanho <select value={item.size} onChange={(event) => changeItem(item.productId, item.size, item.color, event.target.value, item.color)}>{item.product.sizes.map((size) => <option key={size} disabled={!item.product.stock[size]}>{size}</option>)}</select></label>
            <label>Cor <select value={item.color} onChange={(event) => changeItem(item.productId, item.size, item.color, item.size, event.target.value)}>{item.product.colors.map((color) => <option key={color.name}>{color.name}</option>)}</select></label>
            <label>Quantidade <input type="number" min="1" max="9" value={item.quantity} onChange={(event) => updateItem(item.productId, item.size, item.color, Number(event.target.value))} /></label>
          </div>
          <button className="text-link" onClick={() => {
            removeItem(item.productId, item.size, item.color);
            toast("Peça removida.", { action: { label: "Desfazer", onClick: () => addItem({ productId: item.productId, size: item.size, color: item.color }, item.quantity) } });
          }}>Remover</button>
        </div>
      </article>)}
    </section>
    <aside>
      <h2>Resumo</h2>
      <label>Cupom demonstrativo<input value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} placeholder="INOVE10" aria-describedby="coupon-status" /></label>
      <small id="coupon-status" className={couponInvalid ? "field-error" : ""}>{couponInvalid ? "Cupom inválido." : coupon ? "Cupom aplicado." : "Use INOVE10 ou PRIMEIRA."}</small>
      <p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p>
      <p><span>Desconto</span><strong>- {formatPrice(discount)}</strong></p>
      <p className="cart-grand"><span>Total</span><strong>{formatPrice(subtotal - discount)}</strong></p>
      <Link className="button-primary" href="/checkout">Continuar para checkout</Link>
      <small>Ambiente de demonstração · nenhum pagamento é processado.</small>
    </aside>
  </div>;
}
