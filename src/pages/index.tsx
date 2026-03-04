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
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SpotsIndicator } from "@/components/SpotsIndicator";

export default function Home() {
  const scrollToRegistration = () => {
    const form = document.getElementById("registration-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero onCTAClick={scrollToRegistration} />
        
        <div className="container mx-auto px-4 py-12 space-y-8">
          <CountdownTimer />
          <SpotsIndicator />
        </div>

        <ProblemSection />
        <WhatIsPNL />
        <WhatYouWillLearn />
        <WorkshopDetails onCTAClick={scrollToRegistration} />
        <TrainerSection />
        <Testimonials />
        <BonusGuarantee />
        <RegistrationForm />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}