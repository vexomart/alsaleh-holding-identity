import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/ui/page-container";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageContainer>
      <Navigation />
      <main className="animate-fade-in">
        {children}
      </main>
      <Footer />
    </PageContainer>
  );
}