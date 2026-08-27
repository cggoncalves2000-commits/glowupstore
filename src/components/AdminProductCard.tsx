import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";
import type { AdminProduct } from "@/stores/adminStore";

export function AdminProductCard({ product }: { product: AdminProduct }) {
  const formatPrice = (val: string) => {
    const num = parseFloat(val.replace(/[^\d,]/g, "").replace(",", "."));
    if (isNaN(num)) return val;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const buyHref = product.buyLink || whatsappLink(`Oi! Tenho interesse no produto "${product.title}"`);

  return (
    <article className="group relative flex flex-col border border-border bg-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
      <div className="relative block aspect-4/5 overflow-hidden bg-secondary">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            sem imagem
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h3 className="font-display text-xl leading-snug transition-colors duration-300 group-hover:text-accent">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {product.description || "Sem descricao"}
          </p>
        </div>

        <div className="mt-3">
          <span className="text-base font-medium text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <Button
            asChild
            className="flex-1 transition-all duration-300 hover:shadow-glow-rose"
          >
            <a href={buyHref} target="_blank" rel="noopener noreferrer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Comprar
            </a>
          </Button>
          {!product.buyLink && (
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="Perguntar no WhatsApp"
              className="transition-all duration-300 hover:border-whatsapp hover:bg-whatsapp/10 hover:text-whatsapp"
            >
              <a
                href={whatsappLink(`Oi! Tenho interesse no produto "${product.title}"`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
