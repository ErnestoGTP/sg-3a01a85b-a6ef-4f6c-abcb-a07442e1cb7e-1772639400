import { Award, Target, Heart } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function TrainerSection() {
  const highlights = [
    {
      icon: Award,
      title: "Programador Certificado",
      description: "Especialista en PNL y Semántica aplicada"
    },
    {
      icon: Target,
      title: "Enfoque Práctico",
      description: "Herramientas simples para usar al día siguiente"
    },
    {
      icon: Heart,
      title: "Estilo Cercano",
      description: "Ambiente seguro, respetuoso y directo"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#0B1C2D] mb-4">
                Conoce a tu entrenador
              </h2>
              <p className="text-xl text-gray-600">
                Aprende con quien practica lo que enseña
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Trainer Image */}
              <AnimatedSection delay={0.2}>
                <div className="relative">
                  <div className="aspect-square rounded-2xl overflow-hidden border-4 border-[#C6A75E]/30 shadow-2xl">
                    <img
                      src="/presenter.jpg"
                      alt="Ernesto Ramírez - Instructor Certificado en PNL"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative Element */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C6A75E]/10 rounded-full blur-3xl"></div>
                </div>
              </AnimatedSection>

              {/* Trainer Info */}
              <AnimatedSection delay={0.3}>
                <div className="space-y-6">
                  {/* Name & Title */}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-2">
                      Ernesto Ramírez
                    </h3>
                    <p className="text-xl text-[#C6A75E] font-semibold">
                      Programador Neuro Lingüístico y Semántico
                    </p>
                  </div>

                  {/* Bio & Info */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-4">
                        Conoce a tu facilitador
                      </h2>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Ernesto Ramírez es Programador Neuro Lingüístico y Semántico, instructor certificado en el Estándar de Competencia <span className="font-semibold text-[#0B1C2D]">EC0217.01 "Impartición de cursos de formación del capital humano de manera presencial grupal"</span>, avalado por SEP–CONOCER, lo que respalda la calidad y estructura de cada uno de sus talleres.
                      </p>
                    </div>

                    {/* Certification Badge */}
                    <div className="bg-gradient-to-br from-[#C6A75E]/10 to-transparent border-2 border-[#C6A75E]/30 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-lg flex items-center justify-center">
                          <svg className="w-10 h-10 text-[#C6A75E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-[#0B1C2D] text-sm md:text-base">
                            Instructor certificado EC0217.01 – SEP–CONOCER
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Folio CONOCER: <span className="font-semibold text-[#0B1C2D]">D-0000928026</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Approach & Style */}
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p className="font-medium text-[#0B1C2D]">Enfoque práctico y cercano</p>
                      <p className="italic text-gray-600 border-l-4 border-[#C6A75E] pl-4 py-2 bg-[#C6A75E]/5">
                        "Entendiendo y aplicando la Semántica y el PNL en la vida cotidiana"
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                      {highlights.map((highlight, index) => {
                        const Icon = highlight.icon;
                        return (
                          <div key={index} className="text-center p-4 bg-white rounded-xl border border-[#C6A75E]/20 hover:border-[#C6A75E]/50 transition-colors">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-full flex items-center justify-center mx-auto mb-3">
                              <Icon className="w-6 h-6 text-[#C6A75E]" />
                            </div>
                            <p className="font-bold text-[#0B1C2D] text-sm mb-1">{highlight.title}</p>
                            <p className="text-xs text-gray-600">{highlight.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}