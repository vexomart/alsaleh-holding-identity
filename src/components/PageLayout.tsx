import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/ui/page-container";
import { PrayerTimesBar } from "@/components/PrayerTimesBar";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageContainer>
      <PrayerTimesBar />
      <Navigation />
      <main className="animate-fade-in pt-[48px] lg:pt-[112px]">
        {children}
      </main>
      <Footer />
    </PageContainer>
  );
}