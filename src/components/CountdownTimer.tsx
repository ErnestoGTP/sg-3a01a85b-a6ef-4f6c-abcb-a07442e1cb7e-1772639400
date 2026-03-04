"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
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
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const targetDate = new Date(workshopConfig.event.registrationDeadline).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 text-center">
        <Clock className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-300 font-semibold">El registro ha cerrado</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#0B1C2D]/80 to-[#1a2942]/80 backdrop-blur-sm border border-[#C6A75E]/30 rounded-lg p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#C6A75E]" />
        <h3 className="text-lg font-semibold text-white">El taller comienza en:</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { value: timeLeft.days, label: "Días" },
          { value: timeLeft.hours, label: "Horas" },
          { value: timeLeft.minutes, label: "Minutos" },
          { value: timeLeft.seconds, label: "Segundos" },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="bg-gradient-to-br from-[#C6A75E]/20 to-[#C6A75E]/5 backdrop-blur-sm border border-[#C6A75E]/30 rounded-lg p-3 mb-2">
              <span className="text-3xl font-bold text-[#C6A75E] tabular-nums">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-sm text-gray-300 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Registro disponible hasta: <span className="text-[#C6A75E] font-semibold">{workshopConfig.event.date}</span>
        </p>
      </div>
    </div>
  );
}