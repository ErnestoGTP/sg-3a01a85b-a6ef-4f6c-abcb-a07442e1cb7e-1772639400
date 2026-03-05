import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "¿Necesito experiencia previa en PNL?",
      answer: "No, absolutamente ninguna. Este taller está diseñado para principiantes. Te explicaremos todo desde cero con un lenguaje claro y práctico."
    },
    {
      question: "¿Es 100% presencial o hay parte online?",
      answer: "Es completamente presencial. La PNL se aprende mejor practicando en vivo, con ejercicios guiados y retroalimentación inmediata del facilitador."
    },
    {
      question: "¿Qué debo llevar al taller?",
      answer: "Solo necesitas traer una libreta y bolígrafo para tomar notas. Nosotros proporcionamos todo el material de trabajo y los ejercicios guiados."
    },
    {
      question: "¿Puedo cancelar mi registro?",
      answer: "Sí, puedes cancelar hasta 48 horas antes del evento para recibir un reembolso completo. Si surge algo de último momento, también ofrecemos la opción de transferir tu lugar a otra fecha."
    },
    {
      question: "¿Por qué hay cupos limitados?",
      answer: "Limitamos el número de participantes a 7 personas para garantizar atención personalizada, resolver dudas específicas y asegurar que todos tengan espacio para practicar los ejercicios cómodamente."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-600">
                Todo lo que necesitas saber antes de registrarte
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-[#C6A75E]/30 transition-colors">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-lg text-[#0B1C2D] pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#C6A75E] flex-shrink-0 transition-transform duration-300 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}