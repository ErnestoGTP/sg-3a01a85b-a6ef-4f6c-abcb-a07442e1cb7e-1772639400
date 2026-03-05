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
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Credenciales incorrectas");
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
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#0f2438] to-[#0B1C2D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-[#0B1C2D]/50 backdrop-blur-sm border-[#C6A75E]/20 p-8">
          {!showRecovery ? (
            <>
              {/* Volver a la landing */}
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-400 hover:text-[#C6A75E] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a la landing
              </button>

              {/* Logo y título */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#a88942] mb-4">
                  <Shield className="w-8 h-8 text-[#0B1C2D]" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Ingresa tu contraseña para acceder
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email de Administrador
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ramitaptraining.com"
                    className="bg-[#0f2438] border-[#C6A75E]/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Contraseña de Administrador
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      className="bg-[#0f2438] border-[#C6A75E]/30 text-white placeholder:text-gray-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C6A75E] transition-colors"
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
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                    {error}
                    {error.includes("Credenciales") && (
                      <div className="mt-2 text-xs opacity-70">
                        <p>💡 Sugerencia: Verifica que el password sea exactamente: <code className="bg-black/20 px-1 py-0.5 rounded">Ramitap2025!</code></p>
                        <p className="mt-1">Si el problema persiste, usa "¿Olvidaste tu contraseña?" para resetear.</p>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#C6A75E] to-[#a88942] hover:from-[#a88942] hover:to-[#C6A75E] text-[#0B1C2D] font-semibold"
                >
                  {loading ? "Verificando..." : "Iniciar Sesión"}
                </Button>

                <div className="text-center">
                  <Link href="/admin/forgot-password">
                    <button
                      type="button"
                      className="text-sm text-gray-400 hover:text-[#C6A75E] transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Volver al login */}
              <button
                onClick={() => setShowRecovery(false)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al login
              </button>

              {/* Logo y título */}
              <div className="text-center mb-8">
                <Mail className="w-12 h-12 text-[#C6A75E] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Recuperar Contraseña
                </h2>
                <p className="text-gray-300 text-sm">
                  Ingresa tu email de administrador y te enviaremos instrucciones
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleRecovery} className="space-y-6">
                <div>
                  <label
                    htmlFor="recoveryEmail"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email de Administrador
                  </label>
                  <Input
                    id="recoveryEmail"
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
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}