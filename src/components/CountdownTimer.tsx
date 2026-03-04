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
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = (): TimeLeft => {
      const targetDate = new Date(workshopConfig.event.date);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-[#C6A75E]" />
          <h3 className="text-2xl font-bold text-white">
            El Taller Comienza En:
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[0, 0, 0, 0].map((_, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4">
              <div className="text-4xl font-bold text-[#C6A75E] mb-2">--</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Minutos" },
    { value: timeLeft.seconds, label: "Segundos" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-[#0B1C2D] to-[#1a3a52] rounded-2xl p-8 text-center shadow-2xl border border-[#C6A75E]/20"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-[#C6A75E] animate-pulse" />
        <h3 className="text-2xl font-bold text-white">
          El Taller Comienza En:
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <motion.div
              key={unit.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-[#C6A75E] mb-2 font-mono"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.div>
            <div className="text-sm text-white/80 uppercase tracking-wider">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-[#C6A75E] font-semibold"
      >
        ¡No dejes pasar esta oportunidad única!
      </motion.p>
    </motion.div>
  );
}