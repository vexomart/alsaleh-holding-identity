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
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px] overflow-x-hidden relative mobile-scroll">
      {/* أدوات التسويق */}
      <GoogleAnalytics trackingId="G-XXXXXXXXXX" />
      <FacebookPixel pixelId="XXXXXXXXXXXXXXXXX" />
      
      <Navigation />
      
      {/* Simplified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/8 to-accent/6 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-3/4 w-48 h-48 bg-gradient-to-tr from-secondary/6 to-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative overflow-hidden z-10">
        {/* Hero Section - Simplified */}
        <section id="home" className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/8">
          <HeroSection />
        </section>

        {/* Content Sections with Professional Spacing */}
        <div className="space-y-0">
          {/* Our Services Section */}
          <section className="relative">
            <OurServicesSection />
          </section>
          
          {/* Newsletter Subscription */}
          <NewsletterSubscription />
          
          {/* Social Media Links */}
          <SocialMediaLinks />
          
          {/* Marketing Blog */}
          <MarketingBlog />
        </div>
      </main>

      {/* Footer with Enhanced Styling */}
      <footer className="relative z-10 mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
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
