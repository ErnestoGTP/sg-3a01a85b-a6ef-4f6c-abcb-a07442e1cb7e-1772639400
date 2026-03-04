"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError("Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setRecoverySent(true);
      } else {
        setError(data.error || "Error al enviar email de recuperación");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  if (showRecovery) {
    if (recoverySent) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a2332] to-[#0B1C2D] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#C6A75E]/30">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  ✅ Email Enviado
                </h2>

                <p className="text-gray-300 mb-6">
                  Hemos enviado las instrucciones de recuperación a:
                </p>

                <p className="text-[#C6A75E] font-semibold text-lg mb-8">
                  {recoveryEmail}
                </p>

                <p className="text-sm text-gray-400 mb-8">
                  Revisa tu bandeja de entrada y sigue los pasos para restablecer tu contraseña.
                  Si no ves el email, revisa tu carpeta de spam.
                </p>

                <Button
                  onClick={() => {
                    setShowRecovery(false);
                    setRecoverySent(false);
                    setRecoveryEmail("");
                  }}
                  className="w-full bg-[#C6A75E] hover:bg-[#b8995
5] text-white"
                >
                  Volver al Login
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a2332] to-[#0B1C2D] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#C6A75E]/30">
            <button
              onClick={() => setShowRecovery(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al login</span>
            </button>

            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-[#C6A75E] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Recuperar Contraseña
              </h2>
              <p className="text-gray-300 text-sm">
                Ingresa tu email de administrador y te enviaremos instrucciones
              </p>
            </div>

            <form onSubmit={handleRecovery} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email de Administrador
                </label>
                <Input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="admin@ramitaptraining.com"
                  required
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C6A75E] hover:bg-[#b89955] text-white font-semibold py-3"
              >
                {loading ? "Enviando..." : "Enviar Instrucciones"}
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              El email será enviado a {recoveryEmail || "tu dirección registrada"}
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a2332] to-[#0B1C2D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#C6A75E]/30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la landing</span>
          </Link>

          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-[#C6A75E] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-sm">
              Ingresa tu contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="bg-white/10 border-gray-600 text-white placeholder:text-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C6A75E] hover:bg-[#b89955] text-white font-semibold py-3"
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>

            <button
              type="button"
              onClick={() => setShowRecovery(true)}
              className="w-full text-sm text-gray-400 hover:text-[#C6A75E] transition-colors text-center"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              💡 Contraseña por defecto: <span className="font-mono font-semibold">RamitapAdmin2026!</span>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}