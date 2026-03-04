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
  Lock,
  Plus,
  Trash2,
  Settings,
  QrCode,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workshopConfig } from "@/config/workshop";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  payment_status: "pending" | "paid";
  attendance_status: "pending" | "present";
  created_at: string;
}

interface WorkshopConfigData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
}

type FilterType = "all" | "paid" | "pending";

export default function AdminDashboard() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [workshopData, setWorkshopData] = useState<WorkshopConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  
  // Add participant form
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    phone: "",
    payment_status: "paid" as "pending" | "paid"
  });

  // Workshop config form
  const [editWorkshop, setEditWorkshop] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    price: ""
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const getAuthToken = () => {
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ramitaptraining@gmail.com";
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "RamitapAdmin2026!";
    return Buffer.from(`${email}:${password}`).toString("base64");
  };

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

      // Load participants
      await loadParticipants();

      // Load workshop config
      await loadWorkshopConfig();

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

  const loadParticipants = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("/api/admin/participants", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch participants");

      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (error) {
      console.error("Error loading participants:", error);
    }
  };

  const loadWorkshopConfig = async () => {
    try {
      const response = await fetch("/api/admin/workshop-config");
      
      if (!response.ok) throw new Error("Failed to fetch workshop config");

      const data = await response.json();
      if (data.config) {
        setWorkshopData(data.config);
        setEditWorkshop({
          title: data.config.title,
          date: data.config.date,
          time: data.config.time,
          location: data.config.location,
          price: data.config.price
        });
      }
    } catch (error) {
      console.error("Error loading workshop config:", error);
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

  const togglePaymentStatus = async (participant: Participant) => {
    try {
      const token = getAuthToken();
      const newStatus = participant.payment_status === "paid" ? "pending" : "paid";

      const response = await fetch("/api/admin/participants", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: participant.id,
          payment_status: newStatus
        })
      });

      if (!response.ok) throw new Error("Failed to update status");

      await loadParticipants();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const toggleAttendanceStatus = async (participant: Participant) => {
    try {
      const token = getAuthToken();
      const newStatus = participant.attendance_status === "present" ? "pending" : "present";

      const response = await fetch("/api/admin/participants", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: participant.id,
          attendance_status: newStatus
        })
      });

      if (!response.ok) throw new Error("Failed to update attendance");

      await loadParticipants();
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleAddParticipant = async () => {
    try {
      if (!newParticipant.name || !newParticipant.email || !newParticipant.phone) {
        alert("Por favor completa todos los campos");
        return;
      }

      const token = getAuthToken();
      const response = await fetch("/api/admin/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newParticipant)
      });

      if (!response.ok) throw new Error("Failed to add participant");

      setShowAddModal(false);
      setNewParticipant({ name: "", email: "", phone: "", payment_status: "paid" });
      await loadParticipants();
    } catch (error) {
      console.error("Error adding participant:", error);
      alert("Error al agregar participante");
    }
  };

  const handleDeleteParticipant = async () => {
    if (!selectedParticipant) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/admin/participants?id=${selectedParticipant.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete participant");

      setShowDeleteModal(false);
      setSelectedParticipant(null);
      await loadParticipants();
    } catch (error) {
      console.error("Error deleting participant:", error);
      alert("Error al eliminar participante");
    }
  };

  const handleUpdateWorkshopConfig = async () => {
    try {
      if (!editWorkshop.title || !editWorkshop.date || !editWorkshop.time || !editWorkshop.location || !editWorkshop.price) {
        alert("Por favor completa todos los campos");
        return;
      }

      const token = getAuthToken();
      const response = await fetch("/api/admin/workshop-config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editWorkshop)
      });

      if (!response.ok) throw new Error("Failed to update config");

      await loadWorkshopConfig();
      alert("✅ Configuración actualizada exitosamente");
    } catch (error) {
      console.error("Error updating workshop config:", error);
      alert("Error al actualizar configuración");
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredParticipants();
    const csv = [
      ["Nombre", "Email", "Teléfono", "Fecha de Registro", "Pagado", "Asistencia"],
      ...filtered.map(p => [
        p.name,
        p.email,
        p.phone,
        new Date(p.created_at).toLocaleString("es-MX"),
        p.payment_status === "paid" ? "Sí" : "No",
        p.attendance_status === "present" ? "Presente" : "Pendiente"
      ])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `participantes-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredParticipants = () => {
    let filtered = participants;

    if (filter === "paid") {
      filtered = filtered.filter(p => p.payment_status === "paid");
    } else if (filter === "pending") {
      filtered = filtered.filter(p => p.payment_status === "pending");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.phone.includes(searchTerm)
      );
    }

    return filtered;
  };

  const paidCount = participants.filter(p => p.payment_status === "paid").length;
  const pendingCount = participants.filter(p => p.payment_status === "pending").length;
  const presentCount = participants.filter(p => p.attendance_status === "present").length;
  const totalSpots = workshopConfig.event.maxSeats;
  const spotsLeft = Math.max(0, totalSpots - participants.length);

  const filteredParticipants = getFilteredParticipants();

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
          <p className="text-white text-xl">Cargando dashboard...</p>
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
              <p className="text-sm text-gray-400">Taller de PNL Fundamental</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/scanner">
              <Button
                variant="outline"
                className="border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Escáner QR
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="bg-white/5 border border-[#C6A75E]/20">
            <TabsTrigger value="participants" className="data-[state=active]:bg-[#C6A75E] data-[state=active]:text-[#0B1C2D]">
              <Users className="w-4 h-4 mr-2" />
              Participantes
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#C6A75E] data-[state=active]:text-[#0B1C2D]">
              <Settings className="w-4 h-4 mr-2" />
              Configuración del Taller
            </TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total</p>
                      <p className="text-3xl font-bold text-white">{participants.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#C6A75E]" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-white/5 backdrop-blur-sm border-blue-500/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Presentes</p>
                      <p className="text-3xl font-bold text-blue-400">{presentCount}</p>
                    </div>
                    <Award className="w-8 h-8 text-blue-400" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Cupos</p>
                      <p className="text-3xl font-bold text-[#C6A75E]">{spotsLeft}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#C6A75E]" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Filters & Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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
                  <div className="flex gap-2 flex-wrap">
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
                    <Button
                      onClick={() => setShowAddModal(true)}
                      className="bg-[#C6A75E] text-[#0B1C2D] hover:bg-[#C6A75E]/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                    <Button
                      onClick={exportToCSV}
                      disabled={filteredParticipants.length === 0}
                      className="bg-[#C6A75E] text-[#0B1C2D] hover:bg-[#C6A75E]/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Participants Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 overflow-hidden">
                <div className="overflow-x-auto">
                  {filteredParticipants.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">
                        {searchTerm || filter !== "all"
                          ? "No se encontraron participantes"
                          : "Aún no hay participantes registrados"}
                      </p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#C6A75E]/20">
                          <th className="text-left p-4 text-gray-400 font-medium">Participante</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Contacto</th>
                          <th className="text-left p-4 text-gray-400 font-medium">Fecha</th>
                          <th className="text-center p-4 text-gray-400 font-medium">Pago</th>
                          <th className="text-center p-4 text-gray-400 font-medium">Asistencia</th>
                          <th className="text-center p-4 text-gray-400 font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredParticipants.map((participant, index) => (
                          <motion.tr
                            key={participant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-[#C6A75E]/10 hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#0B1C2D] flex items-center justify-center text-white font-bold">
                                  {participant.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white font-medium">{participant.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Mail className="w-4 h-4 text-[#C6A75E]" />
                                  <span className="text-sm">{participant.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Phone className="w-4 h-4 text-[#C6A75E]" />
                                  <span className="text-sm">{participant.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-gray-300 text-sm">
                                {new Date(participant.created_at).toLocaleString("es-MX", {
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
                                  onClick={() => togglePaymentStatus(participant)}
                                  variant="outline"
                                  size="sm"
                                  className={
                                    participant.payment_status === "paid"
                                      ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                                      : "border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                                  }
                                >
                                  {participant.payment_status === "paid" ? (
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
                            <td className="p-4">
                              <div className="flex justify-center">
                                <Button
                                  onClick={() => toggleAttendanceStatus(participant)}
                                  variant="outline"
                                  size="sm"
                                  className={
                                    participant.attendance_status === "present"
                                      ? "border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                                      : "border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                                  }
                                >
                                  {participant.attendance_status === "present" ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Presente
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Ausente
                                    </>
                                  )}
                                </Button>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center">
                                <Button
                                  onClick={() => {
                                    setSelectedParticipant(participant);
                                    setShowDeleteModal(true);
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {filteredParticipants.length > 0 && (
                  <div className="p-4 border-t border-[#C6A75E]/20 bg-white/5">
                    <p className="text-center text-gray-400">
                      Mostrando {filteredParticipants.length} de {participants.length} participantes
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </TabsContent>

          {/* Workshop Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-white/5 backdrop-blur-sm border-[#C6A75E]/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-[#C6A75E]" />
                  Configuración del Taller
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-white mb-2 block">
                      Título del Taller
                    </Label>
                    <Input
                      id="title"
                      value={editWorkshop.title}
                      onChange={(e) => setEditWorkshop({ ...editWorkshop, title: e.target.value })}
                      className="bg-white/5 border-[#C6A75E]/20 text-white"
                      placeholder="Ej: Taller Presencial de PNL Básica"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="date" className="text-white mb-2 block">
                        Fecha
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={editWorkshop.date}
                        onChange={(e) => setEditWorkshop({ ...editWorkshop, date: e.target.value })}
                        className="bg-white/5 border-[#C6A75E]/20 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="time" className="text-white mb-2 block">
                        Horario
                      </Label>
                      <Input
                        id="time"
                        value={editWorkshop.time}
                        onChange={(e) => setEditWorkshop({ ...editWorkshop, time: e.target.value })}
                        className="bg-white/5 border-[#C6A75E]/20 text-white"
                        placeholder="Ej: 9:00 AM - 6:00 PM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="location" className="text-white mb-2 block">
                        Ubicación
                      </Label>
                      <Input
                        id="location"
                        value={editWorkshop.location}
                        onChange={(e) => setEditWorkshop({ ...editWorkshop, location: e.target.value })}
                        className="bg-white/5 border-[#C6A75E]/20 text-white"
                        placeholder="Ej: Hermosillo, Sonora"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-white mb-2 block">
                        Precio
                      </Label>
                      <Input
                        id="price"
                        value={editWorkshop.price}
                        onChange={(e) => setEditWorkshop({ ...editWorkshop, price: e.target.value })}
                        className="bg-white/5 border-[#C6A75E]/20 text-white"
                        placeholder="Ej: $800 MXN"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleUpdateWorkshopConfig}
                      className="bg-[#C6A75E] text-[#0B1C2D] hover:bg-[#C6A75E]/90 px-8"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Participant Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#0B1C2D] border-[#C6A75E]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#C6A75E] flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Agregar Participante Manualmente
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Agrega a alguien que pagó en efectivo o por otro medio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="text-white mb-2 block">
                Nombre Completo
              </Label>
              <Input
                id="name"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                className="bg-white/5 border-[#C6A75E]/20 text-white"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={newParticipant.email}
                onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                className="bg-white/5 border-[#C6A75E]/20 text-white"
                placeholder="Ej: juan@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white mb-2 block">
                Teléfono
              </Label>
              <Input
                id="phone"
                value={newParticipant.phone}
                onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                className="bg-white/5 border-[#C6A75E]/20 text-white"
                placeholder="Ej: 6621234567"
              />
            </div>

            <div>
              <Label htmlFor="payment" className="text-white mb-2 block">
                Estado de Pago
              </Label>
              <Select
                value={newParticipant.payment_status}
                onValueChange={(value: "pending" | "paid") => setNewParticipant({ ...newParticipant, payment_status: value })}
              >
                <SelectTrigger className="bg-white/5 border-[#C6A75E]/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1C2D] border-[#C6A75E]/20">
                  <SelectItem value="paid" className="text-white hover:bg-white/10">
                    Pagado
                  </SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-white/10">
                    Pendiente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddParticipant}
              className="bg-[#C6A75E] text-[#0B1C2D] hover:bg-[#C6A75E]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-[#0B1C2D] border-[#C6A75E]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de que deseas eliminar a {selectedParticipant?.name}?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedParticipant(null);
              }}
              className="border-[#C6A75E] text-[#C6A75E] hover:bg-[#C6A75E] hover:text-[#0B1C2D]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteParticipant}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}