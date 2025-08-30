import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import ScrollToTop from "@/components/ScrollToTop";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRef } from "react";
import { MobileOptimizer } from "@/components/MobileOptimizer";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { ImageOptimizer } from "@/components/ImageOptimizer";
import { ReCaptchaProvider } from "@/components/ReCaptchaProvider";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { TemplateVariableBlocker } from "@/components/TemplateVariableBlocker";
import { AuthProvider } from "@/components/auth/AuthContext";
import { RouteGuard } from "@/components/auth/RouteGuard";

import { lazy, Suspense } from "react";
import Index from "./pages/Index";

// Lazy load pages for better performance
const OurWorks = lazy(() => import("./pages/OurWorks"));
const About = lazy(() => import("./pages/About"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminInvoicesEnhanced = lazy(() => import("./pages/admin/AdminInvoicesEnhanced"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminPaymentMethods = lazy(() => import("./pages/admin/AdminPaymentMethods"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminLogos = lazy(() => import("./pages/admin/AdminLogos"));
const AdminFinancialTemplates = lazy(() => import("./pages/admin/AdminFinancialTemplates"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const Wallet = lazy(() => import("./pages/Wallet"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ClientLayout = lazy(() => import("./components/client/ClientLayout"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ClientProjects = lazy(() => import("./pages/client/ClientProjects"));
const ClientInvoices = lazy(() => import("./pages/client/ClientInvoices"));
const ServiceRequests = lazy(() => import("./pages/client/ServiceRequests"));
const NewServiceRequest = lazy(() => import("./pages/client/NewServiceRequest"));
const ClientPayments = lazy(() => import("./pages/client/ClientPayments"));
const ClientWallet = lazy(() => import("./pages/client/ClientWallet"));
const ClientReceipts = lazy(() => import("./pages/client/ClientReceipts"));
const ClientMessages = lazy(() => import("./pages/client/ClientMessages"));
const ClientSupportTickets = lazy(() => import("./pages/client/ClientSupportTickets"));
const ClientProfile = lazy(() => import("./pages/client/ClientProfile"));
const ClientSettings = lazy(() => import("./pages/client/ClientSettings"));
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
// HostingServices already declared above
const SocialMediaManagement = lazy(() => import("./pages/services/SocialMediaManagement"));
const SEOServices = lazy(() => import("./pages/services/SEOServices"));
const FacebookAds = lazy(() => import("./pages/services/FacebookAds"));
const ProductPhotography = lazy(() => import("./pages/services/ProductPhotography"));
const ContentWriting = lazy(() => import("./pages/services/ContentWriting"));
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
// Old pages replaced with new service pages
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
// Auth page removed
const NotFound = lazy(() => import("./pages/NotFound"));
const StartWithUs = lazy(() => import("./pages/StartWithUs"));
const BookConsultation = lazy(() => import("./pages/BookConsultation"));
const Consultation = lazy(() => import("./pages/Consultation"));
const ProjectTracking = lazy(() => import("./pages/ProjectTracking"));
const AutomationSystem = lazy(() => import("./pages/AutomationSystem"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const ClientLoginPage = lazy(() => import("./pages/auth/ClientLoginPage"));
const AdminLoginPage = lazy(() => import("./pages/auth/AdminLoginPage"));
const MyProjects = lazy(() => import("./pages/MyProjects"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const EnhancedProjectManagement = lazy(() => import("./pages/admin/EnhancedProjectManagement"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUpdates = lazy(() => import("./pages/admin/AdminUpdates"));
const AdminWallets = lazy(() => import("./pages/admin/AdminWallets"));
const AdminAffiliate = lazy(() => import("./pages/admin/AdminAffiliate"));
const AdminEmailPipeline = lazy(() => import("./pages/admin/AdminEmailPipeline"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const AdminSecurityLogs = lazy(() => import("./pages/admin/AdminSecurityLogs"));
const ClientOrders = lazy(() => import("./pages/client/ClientOrders"));
const ClientAffiliate = lazy(() => import("./pages/client/ClientAffiliate"));
const ClientNotifications = lazy(() => import("./pages/client/ClientNotifications"));
const ClientUpdates = lazy(() => import("./pages/client/ClientUpdates"));

const CompanyUpdates = lazy(() => import("./pages/CompanyUpdates"));
const SoftwareProducts = lazy(() => import("./pages/SoftwareProducts"));
const CarRentalWebsite = lazy(() => import("./pages/CarRentalWebsite"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const CarRentalLanding = lazy(() => import("./pages/CarRentalLanding"));
const AboutUs = lazy(() => import("./pages/car-rental/AboutUs"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));

// Continue lazy loading for remaining pages
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

// Enterprise pages
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

// ASH HOLDING Pages
const AshHolding = lazy(() => import("./pages/AshHolding"));
const AshAdmin = lazy(() => import("./pages/ash/AshAdmin"));
const AshClient = lazy(() => import("./pages/ash/AshClient"));
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
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 دقائق
          gcTime: 10 * 60 * 1000, // 10 دقائق (بدلاً من cacheTime)
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
  }
  
  return (
    <QueryClientProvider client={queryClientRef.current!}>
      <TooltipProvider>
        <ReCaptchaProvider>
          <MobileOptimizer>
          <BrowserRouter>
            <AuthProvider>
            <RouteGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 mobile-text">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
              
              {/* Main content with mobile optimizations */}
              <div className="relative z-10 mobile-tap mobile-scroll">
                
                <SecurityHeaders />
                <TemplateVariableBlocker />
                <AnalyticsProvider />
                <ScrollToTop />
                <Toaster />
                <Sonner />
                
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/company-profile" element={<Suspense fallback={<PageLoader />}><CompanyProfile /></Suspense>} />
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
                <Route path="/services/tech-solutions" element={<Suspense fallback={<PageLoader />}><TechSolutions /></Suspense>} />
                <Route path="/services/business-solutions" element={<Suspense fallback={<PageLoader />}><BusinessSolutions /></Suspense>} />
                <Route path="/services/cloud-solutions" element={<Suspense fallback={<PageLoader />}><CloudSolutions /></Suspense>} />
                <Route path="/services/security-solutions" element={<Suspense fallback={<PageLoader />}><SecuritySolutions /></Suspense>} />
                <Route path="/hosting-services" element={<Suspense fallback={<PageLoader />}><HostingServices /></Suspense>} />
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
                <Route path="/payment-verification" element={<Suspense fallback={<PageLoader />}><PaymentVerification /></Suspense>} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/our-works" element={<Suspense fallback={<PageLoader />}><OurWorks /></Suspense>} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/affiliate-marketing" element={<AffiliateMarketing />} />
            <Route path="/business-services" element={<BusinessServices />} />
            <Route path="/technical-services" element={<Suspense fallback={<PageLoader />}><TechnicalServices /></Suspense>} />
            <Route path="/business-services/business-consulting" element={<BusinessConsulting />} />
            <Route path="/business-services/digital-transformation" element={<DigitalTransformation />} />
            <Route path="/business-services/financial-planning" element={<FinancialPlanning />} />
            <Route path="/department/:id" element={<DepartmentDetails />} />
            <Route path="/user-guide" element={<UserGuide />} />
            {/* Auth route removed */}
            
            <Route path="/start-with-us" element={<StartWithUs />} />
                <Route path="/book-consultation" element={<BookConsultation />} />
                <Route path="/consultation" element={<Suspense fallback={<PageLoader />}><Consultation /></Suspense>} />
                <Route path="/project-tracking" element={<Suspense fallback={<PageLoader />}><ProjectTracking /></Suspense>} />
                <Route path="/auth/client/login" element={<Suspense fallback={<PageLoader />}><ClientLoginPage /></Suspense>} />
                <Route path="/auth/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLoginPage /></Suspense>} />
                {/* إعادة توجيه المسارات القديمة */}
                <Route path="/login" element={<Navigate to="/auth/client/login" replace />} />
                <Route path="/ashadmin" element={<Navigate to="/auth/admin/login" replace />} />
                <Route path="/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
                <Route path="/unauthorized" element={<Suspense fallback={<PageLoader />}><UnauthorizedPage /></Suspense>} />
                
                {/* Admin Routes - TODO: Will be protected by RouteGuard */}
                <Route path="/admin/*" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminLayout />
                    </Suspense>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="project-management" element={<EnhancedProjectManagement />} />
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="invoices" element={<AdminInvoicesEnhanced />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="payment-methods" element={<AdminPaymentMethods />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="logos" element={<AdminLogos />} />
                  <Route path="financial-templates" element={<AdminFinancialTemplates />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="updates" element={<AdminUpdates />} />
                  <Route path="wallet" element={<AdminWallets />} />
                  <Route path="affiliate" element={<AdminAffiliate />} />
                  <Route path="email-pipeline" element={<AdminEmailPipeline />} />
                  <Route path="security-logs" element={<Suspense fallback={<PageLoader />}><AdminSecurityLogs /></Suspense>} />
                </Route>
                
                {/* Legacy admin routes - redirect */}
                <Route path="/admin-projects" element={<Navigate to="/admin/projects" replace />} />
                <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin-clients" element={<Navigate to="/admin/clients" replace />} />
                <Route path="/admin-invoices" element={<Navigate to="/admin/invoices" replace />} />
                <Route path="/admin-payments" element={<Navigate to="/admin/payments" replace />} />
                <Route path="/admin-users" element={<Navigate to="/admin/users" replace />} />
                <Route path="/admin-notifications" element={<Navigate to="/admin/notifications" replace />} />
                <Route path="/admin-settings" element={<Navigate to="/admin/settings" replace />} />
                <Route path="/hosting-services" element={<Suspense fallback={<PageLoader />}><HostingServices /></Suspense>} />
                <Route path="/social-media" element={<Suspense fallback={<PageLoader />}><SocialMediaManagement /></Suspense>} />
                <Route path="/seo-services" element={<Suspense fallback={<PageLoader />}><SEOServices /></Suspense>} />
                <Route path="/facebook-ads" element={<Suspense fallback={<PageLoader />}><FacebookAds /></Suspense>} />
                <Route path="/product-photography" element={<Suspense fallback={<PageLoader />}><ProductPhotography /></Suspense>} />
                <Route path="/content-writing" element={<Suspense fallback={<PageLoader />}><ContentWriting /></Suspense>} />
                <Route path="/company-updates" element={<CompanyUpdates />} />
                <Route path="/software-products" element={<Suspense fallback={<PageLoader />}><SoftwareProducts /></Suspense>} />
                <Route path="/construction-website" element={<ConstructionWebsite />} />
                <Route path="/digital-marketing-website" element={<DigitalMarketingWebsite />} />
                <Route path="/electronic-cards-store" element={<ElectronicCardsStore />} />
                <Route path="/electronic-games-store" element={<ElectronicGamesStore />} />
                <Route path="/cards-store" element={<ElectronicCardsStore />} />
                <Route path="/cards-store/product/:id" element={<ProductDetails />} />
                <Route path="/cards-store/about" element={<CardsStoreAbout />} />
                <Route path="/cards-store/contact" element={<CardsStoreContact />} />
                <Route path="/cards-store/faq" element={<CardsStoreFAQ />} />
                <Route path="/offer/:offerId" element={<Suspense fallback={<PageLoader />}><OfferDetails /></Suspense>} />
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
                
                
                <Route path="/tech-ecosystem" element={<TechEcosystem />} />
                <Route path="/services-catalog" element={<ServicesCatalog />} />
                <Route path="/digital-marketing" element={<Suspense fallback={<PageLoader />}><DigitalMarketing /></Suspense>} />
                <Route path="/websites" element={<Suspense fallback={<PageLoader />}><Websites /></Suspense>} />
                <Route path="/mobile-apps" element={<Suspense fallback={<PageLoader />}><MobileApps /></Suspense>} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/enhanced-payment" element={<EnhancedPaymentPage />} />
          
          {/* Enterprise Services Routes */}
          <Route path="/enterprise/development" element={<Suspense fallback={<PageLoader />}><EnterpriseDevelopment /></Suspense>} />
          <Route path="/enterprise/branding" element={<Suspense fallback={<PageLoader />}><EnterpriseBranding /></Suspense>} />
          
          {/* Wallet Route */}
                <Route path="/wallet" element={<Suspense fallback={<PageLoader />}><Wallet /></Suspense>} />
          
                {/* Client Dashboard Routes - TODO: Will be protected by RouteGuard */}
                <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
                <Route path="/my-projects" element={<Navigate to="/client/projects" replace />} />
                <Route path="/client/*" element={
                    <Suspense fallback={<PageLoader />}><ClientLayout /></Suspense>
                }>
                  <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><ClientDashboard /></Suspense>} />
                  <Route path="projects" element={<Suspense fallback={<PageLoader />}><ClientProjects /></Suspense>} />
                  <Route path="service-requests" element={<Suspense fallback={<PageLoader />}><ServiceRequests /></Suspense>} />
                  <Route path="new-service-request" element={<Suspense fallback={<PageLoader />}><NewServiceRequest /></Suspense>} />
                  <Route path="invoices" element={<Suspense fallback={<PageLoader />}><ClientInvoices /></Suspense>} />
                  <Route path="payments" element={<Suspense fallback={<PageLoader />}><ClientPayments /></Suspense>} />
                  <Route path="wallet" element={<Suspense fallback={<PageLoader />}><ClientWallet /></Suspense>} />
                  <Route path="receipts" element={<Suspense fallback={<PageLoader />}><ClientReceipts /></Suspense>} />
                  <Route path="messages" element={<Suspense fallback={<PageLoader />}><ClientMessages /></Suspense>} />
                  <Route path="support-tickets" element={<Suspense fallback={<PageLoader />}><ClientSupportTickets /></Suspense>} />
                  <Route path="profile" element={<Suspense fallback={<PageLoader />}><ClientProfile /></Suspense>} />
                  <Route path="settings" element={<Suspense fallback={<PageLoader />}><ClientSettings /></Suspense>} />
                  <Route path="orders" element={<Suspense fallback={<PageLoader />}><ClientOrders /></Suspense>} />
                  <Route path="affiliate" element={<Suspense fallback={<PageLoader />}><ClientAffiliate /></Suspense>} />
                  <Route path="notifications" element={<Suspense fallback={<PageLoader />}><ClientNotifications /></Suspense>} />
                  <Route path="updates" element={<Suspense fallback={<PageLoader />}><ClientUpdates /></Suspense>} />
              </Route>

              {/* ASH HOLDING Routes */}
              <Route path="/ash" element={<Suspense fallback={<PageLoader />}><AshHolding /></Suspense>} />
              <Route path="/ash/admin" element={<Suspense fallback={<PageLoader />}><AshAdmin /></Suspense>} />
              <Route path="/ash/client" element={<Suspense fallback={<PageLoader />}><AshClient /></Suspense>} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
                </Routes>
                </div>
              </div>
            </RouteGuard>
            </AuthProvider>
          </BrowserRouter>
          </MobileOptimizer>
        </ReCaptchaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
