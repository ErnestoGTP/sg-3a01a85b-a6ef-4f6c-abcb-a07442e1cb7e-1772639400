import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { workshopConfig } from "@/config/workshop";

interface WorkshopDetailsProps {
  onCTAClick: () => void;
}

export function WorkshopDetails({ onCTAClick }: WorkshopDetailsProps) {
  const details = [
    {
      icon: Calendar,
      label: "Fecha",
      value: workshopConfig.event.date
    },
    {
      icon: Clock,
      label: "Duración",
      value: `${workshopConfig.event.duration} • ${workshopConfig.event.time}`
    },
    {
      icon: MapPin,
      label: "Ubicación",
      value: workshopConfig.event.location,
      subtitle: workshopConfig.event.address
    },
    {
      icon: DollarSign,
      label: "Inversión",
      value: workshopConfig.event.price
    },
    {
      icon: Users,
      label: "Cupos",
      value: `Solo ${workshopConfig.event.maxAttendees - workshopConfig.event.currentAttendees} lugares disponibles`,
      urgent: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0B1C2D] via-[#1a2f45] to-[#0B1C2D] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Detalles del Taller
            </h2>
            <p className="text-xl text-gray-300">
              Modalidad: <span className="text-[#C6A75E] font-semibold">100% Presencial</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    detail.urgent
                      ? "bg-[#C6A75E]/10 border-[#C6A75E] shadow-lg shadow-[#C6A75E]/20"
                      : "bg-white/5 border-white/10 hover:border-[#C6A75E]/50 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      detail.urgent ? "bg-[#C6A75E]" : "bg-white/10"
                    }`}>
                      <Icon className={`w-6 h-6 ${detail.urgent ? "text-[#0B1C2D]" : "text-[#C6A75E]"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">{detail.label}</p>
                      <p className={`font-semibold ${detail.urgent ? "text-[#C6A75E] text-lg" : "text-white"}`}>
                        {detail.value}
                      </p>
                      {detail.subtitle && (
                        <p className="text-sm text-gray-400 mt-1">{detail.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              onClick={onCTAClick}
              size="lg"
              className="bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg px-10 py-6 rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300 hover:scale-105"
            >
              Quiero asegurar mi lugar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}