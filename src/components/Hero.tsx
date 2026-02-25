import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1C2D] via-[#1a2f45] to-[#0B1C2D] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C6A75E] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C6A75E] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A75E]/10 border border-[#C6A75E]/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A75E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A75E]"></span>
            </span>
            <span className="text-[#C6A75E] text-sm font-medium">Cupos Limitados • Solo 7 plazas disponibles</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Descubre el Poder de tu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C6A75E] to-[#d4b76f]">
              Mente en Solo 2 Horas
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Taller presencial práctico de Programación Neurolingüística para transformar tu comunicación, seguridad y resultados personales.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              "Sin experiencia previa",
              "100% práctico",
              "Cupos limitados"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#C6A75E]" />
                <span className="text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              onClick={onCTAClick}
              size="lg"
              className="bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300 hover:scale-105"
            >
              Reservar mi lugar
            </Button>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Recibirás un correo con condiciones y ubicación exacta
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}