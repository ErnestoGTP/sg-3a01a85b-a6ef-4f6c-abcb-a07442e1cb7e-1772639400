"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Clock,
  Award,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  LogOut,
  Mail,
  Phone,
  Filter,
  Shield,
  Lock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { workshopConfig } from "@/config/workshop";

interface Registration {
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  paid: boolean;
}

type FilterType = "all" | "paid" | "pending";

export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true);
      
      const authResponse = await fetch("/api/admin/auth", {
        method: "GET",
        credentials: "include"
      });

      if (authResponse.status === 401 || !authResponse.ok) {
        setShowUnauthorized(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
        return;
      }

      const authData = await authResponse.json();
      if (!authData.authenticated) {
        setShowUnauthorized(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
        return;
      }

      setIsAuthenticated(true);

      const response = await fetch("/api/admin/registrations", {
        credentials: "include"
      });
      
      if (response.status === 401) {
        setShowUnauthorized(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setShowUnauthorized(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { 
        method: "DELETE",
        credentials: "include"
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      router.push("/admin/login");
    }
  };

  const togglePaidStatus = async (email: string) => {
    try {
      const registration = registrations.find(r => r.email === email);
      if (!registration) return;

      const response = await fetch("/api/admin/registrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          paid: !registration.paid
        })
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setRegistrations(prev =>
        prev.map(reg =>
          reg.email === email ? { ...reg, paid: !reg.paid } : reg
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredRegistrations();
    const csv = [
      ["Nombre", "Email", "Teléfono", "Fecha de Registro", "Pagado"],
      ...filtered.map(reg => [
        reg.name,
        reg.email,
        reg.phone,
        new Date(reg.timestamp).toLocaleString("es-MX"),
        reg.paid ? "Sí" : "No"
      ])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registros-taller-pnl-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredRegistrations = () => {
    let filtered = registrations;

    if (filter === "paid") {
      filtered = filtered.filter(r => r.paid);
    } else if (filter === "pending") {
      filtered = filtered.filter(r => !r.paid);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        r =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.phone.includes(searchTerm)
      );
    }

    return filtered;
  };

  const paidCount = registrations.filter(r => r.paid).length;
  const pendingCount = registrations.filter(r => !r.paid).length;
  const totalSpots = workshopConfig.event.maxSeats;
  const spotsLeft = Math.max(0, totalSpots - registrations.length);

  const filteredRegistrations = getFilteredRegistrations();

  if (showUnauthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#1a2332] to-[#0B1C2D] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-[#C6A75E]/30 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Lock className="w-16 h-16 text-[#C6A75E] mx-auto mb-6" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-4">
              🔒 Acceso Restringido
            </h2>

            <p className="text-gray-300 mb-8">
              Necesitas iniciar sesión para acceder al dashboard de administración.
            </p>

            <div className="space-y-4">
              <Link href="/admin/login">
                <Button className="w-full bg-[#C6A75E] hover:bg-[#b89955] text-white font-semibold py-3">
                  <Shield className="w-5 h-5 mr-2" />
                  Ir al Login
                </Button>
              </Link>

              <Link href="/">
                <Button 
                  variant="outline" 
                  className="w-full border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
                >
                  Volver a la Landing
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              Redirigiendo al login automáticamente...
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#a88942] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#0B1C2D]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Taller Presencial de PNL Básica</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Registros</p>
                  <p className="text-3xl font-bold text-white">{registrations.length}</p>
                </div>
                <Users className="w-8 h-8 text-[#C6A75E]" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-green-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pagados</p>
                  <p className="text-3xl font-bold text-green-400">{paidCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-orange-500/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-400">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Cupos Libres</p>
                  <p className="text-3xl font-bold text-[#C6A75E]">{spotsLeft}</p>
                </div>
                <Award className="w-8 h-8 text-[#C6A75E]" />
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-[#C6A75E]/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilter("all")}
                  variant={filter === "all" ? "default" : "outline"}
                  className={
                    filter === "all"
                      ? "bg-[#C6A75E] text-[#0B1C2D] hover:bg-[#C6A75E]/90"
                      : "border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
                  }
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Todos
                </Button>
                <Button
                  onClick={() => setFilter("paid")}
                  variant={filter === "paid" ? "default" : "outline"}
                  className={
                    filter === "paid"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  }
                >
                  Pagados
                </Button>
                <Button
                  onClick={() => setFilter("pending")}
                  variant={filter === "pending" ? "default" : "outline"}
                  className={
                    filter === "pending"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                  }
                >
                  Pendientes
                </Button>
              </div>
              <Button
                onClick={exportToCSV}
                disabled={filteredRegistrations.length === 0}
                className="bg-[#C6A75E] text-[#0B1C2D] hover:bg-[#C6A75E]/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 overflow-hidden">
            <div className="overflow-x-auto">
              {filteredRegistrations.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    {searchTerm || filter !== "all"
                      ? "No se encontraron registros con los filtros aplicados"
                      : "Aún no hay registros"}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#C6A75E]/20">
                      <th className="text-left p-4 text-gray-400 font-medium">Participante</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Contacto</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Fecha de Registro</th>
                      <th className="text-center p-4 text-gray-400 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((registration, index) => (
                      <motion.tr
                        key={registration.email}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[#C6A75E]/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#0B1C2D] flex items-center justify-center text-white font-bold">
                              {registration.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white font-medium">{registration.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4 text-[#C6A75E]" />
                              <span className="text-sm">{registration.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4 text-[#C6A75E]" />
                              <span className="text-sm">{registration.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-300">
                            {new Date(registration.timestamp).toLocaleString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <Button
                              onClick={() => togglePaidStatus(registration.email)}
                              variant="outline"
                              size="sm"
                              className={
                                registration.paid
                                  ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                                  : "border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                              }
                            >
                              {registration.paid ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Pagado
                                </>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4 mr-2" />
                                  Pendiente
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {filteredRegistrations.length > 0 && (
              <div className="p-4 border-t border-[#C6A75E]/20 bg-white/5">
                <p className="text-center text-gray-400">
                  Mostrando {filteredRegistrations.length} de {registrations.length} registros totales
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}