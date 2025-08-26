import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import GoogleAnalytics from "@/components/marketing/GoogleAnalytics";
import FacebookPixel from "@/components/marketing/FacebookPixel";
import NewsletterSubscription from "@/components/marketing/NewsletterSubscription";
import SocialMediaLinks from "@/components/marketing/SocialMediaLinks";
import MarketingBlog from "@/components/marketing/MarketingBlog";
import OurServicesSection from "@/components/OurServicesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-[48px] lg:pt-[112px] overflow-x-hidden relative mobile-scroll">
      {/* أدوات التسويق */}
      <GoogleAnalytics trackingId="G-XXXXXXXXXX" />
      <FacebookPixel pixelId="XXXXXXXXXXXXXXXXX" />
      
      <Navigation />
      
      {/* Dark Theme Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-3/4 w-48 h-48 bg-gradient-to-tr from-indigo-600/15 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-bl from-purple-600/10 to-indigo-600/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <main className="relative overflow-hidden z-10">
        {/* Hero Section - Dark Theme */}
        <section id="home" className="relative bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900">
          <HeroSection />
        </section>

        {/* Content Sections with Dark Theme Spacing */}
        <div className="space-y-0 bg-slate-800/30">
          {/* Our Services Section */}
          <section className="relative bg-slate-800/20 backdrop-blur-sm">
            <OurServicesSection />
          </section>
          
          {/* Newsletter Subscription */}
          <div className="bg-slate-800/40">
            <NewsletterSubscription />
          </div>
          
          {/* Social Media Links */}
          <div className="bg-slate-900/60">
            <SocialMediaLinks />
          </div>
          
          {/* Marketing Blog */}
          <div className="bg-slate-800/30">
            <MarketingBlog />
          </div>
        </div>
      </main>

      {/* Footer with Dark Theme Styling */}
      <footer className="relative z-10 mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/60 to-transparent"></div>
        <div className="relative z-10">
          <Footer />
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
};

export default Index;
