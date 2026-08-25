/**
 * Configurações da loja. Troque o número do WhatsApp pelo número real
 * (formato internacional, só dígitos: 55 + DDD + número).
 */
export const SITE = {
  name: "Glow Up Store",
  tagline: "Beleza & Autocuidado",
  whatsappNumber: "5511984217545",
  email: "mattheus.belmiro@gmail.com",
  instagram: "glow_wupstore",
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ?? "Oi! Vim pelo site da Glow Up Store e quero saber mais sobre os produtos ✨",
  );
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}

export const CATEGORIES = [
  { label: "Saude", query: "saude", description: "Bem-estar e saude" },
  { label: "Produtos De Cabelo", query: "cabelo", description: "Forca & brilho" },
  { label: "Maquiagens", query: "maquiagem", description: "Alta cobertura" },
  { label: "Beleza", query: "beleza", description: "Produtos de beleza" },
  { label: "Cuidados", query: "cuidados", description: "Cuidados diarios" },
];
