import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/ui/page-container";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageContainer>
      <Navigation />
      <main className="animate-fade-in w-full overflow-x-hidden">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </PageContainer>
  );
}