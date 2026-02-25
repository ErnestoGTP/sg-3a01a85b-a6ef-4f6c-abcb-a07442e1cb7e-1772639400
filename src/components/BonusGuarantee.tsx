import { Gift, Shield } from "lucide-react";

export function BonusGuarantee() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Bonus */}
          <div className="p-8 bg-white rounded-2xl border-2 border-[#C6A75E]/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#C6A75E] to-[#d4b76f] rounded-full flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-[#0B1C2D]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0B1C2D] mb-4">
              🎁 Bonus Exclusivo
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Al registrarte, recibirás gratis nuestra plantilla PDF:
            </p>
            <div className="p-4 bg-[#C6A75E]/10 rounded-lg border border-[#C6A75E]/30">
              <p className="font-semibold text-[#0B1C2D]">
                "Reencuadre en 3 Pasos"
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Una guía práctica para transformar pensamientos limitantes en recursos poderosos
              </p>
            </div>
          </div>

          {/* Guarantee */}
          <div className="p-8 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-2xl border-2 border-[#C6A75E]/30 shadow-lg text-white">
            <div className="w-16 h-16 bg-[#C6A75E] rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-[#0B1C2D]" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              🛡️ Garantía de Satisfacción
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Estamos tan seguros del valor que recibirás que:
            </p>
            <div className="p-4 bg-white/10 rounded-lg border border-[#C6A75E]/30">
              <p className="font-semibold text-[#C6A75E]">
                Si en los primeros 15 minutos sientes que no es para ti, puedes retirarte.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Sin preguntas, sin compromiso
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}