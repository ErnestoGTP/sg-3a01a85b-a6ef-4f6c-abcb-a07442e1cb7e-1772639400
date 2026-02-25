import { AnimatedSection } from "@/components/AnimatedSection";

export function ProblemSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-6">
                ¿Te suena familiar?
              </h2>
            </div>

            <div className="space-y-6">
              <AnimatedSection delay={0.1}>
                <div className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-[#C6A75E] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="text-[#C6A75E] font-semibold">¿Te ha pasado que sabes lo que quieres decir…</span> pero no logras expresarlo con seguridad?
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-[#C6A75E] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="text-[#C6A75E] font-semibold">¿Sientes que podrías lograr más</span> si dominaras tu comunicación?
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-[#C6A75E] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="text-[#C6A75E] font-semibold">¿Te autosaboteas sin darte cuenta?</span>
                  </p>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.4}>
              <div className="mt-12 text-center bg-gradient-to-r from-[#0B1C2D] to-[#1a2f45] text-white p-8 rounded-2xl shadow-lg">
                <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                  La PNL te enseña a entender cómo funciona tu mente…<br />
                  <span className="text-[#C6A75E]">y cómo dirigirla a tu favor.</span>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}