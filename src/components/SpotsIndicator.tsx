"use client";

import { useState, useEffect } from "react";
import { Users, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { workshopConfig } from "@/config/workshop";

export function SpotsIndicator() {
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchSpotsLeft = async () => {
      try {
        const response = await fetch("/api/spots-remaining");
        const data = await response.json();
        
        if (data.success) {
          setSpotsLeft(data.spotsLeft);
        }
      } catch (error) {
        console.error("Error fetching spots:", error);
        setSpotsLeft(workshopConfig.event.maxSeats);
      }
    };

    fetchSpotsLeft();
    const interval = setInterval(fetchSpotsLeft, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || spotsLeft === null) {
    return null;
  }

  const percentageFilled = ((workshopConfig.event.maxSeats - spotsLeft) / workshopConfig.event.maxSeats) * 100;
  const isLowSpots = spotsLeft <= 5;
  const isCritical = spotsLeft <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden rounded-2xl p-6 
        ${isCritical ? "bg-gradient-to-r from-red-900/30 to-red-800/30 border-2 border-red-500/50" : 
          isLowSpots ? "bg-gradient-to-r from-orange-900/30 to-orange-800/30 border-2 border-orange-500/50" :
          "bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] border border-[#C6A75E]/20"}
        shadow-xl
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className={`w-5 h-5 ${isCritical ? "text-red-400" : isLowSpots ? "text-orange-400" : "text-[#C6A75E]"}`} />
            <h4 className="text-lg font-semibold text-white">
              Cupos Disponibles
            </h4>
          </div>
          
          {isLowSpots && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1 text-sm"
            >
              <TrendingDown className={`w-4 h-4 ${isCritical ? "text-red-400" : "text-orange-400"}`} />
              <span className={`font-bold ${isCritical ? "text-red-400" : "text-orange-400"}`}>
                ¡Últimos lugares!
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-end gap-4">
          <motion.div
            key={spotsLeft}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-6xl font-bold"
          >
            <span className={`
              ${isCritical ? "text-red-400" : 
                isLowSpots ? "text-orange-400" : 
                "text-[#C6A75E]"}
            `}>
              {spotsLeft}
            </span>
            <span className="text-white/60 text-3xl ml-2">
              / {workshopConfig.event.maxSeats}
            </span>
          </motion.div>

          <div className="flex-1 pb-2">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentageFilled}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  isCritical ? "bg-gradient-to-r from-red-500 to-red-600" :
                  isLowSpots ? "bg-gradient-to-r from-orange-500 to-orange-600" :
                  "bg-gradient-to-r from-[#C6A75E] to-[#d4b870]"
                }`}
              />
            </div>
            <p className="text-xs text-white/60 mt-1">
              {Math.round(percentageFilled)}% ocupado
            </p>
          </div>
        </div>

        {isCritical ? (
          <motion.p
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-4 text-red-400 font-semibold text-sm"
          >
            🔥 ¡Solo quedan {spotsLeft} lugares! Regístrate ahora antes de que se agoten.
          </motion.p>
        ) : isLowSpots ? (
          <p className="mt-4 text-orange-400 font-semibold text-sm">
            ⚠️ Cupos limitados. ¡Asegura tu lugar hoy!
          </p>
        ) : (
          <p className="mt-4 text-white/80 text-sm">
            Asegura tu lugar en el taller de PNL más práctico de Puebla
          </p>
        )}
      </div>
    </motion.div>
  );
}