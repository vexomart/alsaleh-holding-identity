import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HostingHero from "@/components/hosting/HostingHero";
import HostingFeatures from "@/components/hosting/HostingFeatures";
import HostingPricing from "@/components/hosting/HostingPricing";
import HostingStats from "@/components/hosting/HostingStats";
import HostingGuarantees from "@/components/hosting/HostingGuarantees";
import HostingCTA from "@/components/hosting/HostingCTA";
import { useState } from "react";

const HostingServices = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      <HostingHero />
      <HostingFeatures />
      <HostingPricing isYearly={isYearly} setIsYearly={setIsYearly} />
      <HostingStats />
      <HostingGuarantees />
      <HostingCTA />

      <Footer />
    </div>
  );
};

export default HostingServices;