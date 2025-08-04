import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

import StatsSection from "@/components/StatsSection";




import DepartmentsSection from "@/components/DepartmentsSection";
import SubsidiariesSection from "@/components/SubsidiariesSection";
import CommitmentsSection from "@/components/CommitmentsSection";
import PaymentMethodsSection from "@/components/PaymentMethodsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";



const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-32 overflow-x-hidden">{/* Better mobile spacing */}
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="relative z-10">
          <HeroSection />
        </section>

        {/* Content Sections with Proper Spacing */}
        <div className="space-y-0">
          {/* About Section */}
          <section id="about" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20"></div>
            <div className="absolute top-5 right-5 sm:top-10 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute bottom-5 left-5 sm:bottom-10 sm:left-10 w-24 h-24 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl sm:blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            <div className="relative z-10">
              <AboutSection />
            </div>
          </section>


          {/* Stats Section */}
          <section id="stats" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-orange-50/80 via-amber-50/60 to-yellow-50/80 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-yellow-950/20"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-orange-100/20"></div>
            <div className="absolute top-5 right-5 sm:top-16 sm:right-16 w-24 h-24 sm:w-60 sm:h-60 bg-gradient-to-br from-orange-200/50 to-amber-200/50 rounded-full blur-lg sm:blur-2xl animate-pulse"></div>
            <div className="absolute bottom-5 left-5 sm:bottom-16 sm:left-16 w-32 h-32 sm:w-72 sm:h-72 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="relative z-10">
              <StatsSection />
            </div>
          </section>





          {/* Departments Section */}
          <section id="departments" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/80 via-pink-50/60 to-fuchsia-50/80 dark:from-rose-950/20 dark:via-pink-950/10 dark:to-fuchsia-950/20"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-rose-100/10 via-pink-100/15 via-fuchsia-100/10 to-rose-100/10 opacity-60"></div>
            <div className="absolute top-5 left-5 sm:top-24 sm:left-24 w-24 h-24 sm:w-64 sm:h-64 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-lg sm:blur-2xl animate-float"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-24 sm:right-24 w-32 h-32 sm:w-80 sm:h-80 bg-gradient-to-br from-fuchsia-200/30 to-purple-200/30 rounded-full blur-xl sm:blur-3xl animate-float-delayed"></div>
            <div className="relative z-10">
              <DepartmentsSection />
            </div>
          </section>

          {/* Subsidiaries Section */}
          <section id="companies" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-zinc-50/80 dark:from-slate-950/30 dark:via-gray-950/20 dark:to-zinc-950/30"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(0,0,0,0.02)_25%,_rgba(0,0,0,0.02)_50%,_transparent_50%,_transparent_75%,_rgba(0,0,0,0.02)_75%)] bg-[length:20px_20px]"></div>
            <div className="absolute top-5 right-5 sm:top-12 sm:right-12 w-32 h-32 sm:w-88 sm:h-88 bg-gradient-to-br from-slate-200/40 to-gray-200/40 rounded-full blur-xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute bottom-5 left-5 sm:bottom-12 sm:left-12 w-28 h-28 sm:w-76 sm:h-76 bg-gradient-to-br from-zinc-200/40 to-slate-200/40 rounded-full blur-lg sm:blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="relative z-10">
              <SubsidiariesSection />
            </div>
          </section>

          {/* Commitments Section */}
          <section id="commitments" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tl from-violet-50/80 via-purple-50/60 to-indigo-50/80 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_var(--tw-gradient-stops))] from-violet-100/20 via-transparent to-purple-100/20"></div>
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 w-32 h-32 sm:w-92 sm:h-92 bg-gradient-to-br from-violet-200/35 to-purple-200/35 rounded-full blur-xl sm:blur-3xl animate-float"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-24 h-24 sm:w-68 sm:h-68 bg-gradient-to-br from-indigo-200/45 to-violet-200/45 rounded-full blur-lg sm:blur-2xl animate-float-delayed"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-300/25 to-indigo-300/25 rounded-full blur-sm sm:blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            <div className="relative z-10">
              <CommitmentsSection />
            </div>
          </section>

          {/* Payment Methods Section */}
          <section id="payment-methods" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-green-100/15 via-emerald-100/20 via-teal-100/15 to-green-100/15"></div>
            <div className="absolute top-5 right-5 sm:top-14 sm:right-14 w-32 h-32 sm:w-84 sm:h-84 bg-gradient-to-br from-green-200/40 to-emerald-200/40 rounded-full blur-xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute bottom-5 left-5 sm:bottom-14 sm:left-14 w-24 h-24 sm:w-72 sm:h-72 bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-lg sm:blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-48 sm:h-48 bg-gradient-to-r from-emerald-200/30 to-green-200/30 rounded-full blur-sm sm:blur-xl animate-float"></div>
            <div className="relative z-10">
              <PaymentMethodsSection />
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-50/80 via-orange-50/60 to-amber-50/80 dark:from-red-950/20 dark:via-orange-950/10 dark:to-amber-950/20"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_transparent_25%,_rgba(255,0,0,0.02)_25%,_rgba(255,0,0,0.02)_50%,_transparent_50%,_transparent_75%,_rgba(255,0,0,0.02)_75%)] bg-[length:30px_30px]"></div>
            <div className="absolute top-5 left-5 sm:top-18 sm:left-18 w-28 h-28 sm:w-76 sm:h-76 bg-gradient-to-br from-red-200/40 to-orange-200/40 rounded-full blur-lg sm:blur-3xl animate-float"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-18 sm:right-18 w-32 h-32 sm:w-88 sm:h-88 bg-gradient-to-br from-amber-200/35 to-yellow-200/35 rounded-full blur-xl sm:blur-2xl animate-float-delayed"></div>
            <div className="absolute top-2/3 left-1/3 w-16 h-16 sm:w-44 sm:h-44 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-full blur-sm sm:blur-xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
            <div className="relative z-10">
              <ContactSection />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-4 sm:mt-8">
        <Footer />
      </footer>

      {/* Floating Elements */}
      <WhatsAppButton />
      
      {/* Background Decorative Elements - Hidden on mobile for performance */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Index;
