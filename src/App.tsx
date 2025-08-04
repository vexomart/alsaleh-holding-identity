import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Team from "./pages/Team";
import Vision from "./pages/Vision";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import JobApplication from "./pages/JobApplication";
import TechInvestment from "./pages/TechInvestment";
import Development from "./pages/Development";
import StrategicConsulting from "./pages/StrategicConsulting";
import IntegratedSolutions from "./pages/IntegratedSolutions";
import Training from "./pages/Training";
import Volunteer from "./pages/Volunteer";
import DevelopmentProgram from "./pages/DevelopmentProgram";
import CompanyNews from "./pages/CompanyNews";
import PressReleases from "./pages/PressReleases";
import UpcomingEvents from "./pages/UpcomingEvents";
import AnnualReports from "./pages/AnnualReports";
import FAQ from "./pages/FAQ";
import ReadyProjects from "./pages/ReadyProjects";
import ProjectDetails from "./pages/ProjectDetails";
import AISolutions from "./pages/AISolutions";
import IoTSolutions from "./pages/IoTSolutions";
import CloudSolutions from "./pages/CloudSolutions";
import SecuritySolutions from "./pages/SecuritySolutions";
import NLPSolutions from "./pages/NLPSolutions";
import ComputerVision from "./pages/ComputerVision";
import MachineLearning from "./pages/MachineLearning";
import SmartAssistants from "./pages/SmartAssistants";
import SmartAnalytics from "./pages/SmartAnalytics";
import SmartAutomation from "./pages/SmartAutomation";
import GlobalPresence from "./pages/GlobalPresence";
import Careers from "./pages/Careers";
import TechProjects from "./pages/TechProjects";
import TechProjectDetails from "./pages/TechProjectDetails";
import Technologies from "./pages/Technologies";
import CurrentOffers from "./pages/CurrentOffers";
import ProfessionalServices from "./pages/ProfessionalServices";
import ContentCreation from "./pages/ContentCreation";
import DesignSolutions from "./pages/DesignSolutions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
        
        {/* Main content */}
        <div className="relative z-10">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/jobs" element={<JobApplication />} />
              <Route path="/tech-investment" element={<TechInvestment />} />
              <Route path="/development" element={<Development />} />
              <Route path="/strategic-consulting" element={<StrategicConsulting />} />
              <Route path="/integrated-solutions" element={<IntegratedSolutions />} />
              <Route path="/training" element={<Training />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/job-application" element={<Careers />} />
              <Route path="/development-program" element={<DevelopmentProgram />} />
              <Route path="/company-news" element={<CompanyNews />} />
              <Route path="/press-releases" element={<PressReleases />} />
              <Route path="/upcoming-events" element={<UpcomingEvents />} />
              <Route path="/annual-reports" element={<AnnualReports />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/ready-projects" element={<ReadyProjects />} />
              <Route path="/project/:projectId" element={<ProjectDetails />} />
              <Route path="/ai-solutions" element={<AISolutions />} />
              <Route path="/iot-solutions" element={<IoTSolutions />} />
              <Route path="/cloud-solutions" element={<CloudSolutions />} />
              <Route path="/security-solutions" element={<SecuritySolutions />} />
              <Route path="/nlp-solutions" element={<NLPSolutions />} />
              <Route path="/computer-vision" element={<ComputerVision />} />
              <Route path="/machine-learning" element={<MachineLearning />} />
              <Route path="/smart-assistants" element={<SmartAssistants />} />
              <Route path="/smart-analytics" element={<SmartAnalytics />} />
              <Route path="/smart-automation" element={<SmartAutomation />} />
              <Route path="/global-presence" element={<GlobalPresence />} />
              <Route path="/tech-projects" element={<TechProjects />} />
              <Route path="/tech-project/:projectId" element={<TechProjectDetails />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/current-offers" element={<CurrentOffers />} />
          <Route path="/professional-services" element={<ProfessionalServices />} />
          <Route path="/content-creation" element={<ContentCreation />} />
          <Route path="/design-solutions" element={<DesignSolutions />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
