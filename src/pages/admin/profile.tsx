"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Admin info
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ramitaptraining@gmail.com";
  const adminName = "Administrador";

  useEffect(() => {
    // Verify authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth", {
          method: "GET",
        });
        if (!response.ok) {
          router.push("/admin/login");
        }
      } catch (err) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validations
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // Verify current password
      const authResponse = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: currentPassword,
        }),
      });

      if (!authResponse.ok) {
        setError("La contraseña actual es incorrecta");
        setLoading(false);
        return;
      }

      // Generate a temporary token for password change
      const resetResponse = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await resetResponse.json();

      if (resetResponse.ok) {
        setSuccess("¡Contraseña actualizada exitosamente!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      } else {
        setError(data.error || "Error al actualizar la contraseña");
      }
    } catch (err) {
      setError("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReset = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setShowResetDialog(true);
      } else {
        setError(data.error || "Error al enviar el email");
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
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a3a52] to-[#0B1C2D]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-[#C6A75E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo variant="light" size="sm" />
              <div>
                <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
                <p className="text-sm text-gray-400">Gestión de cuenta de administrador</p>
              </div>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#b8975a] flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{adminName}</h2>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {adminEmail}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <Shield className="w-5 h-5 text-[#C6A75E]" />
                  <div>
                    <p className="text-sm text-gray-400">Rol</p>
                    <p className="text-white font-medium">Administrador Principal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <Key className="w-5 h-5 text-[#C6A75E]" />
                  <div>
                    <p className="text-sm text-gray-400">Permisos</p>
                    <p className="text-white font-medium">Acceso Completo al Sistema</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-[#C6A75E]" />
                <h3 className="text-xl font-bold text-white">Cambiar Contraseña</h3>
              </div>

              {success && (
                <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-300">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña actual"
                      required
                      className="pl-10 pr-10 bg-white/5 border-[#C6A75E]/20 text-white placeholder:text-gray-500 focus:border-[#C6A75E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      className="pl-10 pr-10 bg-white/5 border-[#C6A75E]/20 text-white placeholder:text-gray-500 focus:border-[#C6A75E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la nueva contraseña"
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                    className="flex-1 bg-[#C6A75E] hover:bg-[#b8975a] text-white font-medium disabled:opacity-50"
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
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0B1C2D] text-gray-400">o</span>
                </div>
              </div>

              {/* Email Reset Option */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-300 mb-1">
                      Restablecer por Email
                    </h4>
                    <p className="text-xs text-blue-200/80 mb-3">
                      Recibirás un link seguro para cambiar tu contraseña sin necesidad de la actual.
                    </p>
                    <Button
                      type="button"
                      onClick={handleEmailReset}
                      disabled={loading}
                      variant="outline"
                      className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Link de Recuperación
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C6A75E]" />
                Consejos de Seguridad
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Usa una contraseña única de al menos 12 caracteres</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Combina letras mayúsculas, minúsculas, números y símbolos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Cambia tu contraseña periódicamente (cada 3-6 meses)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Nunca compartas tu contraseña con nadie</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Cierra sesión cuando uses computadoras compartidas</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Email Sent Success Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-[#0B1C2D] border-[#C6A75E]/20 text-white">
          <DialogHeader>
            <div className="mx-auto mb-4 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <DialogTitle className="text-center text-xl">¡Email Enviado!</DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Hemos enviado un link de recuperación a:
              <br />
              <span className="text-[#C6A75E] font-medium">{adminEmail}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 my-4">
            <p className="text-sm text-blue-300 text-center">
              El link expirará en 1 hora. Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowResetDialog(false)}
              className="w-full bg-[#C6A75E] hover:bg-[#b8975a]"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}