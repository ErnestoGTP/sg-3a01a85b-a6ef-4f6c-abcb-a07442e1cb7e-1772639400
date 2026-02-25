import { Gift, Shield } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function BonusGuarantee() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bonus */}
              <AnimatedSection delay={0.1}>
                <div className="group bg-white p-8 rounded-2xl border-2 border-[#C6A75E]/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#C6A75E] to-[#d4b76f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1C2D] mb-4">
                    🎁 Bonus Exclusivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Recibirás una <span className="font-semibold text-[#C6A75E]">Plantilla PDF descargable</span>:
                  </p>
                  <div className="bg-[#C6A75E]/10 p-4 rounded-lg border-l-4 border-[#C6A75E]">
                    <p className="font-bold text-[#0B1C2D]">"Reencuadre en 3 pasos"</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Guía práctica para transformar creencias limitantes en potenciadoras
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Guarantee */}
              <AnimatedSection delay={0.2}>
                <div className="group bg-white p-8 rounded-2xl border-2 border-[#0B1C2D]/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 text-[#C6A75E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1C2D] mb-4">
                    ✅ Garantía Suave
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Queremos que te sientas 100% seguro de tu decisión:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#0B1C2D]">
                    <p className="text-gray-700">
                      Si en los <span className="font-bold text-[#0B1C2D]">primeros 15 minutos</span> sientes que este taller no es para ti, puedes retirarte sin compromiso.
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 italic">
                    Confiamos en la calidad de nuestro contenido
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}