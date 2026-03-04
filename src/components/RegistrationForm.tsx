"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, CreditCard, Copy, Check } from "lucide-react";
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
  const [registeredName, setRegisteredName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<LegalSection>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("📤 Sending registration:", data);
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      console.log("📥 Response status:", response.status);
      const result = await response.json();
      console.log("📥 Response data:", result);

      // CRITICAL: Always transition to payment screen on 200 status
      if (response.status === 200) {
        console.log("✅ Registration successful, showing payment screen");
        setRegisteredName(data.name);
        setIsSuccess(true);
        reset();

        // Scroll to payment instructions
        setTimeout(() => {
          const paymentInstructions = document.getElementById("payment-instructions");
          if (paymentInstructions) {
            paymentInstructions.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      } else {
        // Only show error for non-200 responses (validation errors)
        throw new Error(result.error || "Error al procesar el registro");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err instanceof Error ? err.message : "Error al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hola, soy ${registeredName}, acabo de registrarme al Taller de PNL y aquí está mi comprobante de pago.`
  );
  const whatsappLink = `https://wa.me/${workshopConfig.contact.whatsappNumber}?text=${whatsappMessage}`;

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
                <div id="payment-instructions" className="bg-white rounded-2xl border-2 border-[#C6A75E]/30 shadow-xl p-8 md:p-10">
                  {/* Success Header */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#C6A75E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-[#C6A75E]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#0B1C2D] mb-3">
                      ¡Excelente decisión, {registeredName}!
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Tu registro está pre-aprobado. Para asegurar definitivamente tu lugar y recibir la ubicación exacta, realiza tu inversión de <span className="font-bold text-[#C6A75E]">{workshopConfig.pricing.price}</span>.
                    </p>
                  </div>

                  {/* Payment Instructions Card */}
                  <div className="bg-gradient-to-br from-[#0B1C2D] to-[#1a2f45] rounded-xl p-6 mb-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-[#C6A75E]" />
                      <h4 className="text-xl font-bold">Datos Bancarios</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Bank */}
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-sm text-gray-300 mb-1">Banco</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold">{workshopConfig.payment.bank}</p>
                          <button
                            onClick={() => copyToClipboard(workshopConfig.payment.bank, "bank")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Copiar banco"
                          >
                            {copiedField === "bank" ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-sm text-gray-300 mb-1">Cuenta/Tarjeta</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold font-mono">{workshopConfig.payment.account}</p>
                          <button
                            onClick={() => copyToClipboard(workshopConfig.payment.account, "account")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Copiar número de cuenta"
                          >
                            {copiedField === "account" ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Account Holder */}
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-sm text-gray-300 mb-1">Titular</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold">{workshopConfig.payment.accountHolder}</p>
                          <button
                            onClick={() => copyToClipboard(workshopConfig.payment.accountHolder, "holder")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Copiar nombre del titular"
                          >
                            {copiedField === "holder" ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Concept */}
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                        <p className="text-sm text-gray-300 mb-1">Concepto</p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold">{workshopConfig.payment.concept}</p>
                          <button
                            onClick={() => copyToClipboard(workshopConfig.payment.concept, "concept")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Copiar concepto"
                          >
                            {copiedField === "concept" ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="bg-[#C6A75E]/20 rounded-lg p-4 backdrop-blur border-2 border-[#C6A75E]/50">
                        <p className="text-sm text-[#C6A75E] mb-1">Monto a Transferir</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-[#C6A75E]">{workshopConfig.payment.amount}</p>
                          <button
                            onClick={() => copyToClipboard(workshopConfig.payment.amount, "amount")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Copiar monto"
                          >
                            {copiedField === "amount" ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-[#C6A75E]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-lg rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-105">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Ya pagué, enviar comprobante
                    </Button>
                  </a>

                  {/* Email Confirmation Notice */}
                  <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">📧 Revisa tu correo:</span> Te hemos enviado un email con tu boleto QR y estas mismas instrucciones por si deseas pagar más tarde.
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-[#C6A75E]/10 rounded-lg border-l-4 border-[#C6A75E]">
                    <p className="text-sm text-gray-700">
                      Una vez que envíes tu comprobante por WhatsApp, confirmaremos tu pago y te enviaremos la ubicación exacta del taller en Hermosillo, Sonora.
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