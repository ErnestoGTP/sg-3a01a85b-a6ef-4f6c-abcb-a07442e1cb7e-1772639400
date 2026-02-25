"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { workshopConfig } from "@/config/workshop";
import { LegalModal } from "@/components/LegalModal";
import { privacyPolicyContent, termsConditionsContent, refundPolicyContent } from "@/lib/legalContent";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos")
});

type FormData = z.infer<typeof formSchema>;
type LegalSection = "privacy" | "terms" | "refund" | null;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<LegalSection>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const openLegalModal = (section: LegalSection) => {
    setOpenModal(section);
  };

  const closeLegalModal = () => {
    setOpenModal(null);
  };

  const legalLinks = [
    { id: "privacy" as LegalSection, label: "Aviso de Privacidad", title: "Aviso de Privacidad", content: privacyPolicyContent },
    { id: "terms" as LegalSection, label: "Términos y Condiciones", title: "Términos y Condiciones", content: termsConditionsContent },
    { id: "refund" as LegalSection, label: "Política de Reembolso", title: "Política de Reembolso", content: refundPolicyContent }
  ];

  const currentModal = legalLinks.find(link => link.id === openModal);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al procesar el registro");
      }

      setIsSuccess(true);
      reset();

      setTimeout(() => {
        const successElement = document.getElementById("success-message");
        if (successElement) {
          successElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="registro" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              {!isSuccess ? (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-4">
                      Reserva tu lugar ahora
                    </h2>
                    <p className="text-lg text-gray-600">
                      Completa el formulario y recibirás un correo de confirmación con todos los detalles
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-[#C6A75E]/30 shadow-xl p-8 md:p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <Label htmlFor="name" className="text-[#0B1C2D] font-semibold mb-2 block">
                          Nombre completo *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre completo"
                          {...register("name")}
                          className={`h-12 border-2 ${
                            errors.name ? "border-red-500" : "border-gray-200 focus:border-[#C6A75E]"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <Label htmlFor="email" className="text-[#0B1C2D] font-semibold mb-2 block">
                          Correo electrónico *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          {...register("email")}
                          className={`h-12 border-2 ${
                            errors.email ? "border-red-500" : "border-gray-200 focus:border-[#C6A75E]"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div>
                        <Label htmlFor="phone" className="text-[#0B1C2D] font-semibold mb-2 block">
                          Teléfono / WhatsApp *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+52 662 123 4567"
                          {...register("phone")}
                          className={`h-12 border-2 ${
                            errors.phone ? "border-red-500" : "border-gray-200 focus:border-[#C6A75E]"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300 hover:scale-105"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          "Confirmar mi asistencia"
                        )}
                      </Button>

                      {/* Legal Text with Modal Links */}
                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Al registrarte, aceptas nuestro{" "}
                          <button
                            type="button"
                            onClick={() => openLegalModal("privacy")}
                            className="text-[#C6A75E] hover:text-[#d4b76f] underline underline-offset-2 font-medium transition-colors"
                          >
                            Aviso de Privacidad
                          </button>
                          ,{" "}
                          <button
                            type="button"
                            onClick={() => openLegalModal("terms")}
                            className="text-[#C6A75E] hover:text-[#d4b76f] underline underline-offset-2 font-medium transition-colors"
                          >
                            Términos y Condiciones
                          </button>
                          {" "}y{" "}
                          <button
                            type="button"
                            onClick={() => openLegalModal("refund")}
                            className="text-[#C6A75E] hover:text-[#d4b76f] underline underline-offset-2 font-medium transition-colors"
                          >
                            Política de Reembolso
                          </button>
                          .
                        </p>
                      </div>
                    </form>

                    {/* Info Box */}
                    <div className="mt-8 p-4 bg-[#C6A75E]/10 rounded-lg border-l-4 border-[#C6A75E]">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-[#0B1C2D]">Inversión:</span> {workshopConfig.pricing.price}
                        <br />
                        <span className="font-semibold text-[#0B1C2D]">Ubicación:</span> {workshopConfig.location.city} - Ubicación exacta por confirmar vía correo
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div id="success-message" className="bg-white rounded-2xl border-2 border-green-500/30 shadow-xl p-8 md:p-10 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0B1C2D] mb-4">
                    ¡Registro exitoso!
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Hemos enviado un correo de confirmación a tu email con todos los detalles del taller, incluyendo:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Fecha y horario exactos</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Ubicación en Hermosillo</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Instrucciones de pago</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Política de cancelación</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mb-6">
                    Si no ves el correo en tu bandeja de entrada, revisa tu carpeta de spam o correo no deseado.
                  </p>
                  <div className="bg-[#C6A75E]/10 p-4 rounded-lg border-l-4 border-[#C6A75E]">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-[#0B1C2D]">¿Tienes dudas?</span>
                      <br />
                      Contáctanos por WhatsApp: {workshopConfig.contact.whatsappNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Legal Modal */}
      {currentModal && (
        <LegalModal
          isOpen={openModal !== null}
          onClose={closeLegalModal}
          title={currentModal.title}
          content={currentModal.content}
        />
      )}
    </>
  );
}