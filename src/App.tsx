import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileOptimizer } from "@/components/MobileOptimizer";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";

// Lazy load components
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Support = lazy(() => import("./pages/Support"));
const Team = lazy(() => import("./pages/Team"));
const Vision = lazy(() => import("./pages/Vision"));
const Story = lazy(() => import("./pages/Story"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const SoftwareProducts = lazy(() => import("./pages/SoftwareProducts"));
const CurrentOffers = lazy(() => import("./pages/CurrentOffers"));
const FAQ = lazy(() => import("./pages/FAQ"));
const BusinessServices = lazy(() => import("./pages/BusinessServices"));
const DesignSolutions = lazy(() => import("./pages/DesignSolutions"));
const TechInvestment = lazy(() => import("./pages/TechInvestment"));
const Development = lazy(() => import("./pages/Development"));
const Training = lazy(() => import("./pages/Training"));
const Careers = lazy(() => import("./pages/Careers"));
const AIIntelligence = lazy(() => import("./pages/AIIntelligence"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground text-lg">جارٍ التحميل...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MobileOptimizer>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
                <Route path="/support" element={<Suspense fallback={<PageLoader />}><Support /></Suspense>} />
                <Route path="/team" element={<Suspense fallback={<PageLoader />}><Team /></Suspense>} />
                <Route path="/vision" element={<Suspense fallback={<PageLoader />}><Vision /></Suspense>} />
                <Route path="/story" element={<Suspense fallback={<PageLoader />}><Story /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<PageLoader />}><Terms /></Suspense>} />
                <Route path="/software-products" element={<Suspense fallback={<PageLoader />}><SoftwareProducts /></Suspense>} />
                <Route path="/current-offers" element={<Suspense fallback={<PageLoader />}><CurrentOffers /></Suspense>} />
                <Route path="/faq" element={<Suspense fallback={<PageLoader />}><FAQ /></Suspense>} />
                <Route path="/business-services" element={<Suspense fallback={<PageLoader />}><BusinessServices /></Suspense>} />
                <Route path="/design-solutions" element={<Suspense fallback={<PageLoader />}><DesignSolutions /></Suspense>} />
                <Route path="/tech-investment" element={<Suspense fallback={<PageLoader />}><TechInvestment /></Suspense>} />
                <Route path="/development" element={<Suspense fallback={<PageLoader />}><Development /></Suspense>} />
                <Route path="/training" element={<Suspense fallback={<PageLoader />}><Training /></Suspense>} />
                <Route path="/careers" element={<Suspense fallback={<PageLoader />}><Careers /></Suspense>} />
                <Route path="/ai-intelligence" element={<Suspense fallback={<PageLoader />}><AIIntelligence /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </MobileOptimizer>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;