"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#0F2639] to-[#0B1C2D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C6A75E]/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#C6A75E]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-white/60">
              Ingresa tu contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Contraseña de administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#C6A75E] to-[#D4B76E] hover:from-[#B89650] hover:to-[#C6A75E] text-white font-semibold"
            >
              {loading ? (
                "Verificando..."
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              ← Volver a la landing page
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-white/40 text-sm">
          <p>💡 Contraseña por defecto: <code className="bg-white/10 px-2 py-1 rounded">admin123</code></p>
          <p className="mt-2">Configura ADMIN_PASSWORD en variables de entorno</p>
        </div>
      </motion.div>
    </div>
  );
}