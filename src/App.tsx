import React, { lazy, Suspense, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";

import ScrollToTop from "@/components/ScrollToTop";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import { ReCaptchaProvider } from "@/components/ReCaptchaProvider";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { TemplateVariableBlocker } from "@/components/TemplateVariableBlocker";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

import Index from "./pages/Index";

// Lazy load pages for better performance
const OurWorks = lazy(() => import("./pages/OurWorks"));
const About = lazy(() => import("./pages/About"));
const Story = lazy(() => import("./pages/Story"));
const Team = lazy(() => import("./pages/Team"));
const Vision = lazy(() => import("./pages/Vision"));
const Contact = lazy(() => import("./pages/Contact"));
const Support = lazy(() => import("./pages/Support"));
const DatabaseSupport = lazy(() => import("./pages/support/DatabaseSupport"));
const AppSupport = lazy(() => import("./pages/support/AppSupport"));
const TechSystemsSupport = lazy(() => import("./pages/support/TechSystemsSupport"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contracts = lazy(() => import("./pages/Contracts"));
const JobApplicationPage = lazy(() => import("./pages/JobApplicationPage"));
const TechInvestment = lazy(() => import("./pages/TechInvestment"));
const Development = lazy(() => import("./pages/Development"));
const StrategicConsulting = lazy(() => import("./pages/StrategicConsulting"));
const IntegratedSolutions = lazy(() => import("./pages/IntegratedSolutions"));
const TechSolutions = lazy(() => import("./pages/services/TechSolutions"));
const BusinessSolutions = lazy(() => import("./pages/services/BusinessSolutions"));
const CloudSolutions = lazy(() => import("./pages/services/CloudSolutions"));
const SecuritySolutions = lazy(() => import("./pages/services/SecuritySolutions"));
const HostingServices = lazy(() => import("./pages/services/HostingServices"));
const Training = lazy(() => import("./pages/Training"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const DevelopmentProgram = lazy(() => import("./pages/DevelopmentProgram"));
const CompanyNews = lazy(() => import("./pages/CompanyNews"));
const PressReleases = lazy(() => import("./pages/PressReleases"));
const UpcomingEvents = lazy(() => import("./pages/UpcomingEvents"));
const AnnualReports = lazy(() => import("./pages/AnnualReports"));
const FAQ = lazy(() => import("./pages/FAQ"));
const DigitalContracts = lazy(() => import("./pages/DigitalContracts"));
const ReadyProjects = lazy(() => import("./pages/ReadyProjects"));

// Services Pages
const SocialMediaManagement = lazy(() => import("./pages/services/SocialMediaManagement"));
const SEOServices = lazy(() => import("./pages/services/SEOServices"));
const FacebookAds = lazy(() => import("./pages/services/FacebookAds"));
const ProductPhotography = lazy(() => import("./pages/services/ProductPhotography"));
const ContentWriting = lazy(() => import("./pages/services/ContentWriting"));
const VideoProduction = lazy(() => import("./pages/services/VideoProduction"));
const GoogleAdsPage = lazy(() => import("./pages/services/GoogleAds"));
const CRMSystem = lazy(() => import("./pages/services/CRMSystem"));
const RemoteWork = lazy(() => import("./pages/RemoteWork"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const AIIntelligence = lazy(() => import("./pages/AIIntelligence"));
const GenerativeAI = lazy(() => import("./pages/ai-services/GenerativeAI"));
const ComputerVision = lazy(() => import("./pages/ai-services/ComputerVision"));
const NaturalLanguageProcessing = lazy(() => import("./pages/ai-services/NaturalLanguageProcessing"));
const PredictiveAnalytics = lazy(() => import("./pages/ai-services/PredictiveAnalytics"));
const SmartAutomation = lazy(() => import("./pages/ai-services/SmartAutomation"));
const SmartSecurity = lazy(() => import("./pages/ai-services/SmartSecurity"));
const FreeTrial = lazy(() => import("./pages/FreeTrial"));
const IoTSolutions = lazy(() => import("./pages/IoTSolutions"));
const NLPSolutions = lazy(() => import("./pages/NLPSolutions"));
const ComputerVisionPage = lazy(() => import("./pages/ComputerVision"));
const MachineLearning = lazy(() => import("./pages/MachineLearning"));
const SmartAssistants = lazy(() => import("./pages/SmartAssistants"));
const SmartAnalytics = lazy(() => import("./pages/SmartAnalytics"));

const GlobalPresence = lazy(() => import("./pages/GlobalPresence"));
const Careers = lazy(() => import("./pages/Careers"));
const TechProjects = lazy(() => import("./pages/TechProjects"));
const TechProjectDetails = lazy(() => import("./pages/TechProjectDetails"));
const Technologies = lazy(() => import("./pages/Technologies"));
const CurrentOffers = lazy(() => import("./pages/CurrentOffers"));
const OfferDetails = lazy(() => import("./pages/OfferDetails"));
const ProfessionalServices = lazy(() => import("./pages/ProfessionalServices"));
const ContentCreation = lazy(() => import("./pages/ContentCreation"));
const DesignSolutions = lazy(() => import("./pages/DesignSolutions"));
const Subsidiaries = lazy(() => import("./pages/Subsidiaries"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentVerification = lazy(() => import("./pages/PaymentVerification"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const AffiliateMarketing = lazy(() => import("./pages/AffiliateMarketing"));
const BusinessServices = lazy(() => import("./pages/BusinessServices"));
const TechnicalServices = lazy(() => import("./pages/TechnicalServices"));
const BusinessConsulting = lazy(() => import("./pages/business-services/BusinessConsulting"));
const DigitalTransformation = lazy(() => import("./pages/business-services/DigitalTransformation"));
const FinancialPlanning = lazy(() => import("./pages/business-services/FinancialPlanning"));
const DepartmentDetails = lazy(() => import("./pages/DepartmentDetails"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const StartWithUs = lazy(() => import("./pages/StartWithUs"));
const BookConsultation = lazy(() => import("./pages/BookConsultation"));
const Consultation = lazy(() => import("./pages/Consultation"));
const StartProject = lazy(() => import("./pages/StartProject"));
const AutomationSystem = lazy(() => import("./pages/AutomationSystem"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));

const CompanyUpdates = lazy(() => import("./pages/CompanyUpdates"));
const SoftwareProducts = lazy(() => import("./pages/SoftwareProducts"));
const CarRentalWebsite = lazy(() => import("./pages/CarRentalWebsite"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const CarRentalLanding = lazy(() => import("./pages/CarRentalLanding"));
const AboutUs = lazy(() => import("./pages/car-rental/AboutUs"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));

const Websites = lazy(() => import("./pages/Websites"));
const MobileApps = lazy(() => import("./pages/MobileApps"));
const CarRentalFAQ = lazy(() => import("./pages/car-rental/FAQ"));
const CarRentalTerms = lazy(() => import("./pages/car-rental/Terms"));
const CarRentalPrivacy = lazy(() => import("./pages/car-rental/Privacy"));
const CarRentalUserGuide = lazy(() => import("./pages/car-rental/UserGuide"));
const CarRentalInsurancePolicy = lazy(() => import("./pages/car-rental/InsurancePolicy"));
const CarRentalCompanyNews = lazy(() => import("./pages/car-rental/CompanyNews"));
const CarRentalServices = lazy(() => import("./pages/car-rental/Services"));
const CarRentalContactUs = lazy(() => import("./pages/car-rental/ContactUs"));
const CarRentalSubServices = lazy(() => import("./pages/car-rental/SubServices"));
const CarRentalEconomyCars = lazy(() => import("./pages/car-rental/services/EconomyCars"));
const CarRentalLuxuryCars = lazy(() => import("./pages/car-rental/services/LuxuryCars"));
const CarRentalElectricCars = lazy(() => import("./pages/car-rental/services/ElectricCars"));
const CarRentalFamilyCars = lazy(() => import("./pages/car-rental/services/FamilyCars"));
const CarRentalBranches = lazy(() => import("./pages/car-rental/contact/Branches"));
const CarRentalComplaints = lazy(() => import("./pages/car-rental/contact/ComplaintsSuggestions"));
const CarFleet = lazy(() => import("./pages/CarFleet"));
const CarBooking = lazy(() => import("./pages/CarBooking"));
const EmailTest = lazy(() => import("./pages/EmailTest"));
const EnhancedDesignCategory = lazy(() => import("./pages/EnhancedDesignCategory"));
const Complaints = lazy(() => import("./pages/Complaints"));

const EnterpriseDevelopment = lazy(() => import("./pages/enterprise/EnterpriseDevelopment"));
const EnterpriseBranding = lazy(() => import("./pages/enterprise/EnterpriseBranding"));

const TechEcosystem = lazy(() => import("./pages/TechEcosystem"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ConstructionWebsite = lazy(() => import("./pages/ConstructionWebsite"));
const DigitalMarketingWebsite = lazy(() => import("./pages/DigitalMarketingWebsite"));
const ElectronicCardsStore = lazy(() => import("./pages/ElectronicCardsStore"));
const ElectronicGamesStore = lazy(() => import("./pages/ElectronicGamesStore"));
const ElectronicCardsWebsite = lazy(() => import("./pages/ElectronicCardsWebsite"));
const CardsStoreAbout = lazy(() => import("./pages/cards-store/About"));
const CardsStoreContact = lazy(() => import("./pages/cards-store/Contact"));
const AshHolding = lazy(() => import("./pages/AshHolding"));
const CardsStoreFAQ = lazy(() => import("./pages/cards-store/FAQ"));
const CardsStorePrivacy = lazy(() => import("./pages/cards-store/Privacy"));
const CardsStoreTerms = lazy(() => import("./pages/cards-store/Terms"));
const KashkhaAbayaStore = lazy(() => import("./pages/KashkhaAbayaStore"));
const ProductDetails = lazy(() => import("./pages/cards-store/ProductDetails"));
const LuxuryAbayas = lazy(() => import("./pages/abaya-categories/LuxuryAbayas"));
const CasualAbayas = lazy(() => import("./pages/abaya-categories/CasualAbayas"));
const FormalAbayas = lazy(() => import("./pages/abaya-categories/FormalAbayas"));
const SportsAbayas = lazy(() => import("./pages/abaya-categories/SportsAbayas"));
const WeddingAbayas = lazy(() => import("./pages/abaya-categories/WeddingAbayas"));
const TraditionalAbayas = lazy(() => import("./pages/abaya-categories/TraditionalAbayas"));
const AbayaAboutUs = lazy(() => import("./pages/abaya-categories/AboutUs"));
const AbayaContactUs = lazy(() => import("./pages/abaya-categories/ContactUs"));
const ShippingDelivery = lazy(() => import("./pages/abaya-categories/ShippingDelivery"));
const ReturnProcedures = lazy(() => import("./pages/abaya-categories/ReturnProcedures"));
const ReturnPolicy = lazy(() => import("./pages/abaya-categories/ReturnPolicy"));
const HelpCenter = lazy(() => import("./pages/abaya-categories/HelpCenter"));

const ServicesCatalog = lazy(() => import("./pages/ServicesCatalog"));
const DigitalMarketing = lazy(() => import("./pages/DigitalMarketing"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const EnhancedPaymentPage = lazy(() => import("./pages/EnhancedPaymentPage"));
const SocialResponsibility = lazy(() => import("./pages/SocialResponsibility"));
const IntegratedServicesPage = lazy(() => import("./pages/IntegratedServicesPage"));

// NEW DASHBOARDS - Clean Architecture
const AuthLogin = lazy(() => import("./pages/auth/Login"));
const AuthRegister = lazy(() => import("./pages/auth/Register"));
const AuthForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AuthResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const CustomerDashboard = lazy(() => import("./pages/app/Dashboard"));
const CustomerOrderDetails = lazy(() => import("./pages/app/OrderDetails"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground text-lg">جارٍ التحميل...</p>
    </div>
  </div>
);

/**
 * RTL-Aware App Shell
 * Applies direction from language context to the root wrapper
 * This is the SINGLE SOURCE OF TRUTH for app-level direction
 * 
 * CRITICAL: This component ensures RTL is applied consistently
 * across the entire application regardless of component hierarchy
 */
const RTLAppShell = ({ children }: { children: React.ReactNode }) => {
  const { isRTL, language } = useLanguage();
  
  // Sync document direction when language changes
  useEffect(() => {
    const dir = isRTL ? 'rtl' : 'ltr';
    
    // Apply to html
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-direction', dir);
    
    // Apply to body
    document.body.dir = dir;
    document.body.setAttribute('data-lang', language);
    
    // Toggle classes
    document.documentElement.classList.toggle('rtl', isRTL);
    document.documentElement.classList.toggle('ltr', !isRTL);
    document.body.classList.toggle('rtl', isRTL);
    document.body.classList.toggle('ltr', !isRTL);
  }, [isRTL, language]);
  
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        "min-h-screen bg-background mobile-text rtl-root",
        isRTL ? "text-right" : "text-left"
      )}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="relative z-10 mobile-tap mobile-scroll">
        {children}
      </div>
    </div>
  );
};

// Create QueryClient outside component to avoid recreation and React hooks issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount: number, error: any) => {
        if (failureCount < 2 && error?.status !== 404) {
          return true;
        }
        return false;
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <TooltipProvider>
                <ReCaptchaProvider>
                  <RTLAppShell>
                      <SecurityHeaders />
                      <TemplateVariableBlocker />
                      <AnalyticsProvider />
                      <ScrollToTop />
                      <Toaster />
                      <Sonner />
                    
                    <Routes>
                      {/* Public Website */}
                      <Route path="/" element={<Index />} />
                      
{/* Auth Routes - CLEAN */}
                      <Route path="/auth/login" element={<Suspense fallback={<PageLoader />}><AuthLogin /></Suspense>} />
                      <Route path="/auth/register" element={<Suspense fallback={<PageLoader />}><AuthRegister /></Suspense>} />
                      <Route path="/auth/forgot-password" element={<Suspense fallback={<PageLoader />}><AuthForgotPassword /></Suspense>} />
                      <Route path="/auth/reset-password" element={<Suspense fallback={<PageLoader />}><AuthResetPassword /></Suspense>} />
                      
                      {/* Admin Dashboard - /admin/* */}
                      <Route path="/admin/*" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
                      
                      {/* Customer Dashboard - /app/* */}
                      <Route path="/app/orders/:id" element={<Suspense fallback={<PageLoader />}><CustomerOrderDetails /></Suspense>} />
                      <Route path="/app/*" element={<Suspense fallback={<PageLoader />}><CustomerDashboard /></Suspense>} />
                      
                      {/* Company Pages */}
                      <Route path="/company-profile" element={<Suspense fallback={<PageLoader />}><CompanyProfile /></Suspense>} />
                      <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
                      <Route path="/story" element={<Suspense fallback={<PageLoader />}><Story /></Suspense>} />
                      <Route path="/team" element={<Suspense fallback={<PageLoader />}><Team /></Suspense>} />
                      <Route path="/vision" element={<Suspense fallback={<PageLoader />}><Vision /></Suspense>} />
                      <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
                      <Route path="/support" element={<Suspense fallback={<PageLoader />}><Support /></Suspense>} />
                      <Route path="/support/database" element={<Suspense fallback={<PageLoader />}><DatabaseSupport /></Suspense>} />
                      <Route path="/support/applications" element={<Suspense fallback={<PageLoader />}><AppSupport /></Suspense>} />
                      <Route path="/support/tech-systems" element={<Suspense fallback={<PageLoader />}><TechSystemsSupport /></Suspense>} />
                      <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
                      <Route path="/cookie-policy" element={<Suspense fallback={<PageLoader />}><CookiePolicy /></Suspense>} />
                      <Route path="/terms" element={<Suspense fallback={<PageLoader />}><Terms /></Suspense>} />
                      <Route path="/careers" element={<Suspense fallback={<PageLoader />}><Careers /></Suspense>} />
                      <Route path="/jobs" element={<Suspense fallback={<PageLoader />}><Careers /></Suspense>} />
                      <Route path="/job-application" element={<Suspense fallback={<PageLoader />}><JobApplicationPage /></Suspense>} />
                      <Route path="/our-works" element={<Suspense fallback={<PageLoader />}><OurWorks /></Suspense>} />
                      <Route path="/works" element={<Suspense fallback={<PageLoader />}><OurWorks /></Suspense>} />
                      
                      {/* Services */}
                      <Route path="/tech-investment" element={<Suspense fallback={<PageLoader />}><TechInvestment /></Suspense>} />
                      <Route path="/development" element={<Suspense fallback={<PageLoader />}><Development /></Suspense>} />
                      <Route path="/strategic-consulting" element={<Suspense fallback={<PageLoader />}><StrategicConsulting /></Suspense>} />
                      <Route path="/integrated-solutions" element={<Suspense fallback={<PageLoader />}><IntegratedSolutions /></Suspense>} />
                      <Route path="/services/tech-solutions" element={<Suspense fallback={<PageLoader />}><TechSolutions /></Suspense>} />
                      <Route path="/services/business-solutions" element={<Suspense fallback={<PageLoader />}><BusinessSolutions /></Suspense>} />
                      <Route path="/services/cloud-solutions" element={<Suspense fallback={<PageLoader />}><CloudSolutions /></Suspense>} />
                      <Route path="/services/security-solutions" element={<Suspense fallback={<PageLoader />}><SecuritySolutions /></Suspense>} />
                      <Route path="/hosting-services" element={<Suspense fallback={<PageLoader />}><HostingServices /></Suspense>} />
                      <Route path="/services/hosting" element={<Suspense fallback={<PageLoader />}><HostingServices /></Suspense>} />
                      <Route path="/services/social-media" element={<Suspense fallback={<PageLoader />}><SocialMediaManagement /></Suspense>} />
                      <Route path="/social-media" element={<Suspense fallback={<PageLoader />}><SocialMediaManagement /></Suspense>} />
                      <Route path="/services/seo" element={<Suspense fallback={<PageLoader />}><SEOServices /></Suspense>} />
                      <Route path="/seo-services" element={<Suspense fallback={<PageLoader />}><SEOServices /></Suspense>} />
                      <Route path="/services/facebook-ads" element={<Suspense fallback={<PageLoader />}><FacebookAds /></Suspense>} />
                      <Route path="/facebook-ads" element={<Suspense fallback={<PageLoader />}><FacebookAds /></Suspense>} />
                      <Route path="/services/photography" element={<Suspense fallback={<PageLoader />}><ProductPhotography /></Suspense>} />
                      <Route path="/product-photography" element={<Suspense fallback={<PageLoader />}><ProductPhotography /></Suspense>} />
                      <Route path="/services/content-writing" element={<Suspense fallback={<PageLoader />}><ContentWriting /></Suspense>} />
                      <Route path="/content-writing" element={<Suspense fallback={<PageLoader />}><ContentWriting /></Suspense>} />
                      <Route path="/video-production" element={<Suspense fallback={<PageLoader />}><VideoProduction /></Suspense>} />
                      <Route path="/services/video" element={<Suspense fallback={<PageLoader />}><VideoProduction /></Suspense>} />
                      <Route path="/google-ads" element={<Suspense fallback={<PageLoader />}><GoogleAdsPage /></Suspense>} />
                      <Route path="/services/google-ads" element={<Suspense fallback={<PageLoader />}><GoogleAdsPage /></Suspense>} />
                      <Route path="/crm-system" element={<Suspense fallback={<PageLoader />}><CRMSystem /></Suspense>} />
                      <Route path="/services/crm" element={<Suspense fallback={<PageLoader />}><CRMSystem /></Suspense>} />
                      <Route path="/brand-identity" element={<Suspense fallback={<PageLoader />}><DesignSolutions /></Suspense>} />
                      <Route path="/remote-work" element={<Suspense fallback={<PageLoader />}><RemoteWork /></Suspense>} />
                      <Route path="/services-catalog" element={<Suspense fallback={<PageLoader />}><ServicesCatalog /></Suspense>} />
                      <Route path="/integrated-services" element={<Suspense fallback={<PageLoader />}><IntegratedServicesPage /></Suspense>} />
                      
                      {/* AI Services */}
                      <Route path="/ai-solutions" element={<Suspense fallback={<PageLoader />}><AIIntelligence /></Suspense>} />
                      <Route path="/ai-services/generative" element={<Suspense fallback={<PageLoader />}><GenerativeAI /></Suspense>} />
                      <Route path="/ai-services/vision" element={<Suspense fallback={<PageLoader />}><ComputerVision /></Suspense>} />
                      <Route path="/ai-services/nlp" element={<Suspense fallback={<PageLoader />}><NaturalLanguageProcessing /></Suspense>} />
                      <Route path="/ai-services/analytics" element={<Suspense fallback={<PageLoader />}><PredictiveAnalytics /></Suspense>} />
                      <Route path="/ai-services/automation" element={<Suspense fallback={<PageLoader />}><SmartAutomation /></Suspense>} />
                      <Route path="/ai-services/security" element={<Suspense fallback={<PageLoader />}><SmartSecurity /></Suspense>} />
                      <Route path="/iot-solutions" element={<Suspense fallback={<PageLoader />}><IoTSolutions /></Suspense>} />
                      <Route path="/cloud-solutions" element={<Suspense fallback={<PageLoader />}><CloudSolutions /></Suspense>} />
                      <Route path="/security-solutions" element={<Suspense fallback={<PageLoader />}><SecuritySolutions /></Suspense>} />
                      <Route path="/nlp-solutions" element={<Suspense fallback={<PageLoader />}><NLPSolutions /></Suspense>} />
                      <Route path="/computer-vision" element={<Suspense fallback={<PageLoader />}><ComputerVisionPage /></Suspense>} />
                      <Route path="/machine-learning" element={<Suspense fallback={<PageLoader />}><MachineLearning /></Suspense>} />
                      <Route path="/smart-assistants" element={<Suspense fallback={<PageLoader />}><SmartAssistants /></Suspense>} />
                      <Route path="/smart-analytics" element={<Suspense fallback={<PageLoader />}><SmartAnalytics /></Suspense>} />
                      
                      {/* Business Services */}
                      <Route path="/business-services" element={<Suspense fallback={<PageLoader />}><BusinessServices /></Suspense>} />
                      <Route path="/business-services/consulting" element={<Suspense fallback={<PageLoader />}><BusinessConsulting /></Suspense>} />
                      <Route path="/business-services/transformation" element={<Suspense fallback={<PageLoader />}><DigitalTransformation /></Suspense>} />
                      <Route path="/business-services/financial" element={<Suspense fallback={<PageLoader />}><FinancialPlanning /></Suspense>} />
                      <Route path="/technical-services" element={<Suspense fallback={<PageLoader />}><TechnicalServices /></Suspense>} />
                      <Route path="/professional-services" element={<Suspense fallback={<PageLoader />}><ProfessionalServices /></Suspense>} />
                      <Route path="/content-creation" element={<Suspense fallback={<PageLoader />}><ContentCreation /></Suspense>} />
                      <Route path="/design-solutions" element={<Suspense fallback={<PageLoader />}><DesignSolutions /></Suspense>} />
                      <Route path="/digital-marketing" element={<Suspense fallback={<PageLoader />}><DigitalMarketing /></Suspense>} />
                      
                      {/* Projects & Products */}
                      <Route path="/tech-projects" element={<Suspense fallback={<PageLoader />}><TechProjects /></Suspense>} />
                      <Route path="/tech-projects/:id" element={<Suspense fallback={<PageLoader />}><TechProjectDetails /></Suspense>} />
                      <Route path="/project/:id" element={<Suspense fallback={<PageLoader />}><ProjectDetails /></Suspense>} />
                      <Route path="/software-products" element={<Suspense fallback={<PageLoader />}><SoftwareProducts /></Suspense>} />
                      <Route path="/websites" element={<Suspense fallback={<PageLoader />}><Websites /></Suspense>} />
                      <Route path="/mobile-apps" element={<Suspense fallback={<PageLoader />}><MobileApps /></Suspense>} />
                      <Route path="/ready-projects" element={<Suspense fallback={<PageLoader />}><ReadyProjects /></Suspense>} />
                      <Route path="/technologies" element={<Suspense fallback={<PageLoader />}><Technologies /></Suspense>} />
                      <Route path="/tech-ecosystem" element={<Suspense fallback={<PageLoader />}><TechEcosystem /></Suspense>} />
                      
                      {/* Offers & Pricing */}
                      <Route path="/offers" element={<Suspense fallback={<PageLoader />}><CurrentOffers /></Suspense>} />
                      <Route path="/offers/:id" element={<Suspense fallback={<PageLoader />}><OfferDetails /></Suspense>} />
                      <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><PricingPage /></Suspense>} />
                      <Route path="/free-trial" element={<Suspense fallback={<PageLoader />}><FreeTrial /></Suspense>} />
                      
                      {/* Payment */}
                      <Route path="/payment" element={<Suspense fallback={<PageLoader />}><PaymentPage /></Suspense>} />
                      <Route path="/payment/enhanced" element={<Suspense fallback={<PageLoader />}><EnhancedPaymentPage /></Suspense>} />
                      <Route path="/payment-methods" element={<Suspense fallback={<PageLoader />}><PaymentMethods /></Suspense>} />
                      <Route path="/payment/success" element={<Suspense fallback={<PageLoader />}><PaymentSuccess /></Suspense>} />
                      <Route path="/payment/verify" element={<Suspense fallback={<PageLoader />}><PaymentVerification /></Suspense>} />
                      <Route path="/payment/cancel" element={<Suspense fallback={<PageLoader />}><PaymentCancel /></Suspense>} />
                      <Route path="/payment-success" element={<Suspense fallback={<PageLoader />}><PaymentSuccessPage /></Suspense>} />
                      
                      {/* Company Info */}
                      <Route path="/subsidiaries" element={<Suspense fallback={<PageLoader />}><Subsidiaries /></Suspense>} />
                      <Route path="/partnerships" element={<Suspense fallback={<PageLoader />}><Partnerships /></Suspense>} />
                      <Route path="/affiliate" element={<Suspense fallback={<PageLoader />}><AffiliateMarketing /></Suspense>} />
                      <Route path="/global-presence" element={<Suspense fallback={<PageLoader />}><GlobalPresence /></Suspense>} />
                      <Route path="/social-responsibility" element={<Suspense fallback={<PageLoader />}><SocialResponsibility /></Suspense>} />
                      
                      {/* News & Updates */}
                      <Route path="/news" element={<Suspense fallback={<PageLoader />}><CompanyNews /></Suspense>} />
                      <Route path="/press" element={<Suspense fallback={<PageLoader />}><PressReleases /></Suspense>} />
                      <Route path="/events" element={<Suspense fallback={<PageLoader />}><UpcomingEvents /></Suspense>} />
                      <Route path="/reports" element={<Suspense fallback={<PageLoader />}><AnnualReports /></Suspense>} />
                      <Route path="/updates" element={<Suspense fallback={<PageLoader />}><CompanyUpdates /></Suspense>} />
                      
                      {/* Training & Programs */}
                      <Route path="/training" element={<Suspense fallback={<PageLoader />}><Training /></Suspense>} />
                      <Route path="/volunteer" element={<Suspense fallback={<PageLoader />}><Volunteer /></Suspense>} />
                      <Route path="/development-program" element={<Suspense fallback={<PageLoader />}><DevelopmentProgram /></Suspense>} />
                      
                      {/* Forms & Actions */}
                      <Route path="/contracts" element={<Suspense fallback={<PageLoader />}><Contracts /></Suspense>} />
                      <Route path="/digital-contracts" element={<Suspense fallback={<PageLoader />}><DigitalContracts /></Suspense>} />
                      <Route path="/start-with-us" element={<Suspense fallback={<PageLoader />}><StartWithUs /></Suspense>} />
                      <Route path="/book-consultation" element={<Suspense fallback={<PageLoader />}><BookConsultation /></Suspense>} />
                      <Route path="/consultation" element={<Suspense fallback={<PageLoader />}><Consultation /></Suspense>} />
                      <Route path="/start-project" element={<Suspense fallback={<PageLoader />}><StartProject /></Suspense>} />
                      <Route path="/automation" element={<Suspense fallback={<PageLoader />}><AutomationSystem /></Suspense>} />
                      <Route path="/complaints" element={<Suspense fallback={<PageLoader />}><Complaints /></Suspense>} />
                      
                      {/* Help */}
                      <Route path="/faq" element={<Suspense fallback={<PageLoader />}><FAQ /></Suspense>} />
                      <Route path="/user-guide" element={<Suspense fallback={<PageLoader />}><UserGuide /></Suspense>} />
                      <Route path="/sitemap" element={<Suspense fallback={<PageLoader />}><Sitemap /></Suspense>} />
                      <Route path="/department/:id" element={<Suspense fallback={<PageLoader />}><DepartmentDetails /></Suspense>} />
                      
                      {/* Enterprise */}
                      <Route path="/enterprise/development" element={<Suspense fallback={<PageLoader />}><EnterpriseDevelopment /></Suspense>} />
                      <Route path="/enterprise/branding" element={<Suspense fallback={<PageLoader />}><EnterpriseBranding /></Suspense>} />
                      <Route path="/design-category" element={<Suspense fallback={<PageLoader />}><EnhancedDesignCategory /></Suspense>} />
                      
                      {/* Car Rental */}
                      <Route path="/car-rental" element={<Suspense fallback={<PageLoader />}><CarRentalLanding /></Suspense>} />
                      <Route path="/car-rental-website" element={<Suspense fallback={<PageLoader />}><CarRentalWebsite /></Suspense>} />
                      <Route path="/car-rental/about" element={<Suspense fallback={<PageLoader />}><AboutUs /></Suspense>} />
                      <Route path="/car-rental/faq" element={<Suspense fallback={<PageLoader />}><CarRentalFAQ /></Suspense>} />
                      <Route path="/car-rental/terms" element={<Suspense fallback={<PageLoader />}><CarRentalTerms /></Suspense>} />
                      <Route path="/car-rental/privacy" element={<Suspense fallback={<PageLoader />}><CarRentalPrivacy /></Suspense>} />
                      <Route path="/car-rental/guide" element={<Suspense fallback={<PageLoader />}><CarRentalUserGuide /></Suspense>} />
                      <Route path="/car-rental/insurance" element={<Suspense fallback={<PageLoader />}><CarRentalInsurancePolicy /></Suspense>} />
                      <Route path="/car-rental/news" element={<Suspense fallback={<PageLoader />}><CarRentalCompanyNews /></Suspense>} />
                      <Route path="/car-rental/services" element={<Suspense fallback={<PageLoader />}><CarRentalServices /></Suspense>} />
                      <Route path="/car-rental/contact" element={<Suspense fallback={<PageLoader />}><CarRentalContactUs /></Suspense>} />
                      <Route path="/car-rental/sub-services" element={<Suspense fallback={<PageLoader />}><CarRentalSubServices /></Suspense>} />
                      <Route path="/car-rental/services/economy" element={<Suspense fallback={<PageLoader />}><CarRentalEconomyCars /></Suspense>} />
                      <Route path="/car-rental/services/luxury" element={<Suspense fallback={<PageLoader />}><CarRentalLuxuryCars /></Suspense>} />
                      <Route path="/car-rental/services/electric" element={<Suspense fallback={<PageLoader />}><CarRentalElectricCars /></Suspense>} />
                      <Route path="/car-rental/services/family" element={<Suspense fallback={<PageLoader />}><CarRentalFamilyCars /></Suspense>} />
                      <Route path="/car-rental/contact/branches" element={<Suspense fallback={<PageLoader />}><CarRentalBranches /></Suspense>} />
                      <Route path="/car-rental/contact/complaints" element={<Suspense fallback={<PageLoader />}><CarRentalComplaints /></Suspense>} />
                      <Route path="/car-rental/careers" element={<Suspense fallback={<PageLoader />}><CareersPage /></Suspense>} />
                      <Route path="/car-fleet" element={<Suspense fallback={<PageLoader />}><CarFleet /></Suspense>} />
                      <Route path="/car-booking" element={<Suspense fallback={<PageLoader />}><CarBooking /></Suspense>} />
                      
                      {/* Stores */}
                      <Route path="/cards-store" element={<Suspense fallback={<PageLoader />}><ElectronicCardsStore /></Suspense>} />
                      <Route path="/cards-store/about" element={<Suspense fallback={<PageLoader />}><CardsStoreAbout /></Suspense>} />
                      <Route path="/cards-store/contact" element={<Suspense fallback={<PageLoader />}><CardsStoreContact /></Suspense>} />
                      <Route path="/cards-store/faq" element={<Suspense fallback={<PageLoader />}><CardsStoreFAQ /></Suspense>} />
                      <Route path="/cards-store/privacy" element={<Suspense fallback={<PageLoader />}><CardsStorePrivacy /></Suspense>} />
                      <Route path="/cards-store/terms" element={<Suspense fallback={<PageLoader />}><CardsStoreTerms /></Suspense>} />
                      <Route path="/cards-store/product/:id" element={<Suspense fallback={<PageLoader />}><ProductDetails /></Suspense>} />
                      <Route path="/cards-store/cards" element={<Suspense fallback={<PageLoader />}><ElectronicCardsWebsite /></Suspense>} />
                      <Route path="/games-store" element={<Suspense fallback={<PageLoader />}><ElectronicGamesStore /></Suspense>} />
                      
                      {/* Abaya Store */}
                      <Route path="/abayati-store" element={<Suspense fallback={<PageLoader />}><KashkhaAbayaStore /></Suspense>} />
                      <Route path="/abayati-store/luxury" element={<Suspense fallback={<PageLoader />}><LuxuryAbayas /></Suspense>} />
                      <Route path="/abayati-store/casual" element={<Suspense fallback={<PageLoader />}><CasualAbayas /></Suspense>} />
                      <Route path="/abayati-store/formal" element={<Suspense fallback={<PageLoader />}><FormalAbayas /></Suspense>} />
                      <Route path="/abayati-store/sports" element={<Suspense fallback={<PageLoader />}><SportsAbayas /></Suspense>} />
                      <Route path="/abayati-store/wedding" element={<Suspense fallback={<PageLoader />}><WeddingAbayas /></Suspense>} />
                      <Route path="/abayati-store/traditional" element={<Suspense fallback={<PageLoader />}><TraditionalAbayas /></Suspense>} />
                      <Route path="/abayati-store/about" element={<Suspense fallback={<PageLoader />}><AbayaAboutUs /></Suspense>} />
                      <Route path="/abayati-store/contact" element={<Suspense fallback={<PageLoader />}><AbayaContactUs /></Suspense>} />
                      <Route path="/abayati-store/shipping" element={<Suspense fallback={<PageLoader />}><ShippingDelivery /></Suspense>} />
                      <Route path="/abayati-store/returns" element={<Suspense fallback={<PageLoader />}><ReturnProcedures /></Suspense>} />
                      <Route path="/abayati-store/return-policy" element={<Suspense fallback={<PageLoader />}><ReturnPolicy /></Suspense>} />
                      <Route path="/abayati-store/help" element={<Suspense fallback={<PageLoader />}><HelpCenter /></Suspense>} />
                      
                      {/* Other Sites */}
                      <Route path="/construction" element={<Suspense fallback={<PageLoader />}><ConstructionWebsite /></Suspense>} />
                      <Route path="/digital-marketing-site" element={<Suspense fallback={<PageLoader />}><DigitalMarketingWebsite /></Suspense>} />
                      <Route path="/ash" element={<Suspense fallback={<PageLoader />}><AshHolding /></Suspense>} />
                      
                      {/* Dev/Test */}
                      <Route path="/email-test" element={<Suspense fallback={<PageLoader />}><EmailTest /></Suspense>} />
                      
                      {/* 404 */}
                      <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
                  </Routes>
                  </RTLAppShell>
                </ReCaptchaProvider>
              </TooltipProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
