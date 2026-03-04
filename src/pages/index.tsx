import { SEO } from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatIsPNL } from "@/components/WhatIsPNL";
import { WhatYouWillLearn } from "@/components/WhatYouWillLearn";
import { WorkshopDetails } from "@/components/WorkshopDetails";
import { BonusGuarantee } from "@/components/BonusGuarantee";
import { RegistrationForm } from "@/components/RegistrationForm";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { TrainerSection } from "@/components/TrainerSection";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  const scrollToRegister = () => {
    const element = document.getElementById("registro");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] via-[#0f2942] to-[#0B1C2D]">
        {/* Navbar is handled in _app.tsx */}
        <Hero onCTAClick={scrollToRegister} />
        <ProblemSection />
        <WhatIsPNL />
        <WhatYouWillLearn />
        <Testimonials />
        <TrainerSection />
        <WorkshopDetails onCTAClick={scrollToRegister} />
        <BonusGuarantee />
        <RegistrationForm />
        <FAQ />
        {/* Footer is handled in _app.tsx */}
        <WhatsAppButton />
      </div>
    </>
  );
}