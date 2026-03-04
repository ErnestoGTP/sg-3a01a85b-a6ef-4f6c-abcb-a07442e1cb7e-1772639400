"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Error al enviar el email");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a3a52] to-[#0B1C2D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-sm border border-[#C6A75E]/20 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo variant="light" size="lg" />
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                ¡Email Enviado!
              </h2>
              
              <p className="text-gray-300 mb-6">
                Si el email existe en nuestro sistema, recibirás un link de recuperación.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  Revisa tu bandeja de entrada y sigue las instrucciones.
                  El link expira en 1 hora.
                </p>
              </div>

              <Link href="/admin/login">
                <Button className="w-full bg-[#C6A75E] hover:bg-[#b8975a] text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-gray-400">
                  Ingresa tu email y te enviaremos un link de recuperación
                </p>
              </div>

              {error && (
                <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email del Administrador
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ramitaptraining.com"
                      required
                      className="pl-10 bg-white/5 border-[#C6A75E]/20 text-white placeholder:text-gray-500 focus:border-[#C6A75E]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C6A75E] hover:bg-[#b8975a] text-white font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Link de Recuperación
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/admin/login">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al Login
                    </Button>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Ramitap Training © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}