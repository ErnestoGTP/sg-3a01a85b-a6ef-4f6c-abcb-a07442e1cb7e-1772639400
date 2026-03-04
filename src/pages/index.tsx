import { GetServerSideProps } from "next";
import { supabase } from "@/integrations/supabase/client";
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
import { workshopConfig as staticConfig } from "@/config/workshop";

interface HomeProps {
  config: typeof staticConfig;
}

export default function Home({ config }: HomeProps) {
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
        <Hero onCTAClick={scrollToRegister} config={config} />
        <ProblemSection />
        <WhatIsPNL />
        <WhatYouWillLearn />
        <Testimonials />
        <TrainerSection />
        <WorkshopDetails onCTAClick={scrollToRegister} config={config} />
        <BonusGuarantee />
        <RegistrationForm />
        <FAQ />
        {/* Footer is handled in _app.tsx */}
        <WhatsAppButton />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Try to fetch dynamic config from Supabase
    const { data, error } = await supabase
      .from("workshop_config")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      console.warn("Using static config due to DB error or empty data:", error);
      return {
        props: {
          config: staticConfig,
        },
      };
    }

    // Merge dynamic data with static config structure
    const dynamicConfig = {
      ...staticConfig,
      event: {
        ...staticConfig.event,
        title: data.title || staticConfig.event.title,
        date: data.date ? new Date(data.date).toLocaleDateString("es-MX", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : staticConfig.event.date,
        time: data.time || staticConfig.event.time,
        location: data.location || staticConfig.event.location,
      },
      location: {
        ...staticConfig.location,
        name: data.location || staticConfig.location.name,
      },
      pricing: {
        ...staticConfig.pricing,
        price: data.price || staticConfig.pricing.price,
      },
    };

    return {
      props: {
        config: dynamicConfig,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        config: staticConfig,
      },
    };
  }
};