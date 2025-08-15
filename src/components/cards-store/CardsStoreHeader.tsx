import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart,
  MessageCircle,
  Menu,
  X,
  Crown,
  Building,
  Phone,
  ArrowRight
} from "lucide-react";

interface CardsStoreHeaderProps {
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

export function CardsStoreHeader({ 
  showBackButton = false, 
  title = "🛍️ متجر البطاقات الإلكترونية",
  subtitle = "المتجر الأول والأكثر ثقة في المملكة"
}: CardsStoreHeaderProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { name: "الرئيسية", href: "/cards-store" },
    { name: "عن المتجر", href: "/cards-store/about" },
    { name: "تواصل معنا", href: "/cards-store/contact" },
    { name: "الأسئلة الشائعة", href: "/cards-store/faq" },
    { name: "الشروط والأحكام", href: "/cards-store/terms" },
    { name: "سياسة الخصوصية", href: "/cards-store/privacy" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="container mx-auto text-center relative">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm font-medium flex items-center justify-center gap-2"
          >
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
            🏢 تم تطوير هذا المتجر بواسطة{" "}
            <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-full">
              شركة علي صالح الشهري القابضة
            </span>
            <Crown className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 animate-bounce" />
          </motion.p>
        </div>
      </div>

      {/* Navigation Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-200 dark:border-slate-700" 
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cards-store")}
            >
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {title}
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to="/cards-store">
                    <Button variant="outline" className="flex items-center gap-2" size="sm">
                      <ArrowRight className="w-4 h-4" />
                      العودة للرئيسية
                    </Button>
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={() => {
                    const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">💬 واتساب</span>
                  <span className="sm:hidden">💬</span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  onClick={() => window.open('tel:+966500000000', '_blank')}
                  variant="outline"
                  className="hidden sm:flex items-center gap-2"
                  size="sm"
                >
                  <Phone className="w-4 h-4" />
                  📞 اتصل
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-2 px-4 pt-2">
                <Button 
                  onClick={() => {
                    window.open('tel:+966500000000', '_blank');
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <Phone className="w-4 h-4 ml-2" />
                  📞 اتصل بنا
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>
    </>
  );
}