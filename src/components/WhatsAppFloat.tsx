import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-whatsapp-foreground shadow-luxe transition-transform hover:scale-105 md:px-5"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm font-medium md:inline">Falar no WhatsApp</span>
    </a>
  );
}
