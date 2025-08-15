import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/components/EnhancedNotifications";
import ScrollToTop from "@/components/ScrollToTop";
import { MobileOptimizer } from "@/components/MobileOptimizer";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

// Import pages directly without lazy loading to avoid hook issues
import Index from "./pages/Index";
import CurrentOffers from "./pages/CurrentOffers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  console.log('App component rendering...');
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ash-theme">
          <NotificationProvider>
            <TooltipProvider>
              <MobileOptimizer>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 mobile-text">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
                  
                  {/* Main content with mobile optimizations */}
                  <div className="relative z-10 mobile-tap mobile-scroll">
                    <ServiceWorkerRegistration />
                    
                    <Toaster />
                    <Sonner />
                    
                    <BrowserRouter>
                      <ScrollToTop />
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/current-offers" element={<CurrentOffers />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </div>
                </div>
              </MobileOptimizer>
            </TooltipProvider>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;