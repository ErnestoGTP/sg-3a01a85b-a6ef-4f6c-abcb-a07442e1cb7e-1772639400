"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, MapPin, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { SEO } from "@/components/SEO";
import { workshopConfig } from "@/config/workshop";

export default function ThankYouPage() {
  const router = useRouter();
  const { name } = router.query;

  useEffect(() => {
    // Fire Meta Pixel CompleteRegistration event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "CompleteRegistration", {
        content_name: "Taller PNL Básica",
        value: 800,
        currency: "MXN"
      });
    }

    // Fire Google Analytics event (GTM)
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "lead",
        event_category: "registration",
        event_label: "workshop_registration",
        value: 800
      });
    }
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hola, soy ${name || "un nuevo participante"}, acabo de registrarme al Taller de PNL y aquí está mi comprobante de pago.`
  );
  const whatsappLink = `https://wa.me/${workshopConfig.contact.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <SEO
        title="¡Registro Exitoso! - Taller PNL Básica"
        description="Tu registro ha sido confirmado. Revisa tu email para instrucciones de pago."
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] via-[#1a3a52] to-[#0B1C2D] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Logo variant="light" size="lg" />
          </div>

          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-[#C6A75E]/20 rounded-2xl p-8 md:p-12 shadow-2xl">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-[#C6A75E]/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-[#C6A75E]" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¡Excelente decisión{name ? `, ${name}` : ""}!
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Tu registro ha sido confirmado exitosamente
              </p>
            </motion.div>

            {/* Workshop Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#C6A75E]/10 to-[#C6A75E]/5 rounded-xl p-6 mb-8 border border-[#C6A75E]/20"
            >
              <h3 className="text-lg font-bold text-[#C6A75E] mb-4">Detalles del Taller:</h3>
              <div className="space-y-3 text-white">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#C6A75E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Fecha</p>
                    <p className="text-gray-300">{workshopConfig.event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C6A75E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Hora</p>
                    <p className="text-gray-300">{workshopConfig.event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C6A75E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Ubicación</p>
                    <p className="text-gray-300">{workshopConfig.location.city}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      La ubicación exacta se enviará por correo después de confirmar el pago
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-bold text-blue-300 mb-3">📧 Revisa tu correo</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Te hemos enviado un email con:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] font-bold">•</span>
                  Boleto QR para acceso al taller
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] font-bold">•</span>
                  Datos bancarios para confirmar tu pago
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] font-bold">•</span>
                  Instrucciones completas del evento
                </li>
              </ul>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Enviar Comprobante por WhatsApp
                </Button>
              </a>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full h-12 border-[#C6A75E]/30 text-[#C6A75E] hover:bg-[#C6A75E]/10 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-gray-400 text-sm mt-8"
          >
            ¿No recibiste el correo? Revisa tu carpeta de spam o contacta por WhatsApp
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}