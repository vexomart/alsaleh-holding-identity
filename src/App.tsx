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
const SoftwareProducts = lazy(() => import("./pages/SoftwareProducts"));
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
                <Route path="/software-products" element={<Suspense fallback={<PageLoader />}><SoftwareProducts /></Suspense>} />
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