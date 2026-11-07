import Link from "next/link";
import { Arabesque } from "@/components/monogram";

export function SiteFooter() {
  return <footer className="site-footer">
    <h2><span>INOVE</span><span>BOUTIQUE</span></h2><Arabesque />
    <div className="footer-grid"><div><a href="https://wa.me/5535992582086">(35) 99258-2086</a><a href="https://www.instagram.com/inoveboutique_/">@inoveboutique_</a></div><nav><Link href="/loja">Loja</Link><Link href="/sobre">Sobre</Link><Link href="/trocas">Trocas</Link><Link href="/favoritos">Favoritos</Link></nav><div className="footer-contact"><strong>Atendimento direto</strong><span>Varginha — MG</span><a href="https://www.google.com/maps/search/?api=1&query=Inove+Boutique+Rua+Presidente+Antonio+Carlos+378+Varginha+MG" target="_blank" rel="noreferrer">Ver no Google Maps</a></div></div>
    <div className="footer-bottom"><p>Rua Presidente Antônio Carlos, 378, Centro, Varginha-MG</p><p>Site demonstrativo · nenhum pedido é processado</p></div>
  </footer>;
}
