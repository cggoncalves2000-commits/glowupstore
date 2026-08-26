import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import logo from "@/assets/favicon.jpg";

export function SiteHeader() {
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
      </div>
    </header>
  );
}
