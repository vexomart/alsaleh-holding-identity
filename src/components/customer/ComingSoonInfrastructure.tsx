/**
 * Coming Soon Infrastructure Page
 * Premium coming soon page with notification signup form
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Server,
  Cloud,
  Database,
  Shield,
  Zap,
  Globe,
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  Mail,
  Sparkles,
  Rocket,
  Lock,
  HardDrive,
  Network,
  Cpu,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Email validation schema
const emailSchema = z.string().email().max(255);

// Upcoming features
const upcomingFeatures = [
  {
    icon: Cloud,
    titleAr: "الاستضافة السحابية",
    titleEn: "Cloud Hosting",
    descAr: "خوادم سحابية عالية الأداء",
    descEn: "High-performance cloud servers",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Server,
    titleAr: "سيرفرات مخصصة",
    titleEn: "Dedicated Servers",
    descAr: "سيرفرات حصرية لمشاريعك",
    descEn: "Exclusive servers for your projects",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Database,
    titleAr: "قواعد البيانات",
    titleEn: "Managed Databases",
    descAr: "إدارة قواعد بيانات متقدمة",
    descEn: "Advanced database management",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    titleAr: "الحماية والأمان",
    titleEn: "Security & Protection",
    descAr: "حماية متقدمة لبياناتك",
    descEn: "Advanced data protection",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Network,
    titleAr: "شبكات CDN",
    titleEn: "CDN Networks",
    descAr: "توزيع محتوى عالمي سريع",
    descEn: "Fast global content delivery",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: HardDrive,
    titleAr: "النسخ الاحتياطي",
    titleEn: "Backup Solutions",
    descAr: "نسخ احتياطي تلقائي آمن",
    descEn: "Secure automatic backups",
    color: "from-indigo-500 to-violet-500",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const floatVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export function ComingSoonInfrastructure() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store notification subscription in notifications table
      const { error } = await supabase.from("notifications").insert({
        title: "Infrastructure Launch Notification",
        title_ar: "إشعار إطلاق البنية التحتية",
        message: `Subscribed email: ${email}`,
        message_ar: `البريد المشترك: ${email}`,
        type: "info",
        metadata: {
          subscription_type: "infrastructure_launch",
          email: email,
          subscribed_at: new Date().toISOString(),
        },
      });

      if (error) throw error;

      setIsSubscribed(true);
      setEmail("");
      toast({
        title: isRTL ? "تم الاشتراك بنجاح!" : "Subscribed successfully!",
        description: isRTL
          ? "سنُعلمك فور إطلاق خدمات البنية التحتية"
          : "We'll notify you when infrastructure services launch",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: isRTL ? "حدث خطأ" : "An error occurred",
        description: isRTL
          ? "يرجى المحاولة مرة أخرى"
          : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-background to-teal-950/30" />
      
      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[Server, Cloud, Database, Shield, Cpu, Globe].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Icon className="h-32 w-32 text-emerald-500" />
          </motion.div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/services")}
            className="gap-2 hover:bg-emerald-500/10 text-emerald-400"
          >
            <BackIcon className="h-4 w-4" />
            {isRTL ? "العودة للخدمات" : "Back to Services"}
          </Button>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            >
              <Rocket className="h-4 w-4 me-2" />
              {isRTL ? "قريباً جداً" : "Coming Very Soon"}
            </Badge>
          </motion.div>

          {/* Main Icon */}
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-3xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative p-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                <Server className="h-20 w-20 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
          >
            {isRTL ? "البنية التحتية" : "Infrastructure"}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-4"
          >
            {isRTL
              ? "نعمل على تجهيز أقوى حلول الاستضافة والسيرفرات"
              : "We're preparing the most powerful hosting solutions"}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground/80 max-w-2xl mx-auto mb-12"
          >
            {isRTL
              ? "قريباً ستتمكن من الوصول لأحدث حلول البنية التحتية السحابية، سيرفرات مخصصة عالية الأداء، وخدمات استضافة متقدمة مع أعلى معايير الأمان والموثوقية."
              : "Soon you'll have access to cutting-edge cloud infrastructure, high-performance dedicated servers, and advanced hosting services with the highest security and reliability standards."}
          </motion.p>

          {/* Notification Form */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="max-w-md mx-auto bg-gradient-to-br from-card/80 to-card/60 border-emerald-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 justify-center mb-4">
                  <Bell className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-lg">
                    {isRTL ? "كن أول من يعلم!" : "Be the First to Know!"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRTL
                    ? "اشترك ليصلك إشعار فور إطلاق الخدمات"
                    : "Subscribe to get notified when services launch"}
                </p>

                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3 py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                      </motion.div>
                      <p className="text-emerald-400 font-medium">
                        {isRTL ? "تم الاشتراك بنجاح!" : "Successfully subscribed!"}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubscribe}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <div className="relative flex-1">
                        <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder={isRTL ? "بريدك الإلكتروني" : "Your email address"}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="ps-10 bg-background/50 border-emerald-500/30 focus:border-emerald-500"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 gap-2"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                        {isRTL ? "أعلمني" : "Notify Me"}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Features Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              {isRTL ? "خدمات قادمة" : "Upcoming Services"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-card/60 to-card/40 border-border/50 hover:border-emerald-500/30 transition-all duration-300 group">
                      <CardContent className="p-5 text-center">
                        <motion.div
                          className={cn(
                            "w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center",
                            "bg-gradient-to-br",
                            feature.color,
                            "opacity-80 group-hover:opacity-100 transition-opacity"
                          )}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <h3 className="font-semibold mb-2">
                          {isRTL ? feature.titleAr : feature.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? feature.descAr : feature.descEn}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              {isRTL ? "أمان بدرجة المؤسسات" : "Enterprise-grade Security"}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              {isRTL ? "أداء فائق السرعة" : "Ultra-fast Performance"}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              {isRTL ? "تغطية عالمية" : "Global Coverage"}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
