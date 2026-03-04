"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Shield,
  AlertCircle,
  Users
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ScanResult {
  success: boolean;
  participant?: {
    name: string;
    email: string;
    attendance_status: string;
  };
  message: string;
  alreadyPresent?: boolean;
}

export default function QRScanner() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<Array<{ name: string; time: string; status: string }>>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authResponse = await fetch("/api/admin/auth", {
        method: "GET",
        credentials: "include"
      });

      if (authResponse.status === 401 || !authResponse.ok) {
        router.push("/admin/login");
        return;
      }

      const authData = await authResponse.json();
      if (!authData.authenticated) {
        router.push("/admin/login");
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = () => {
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ramitaptraining@gmail.com";
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "RamitapAdmin2026!";
    return Buffer.from(`${email}:${password}`).toString("base64");
  };

  const handleScan = async (result: any) => {
    if (!result || !scanning) return;

    try {
      setScanning(false);

      const token = getAuthToken();
      const response = await fetch("/api/admin/scan-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ qrCodeData: result[0].rawValue })
      });

      const data = await response.json();

      if (response.ok) {
        setLastScan({
          success: true,
          participant: data.participant,
          message: data.message,
          alreadyPresent: data.alreadyPresent
        });

        // Add to recent scans
        if (data.participant) {
          setRecentScans(prev => [
            {
              name: data.participant.name,
              time: new Date().toLocaleTimeString("es-MX"),
              status: data.alreadyPresent ? "Ya registrado" : "Registrado"
            },
            ...prev.slice(0, 9) // Keep last 10 scans
          ]);
        }
      } else {
        setLastScan({
          success: false,
          message: data.error || "Error al procesar el código QR"
        });
      }

      // Resume scanning after 3 seconds
      setTimeout(() => {
        setScanning(true);
        setLastScan(null);
      }, 3000);

    } catch (error) {
      console.error("Error scanning QR:", error);
      setLastScan({
        success: false,
        message: "Error de conexión. Intenta de nuevo."
      });

      setTimeout(() => {
        setScanning(true);
        setLastScan(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a2332] to-[#0B1C2D] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-12 h-12 text-[#C6A75E] mx-auto mb-4" />
          </motion.div>
          <p className="text-white text-xl">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#0f2438] to-[#0B1C2D]">
      {/* Header */}
      <header className="border-b border-[#C6A75E]/20 bg-[#0B1C2D]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard">
              <Button
                variant="outline"
                className="border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#a88942] flex items-center justify-center">
                <QrCode className="w-5 h-5 text-[#0B1C2D]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Escáner de QR</h1>
                <p className="text-sm text-gray-400">Control de Asistencia</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <QrCode className="w-6 h-6 text-[#C6A75E]" />
                Escanear Código QR
              </h2>

              <div className="relative rounded-lg overflow-hidden bg-black aspect-square">
                {scanning ? (
                  <Scanner
                    onScan={handleScan}
                    constraints={{
                      facingMode: "environment"
                    }}
                    components={{
                      finder: true
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <AlertCircle className="w-16 h-16 text-[#C6A75E] mx-auto mb-4" />
                      </motion.div>
                      <p className="text-white text-lg">Procesando...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-[#C6A75E]/20">
                <p className="text-gray-300 text-sm text-center">
                  📱 Apunta la cámara hacia el código QR del participante
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Last Scan Result */}
            {lastScan && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Alert
                  className={
                    lastScan.success
                      ? "bg-green-500/20 border-green-500/50"
                      : "bg-red-500/20 border-red-500/50"
                  }
                >
                  {lastScan.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <AlertTitle className="text-white">
                    {lastScan.success ? "¡Éxito!" : "Error"}
                  </AlertTitle>
                  <AlertDescription className="text-gray-200">
                    {lastScan.message}
                    {lastScan.participant && (
                      <div className="mt-2 space-y-1">
                        <p className="font-bold">{lastScan.participant.name}</p>
                        <p className="text-sm">{lastScan.participant.email}</p>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Recent Scans */}
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C6A75E]" />
                Escaneos Recientes
              </h3>

              {recentScans.length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aún no has escaneado ningún código</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentScans.map((scan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-[#C6A75E]/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#0B1C2D] flex items-center justify-center text-white text-sm font-bold">
                          {scan.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{scan.name}</p>
                          <p className="text-gray-400 text-xs">{scan.time}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          scan.status === "Registrado"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {scan.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Instructions */}
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <h3 className="text-lg font-bold text-white mb-3">📋 Instrucciones</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] mt-1">•</span>
                  <span>Pide al participante que muestre su código QR del email de confirmación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] mt-1">•</span>
                  <span>Apunta la cámara directamente al código QR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] mt-1">•</span>
                  <span>Espera a que el sistema procese automáticamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A75E] mt-1">•</span>
                  <span>El estado de asistencia se actualizará en tiempo real</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}