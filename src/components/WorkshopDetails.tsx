import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, DollarSign, Award } from "lucide-react";
import { workshopConfig as defaultConfig } from "@/config/workshop";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getFormattedDate, getFormattedTime, getFormattedPrice, getFormattedLocation } from "@/lib/dateHelpers";

interface WorkshopDetailsProps {
  onCTAClick: () => void;
  config?: typeof defaultConfig;
}

export function WorkshopDetails({ onCTAClick, config = defaultConfig }: WorkshopDetailsProps) {
  // Safe data extraction with fallbacks
  const safeConfig = {
    date: getFormattedDate(config.event?.date),
    time: getFormattedTime(config.event?.time),
    location: getFormattedLocation(config.location?.name),
    locationNote: config.location?.note || "",
    price: getFormattedPrice(config.pricing?.price),
    maxSeats: config.event?.maxSeats || 15,
    modality: config.event?.modality || "Presencial",
    duration: config.event?.duration || "2 horas"
  };

  const handleCTAClick = () => {
    // Smooth scroll to registration form
    const registrationSection = document.getElementById("registro");
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Call parent callback
    onCTAClick();
  };

  const details = [
    {
      icon: Award,
      label: "Modalidad",
      value: safeConfig.modality
    },
    {
      icon: Clock,
      label: "Duración",
      value: safeConfig.duration
    },
    {
      icon: Calendar,
      label: "Fecha",
      value: safeConfig.date
    },
    {
      icon: Clock,
      label: "Hora",
      value: safeConfig.time
    },
    {
      icon: MapPin,
      label: "Ubicación",
      value: safeConfig.location,
      note: safeConfig.locationNote
    },
    {
      icon: DollarSign,
      label: "Inversión",
      value: safeConfig.price,
      highlight: true
    },
    {
      icon: Users,
      label: "Cupos",
      value: `Máximo ${safeConfig.maxSeats} personas`,
      highlight: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#0B1C2D] mb-4">
                Detalles del Taller
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Todo lo que necesitas saber para asegurar tu lugar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {details.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <AnimatedSection key={index} delay={index * 0.1}>
                    <div className={`
                      group bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-2
                      ${detail.highlight 
                        ? "border-[#C6A75E] shadow-lg shadow-[#C6A75E]/20 hover:shadow-xl hover:shadow-[#C6A75E]/30" 
                        : "border-gray-200 hover:border-[#C6A75E]/50 shadow-sm hover:shadow-md"
                      }
                    `}>
                      <div className="flex items-start gap-4">
                        <div className={`
                          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                          ${detail.highlight 
                            ? "bg-gradient-to-br from-[#C6A75E] to-[#d4b76f]" 
                            : "bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45]"
                          }
                          group-hover:scale-110 transition-transform
                        `}>
                          <Icon className={`w-6 h-6 ${detail.highlight ? "text-white" : "text-[#C6A75E]"}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600 mb-1">{detail.label}</p>
                          <p className={`font-bold ${detail.highlight ? "text-[#C6A75E] text-lg" : "text-[#0B1C2D]"}`}>
                            {detail.value}
                          </p>
                          {detail.note && (
                            <p className="text-xs text-gray-500 mt-2 italic">{detail.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            <AnimatedSection delay={0.8}>
              <div className="text-center bg-gradient-to-r from-[#0B1C2D] to-[#1a2f45] rounded-2xl p-8 shadow-xl">
                <p className="text-white text-lg mb-6">
                  <span className="font-bold text-[#C6A75E]">Inversión única:</span> {safeConfig.price} — Pago completo
                </p>
                <Button
                  onClick={handleCTAClick}
                  size="lg"
                  className="bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300 hover:scale-105"
                >
                  Quiero asegurar mi lugar
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}