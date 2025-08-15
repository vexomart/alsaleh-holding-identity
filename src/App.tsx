import React, { lazy, Suspense, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileOptimizer } from "@/components/MobileOptimizer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NotificationProvider } from "@/components/EnhancedNotifications";
import { HelmetProvider } from 'react-helmet-async';
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import Index from "./pages/Index";

// Lazy load pages for better performance
const About = lazy(() => import("./pages/About"));
const Story = lazy(() => import("./pages/Story"));
const Team = lazy(() => import("./pages/Team"));
const Vision = lazy(() => import("./pages/Vision"));
const Contact = lazy(() => import("./pages/Contact"));
const Support = lazy(() => import("./pages/Support"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contracts = lazy(() => import("./pages/Contracts"));
const JobApplication = lazy(() => import("./pages/JobApplication"));
const TechInvestment = lazy(() => import("./pages/TechInvestment"));
const Development = lazy(() => import("./pages/Development"));
const StrategicConsulting = lazy(() => import("./pages/StrategicConsulting"));
const IntegratedSolutions = lazy(() => import("./pages/IntegratedSolutions"));
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
const CloudSolutions = lazy(() => import("./pages/CloudSolutions"));
const SecuritySolutions = lazy(() => import("./pages/SecuritySolutions"));
const NLPSolutions = lazy(() => import("./pages/NLPSolutions"));
const ComputerVisionPage = lazy(() => import("./pages/ComputerVision"));
const MachineLearning = lazy(() => import("./pages/MachineLearning"));
const SmartAssistants = lazy(() => import("./pages/SmartAssistants"));
const SmartAnalytics = lazy(() => import("./pages/SmartAnalytics"));

// Continue lazy loading for better performance
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
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const AffiliateMarketing = lazy(() => import("./pages/AffiliateMarketing"));
const BusinessServices = lazy(() => import("./pages/BusinessServices"));
const BusinessConsulting = lazy(() => import("./pages/business-services/BusinessConsulting"));
const DigitalTransformation = lazy(() => import("./pages/business-services/DigitalTransformation"));
const FinancialPlanning = lazy(() => import("./pages/business-services/FinancialPlanning"));
const DepartmentDetails = lazy(() => import("./pages/DepartmentDetails"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const Auth = lazy(() => import("./pages/Auth"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StartWithUs = lazy(() => import("./pages/StartWithUs"));
const BookConsultation = lazy(() => import("./pages/BookConsultation"));
const AutomationSystem = lazy(() => import("./pages/AutomationSystem"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const HostingServices = lazy(() => import("./pages/HostingServices"));
const CompanyUpdates = lazy(() => import("./pages/CompanyUpdates"));
const SoftwareProducts = lazy(() => import("./pages/SoftwareProducts"));
const CarRentalWebsite = lazy(() => import("./pages/CarRentalWebsite"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const CarRentalLanding = lazy(() => import("./pages/CarRentalLanding"));
const AboutUs = lazy(() => import("./pages/car-rental/AboutUs"));

// Continue lazy loading for remaining pages
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
const InvoiceAdmin = lazy(() => import("./pages/InvoiceAdmin"));
const InvoiceViewer = lazy(() => import("./pages/InvoiceViewer"));
const TechEcosystem = lazy(() => import("./pages/TechEcosystem"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ConstructionWebsite = lazy(() => import("./pages/ConstructionWebsite"));
const DigitalMarketingWebsite = lazy(() => import("./pages/DigitalMarketingWebsite"));
const ElectronicCardsStore = lazy(() => import("./pages/ElectronicCardsStore"));
const ElectronicGamesStore = lazy(() => import("./pages/ElectronicGamesStore"));
const ElectronicCardsWebsite = lazy(() => import("./pages/ElectronicCardsWebsite"));
const CardsStoreAbout = lazy(() => import("./pages/cards-store/About"));
const CardsStoreContact = lazy(() => import("./pages/cards-store/Contact"));
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

// Loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-muted-foreground text-lg">جارٍ التحميل...</p>
    </div>
  </div>
);



const App = () => {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  console.log('App component rendering...');
  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClientRef.current!}>
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
                <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
                <Route path="/story" element={<Suspense fallback={<PageLoader />}><Story /></Suspense>} />
                <Route path="/team" element={<Suspense fallback={<PageLoader />}><Team /></Suspense>} />
                <Route path="/vision" element={<Suspense fallback={<PageLoader />}><Vision /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
                <Route path="/support" element={<Suspense fallback={<PageLoader />}><Support /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
                <Route path="/cookie-policy" element={<Suspense fallback={<PageLoader />}><CookiePolicy /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<PageLoader />}><Terms /></Suspense>} />
                <Route path="/careers" element={<Suspense fallback={<PageLoader />}><Careers /></Suspense>} />
                <Route path="/jobs" element={<Suspense fallback={<PageLoader />}><Careers /></Suspense>} />
                <Route path="/job-application" element={<Suspense fallback={<PageLoader />}><JobApplication /></Suspense>} />
                <Route path="/tech-investment" element={<Suspense fallback={<PageLoader />}><TechInvestment /></Suspense>} />
                <Route path="/development" element={<Suspense fallback={<PageLoader />}><Development /></Suspense>} />
                <Route path="/strategic-consulting" element={<Suspense fallback={<PageLoader />}><StrategicConsulting /></Suspense>} />
                <Route path="/integrated-solutions" element={<Suspense fallback={<PageLoader />}><IntegratedSolutions /></Suspense>} />
                <Route path="/training" element={<Suspense fallback={<PageLoader />}><Training /></Suspense>} />
                <Route path="/volunteer" element={<Suspense fallback={<PageLoader />}><Volunteer /></Suspense>} />
                <Route path="/contracts" element={<Suspense fallback={<PageLoader />}><Contracts /></Suspense>} />
                <Route path="/development-program" element={<Suspense fallback={<PageLoader />}><DevelopmentProgram /></Suspense>} />
                <Route path="/company-news" element={<Suspense fallback={<PageLoader />}><CompanyNews /></Suspense>} />
                <Route path="/press-releases" element={<Suspense fallback={<PageLoader />}><PressReleases /></Suspense>} />
                <Route path="/upcoming-events" element={<Suspense fallback={<PageLoader />}><UpcomingEvents /></Suspense>} />
                <Route path="/annual-reports" element={<Suspense fallback={<PageLoader />}><AnnualReports /></Suspense>} />
                <Route path="/faq" element={<Suspense fallback={<PageLoader />}><FAQ /></Suspense>} />
                <Route path="/digital-contracts" element={<Suspense fallback={<PageLoader />}><DigitalContracts /></Suspense>} />
                <Route path="/ready-projects" element={<Suspense fallback={<PageLoader />}><ReadyProjects /></Suspense>} />
                <Route path="/remote-work" element={<Suspense fallback={<PageLoader />}><RemoteWork /></Suspense>} />
                <Route path="/project/:projectId" element={<Suspense fallback={<PageLoader />}><ProjectDetails /></Suspense>} />
                <Route path="/ai-intelligence" element={<AIIntelligence />} />
                <Route path="/ai-services/generative-ai" element={<GenerativeAI />} />
                <Route path="/ai-services/computer-vision" element={<ComputerVision />} />
                <Route path="/ai-services/natural-language-processing" element={<NaturalLanguageProcessing />} />
                <Route path="/ai-services/predictive-analytics" element={<PredictiveAnalytics />} />
                <Route path="/ai-services/smart-automation" element={<SmartAutomation />} />
                 <Route path="/ai-services/smart-security" element={<SmartSecurity />} />
                 <Route path="/free-trial" element={<FreeTrial />} />
                 <Route path="/automation-system" element={<AutomationSystem />} />
                 <Route path="/pricing" element={<PricingPage />} />
                 <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/ai-solutions" element={<AIIntelligence />} />
                <Route path="/iot-solutions" element={<IoTSolutions />} />
                <Route path="/cloud-solutions" element={<CloudSolutions />} />
                <Route path="/security-solutions" element={<SecuritySolutions />} />
                <Route path="/nlp-solutions" element={<NLPSolutions />} />
                <Route path="/computer-vision" element={<ComputerVisionPage />} />
                <Route path="/machine-learning" element={<MachineLearning />} />
                <Route path="/smart-assistants" element={<SmartAssistants />} />
                <Route path="/smart-analytics" element={<SmartAnalytics />} />
                
                <Route path="/global-presence" element={<GlobalPresence />} />
                <Route path="/tech-projects" element={<TechProjects />} />
                <Route path="/tech-project/:projectId" element={<TechProjectDetails />} />
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/current-offers" element={<CurrentOffers />} />
                <Route path="/offer-details/:id" element={<OfferDetails />} />
                <Route path="/professional-services" element={<ProfessionalServices />} />
                
                <Route path="/content-creation" element={<ContentCreation />} />
                <Route path="/design-solutions" element={<DesignSolutions />} />
                <Route path="/design-solutions/:slug" element={<EnhancedDesignCategory />} />
                <Route path="/subsidiaries" element={<Subsidiaries />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/affiliate-marketing" element={<AffiliateMarketing />} />
            <Route path="/business-services" element={<BusinessServices />} />
            <Route path="/business-services/business-consulting" element={<BusinessConsulting />} />
            <Route path="/business-services/digital-transformation" element={<DigitalTransformation />} />
            <Route path="/business-services/financial-planning" element={<FinancialPlanning />} />
            <Route path="/department/:id" element={<DepartmentDetails />} />
            <Route path="/user-guide" element={<UserGuide />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/start-with-us" element={<StartWithUs />} />
                <Route path="/book-consultation" element={<BookConsultation />} />
                <Route path="/hosting-services" element={<HostingServices />} />
                <Route path="/company-updates" element={<CompanyUpdates />} />
                <Route path="/software-products" element={<SoftwareProducts />} />
                <Route path="/construction-website" element={<ConstructionWebsite />} />
                <Route path="/digital-marketing-website" element={<DigitalMarketingWebsite />} />
                <Route path="/electronic-cards-store" element={<ElectronicCardsStore />} />
                <Route path="/electronic-games-store" element={<ElectronicGamesStore />} />
                <Route path="/cards-store" element={<ElectronicCardsStore />} />
                <Route path="/cards-store/product/:id" element={<ProductDetails />} />
                <Route path="/cards-store/about" element={<CardsStoreAbout />} />
                <Route path="/cards-store/contact" element={<CardsStoreContact />} />
                <Route path="/cards-store/faq" element={<CardsStoreFAQ />} />
                <Route path="/cards-store/cards" element={<ElectronicCardsWebsite />} />
                <Route path="/cards-store/privacy" element={<CardsStorePrivacy />} />
                <Route path="/cards-store/terms" element={<CardsStoreTerms />} />
                <Route path="/abayati-store" element={<KashkhaAbayaStore />} />
                <Route path="/abayati-store/luxury" element={<LuxuryAbayas />} />
                <Route path="/abayati-store/casual" element={<CasualAbayas />} />
                <Route path="/abayati-store/formal" element={<FormalAbayas />} />
                <Route path="/abayati-store/sports" element={<SportsAbayas />} />
                <Route path="/abayati-store/wedding" element={<WeddingAbayas />} />
                <Route path="/abayati-store/traditional" element={<TraditionalAbayas />} />
                <Route path="/abayati-store/about" element={<AbayaAboutUs />} />
                <Route path="/abayati-store/contact" element={<AbayaContactUs />} />
                <Route path="/abayati-store/shipping-delivery" element={<ShippingDelivery />} />
                <Route path="/abayati-store/return-procedures" element={<ReturnProcedures />} />
                <Route path="/abayati-store/return-policy" element={<ReturnPolicy />} />
                <Route path="/abayati-store/help-center" element={<HelpCenter />} />
                <Route path="/car-rental-preview" element={<CarRentalWebsite />} />
                <Route path="/car-rental-landing" element={<CarRentalLanding />} />
                <Route path="/car-rental" element={<CarRentalLanding />} />
                <Route path="/car-rental-landing" element={<CarRentalLanding />} />
                <Route path="/car-rental-website" element={<CarRentalWebsite />} />
                <Route path="/car-rental/about" element={<AboutUs />} />
                <Route path="/car-rental/faq" element={<CarRentalFAQ />} />
                <Route path="/car-rental/terms" element={<CarRentalTerms />} />
                <Route path="/car-rental/privacy" element={<CarRentalPrivacy />} />
                <Route path="/car-rental/guide" element={<CarRentalUserGuide />} />
                <Route path="/car-rental/insurance" element={<CarRentalInsurancePolicy />} />
                <Route path="/car-rental/news" element={<CarRentalCompanyNews />} />
                <Route path="/car-rental/services" element={<CarRentalServices />} />
                <Route path="/car-rental/contact" element={<CarRentalContactUs />} />
                <Route path="/car-rental/sub-services" element={<CarRentalSubServices />} />
                <Route path="/car-rental/services/economy" element={<CarRentalEconomyCars />} />
                <Route path="/car-rental/services/luxury" element={<CarRentalLuxuryCars />} />
                <Route path="/car-rental/services/electric" element={<CarRentalElectricCars />} />
                <Route path="/car-rental/services/family" element={<CarRentalFamilyCars />} />
                <Route path="/car-rental/contact/branches" element={<CarRentalBranches />} />
                <Route path="/car-rental/contact/complaints" element={<CarRentalComplaints />} />
                <Route path="/car-rental/careers" element={<CareersPage />} />
                
                <Route path="/car-fleet" element={<CarFleet />} />
                <Route path="/car-booking" element={<CarBooking />} />
                <Route path="/email-test" element={<EmailTest />} />
                <Route path="/invoice-admin" element={<InvoiceAdmin />} />
                <Route path="/invoice-viewer/:id" element={<InvoiceViewer />} />
                <Route path="/tech-ecosystem" element={<TechEcosystem />} />
                <Route path="/services-catalog" element={<ServicesCatalog />} />
                <Route path="/digital-marketing" element={<DigitalMarketing />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/enhanced-payment" element={<EnhancedPaymentPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
