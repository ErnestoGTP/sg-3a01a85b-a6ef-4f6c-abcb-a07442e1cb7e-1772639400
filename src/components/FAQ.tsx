import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "¿Necesito experiencia previa en PNL?",
      answer: "No, este taller está diseñado específicamente para principiantes. Comenzaremos desde cero y aprenderás de forma práctica y sencilla. No necesitas conocimientos previos de psicología ni PNL."
    },
    {
      question: "¿Es 100% presencial? ¿No hay opción online?",
      answer: "Sí, el taller es 100% presencial. La PNL se aprende mejor mediante práctica directa y ejercicios en vivo. La experiencia presencial te permite conectar con otros participantes, recibir feedback inmediato y practicar las técnicas en tiempo real."
    },
    {
      question: "¿Qué debo llevar al taller?",
      answer: "Solo necesitas traer una actitud abierta, cuaderno y bolígrafo para tomar notas. Todo el material didáctico será proporcionado durante el taller, incluyendo la plantilla PDF de regalo."
    },
    {
      question: "¿Puedo cancelar mi registro?",
      answer: "Sí, puedes cancelar hasta 48 horas antes del evento sin penalización. Para cancelaciones, simplemente contáctanos por WhatsApp o email. Si cancelas con menos de 48 horas de anticipación, no se realizarán reembolsos."
    },
    {
      question: "¿Realmente solo hay cupos limitados?",
      answer: "Sí, mantenemos grupos pequeños (máximo 25 personas) para garantizar atención personalizada y que todos puedan participar activamente en los ejercicios. Una vez que se llenen los cupos, tendrás que esperar a la próxima edición."
    },
    {
      question: "¿Recibiré algún certificado?",
      answer: "Este es un taller introductorio de 2 horas, por lo que no incluye certificación formal. Sin embargo, recibirás material de apoyo y herramientas prácticas que podrás aplicar inmediatamente."
    },
    {
      question: "¿Qué pasa si llego tarde?",
      answer: "Te recomendamos llegar 10 minutos antes para el registro. Si llegas con más de 15 minutos de retraso, es posible que no puedas ingresar ya que habremos iniciado con los ejercicios fundamentales del taller."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C2D] mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos tus dudas antes de registrarte
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#C6A75E]/50 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-[#0B1C2D] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-[#C6A75E] flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed border-t border-gray-200 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}