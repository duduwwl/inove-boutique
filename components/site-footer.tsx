import Link from "next/link";
import { Arabesque } from "@/components/monogram";

export function SiteFooter() {
  return <footer className="site-footer">
    <h2>INOVE BOUTIQUE</h2><Arabesque />
    <div className="footer-grid"><div><a href="https://wa.me/5535992582086">(35) 99258-2086</a><a href="https://www.instagram.com/inoveboutique_/">@inoveboutique_</a></div><nav><Link href="/loja">Loja</Link><Link href="/sobre">Sobre</Link><Link href="/trocas">Trocas</Link><Link href="/favoritos">Favoritos</Link></nav><form><label htmlFor="newsletter">Receba a edição da semana</label><div><input id="newsletter" type="email" placeholder="seu@email.com" /><button type="submit">Assinar</button></div></form></div>
    <div className="footer-bottom"><p>Rua Presidente Antônio Carlos, 378, Centro, Varginha-MG</p><p>Site demonstrativo · nenhum pedido é processado</p></div>
  </footer>;
}
