import { Check } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function WhatYouWillLearn() {
  const learningPoints = [
    "Detectar patrones mentales limitantes que te detienen",
    "Técnicas básicas de reprogramación mental efectiva",
    "Comunicación más segura y convincente",
    "Ejercicio guiado práctico con feedback inmediato",
    "Método simple para aplicar PNL después del taller"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-[#0B1C2D] mb-4">
                Lo que aprenderás en 2 horas
              </h2>
              <p className="text-xl text-gray-600">
                Contenido práctico que aplicarás desde el primer día
              </p>
            </div>

            <div className="space-y-4">
              {learningPoints.map((point, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="group flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-transparent hover:border-[#C6A75E]/30 transition-all duration-300 hover:shadow-md">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C6A75E] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">{point}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.6}>
              <div className="mt-12 text-center bg-gradient-to-br from-[#C6A75E]/10 to-transparent border-2 border-[#C6A75E]/30 rounded-2xl p-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-bold text-[#0B1C2D]">Todo en formato práctico.</span> No teoría aburrida. 
                  <span className="text-[#C6A75E] font-semibold"> Herramientas que usarás en tu día a día.</span>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}