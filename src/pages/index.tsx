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
import { TrainerSection } from "@/components/TrainerSection";
import { workshopConfig } from "@/config/workshop";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <SEO
        title={workshopConfig.seo.title}
        description={workshopConfig.seo.description}
        image={workshopConfig.seo.ogImage}
        url="/"
      />
      
      <main>
        <Hero onCTAClick={scrollToForm} />
        <ProblemSection />
        <WhatIsPNL />
        <WhatYouWillLearn />
        <TrainerSection />
        <WorkshopDetails onCTAClick={scrollToForm} />
        <BonusGuarantee />
        <Testimonials />

        <div ref={formRef} id="registro" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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