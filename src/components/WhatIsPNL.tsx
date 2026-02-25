import { Brain, Target, Lightbulb } from "lucide-react";

export function WhatIsPNL() {
  const features = [
    {
      icon: Brain,
      title: "Práctica inmediata",
      description: "No es teoría compleja. Son herramientas que aplicas desde el primer minuto."
    },
    {
      icon: Target,
      title: "Resultados reales",
      description: "Técnicas probadas que transforman tu forma de comunicarte y pensar."
    },
    {
      icon: Lightbulb,
      title: "Para la vida real",
      description: "Aplicable en tu trabajo, relaciones personales y desarrollo personal."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C2D] mb-6">
              ¿Qué es la PNL?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              La <strong>Programación Neurolingüística</strong> es un conjunto de técnicas prácticas que te permiten comprender cómo procesas información, cómo te comunicas y cómo puedes reprogramar patrones mentales que te limitan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-white rounded-xl border-2 border-[#C6A75E]/20 hover:border-[#C6A75E] transition-all duration-300 hover:shadow-lg hover:shadow-[#C6A75E]/10"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-[#C6A75E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1C2D] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}