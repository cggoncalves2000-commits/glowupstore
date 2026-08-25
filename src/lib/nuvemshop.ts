export interface NuvemshopProduct {
  title: string;
  description: string;
  price: string;
  image: string;
}

function parseJsonLd(html: string): NuvemshopProduct | null {
  const match = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;

  try {
    const data = JSON.parse(match[1]);
    const product = data["@type"] === "Product" ? data : data["@graph"]?.find((i: Record<string, string>) => i["@type"] === "Product");
    if (!product) return null;

    const offers = product.offers;
    const price = offers?.price ?? offers?.lowPrice ?? "";

    let image = "";
    if (typeof product.image === "string") {
      image = product.image;
    } else if (Array.isArray(product.image) && product.image.length > 0) {
      image = product.image[0];
    }

    return {
      title: product.name || "",
      description: stripHtml(product.description || ""),
      price: String(price),
      image,
    };
  } catch {
    return null;
  }
}

function parseOpenGraph(html: string): NuvemshopProduct | null {
  const get = (prop: string) => {
    const m = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i"));
    return m?.[1] || "";
  };

  const title = get("og:title");
  if (!title) return null;

  return {
    title,
    description: get("og:description"),
    price: get("product:price:amount") || "",
    image: get("og:image"),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractHandle(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

export async function scrapeNuvemshopProduct(url: string): Promise<NuvemshopProduct> {
  const proxyUrl = `/api/scrape?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("Nao foi possivel acessar a pagina do produto.");

  const html = await res.text();

  const jsonLd = parseJsonLd(html);
  if (jsonLd && jsonLd.title) return jsonLd;

  const og = parseOpenGraph(html);
  if (og && og.title) return og;

  throw new Error("Nao foi possivel extrair as informacoes do produto. Verifique se o link e de um produto Nuvemshop.");
}
