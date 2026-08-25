import { Link } from "@tanstack/react-router";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";

const NAV = [
  { label: "Destaques", href: "/#destaques" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Ofertas", href: "/#ofertas" },
  { label: "Avaliações", href: "/#avaliacoes" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-tight">Glow Up</span>
          <span className="eyebrow text-[9px] text-accent">{SITE.tagline}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/70 transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
