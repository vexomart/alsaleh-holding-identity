/**
 * PageLayout - RTL-Native Page Layout Wrapper
 * Enforces strict RTL direction for all public pages
 */

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
      <div dir="rtl" className="w-full text-start">
        <Navigation />
        <main className="animate-fade-in">
          {children}
        </main>
        <Footer />
      </div>
    </PageContainer>
  );
}