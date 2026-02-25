export function ProblemSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C2D] mb-8">
            ¿Te suena familiar?
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p className="italic border-l-4 border-[#C6A75E] pl-6 py-2">
              ¿Te ha pasado que sabes lo que quieres decir… pero no logras expresarlo con seguridad?
            </p>
            
            <p className="italic border-l-4 border-[#C6A75E] pl-6 py-2">
              ¿Sientes que podrías lograr más si dominaras tu comunicación?
            </p>
            
            <p className="italic border-l-4 border-[#C6A75E] pl-6 py-2">
              ¿Te autosaboteas sin darte cuenta?
            </p>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-2xl text-white">
            <p className="text-2xl md:text-3xl font-semibold mb-4">
              La PNL te enseña a entender cómo funciona tu mente…
            </p>
            <p className="text-xl text-[#C6A75E]">
              y cómo dirigirla a tu favor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}