import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { workshopConfig } from "@/config/workshop";

export function WorkshopDetails() {
  const scrollToForm = () => {
    const formElement = document.getElementById("registro");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-4">
            Detalles del Evento
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas saber para tu transformación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Date */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#C6A75E]/20 hover:border-[#C6A75E] transition-colors group">
            <div className="w-12 h-12 rounded-full bg-[#0B1C2D]/5 flex items-center justify-center mb-4 group-hover:bg-[#C6A75E]/10 transition-colors">
              <Calendar className="text-[#0B1C2D] group-hover:text-[#C6A75E] transition-colors" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-[#0B1C2D] mb-2">Fecha</h3>
            <p className="text-gray-600">{workshopConfig.event.date}</p>
          </div>

          {/* Time */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#C6A75E]/20 hover:border-[#C6A75E] transition-colors group">
            <div className="w-12 h-12 rounded-full bg-[#0B1C2D]/5 flex items-center justify-center mb-4 group-hover:bg-[#C6A75E]/10 transition-colors">
              <Clock className="text-[#0B1C2D] group-hover:text-[#C6A75E] transition-colors" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-[#0B1C2D] mb-2">Horario</h3>
            <p className="text-gray-600">{workshopConfig.event.time}</p>
            <p className="text-sm text-gray-400 mt-1">{workshopConfig.event.duration}</p>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#C6A75E]/20 hover:border-[#C6A75E] transition-colors group">
            <div className="w-12 h-12 rounded-full bg-[#0B1C2D]/5 flex items-center justify-center mb-4 group-hover:bg-[#C6A75E]/10 transition-colors">
              <MapPin className="text-[#0B1C2D] group-hover:text-[#C6A75E] transition-colors" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-[#0B1C2D] mb-2">Ubicación</h3>
            <p className="text-gray-600 font-medium">{workshopConfig.location.name}</p>
            <p className="text-sm text-gray-500 mt-1">{workshopConfig.location.address}</p>
          </div>

          {/* Investment */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#C6A75E]/20 hover:border-[#C6A75E] transition-colors group">
            <div className="w-12 h-12 rounded-full bg-[#0B1C2D]/5 flex items-center justify-center mb-4 group-hover:bg-[#C6A75E]/10 transition-colors">
              <DollarSign className="text-[#0B1C2D] group-hover:text-[#C6A75E] transition-colors" size={24} />
            </div>
            <h3 className="font-semibold text-lg text-[#0B1C2D] mb-2">Inversión</h3>
            <p className="text-2xl font-bold text-[#C6A75E]">{workshopConfig.pricing.price}</p>
            {workshopConfig.capacity.showSeatsRemaining && (
              <div className="flex items-center gap-1 mt-2 text-xs text-red-500 font-medium">
                <Users size={12} />
                <span>¡Cupos limitados!</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={scrollToForm}
            className="bg-[#C6A75E] hover:bg-[#B8965A] text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Quiero asegurar mi lugar
          </Button>
        </div>
      </div>
    </section>
  );
}