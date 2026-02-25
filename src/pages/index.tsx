import { useRef } from "react";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatIsPNL } from "@/components/WhatIsPNL";
import { WhatYouWillLearn } from "@/components/WhatYouWillLearn";
import { WorkshopDetails } from "@/components/WorkshopDetails";
import { BonusGuarantee } from "@/components/BonusGuarantee";
import { Testimonials } from "@/components/Testimonials";
import { RegistrationForm } from "@/components/RegistrationForm";
import { FAQ } from "@/components/FAQ";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

        <Testimonials />

        <div ref={formRef} id="registro" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C6A75E]/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#0B1C2D]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <RegistrationForm />
          </div>
        </div>

        <FAQ />
        
        <WhatsAppButton />
      </main>
    </>
  );
}