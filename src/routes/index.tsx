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
import { fetchProductsGitHub } from "@/lib/github-products";
import { fetchBannersGitHub } from "@/lib/github-banners";
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
  { id: "default-1", src: carrosel1, alt: "Carrossel de produtos de beleza 1" },
  { id: "default-2", src: carrosel2, alt: "Carrossel de produtos de beleza 2" },
  { id: "default-3", src: carrosel3, alt: "Carrossel de produtos de beleza 3" },
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
  {
    name: "Fernanda L.",
    initials: "FL",
    rating: 5,
    text: "A maquiagem e incrivel! Cobertura perfeita e dura o dia todo. Ja indiquei para todas minhas amigas.",
    product: "Base de Longa Duracao",
  },
  {
    name: "Mariana S.",
    initials: "MS",
    rating: 5,
    text: "Produto de altissima qualidade e entrega foi super rapida. Com certeza vou comprar de novo!",
    product: "Kit Cuidados com a Pele",
  },
  {
    name: "Patricia O.",
    initials: "PO",
    rating: 5,
    text: "Melhor loja de beleza que ja comprei! Preco justo e produto chegou embalado com muito carinho.",
    product: "Shampoo Nutritivo",
  },
];

function Home() {
  useCartSync();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(24),
  });

  const { data: adminProducts = [] } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => fetchProductsGitHub(),
  });

  const { data: rawBanners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: () => fetchBannersGitHub(),
  });

  const banners = useMemo(() => {
    const savedDefaults = rawBanners.filter((b) => HERO_SLIDES.some((s) => s.id === b.id));
    const custom = rawBanners.filter((b) => !HERO_SLIDES.some((s) => s.id === b.id));
    const defaults = HERO_SLIDES.map((s) => {
      const existing = savedDefaults.find((b) => b.id === s.id);
      return existing ?? { id: s.id, image: s.src, link: "", createdAt: 0 };
    });
    return [...defaults, ...custom];
  }, [rawBanners]);

  const slideCount = banners.length > 0 ? banners.length : HERO_SLIDES.length;

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 7000);
  }, [slideCount]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slideCount);
  }, [currentSlide, goToSlide, slideCount]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  }, [currentSlide, goToSlide, slideCount]);

  useEffect(() => {
    setCurrentSlide(0);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [slideCount]);

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
          <div className="relative h-[500px] overflow-hidden rounded-lg md:h-[700px]">
            {banners.map((banner, i) => (
              banner.link ? (
                <a key={banner.id} href={banner.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={banner.image}
                    alt={`Banner ${i + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                      i === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              ) : (
                <img
                  key={banner.id}
                  src={banner.image}
                  alt={`Banner ${i + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                    i === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              )
            ))}

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

          <div className="flex justify-center pb-6 pt-4">
            {banners.map((_: unknown, i: number) => (
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

      {/* DESTAQUES */}
      <section id="destaques" className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-accent">Destaques</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Produtos em destaque</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {adminProducts
            .filter((p) => p.available && p.featured)
            .map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 80, 400)}ms` }}
              >
                <AdminProductCard product={product} />
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
                className={`rounded-full border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-accent hover:bg-accent/5"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {activeCategory && (
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" onClick={() => setActiveCategory(null)} className="text-accent">
                Limpar filtro
              </Button>
            </div>
          )}
          {activeCategory && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product, i) => (
                <div
                  key={product.node.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i * 80, 400)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
              {adminProducts
                .filter((p) => p.available)
                .filter((p) => p.category === activeCategory)
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
                <a href={whatsappLink("Oi! Quero saber as ofertas da semana da Glow Up Store")} target="_blank" rel="noopener noreferrer">
                  Ver ofertas
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
      </section>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
