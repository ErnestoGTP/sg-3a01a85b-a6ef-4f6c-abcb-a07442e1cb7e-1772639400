import { MessageCircle } from "lucide-react";
import { workshopConfig } from "@/config/workshop";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hola 👋 Quiero información del Taller Presencial de PNL Básica (2 horas)."
  );
  
  const whatsappUrl = `https://wa.me/${workshopConfig.contact.whatsapp.replace(/[\s\-\+\(\)]/g, "")}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white" />
      
      <span className="absolute right-full mr-4 bg-[#0B1C2D] text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        ¿Tienes dudas? Escríbenos
      </span>

      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </a>
  );
}