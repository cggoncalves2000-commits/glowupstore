import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, ShieldCheck, Sparkles, Star, Truck, Heart, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ProductCard } from "@/components/ProductCard";
import { AdminProductCard } from "@/components/AdminProductCard";
import { useAdminStore } from "@/stores/adminStore";
import { fetchProducts } from "@/lib/shopify";
import { CATEGORIES, whatsappLink } from "@/lib/site";
import { useCartSync } from "@/hooks/useCartSync";
import offerBanner from "@/assets/offer-banner.jpg";
import carrosel1 from "@/assets/carrosel 1.jpeg";
import carrosel2 from "@/assets/carrosel 2.jpeg";
import carrosel3 from "@/assets/carrosel 3.jpeg";

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
          "Produtos de beleza selecionados com curadoria. Compre pelo site ou peca pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const HERO_SLIDES = [
  { src: carrosel1, alt: "Carrossel de produtos de beleza 1" },
  { src: carrosel2, alt: "Carrossel de produtos de beleza 2" },
  { src: carrosel3, alt: "Carrossel de produtos de beleza 3" },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "100% originais", text: "Marcas autorizadas" },
  { icon: Sparkles, title: "Curadoria propria", text: "Testado antes de vender" },
  { icon: Truck, title: "Envio rapido", text: "Para todo o Brasil" },
  { icon: Star, title: "Atendimento humano", text: "Direto no WhatsApp" },
];

const TESTIMONIALS = [
  {
    name: "Ana Clara",
    initials: "AC",
    rating: 5,
    text: "Amei o protetor solar! Textura leve, nao deixa pele branca. Chegou super rapido.",
    product: "Protetor Solar Facial",
  },
  {
    name: "Juliana M.",
    initials: "JM",
    rating: 5,
    text: "O creme para cabelo que eu precisava. Cabelo macio e sem frizz no primeiro uso!",
    product: "Creme Pentear Sem Enxague",
  },
  {
    name: "Camila R.",
    initials: "CR",
    rating: 5,
    text: "Atendimento incrivel no WhatsApp. Me ajudou a montar minha rotina inteira. Super recomendo!",
    product: "Rotina Personalizada",
  },
];

function Home() {
  useCartSync();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % HERO_SLIDES.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(24),
  });

  const adminProducts = useAdminStore((s) => s.products);

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
      <section className="bg-sand">
        <div className="relative mx-auto max-w-7xl">
          {/* Image area */}
          <div className="relative h-[500px] overflow-hidden rounded-lg md:h-[700px]">
            {HERO_SLIDES.map((slide, i) => (
              <img
                key={i}
                src={slide.src}
                alt={slide.alt}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                  i === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/10 text-ink backdrop-blur-sm transition-all duration-300 hover:bg-ink/20 hover:scale-110 md:left-5"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/10 text-ink backdrop-blur-sm transition-all duration-300 hover:bg-ink/20 hover:scale-110 md:right-5"
              aria-label="Proximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center pb-6 pt-4">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`mx-1 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-accent" : "w-2 bg-ink/20 hover:bg-ink/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-b border-border bg-sand">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 md:grid-cols-4 md:gap-6 md:px-8">
          {BENEFITS.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={`group flex items-start gap-3 animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>
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
                className={`group relative overflow-hidden border p-5 text-left transition-all duration-300 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-accent hover:shadow-card-hover hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
                    active
                      ? "bg-gradient-to-br from-primary/20 to-transparent"
                      : "bg-gradient-to-br from-accent/5 to-transparent group-hover:opacity-100"
                  }`}
                />
                <p className="relative font-display text-2xl">{cat.label}</p>
                <p
                  className={`relative mt-1 text-xs ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}
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
            <Button variant="ghost" onClick={() => setActiveCategory(null)} className="text-accent">
              Limpar filtro
            </Button>
          )}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-4/5 bg-secondary" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-secondary" />
                    <div className="h-3 w-1/2 rounded bg-secondary" />
                    <div className="h-8 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 && adminProducts.filter((p) => p.available).length === 0 ? (
            <div className="border border-dashed border-border py-20 text-center">
              <p className="font-display text-2xl">Nenhum produto encontrado</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {activeCategory
                  ? "Nenhum produto nessa categoria ainda."
                  : "Sua loja ainda nao tem produtos cadastrados."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product, i) => (
                <div
                  key={product.node.id}
                  className={`animate-fade-in-up`}
                  style={{ animationDelay: `${Math.min(i * 80, 400)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
              {adminProducts
                .filter((p) => p.available)
                .filter((p) => {
                  if (!activeCategory) return true;
                  return p.category === activeCategory;
                })
                .map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${Math.min((filtered.length + i) * 80, 400)}ms` }}
                  >
                    <AdminProductCard product={product} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* OFERTAS */}
      <section id="ofertas" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={offerBanner}
            alt="Frascos de skincare em tons de vinho sobre marmore bege"
            width={1600}
            height={704}
            loading="lazy"
            className="h-[280px] w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[340px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6 md:px-14">
            <span className="eyebrow text-rose-soft">Ofertas da semana</span>
            <h2 className="max-w-sm font-display text-4xl leading-tight text-ink-foreground md:text-5xl">
              Kits selecionados com condicoes especiais
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-rose text-accent-foreground shadow-lg shadow-rose/25 transition-all duration-300 hover:bg-rose/90 hover:shadow-xl hover:-translate-y-0.5"
              >
                <a href="#destaques">Ver ofertas</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ink-foreground/40 bg-transparent text-ink-foreground transition-all duration-300 hover:border-ink-foreground/70 hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <a
                  href={whatsappLink("Oi! Quero saber as ofertas da semana da Glow Up Store")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AVALIACOES */}
      <section id="avaliacoes" className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
        <span className="eyebrow text-accent">Avaliacoes</span>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">O que dizem as clientes</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`group relative border border-border bg-card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-in-up`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-accent/10 transition-colors duration-300 group-hover:text-accent/25" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-sm font-medium text-accent-foreground">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.product}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          As avaliacoes aparecem aqui conforme as clientes reais enviarem seus depoimentos.
        </p>
      </section>

      {/* DUAS FORMAS DE COMPRAR */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-ink group relative flex flex-col justify-between gap-6 overflow-hidden p-8 transition-all duration-300 hover:shadow-2xl md:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose/10 blur-[60px] transition-all duration-500 group-hover:bg-rose/20" />
            <div className="relative">
              <span className="eyebrow text-rose-soft">Opcao 1</span>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">Comprar pelo site</h3>
              <p className="mt-3 text-sm text-ink-foreground/70">
                Escolha, adicione a sacola e finalize com checkout seguro da Shopify. Rapido e sem
                conversa.
              </p>
            </div>
            <Button
              asChild
              className="relative w-fit bg-rose text-accent-foreground shadow-lg shadow-rose/25 transition-all duration-300 hover:bg-rose/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              <a href="#destaques">Ver produtos</a>
            </Button>
          </div>
          <div className="group relative flex flex-col justify-between gap-6 overflow-hidden border border-border bg-card p-8 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 md:p-12">
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/5 blur-[60px] transition-all duration-500 group-hover:bg-accent/10" />
            <div className="relative">
              <span className="eyebrow text-accent">Opcao 2</span>
              <h3 className="mt-3 font-display text-3xl md:text-4xl">Falar no WhatsApp</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Prefere indicacao personalizada? Me chama que eu te ajudo a montar sua rotina ideal.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="relative w-fit transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5"
            >
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
