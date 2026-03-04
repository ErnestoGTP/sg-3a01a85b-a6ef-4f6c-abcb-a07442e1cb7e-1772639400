import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const message = encodeURIComponent("¿Dudas sobre el taller?");
  const phoneNumber = "5216626516705";
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={24} className="fill-white" />
      <span className="font-medium hidden md:inline-block">¿Dudas sobre el taller?</span>
      <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
    </a>
  );
}