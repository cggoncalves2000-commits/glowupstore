import { Link } from "@tanstack/react-router";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { whatsappLink } from "@/lib/site";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const node = product.node;
  const selectedVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount) ? compareAt : null;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Adicionado a sacola", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <article className="group relative flex flex-col border border-border bg-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1">
      <Link
        to="/produto/$handle"
        params={{ handle: node.handle }}
        className="relative block aspect-4/5 overflow-hidden bg-secondary"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? node.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            sem imagem
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Quick view hint on hover */}
        <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          Ver detalhes
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/produto/$handle" params={{ handle: node.handle }} className="flex-1">
          <h3 className="font-display text-xl leading-snug transition-colors duration-300 group-hover:text-accent">
            {node.title}
          </h3>
          <div
            className="mt-1 text-xs text-muted-foreground [&_p]:mb-1 [&_p]:last:mb-0"
            dangerouslySetInnerHTML={{ __html: node.description }}
          />
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-medium text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(hasDiscount.amount, hasDiscount.currencyCode)}
            </span>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant?.availableForSale}
            className="flex-1 transition-all duration-300 hover:shadow-glow-rose"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Comprar
              </>
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            aria-label="Perguntar no WhatsApp"
            className="transition-all duration-300 hover:border-whatsapp hover:bg-whatsapp/10 hover:text-whatsapp"
          >
            <a
              href={whatsappLink(`Oi! Tenho interesse no produto "${node.title}"`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.03.24-3.47-.72-2.94-1.16-4.8-4.2-4.95-4.4-.14-.2-1.17-1.56-1.17-2.98 0-1.42.75-2.11 1.01-2.4.27-.29.58-.36.77-.36.19 0 .39 0 .55.01.19.01.44-.07.68.53.24.6.82 2.02.89 2.17.07.15.12.32.02.51-.1.19-.34.53-.55.72-.15.14-.31.29-.14.58.17.29.75 1.24 1.6 2 1.1.98 1.87 1.29 2.16 1.44.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.26.1 1.67.79 1.96.93.29.14.48.22.55.34.07.12.07.68-.17 1.36Z" />
              </svg>
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
