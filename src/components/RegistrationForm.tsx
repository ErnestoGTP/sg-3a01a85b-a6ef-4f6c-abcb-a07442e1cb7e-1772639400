import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const formSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos").regex(/^[0-9+\s()-]+$/, "Formato de teléfono inválido")
});

type FormData = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError("");

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
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el formulario. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AnimatedSection>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 border-2 border-green-200 shadow-xl">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-4">
              ¡Registro Exitoso!
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Revisa tu correo para ver la ubicación exacta en Hermosillo, la fecha, la hora y las condiciones del taller.
            </p>
            <div className="space-y-4 text-left bg-white rounded-xl p-6 border border-green-200">
              <p className="text-gray-700">
                <strong className="text-[#0B1C2D]">📧 Revisa tu bandeja de entrada</strong>
                <br />
                <span className="text-sm">Si no lo encuentras, verifica tu carpeta de spam</span>
              </p>
              <p className="text-gray-700">
                <strong className="text-[#0B1C2D]">📍 Confirma la ubicación exacta</strong>
                <br />
                <span className="text-sm">El correo incluye la dirección completa</span>
              </p>
              <p className="text-gray-700">
                <strong className="text-[#0B1C2D]">🎁 Tu regalo está en camino</strong>
                <br />
                <span className="text-sm">Recibirás la plantilla PDF en las próximas 24 horas</span>
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-6">
              ¿Tienes preguntas? Contáctanos por WhatsApp
            </p>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C2D] mb-4">
            Asegura tu lugar ahora
          </h2>
          <p className="text-xl text-gray-600">
            Solo faltan <span className="text-[#C6A75E] font-bold">7 cupos</span> disponibles
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-[#C6A75E]/20">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#0B1C2D] font-semibold text-lg">
              Nombre completo *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              {...register("name")}
              className="h-12 text-base border-2 border-gray-200 focus:border-[#C6A75E] rounded-lg"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#0B1C2D] font-semibold text-lg">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              className="h-12 text-base border-2 border-gray-200 focus:border-[#C6A75E] rounded-lg"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#0B1C2D] font-semibold text-lg">
              Teléfono *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+52 662 123 4567"
              {...register("phone")}
              className="h-12 text-base border-2 border-gray-200 focus:border-[#C6A75E] rounded-lg"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C6A75E] hover:bg-[#d4b76f] text-[#0B1C2D] font-bold text-lg h-14 rounded-full shadow-lg shadow-[#C6A75E]/30 hover:shadow-xl hover:shadow-[#C6A75E]/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Tus datos solo se usarán para enviarte información de este taller y recordatorios importantes.
          </p>
        </form>
      </div>
    </AnimatedSection>
  );
}