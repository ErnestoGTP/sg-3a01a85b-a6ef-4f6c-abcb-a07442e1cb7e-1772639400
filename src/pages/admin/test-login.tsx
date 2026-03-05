"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

/**
 * Diagnostic page to test admin credentials
 * DELETE THIS FILE IN PRODUCTION
 */
export default function TestLogin() {
  const [email, setEmail] = useState("ramitaptraining@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCredentials = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/test-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: "Error al conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] to-[#1a3a52] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/5 backdrop-blur-sm border-[#C6A75E]/20">
        <h1 className="text-3xl font-bold text-white mb-2">
          🔍 Diagnóstico de Credenciales Admin
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Herramienta de debugging - Eliminar en producción
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-gray-600 text-white pr-10"
                placeholder="Ingresa el password a probar"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Caracteres: {password.length} | Primer char: {password[0] || "N/A"} | Último char: {password[password.length - 1] || "N/A"}
            </p>
          </div>

          <Button
            onClick={testCredentials}
            disabled={loading || !email || !password}
            className="w-full bg-[#C6A75E] hover:bg-[#b89955] text-white"
          >
            {loading ? "Probando..." : "🔍 Probar Credenciales"}
          </Button>
        </div>

        {result && (
          <div className="bg-black/20 border border-gray-700 rounded-lg p-6 space-y-4">
            <div className={`text-lg font-bold ${result.comparison?.passwordMatch ? "text-green-400" : "text-red-400"}`}>
              {result.diagnosis}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="text-[#C6A75E] font-semibold mb-2">📤 Datos Enviados</h3>
                <div className="space-y-1 text-gray-300">
                  <p>Email: {result.provided?.email}</p>
                  <p>Email length: {result.provided?.emailLength}</p>
                  <p>Password length: {result.provided?.passwordLength}</p>
                  <p>First char: "{result.provided?.passwordFirstChar}"</p>
                  <p>Last char: "{result.provided?.passwordLastChar}"</p>
                </div>
              </div>

              <div>
                <h3 className="text-[#C6A75E] font-semibold mb-2">⚙️ Configurado en Server</h3>
                <div className="space-y-1 text-gray-300">
                  <p>Email: {result.configured?.email}</p>
                  <p>Email length: {result.configured?.emailLength}</p>
                  <p>Password length: {result.configured?.passwordLength}</p>
                  <p>First char: "{result.configured?.passwordFirstChar}"</p>
                  <p>Last char: "{result.configured?.passwordLastChar}"</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-[#C6A75E] font-semibold mb-2">🔍 Comparación</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Email match: {result.comparison?.emailMatch ? "✅ SÍ" : "❌ NO"}</p>
                <p>Password length match: {result.comparison?.passwordLengthMatch ? "✅ SÍ" : "❌ NO"}</p>
                <p>Password match: {result.comparison?.passwordMatch ? "✅ SÍ" : "❌ NO"}</p>
              </div>
            </div>

            {result.comparison?.passwordMatch && (
              <div className="bg-green-500/10 border border-green-500/30 rounded p-4 text-green-300 text-sm">
                <p className="font-semibold">✅ ¡Credenciales Correctas!</p>
                <p className="mt-2">Puedes usar estas credenciales en el login normal:</p>
                <p className="mt-1">👉 <a href="/admin/login" className="underline hover:text-green-200">Ir al Login</a></p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Esta página es solo para debugging. Elimínala en producción.
          </p>
          <a href="/admin/login" className="text-sm text-[#C6A75E] hover:underline">
            ← Volver al Login Normal
          </a>
        </div>
      </Card>
    </div>
  );
}