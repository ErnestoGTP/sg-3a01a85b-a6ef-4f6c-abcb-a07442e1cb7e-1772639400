import { Check } from "lucide-react";

export function WhatYouWillLearn() {
  const learnings = [
    "Detectar patrones mentales limitantes que te frenan",
    "Técnicas básicas de reprogramación mental",
    "Comunicación más segura y efectiva",
    "Ejercicio guiado práctico paso a paso",
    "Método simple para aplicar después del taller"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C2D] mb-6">
              Lo que aprenderás en 2 horas
            </h2>
            <p className="text-xl text-gray-600">
              Un taller intensivo, práctico y transformador
            </p>
          </div>

          <div className="grid gap-6">
            {learnings.map((learning, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border-l-4 border-[#C6A75E] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#C6A75E] rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#0B1C2D]" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed flex-1">
                  {learning}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-[#C6A75E]/10 to-[#C6A75E]/5 rounded-2xl border-2 border-[#C6A75E]/30">
            <p className="text-xl text-center text-[#0B1C2D] font-semibold">
              🎯 Al finalizar, tendrás herramientas concretas que podrás usar inmediatamente en tu día a día
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}