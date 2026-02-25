import { useState, useRef } from "react";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatIsPNL } from "@/components/WhatIsPNL";
import { WhatYouWillLearn } from "@/components/WhatYouWillLearn";
import { WorkshopDetails } from "@/components/WorkshopDetails";
import { BonusGuarantee } from "@/components/BonusGuarantee";
import { RegistrationForm } from "@/components/RegistrationForm";
import { FAQ } from "@/components/FAQ";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Taller Presencial de PNL Básica - 2 Horas de Transformación"
        description="Descubre el poder de tu mente en solo 2 horas. Taller práctico de Programación Neurolingüística para transformar tu comunicación y seguridad personal. Cupos limitados."
        image="/og-image.png"
      />
      
      <main className="min-h-screen relative">
        <Hero onCTAClick={scrollToForm} />
        <ProblemSection />
        <WhatIsPNL />
        <WhatYouWillLearn />
        <WorkshopDetails onCTAClick={scrollToForm} />
        <BonusGuarantee />
        
        <div ref={formRef} className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C6A75E]/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#0B1C2D]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <RegistrationForm />
          </div>
        </div>

        <FAQ />
        
        <footer className="bg-[#0B1C2D] text-white py-12 border-t border-[#C6A75E]/20">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bold text-xl mb-4 text-white">PNL Fundamental</p>
            <p className="text-gray-400 text-sm mb-6">
              Transformando vidas a través de la comunicación consciente.
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Instituto PNL Fundamental. Todos los derechos reservados.
            </p>
          </div>
        </footer>

        <WhatsAppButton />
      </main>
    </>
  );
}