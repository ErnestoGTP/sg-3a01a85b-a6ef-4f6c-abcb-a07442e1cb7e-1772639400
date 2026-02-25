import { Star, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export function Testimonials() {
  const testimonials = [
    {
      name: "Ana L.",
      role: "Profesional de Marketing",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
      rating: 5,
      text: "Antes me trababa al hablar en juntas importantes. Después del taller con Ramitap Training, aprendí técnicas simples que me ayudan a expresarme con más claridad y sin nervios. Lo mejor: el ambiente fue muy seguro y cercano."
    },
    {
      name: "Carlos M.",
      role: "Emprendedor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      rating: 5,
      text: "Increíble cómo en solo 2 horas pude identificar patrones mentales que me estaban saboteando. Las técnicas son prácticas y las apliqué de inmediato. Ahora me siento más seguro al comunicarme con clientes y mi equipo."
    },
    {
      name: "Laura S.",
      role: "Docente",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      rating: 5,
      text: "Pensé que la PNL era compleja, pero el taller de Ramitap Training lo hizo súper accesible. Aprendí a manejar mejor la ansiedad al hablar en público y a confiar más en lo que tengo que decir. ¡100% recomendado!"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#0B1C2D] mb-4">
                Lo que dicen nuestros participantes
              </h2>
              <p className="text-xl text-gray-600">
                Historias reales de transformación en solo 2 horas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#C6A75E]/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="w-16 h-16 text-[#C6A75E]" />
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#C6A75E]/30 group-hover:border-[#C6A75E] transition-colors"
                      />
                      <div>
                        <p className="font-bold text-[#0B1C2D] text-lg">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#C6A75E] text-[#C6A75E]" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 leading-relaxed relative z-10">
                      "{testimonial.text}"
                    </p>
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