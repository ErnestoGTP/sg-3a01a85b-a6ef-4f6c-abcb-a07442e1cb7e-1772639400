"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { workshopConfig } from "@/config/workshop";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = (): TimeLeft => {
      // Parse the date properly - "Sábado 21 de Marzo, 2026"
      // Extract day, month, year
      const dateStr = workshopConfig.event.date;
      const parts = dateStr.split(/[\s,]+/); // Split by spaces and commas
      
      // Find the numeric parts
      const day = parseInt(parts.find(p => /^\d+$/.test(p)) || "21");
      const yearStr = parts.find(p => /^\d{4}$/.test(p)) || "2026";
      const year = parseInt(yearStr);
      
      // Convert Spanish month name to English
      const monthMap: { [key: string]: number } = {
        "enero": 0, "febrero": 1, "marzo": 2, "abril": 3,
        "mayo": 4, "junio": 5, "julio": 6, "agosto": 7,
        "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
      };
      
      const monthName = dateStr.toLowerCase().match(/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/)?.[0];
      const month = monthName ? monthMap[monthName] : 2; // Default to March
      
      // Parse time - "10:00 AM - 12:00 PM"
      const timeStr = workshopConfig.event.time;
      const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hours = 10; // Default
      let minutes = 0;
      
      if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();
        
        if (period === "PM" && hours !== 12) {
          hours += 12;
        } else if (period === "AM" && hours === 12) {
          hours = 0;
        }
      }
      
      // Create target date in local timezone
      const targetDate = new Date(year, month, day, hours, minutes, 0);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  if (timeLeft.total <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto px-4 py-8"
      >
        <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1a2332] rounded-2xl p-8 text-center border border-[#C6A75E]/20">
          <Clock className="w-12 h-12 text-[#C6A75E] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            ¡El Taller Ha Comenzado!
          </h3>
          <p className="text-gray-300">
            Nos vemos en la siguiente edición
          </p>
        </div>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: "DÍAS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hours },
    { label: "MIN", value: timeLeft.minutes },
    { label: "SEG", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-gradient-to-br from-[#0B1C2D] via-[#1a2332] to-[#0B1C2D] rounded-2xl p-8 border border-[#C6A75E]/30 shadow-2xl">
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Clock className="w-10 h-10 text-[#C6A75E] mx-auto mb-3" />
          </motion.div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ⏱️ ¡El Tiempo Se Agota!
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            El taller comienza en:
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-6 mb-6">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-[#C6A75E] to-[#8b7340] rounded-xl p-4 md:p-6 mb-2 shadow-lg">
                <span className="text-3xl md:text-5xl font-bold text-white block">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs md:text-sm font-semibold text-[#C6A75E] tracking-wider">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center text-gray-300 text-sm md:text-base"
        >
          ¡No dejes pasar esta oportunidad única!
        </motion.p>
      </div>
    </motion.div>
  );
}