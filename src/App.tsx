import React, { lazy, Suspense } from "react";
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

// Create QueryClient instance outside component to avoid recreation
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
                        <Route path="/ai-intelligence" element={<Suspense fallback={<PageLoader />}><AIIntelligence /></Suspense>} />
                        <Route path="/ai-services/generative-ai" element={<Suspense fallback={<PageLoader />}><GenerativeAI /></Suspense>} />
                        <Route path="/ai-services/computer-vision" element={<Suspense fallback={<PageLoader />}><ComputerVision /></Suspense>} />
                        <Route path="/ai-services/natural-language-processing" element={<Suspense fallback={<PageLoader />}><NaturalLanguageProcessing /></Suspense>} />
                        <Route path="/ai-services/predictive-analytics" element={<Suspense fallback={<PageLoader />}><PredictiveAnalytics /></Suspense>} />
                        <Route path="/ai-services/smart-automation" element={<Suspense fallback={<PageLoader />}><SmartAutomation /></Suspense>} />
                        <Route path="/ai-services/smart-security" element={<Suspense fallback={<PageLoader />}><SmartSecurity /></Suspense>} />
                        <Route path="/free-trial" element={<Suspense fallback={<PageLoader />}><FreeTrial /></Suspense>} />
                        <Route path="/automation-system" element={<Suspense fallback={<PageLoader />}><AutomationSystem /></Suspense>} />
                        <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><PricingPage /></Suspense>} />
                        <Route path="/payment-success" element={<Suspense fallback={<PageLoader />}><PaymentSuccessPage /></Suspense>} />
                        <Route path="/ai-solutions" element={<Suspense fallback={<PageLoader />}><AIIntelligence /></Suspense>} />
                        <Route path="/iot-solutions" element={<Suspense fallback={<PageLoader />}><IoTSolutions /></Suspense>} />
                        <Route path="/cloud-solutions" element={<Suspense fallback={<PageLoader />}><CloudSolutions /></Suspense>} />
                        <Route path="/security-solutions" element={<Suspense fallback={<PageLoader />}><SecuritySolutions /></Suspense>} />
                        <Route path="/nlp-solutions" element={<Suspense fallback={<PageLoader />}><NLPSolutions /></Suspense>} />
                        <Route path="/computer-vision" element={<Suspense fallback={<PageLoader />}><ComputerVisionPage /></Suspense>} />
                        <Route path="/machine-learning" element={<Suspense fallback={<PageLoader />}><MachineLearning /></Suspense>} />
                        <Route path="/smart-assistants" element={<Suspense fallback={<PageLoader />}><SmartAssistants /></Suspense>} />
                        <Route path="/smart-analytics" element={<Suspense fallback={<PageLoader />}><SmartAnalytics /></Suspense>} />
                        
                        <Route path="/global-presence" element={<Suspense fallback={<PageLoader />}><GlobalPresence /></Suspense>} />
                        <Route path="/tech-projects" element={<Suspense fallback={<PageLoader />}><TechProjects /></Suspense>} />
                        <Route path="/tech-project/:projectId" element={<Suspense fallback={<PageLoader />}><TechProjectDetails /></Suspense>} />
                        <Route path="/technologies" element={<Suspense fallback={<PageLoader />}><Technologies /></Suspense>} />
                        <Route path="/current-offers" element={<Suspense fallback={<PageLoader />}><CurrentOffers /></Suspense>} />
                        <Route path="/offer-details/:id" element={<Suspense fallback={<PageLoader />}><OfferDetails /></Suspense>} />
                        <Route path="/professional-services" element={<Suspense fallback={<PageLoader />}><ProfessionalServices /></Suspense>} />
                        
                        <Route path="/content-creation" element={<Suspense fallback={<PageLoader />}><ContentCreation /></Suspense>} />
                        <Route path="/design-solutions" element={<Suspense fallback={<PageLoader />}><DesignSolutions /></Suspense>} />
                        <Route path="/design-solutions/:slug" element={<Suspense fallback={<PageLoader />}><EnhancedDesignCategory /></Suspense>} />
                        <Route path="/subsidiaries" element={<Suspense fallback={<PageLoader />}><Subsidiaries /></Suspense>} />
                        <Route path="/payment-methods" element={<Suspense fallback={<PageLoader />}><PaymentMethods /></Suspense>} />
                        <Route path="/payment-success" element={<Suspense fallback={<PageLoader />}><PaymentSuccess /></Suspense>} />
                        <Route path="/payment-cancel" element={<Suspense fallback={<PageLoader />}><PaymentCancel /></Suspense>} />
                        <Route path="/partnerships" element={<Suspense fallback={<PageLoader />}><Partnerships /></Suspense>} />
                        <Route path="/affiliate-marketing" element={<Suspense fallback={<PageLoader />}><AffiliateMarketing /></Suspense>} />
                        <Route path="/business-services" element={<Suspense fallback={<PageLoader />}><BusinessServices /></Suspense>} />
                        <Route path="/business-services/business-consulting" element={<Suspense fallback={<PageLoader />}><BusinessConsulting /></Suspense>} />
                        <Route path="/business-services/digital-transformation" element={<Suspense fallback={<PageLoader />}><DigitalTransformation /></Suspense>} />
                        <Route path="/business-services/financial-planning" element={<Suspense fallback={<PageLoader />}><FinancialPlanning /></Suspense>} />
                        <Route path="/department/:departmentId" element={<Suspense fallback={<PageLoader />}><DepartmentDetails /></Suspense>} />
                        <Route path="/user-guide" element={<Suspense fallback={<PageLoader />}><UserGuide /></Suspense>} />
                        <Route path="/auth" element={<Suspense fallback={<PageLoader />}><Auth /></Suspense>} />
                        <Route path="/client-dashboard" element={<Suspense fallback={<PageLoader />}><ClientDashboard /></Suspense>} />
                        <Route path="/admin-dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
                        <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
                        <Route path="/start-with-us" element={<Suspense fallback={<PageLoader />}><StartWithUs /></Suspense>} />
                        <Route path="/book-consultation" element={<Suspense fallback={<PageLoader />}><BookConsultation /></Suspense>} />
                        <Route path="/hosting-services" element={<Suspense fallback={<PageLoader />}><HostingServices /></Suspense>} />
                        <Route path="/company-updates" element={<Suspense fallback={<PageLoader />}><CompanyUpdates /></Suspense>} />
                        <Route path="/software-products" element={<Suspense fallback={<PageLoader />}><SoftwareProducts /></Suspense>} />

                        {/* Car Rental Routes */}
                        <Route path="/car-rental" element={<Suspense fallback={<PageLoader />}><CarRentalWebsite /></Suspense>} />
                        <Route path="/car-rental-landing" element={<Suspense fallback={<PageLoader />}><CarRentalLanding /></Suspense>} />
                        <Route path="/car-rental/about" element={<Suspense fallback={<PageLoader />}><AboutUs /></Suspense>} />
                        <Route path="/car-rental/faq" element={<Suspense fallback={<PageLoader />}><CarRentalFAQ /></Suspense>} />
                        <Route path="/car-rental/terms" element={<Suspense fallback={<PageLoader />}><CarRentalTerms /></Suspense>} />
                        <Route path="/car-rental/privacy" element={<Suspense fallback={<PageLoader />}><CarRentalPrivacy /></Suspense>} />
                        <Route path="/car-rental/user-guide" element={<Suspense fallback={<PageLoader />}><CarRentalUserGuide /></Suspense>} />
                        <Route path="/car-rental/insurance-policy" element={<Suspense fallback={<PageLoader />}><CarRentalInsurancePolicy /></Suspense>} />
                        <Route path="/car-rental/company-news" element={<Suspense fallback={<PageLoader />}><CarRentalCompanyNews /></Suspense>} />
                        <Route path="/car-rental/services" element={<Suspense fallback={<PageLoader />}><CarRentalServices /></Suspense>} />
                        <Route path="/car-rental/contact" element={<Suspense fallback={<PageLoader />}><CarRentalContactUs /></Suspense>} />
                        <Route path="/car-rental/sub-services" element={<Suspense fallback={<PageLoader />}><CarRentalSubServices /></Suspense>} />
                        <Route path="/car-rental/economy-cars" element={<Suspense fallback={<PageLoader />}><CarRentalEconomyCars /></Suspense>} />
                        <Route path="/car-rental/luxury-cars" element={<Suspense fallback={<PageLoader />}><CarRentalLuxuryCars /></Suspense>} />
                        <Route path="/car-rental/electric-cars" element={<Suspense fallback={<PageLoader />}><CarRentalElectricCars /></Suspense>} />
                        <Route path="/car-rental/family-cars" element={<Suspense fallback={<PageLoader />}><CarRentalFamilyCars /></Suspense>} />
                        <Route path="/car-rental/branches" element={<Suspense fallback={<PageLoader />}><CarRentalBranches /></Suspense>} />
                        <Route path="/car-rental/complaints" element={<Suspense fallback={<PageLoader />}><CarRentalComplaints /></Suspense>} />
                        <Route path="/car-fleet" element={<Suspense fallback={<PageLoader />}><CarFleet /></Suspense>} />
                        <Route path="/car-booking" element={<Suspense fallback={<PageLoader />}><CarBooking /></Suspense>} />

                        <Route path="/careers-page" element={<Suspense fallback={<PageLoader />}><CareersPage /></Suspense>} />
                        <Route path="/email-test" element={<Suspense fallback={<PageLoader />}><EmailTest /></Suspense>} />
                        <Route path="/invoice-admin" element={<Suspense fallback={<PageLoader />}><InvoiceAdmin /></Suspense>} />
                        <Route path="/invoice-viewer" element={<Suspense fallback={<PageLoader />}><InvoiceViewer /></Suspense>} />
                        <Route path="/tech-ecosystem" element={<Suspense fallback={<PageLoader />}><TechEcosystem /></Suspense>} />

                        {/* Store Routes */}
                        <Route path="/construction-website" element={<Suspense fallback={<PageLoader />}><ConstructionWebsite /></Suspense>} />
                        <Route path="/digital-marketing-website" element={<Suspense fallback={<PageLoader />}><DigitalMarketingWebsite /></Suspense>} />
                        <Route path="/electronic-cards-store" element={<Suspense fallback={<PageLoader />}><ElectronicCardsStore /></Suspense>} />
                        <Route path="/electronic-games-store" element={<Suspense fallback={<PageLoader />}><ElectronicGamesStore /></Suspense>} />
                        <Route path="/electronic-cards-website" element={<Suspense fallback={<PageLoader />}><ElectronicCardsWebsite /></Suspense>} />
                        <Route path="/cards-store/about" element={<Suspense fallback={<PageLoader />}><CardsStoreAbout /></Suspense>} />
                        <Route path="/cards-store/contact" element={<Suspense fallback={<PageLoader />}><CardsStoreContact /></Suspense>} />
                        <Route path="/cards-store/faq" element={<Suspense fallback={<PageLoader />}><CardsStoreFAQ /></Suspense>} />
                        <Route path="/cards-store/privacy" element={<Suspense fallback={<PageLoader />}><CardsStorePrivacy /></Suspense>} />
                        <Route path="/cards-store/terms" element={<Suspense fallback={<PageLoader />}><CardsStoreTerms /></Suspense>} />
                        <Route path="/product/:productId" element={<Suspense fallback={<PageLoader />}><ProductDetails /></Suspense>} />

                        {/* Abaya Store Routes */}
                        <Route path="/kashkha-abaya-store" element={<Suspense fallback={<PageLoader />}><KashkhaAbayaStore /></Suspense>} />
                        <Route path="/abaya-categories/luxury" element={<Suspense fallback={<PageLoader />}><LuxuryAbayas /></Suspense>} />
                        <Route path="/abaya-categories/casual" element={<Suspense fallback={<PageLoader />}><CasualAbayas /></Suspense>} />
                        <Route path="/abaya-categories/formal" element={<Suspense fallback={<PageLoader />}><FormalAbayas /></Suspense>} />
                        <Route path="/abaya-categories/sports" element={<Suspense fallback={<PageLoader />}><SportsAbayas /></Suspense>} />
                        <Route path="/abaya-categories/wedding" element={<Suspense fallback={<PageLoader />}><WeddingAbayas /></Suspense>} />
                        <Route path="/abaya-categories/traditional" element={<Suspense fallback={<PageLoader />}><TraditionalAbayas /></Suspense>} />
                        <Route path="/abaya-store/about" element={<Suspense fallback={<PageLoader />}><AbayaAboutUs /></Suspense>} />
                        <Route path="/abaya-store/contact" element={<Suspense fallback={<PageLoader />}><AbayaContactUs /></Suspense>} />
                        <Route path="/abaya-store/shipping" element={<Suspense fallback={<PageLoader />}><ShippingDelivery /></Suspense>} />
                        <Route path="/abaya-store/return-procedures" element={<Suspense fallback={<PageLoader />}><ReturnProcedures /></Suspense>} />
                        <Route path="/abaya-store/return-policy" element={<Suspense fallback={<PageLoader />}><ReturnPolicy /></Suspense>} />
                        <Route path="/abaya-store/help" element={<Suspense fallback={<PageLoader />}><HelpCenter /></Suspense>} />

                        <Route path="/services-catalog" element={<Suspense fallback={<PageLoader />}><ServicesCatalog /></Suspense>} />
                        <Route path="/digital-marketing" element={<Suspense fallback={<PageLoader />}><DigitalMarketing /></Suspense>} />
                        <Route path="/payment" element={<Suspense fallback={<PageLoader />}><PaymentPage /></Suspense>} />
                        <Route path="/enhanced-payment" element={<Suspense fallback={<PageLoader />}><EnhancedPaymentPage /></Suspense>} />

                        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
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