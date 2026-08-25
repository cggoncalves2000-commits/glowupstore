import { Link } from "@tanstack/react-router";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { SITE, whatsappLink } from "@/lib/site";
import logo from "@/assets/favicon.jpg";

const NAV = [
  { label: "Destaques", href: "/#destaques" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Ofertas", href: "/#ofertas" },
  { label: "Avaliacoes", href: "/#avaliacoes" },
];

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5 leading-none">
          <img src={logo} alt="Glow Up Store" className="h-9 w-9 rounded-full object-cover shadow-md transition-shadow group-hover:shadow-lg" />
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-tight transition-colors group-hover:text-accent">
              Glow Up
            </span>
            <span className="eyebrow text-[8px] text-accent">{SITE.tagline}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-accent"
            >
              {item.label}
              <span className="absolute bottom-0 left-3 right-3 h-0.5 scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden border-accent/30 text-accent transition-all hover:border-accent hover:bg-accent/10 sm:inline-flex"
          >
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
