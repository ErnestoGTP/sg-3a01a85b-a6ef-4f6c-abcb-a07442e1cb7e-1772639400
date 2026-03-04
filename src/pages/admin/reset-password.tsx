"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token no válido. Solicita un nuevo link de recuperación.");
    }
  }, [token]);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      } else {
        setError(data.error || "Error al restablecer la contraseña");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const length = newPassword.length;
    if (length === 0) return { strength: 0, label: "", color: "" };
    if (length < 8) return { strength: 1, label: "Débil", color: "bg-red-500" };
    if (length < 12) return { strength: 2, label: "Media", color: "bg-yellow-500" };
    return { strength: 3, label: "Fuerte", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

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
                ¡Contraseña Actualizada!
              </h2>
              
              <p className="text-gray-300 mb-6">
                Tu contraseña ha sido cambiada exitosamente.
              </p>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-300">
                  Redirigiendo al login...
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Restablecer Contraseña
                </h2>
                <p className="text-gray-400">
                  Ingresa tu nueva contraseña segura
                </p>
              </div>

              {error && (
                <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      className="pl-10 pr-10 bg-white/5 border-[#C6A75E]/20 text-white placeholder:text-gray-500 focus:border-[#C6A75E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : "bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        Seguridad: <span className={passwordStrength.strength >= 2 ? "text-green-400" : "text-yellow-400"}>
                          {passwordStrength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      required
                      className="pl-10 pr-10 bg-white/5 border-[#C6A75E]/20 text-white placeholder:text-gray-500 focus:border-[#C6A75E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-xs text-blue-300 mb-2 font-medium">
                    Requisitos de contraseña:
                  </p>
                  <ul className="text-xs text-blue-300/80 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? "bg-green-400" : "bg-gray-500"}`} />
                      Mínimo 8 caracteres
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${newPassword === confirmPassword && newPassword ? "bg-green-400" : "bg-gray-500"}`} />
                      Ambas contraseñas deben coincidir
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !token || newPassword !== confirmPassword || newPassword.length < 8}
                  className="w-full bg-[#C6A75E] hover:bg-[#b8975a] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/admin/login">
                    <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
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