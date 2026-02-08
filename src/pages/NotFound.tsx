/**
 * 404 Not Found Page - Premium Enterprise Design
 * Unified design system - iOS-like experience
 */

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  HelpCircle,
  RefreshCw,
  FileQuestion,
  Sparkles
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const quickLinks = [
    {
      titleAr: "الصفحة الرئيسية",
      titleEn: "Home",
      path: "/",
      icon: Home,
    },
    {
      titleAr: "خدماتنا",
      titleEn: "Services",
      path: "/services",
      icon: Search,
    },
    {
      titleAr: "مركز المساعدة",
      titleEn: "Help Center",
      path: "/support",
      icon: HelpCircle,
    },
  ];

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto mb-8"
        >
          <div className="relative inline-flex">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
              <FileQuestion className="h-16 w-16 text-primary/60" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground">
            {isRTL ? "الصفحة غير موجودة" : "Page Not Found"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {isRTL
              ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تأكد من صحة الرابط أو عد إلى الصفحة الرئيسية."
              : "Sorry, the page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage."}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="gap-2 min-w-[140px]"
          >
            <BackIcon className="h-4 w-4" />
            {isRTL ? "رجوع" : "Go Back"}
          </Button>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="gap-2 min-w-[140px]"
          >
            <Home className="h-4 w-4" />
            {isRTL ? "الصفحة الرئيسية" : "Home"}
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {isRTL ? "روابط سريعة" : "Quick Links"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((link, index) => (
              <Button
                key={link.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(link.path)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {isRTL ? link.titleAr : link.titleEn}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Path Info (for debugging) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-xs text-muted-foreground/50 font-mono" dir="ltr">
            {location.pathname}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
