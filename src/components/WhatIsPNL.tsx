import { Brain, Target, Lightbulb } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function WhatIsPNL() {
  const features = [
    {
      icon: Brain,
      title: "No es teoría compleja",
      description: "Técnicas prácticas y aplicables desde el primer día"
    },
    {
      icon: Target,
      title: "Es práctica inmediata",
      description: "Ejercicios guiados que implementas en el momento"
    },
    {
      icon: Lightbulb,
      title: "Se aplica en vida real",
      description: "Herramientas que usarás en tu día a día"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#0B1C2D] mb-4">
                ¿Qué es la PNL?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                <span className="font-semibold text-[#C6A75E]">Programación Neurolingüística</span> es el estudio de cómo tu lenguaje y patrones mentales afectan tu realidad. En este taller aprenderás a reprogramar tu mente para lograr mejores resultados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <AnimatedSection key={index} delay={index * 0.1}>
                    <div className="group bg-white p-8 rounded-2xl border-2 border-[#C6A75E]/20 hover:border-[#C6A75E] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-[#C6A75E]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0B1C2D] mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}