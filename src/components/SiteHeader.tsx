import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import logo from "@/assets/favicon.jpg";

const NAV = [
  { label: "Destaques", id: "destaques" },
  { label: "Categorias", id: "categorias" },
  { label: "Ofertas", id: "ofertas" },
  { label: "Avaliacoes", id: "avaliacoes" },
];

export function SiteHeader() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="glass sticky top-0 z-40 border-b border-border/50">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5 leading-none">
          <img src={logo} alt="Glow Up Store" className="h-9 w-9 rounded-full object-cover shadow-md transition-shadow group-hover:shadow-lg" />
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-tight transition-colors group-hover:text-accent">
              Glow Up
            </span>
            <span className="eyebrow text-[8px] text-accent">{SITE.tagline}</span>
          </div>
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-accent"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
