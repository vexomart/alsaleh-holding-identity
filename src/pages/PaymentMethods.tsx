import Navigation from "@/components/Navigation";
import PaymentMethodsSection from "@/components/PaymentMethodsSection";
import Footer from "@/components/Footer";


const PaymentMethods = () => {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-32 overflow-x-hidden">
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 overflow-hidden">
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-green-100/15 via-emerald-100/20 via-teal-100/15 to-green-100/15"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-green-200/40 to-emerald-200/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                طرق الدفع
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                نوفر لك مجموعة متنوعة من طرق الدفع الآمنة والسهلة لتناسب احتياجاتك
              </p>
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-green-100/15 via-emerald-100/20 via-teal-100/15 to-green-100/15"></div>
          <div className="absolute top-5 right-5 sm:top-14 sm:right-14 w-32 h-32 sm:w-84 sm:h-84 bg-gradient-to-br from-green-200/40 to-emerald-200/40 rounded-full blur-xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-5 left-5 sm:bottom-14 sm:left-14 w-24 h-24 sm:w-72 sm:h-72 bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-lg sm:blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-48 sm:h-48 bg-gradient-to-r from-emerald-200/30 to-green-200/30 rounded-full blur-sm sm:blur-xl animate-float"></div>
          <div className="relative z-10">
            <PaymentMethodsSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-4 sm:mt-8">
        <Footer />
      </footer>

      {/* Floating Elements */}
      
      
      {/* Background Decorative Elements */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default PaymentMethods;