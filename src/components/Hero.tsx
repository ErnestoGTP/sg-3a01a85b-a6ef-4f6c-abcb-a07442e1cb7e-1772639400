"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { workshopConfig as defaultConfig } from "@/config/workshop";
import { getFormattedDate } from "@/lib/dateHelpers";

interface HeroProps {
  onCTAClick: () => void;
  config?: typeof defaultConfig;
}

export function Hero({ onCTAClick, config = defaultConfig }: HeroProps) {
  // Safe data extraction with try/catch
  const safeTrainerName = config.trainer?.name || "Instructor certificado";
  const safeTrainerTitle = config.trainer?.title || "Especialista en PNL";

  const benefits = [
    "No necesitas experiencia previa",
    "100% práctico, cero teoría pesada",
    "Grupo reducido y cupos limitados"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1C2D] via-[#1a2f45] to-[#0B1C2D] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #C6A75E 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Habla con seguridad,{" "}
            <span className="text-[#C6A75E]">sin traicionarte</span>,{" "}
            en solo 2 horas
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Taller presencial de PNL con <span className="font-semibold text-white">Ramitap Training</span> y{" "}
            <span className="font-semibold text-[#C6A75E]">{config.trainer.name}</span>,{" "}
            {config.trainer.title}, para dejar de trabarte al hablar, expresar lo que realmente piensas
            y sentirte más seguro en conversaciones importantes.
          </p>

          {/* Trainer Credit */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base text-[#C6A75E]/90 mb-8 italic"
          >
            Facilitado por {config.trainer.name}, {config.trainer.title}
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-[#C6A75E] flex-shrink-0" />
                <span className="text-sm md:text-base">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-6"
          >
            <Button
              onClick={onCTAClick}
              size="lg"
              className="bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg px-10 py-7 rounded-full shadow-2xl shadow-[#C6A75E]/40 hover:shadow-[#C6A75E]/60 transition-all duration-300 hover:scale-105"
            >
              Reservar mi lugar
            </Button>
          </motion.div>

          {/* Micro-text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-sm text-gray-400 max-w-2xl mx-auto"
          >
            Al confirmar tu asistencia, recibirás por correo la ubicación exacta en Hermosillo y las condiciones del taller.
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}