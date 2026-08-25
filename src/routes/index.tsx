import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, Loader2, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import { CATEGORIES, whatsappLink } from "@/lib/site";
import { useCartSync } from "@/hooks/useCartSync";
import heroImage from "@/assets/hero-glow.jpg";
import offerBanner from "@/assets/offer-banner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glow Up Store | Beleza, skincare e autocuidado" },
      {
        name: "description",
        content:
          "Curadoria de skincare, cabelos, corpo e maquiagem na Glow Up Store. Compre online com checkout seguro ou fale direto no WhatsApp.",
      },
      { property: "og:title", content: "Glow Up Store | Beleza, skincare e autocuidado" },
      {
        property: "og:description",
        content:
          "Produtos de beleza selecionados com curadoria. Compre pelo site ou peça pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const BENEFITS = [
  { icon: ShieldCheck, title: "100% originais", text: "Marcas autorizadas" },
  { icon: Sparkles, title: "Curadoria própria", text: "Testado antes de vender" },
  { icon: Truck, title: "Envio rápido", text: "Para todo o Brasil" },
  { icon: Star, title: "Atendimento humano", text: "Direto no WhatsApp" },
];

function Home() {
  useCartSync();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(24),
  });

  const filtered = useMemo(() => {
    if (!activeCategory) return products;
    const term = activeCategory.toLowerCase();
    return products.filter((p) => {
      const haystack = [
        p.node.title,
        p.node.productType ?? "",
        p.node.description,
        ...(p.node.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="surface-ink relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 md:grid-cols-2 md:px-8 md:pb-24 md:pt-20">
          <div>
            <span className="eyebrow inline-block border border-rose/40 px-3 py-1 text-rose-soft">
              Nova coleção · Glow diário
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Sua rotina de beleza,
              <span className="block italic text-rose-soft">elevada.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-foreground/70 md:text-base">
              Skincare, cabelos, corpo e maquiagem escolhidos a dedo para quem quer resultado real —
              com aquele toque de luxo no dia a dia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-rose text-accent-foreground hover:bg-rose/90">
                <a href="#destaques">
                  Ver produtos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  Comprar pelo WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Modelo com pele radiante em iluminação vinho e rosa"
              width={1408}
              height={1600}
              className="h-[380px] w-full object-cover object-top md:h-[560px]"
            />
            <div className="absolute -bottom-6 left-6 hidden bg-background px-6 py-4 shadow-luxe md:block">
              <p className="font-display text-3xl text-primary">+2 mil</p>
              <p className="eyebrow text-muted-foreground">clientes atendidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="border-b border-border bg-sand">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-accent">Categorias</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Escolha por necessidade</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.query;
            return (
              <button
                key={cat.query}
                onClick={() => setActiveCategory(active ? null : cat.query)}
                className={`group border p-5 text-left transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-accent"
                }`}
              >
                <p className="font-display text-2xl">{cat.label}</p>
                <p
                  className={`mt-1 text-xs ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="destaques" className="mx-auto max-w-7xl px-4 pb-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-accent">Em destaque</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              {activeCategory ? `Filtrando: ${activeCategory}` : "Mais desejados"}
            </h2>
          </div>
          {activeCategory && (
            <Button variant="ghost" onClick={() => setActiveCategory(null)}>
              Limpar filtro
            </Button>
          )}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-border py-20 text-center">
              <p className="font-display text-2xl">Nenhum produto encontrado</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {activeCategory
                  ? "Nenhum produto nessa categoria ainda."
                  : "Sua loja ainda não tem produtos cadastrados."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OFERTAS */}
      <section id="ofertas" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="relative overflow-hidden">
          <img
            src={offerBanner}
            alt="Frascos de skincare em tons de vinho sobre mármore bege"
            width={1600}
            height={704}
            loading="lazy"
            className="h-[280px] w-full object-cover md:h-[340px]"
          />
          <div className="absolute inset-0 flex flex-col justify-center gap-4 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent px-6 md:px-14">
            <span className="eyebrow text-rose-soft">Ofertas da semana</span>
            <h2 className="max-w-sm font-display text-4xl leading-tight text-ink-foreground md:text-5xl">
              Kits selecionados com condições especiais
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-rose text-accent-foreground hover:bg-rose/90">
                <a href="#destaques">Ver ofertas</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ink-foreground/40 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <a href={whatsappLink("Oi! Quero saber as ofertas da semana da Glow Up Store 💖")} target="_blank" rel="noopener noreferrer">
                  Pedir no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section id="avaliacoes" className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
        <span className="eyebrow text-accent">Avaliações</span>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">O que dizem as clientes</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-dashed border-border bg-card p-6">
              <div className="flex gap-1 text-muted-foreground">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Ainda não há avaliações.</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          As avaliações aparecem aqui conforme as clientes reais enviarem seus depoimentos.
        </p>
      </section>

      {/* DUAS FORMAS DE COMPRAR */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-ink flex flex-col justify-between gap-6 p-8 md:p-12">
            <div>
              <span className="eyebrow text-rose-soft">Opção 1</span>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">Comprar pelo site</h3>
              <p className="mt-3 text-sm text-ink-foreground/70">
                Escolha, adicione à sacola e finalize com checkout seguro da Shopify. Rápido e sem
                conversa.
              </p>
            </div>
            <Button asChild className="w-fit bg-rose text-accent-foreground hover:bg-rose/90">
              <a href="#destaques">Ver produtos</a>
            </Button>
          </div>
          <div className="flex flex-col justify-between gap-6 border border-border bg-card p-8 md:p-12">
            <div>
              <span className="eyebrow text-accent">Opção 2</span>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">Falar no WhatsApp</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Prefere indicação personalizada? Me chama que eu te ajudo a montar sua rotina ideal.
              </p>
            </div>
            <Button asChild variant="outline" className="w-fit">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                Chamar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
