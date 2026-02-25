"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
}

export function Hero({ onCTAClick }: HeroProps) {
  /* 
  VARIACIÓN 1 (ACTUAL): Enfoque comunicación
  Título: "Habla con seguridad, sin traicionarte, en solo 2 horas"
  
  VARIACIÓN 2 (COMENTADA): Enfoque transformación
  Título: "Reprograma tu mente en 2 horas y toma el control"
  Subtítulo: Taller presencial de PNL con Ramitap Training para detectar patrones que te limitan, 
  aprender técnicas de reprogramación mental y empezar a tomar decisiones más alineadas contigo.
  
  VARIACIÓN 3 (COMENTADA): Enfoque resultados
  Título: "Deja de sabotearte y empieza a actuar con claridad"
  Subtítulo: Taller presencial de PNL con Ramitap Training para reconocer tus bloqueos mentales, 
  eliminar el autosabotaje y recuperar la confianza para comunicarte y decidir sin miedo.
  */

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1C2D] via-[#1a2f45] to-[#0B1C2D] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 left-10 w-72 h-72 bg-[#C6A75E] rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#C6A75E] rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A75E]/10 border border-[#C6A75E]/30 rounded-full mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A75E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A75E]"></span>
            </span>
            <span className="text-[#C6A75E] text-sm font-medium">Cupos Limitados • Máximo 15 personas</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Habla con seguridad,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C6A75E] to-[#d4b76f]">
              sin traicionarte, en solo 2 horas
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Taller presencial de PNL con <span className="text-[#C6A75E] font-semibold">Ramitap Training</span> para dejar de trabarte al hablar, expresar lo que realmente piensas y sentirte más seguro en conversaciones importantes, sin perder tu autenticidad.
          </motion.p>

          {/* Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            {[
              "No necesitas experiencia previa",
              "100% práctico, cero teoría pesada",
              "Grupo reducido y cupos limitados"
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-[#C6A75E]" />
                <span className="text-gray-200">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="space-y-4"
          >
            <Button
              onClick={onCTAClick}
              size="lg"
              className="bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300 hover:scale-105"
            >
              Reservar mi lugar
            </Button>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Al confirmar tu asistencia, recibirás por correo la ubicación exacta en Hermosillo y las condiciones del taller
            </p>
          </motion.div>
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