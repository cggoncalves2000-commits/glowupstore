import { Instagram, Mail } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="surface-ink mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-3xl">Glow Up Store</p>
          <p className="mt-3 max-w-xs text-sm text-ink-foreground/60">
            Beleza e autocuidado selecionados com curadoria. Compre pelo site ou fale com a gente no
            WhatsApp.
          </p>
        </div>
        <div>
          <p className="eyebrow text-ink-foreground/50">Atendimento</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/75">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-rose-soft">
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> {SITE.email}
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-3.5 w-3.5" /> {SITE.instagram}
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-ink-foreground/50">Compra segura</p>
          <p className="mt-4 text-sm text-ink-foreground/70">
            Checkout processado pela Shopify, com pagamento protegido e envio para todo o Brasil.
          </p>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 px-4 py-5 text-center text-xs text-ink-foreground/45 md:px-8">
        © {new Date().getFullYear()} Glow Up Store. Todos os direitos reservados.
      </div>
    </footer>
  );
}
