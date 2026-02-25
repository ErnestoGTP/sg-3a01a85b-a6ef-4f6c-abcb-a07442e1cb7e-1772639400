import { useState, useRef } from "react";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatIsPNL } from "@/components/WhatIsPNL";
import { WhatYouWillLearn } from "@/components/WhatYouWillLearn";
import { WorkshopDetails } from "@/components/WorkshopDetails";
import { BonusGuarantee } from "@/components/BonusGuarantee";

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
      
      <main className="min-h-screen">
        <Hero onCTAClick={scrollToForm} />
        <ProblemSection />
        <WhatIsPNL />
        <WhatYouWillLearn />
        <WorkshopDetails onCTAClick={scrollToForm} />
        <BonusGuarantee />
        
        {/* Form section - Will add in next iteration */}
        <div ref={formRef} className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-[#0B1C2D] mb-6">
                Formulario de registro (próximamente)
              </h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}