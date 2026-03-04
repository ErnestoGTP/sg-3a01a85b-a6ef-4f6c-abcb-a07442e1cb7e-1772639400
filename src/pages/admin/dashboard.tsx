"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  LogOut,
  Calendar,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { workshopConfig } from "@/config/workshop";

interface Registration {
  name: string;
  email: string;
  phone: string;
  timestamp: string;
  paid?: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaid, setFilterPaid] = useState<"all" | "paid" | "unpaid">("all");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchTerm, filterPaid]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/registrations");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.phone.includes(searchTerm)
      );
    }

    if (filterPaid === "paid") {
      filtered = filtered.filter((reg) => reg.paid);
    } else if (filterPaid === "unpaid") {
      filtered = filtered.filter((reg) => !reg.paid);
    }

    setFilteredRegistrations(filtered);
  };

  const togglePaidStatus = async (email: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, paid: !currentStatus }),
      });
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "Fecha de Registro", "Pagado"];
    const rows = filteredRegistrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      new Date(reg.timestamp).toLocaleString("es-MX"),
      reg.paid ? "Sí" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `registros-taller-pnl-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleLogout = () => {
    document.cookie = "admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  const stats = {
    total: registrations.length,
    paid: registrations.filter((r) => r.paid).length,
    unpaid: registrations.filter((r) => !r.paid).length,
    spotsLeft: workshopConfig.event.maxSeats - registrations.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#0F2639] to-[#0B1C2D] flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#0F2639] to-[#0B1C2D]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
                <p className="text-white/60 text-sm">{workshopConfig.event.title}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Registros</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-[#C6A75E]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Pagados</p>
                <p className="text-3xl font-bold text-green-400">{stats.paid}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-orange-400">{stats.unpaid}</p>
              </div>
              <XCircle className="w-10 h-10 text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Cupos Libres</p>
                <p className="text-3xl font-bold text-[#C6A75E]">{stats.spotsLeft}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-[#C6A75E]" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setFilterPaid("all")}
                variant={filterPaid === "all" ? "default" : "outline"}
                className={
                  filterPaid === "all"
                    ? "bg-[#C6A75E] hover:bg-[#B89650]"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos
              </Button>
              <Button
                onClick={() => setFilterPaid("paid")}
                variant={filterPaid === "paid" ? "default" : "outline"}
                className={
                  filterPaid === "paid"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                Pagados
              </Button>
              <Button
                onClick={() => setFilterPaid("unpaid")}
                variant={filterPaid === "unpaid" ? "default" : "outline"}
                className={
                  filterPaid === "unpaid"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                Pendientes
              </Button>
            </div>

            <Button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-[#C6A75E] to-[#D4B76E] hover:from-[#B89650] hover:to-[#C6A75E]"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </motion.div>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        >
          {filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-white/60">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay registros {searchTerm || filterPaid !== "all" ? "que coincidan con los filtros" : "todavía"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Teléfono</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Fecha</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">Pagado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredRegistrations.map((reg, index) => (
                    <motion.tr
                      key={reg.email}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#C6A75E]/20 flex items-center justify-center">
                            <span className="text-[#C6A75E] font-semibold">
                              {reg.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium">{reg.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <Mail className="w-4 h-4 text-white/40" />
                          {reg.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <Phone className="w-4 h-4 text-white/40" />
                          {reg.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <Calendar className="w-4 h-4 text-white/40" />
                          {new Date(reg.timestamp).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => togglePaidStatus(reg.email, reg.paid || false)}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                              ${
                                reg.paid
                                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                              }
                            `}
                          >
                            {reg.paid ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Pagado
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Pendiente
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-white/40 text-sm">
          <p>Mostrando {filteredRegistrations.length} de {registrations.length} registros totales</p>
        </div>
      </div>
    </div>
  );
}