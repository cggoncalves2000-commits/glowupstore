/**
 * Configurações da loja. Troque o número do WhatsApp pelo número real
 * (formato internacional, só dígitos: 55 + DDD + número).
 */
export const SITE = {
  name: "Glow Up Store",
  tagline: "Beleza & Autocuidado",
  whatsappNumber: "5511999999999",
  email: "contato@glowupstore.com",
  instagram: "@glowupstore",
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ?? "Oi! Vim pelo site da Glow Up Store e quero saber mais sobre os produtos ✨",
  );
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}

export const CATEGORIES = [
  { label: "Skincare", query: "skincare", description: "Rotina de pele" },
  { label: "Cabelos", query: "cabelo", description: "Força & brilho" },
  { label: "Corpo", query: "corpo", description: "Hidratação diária" },
  { label: "Maquiagem", query: "maquiagem", description: "Alta cobertura" },
  { label: "Perfumaria", query: "perfume", description: "Assinatura olfativa" },
];
