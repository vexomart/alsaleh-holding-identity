/**
 * Sitemap Page - خريطة الموقع
 * Enterprise website sitemap with all routes organized by category
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { 
  Building2, 
  Briefcase, 
  Package, 
  Headphones, 
  BookOpen, 
  Scale,
  Code,
  Brain,
  Rocket,
  Cloud,
  Megaphone,
  Palette,
  Globe,
  Smartphone,
  Monitor,
  Users,
  Heart,
  GraduationCap,
  Newspaper,
  Calendar,
  FileText,
  HelpCircle,
  MapPin,
  ChevronLeft
} from "lucide-react";

const Sitemap = () => {
  const sections = [
    {
      title: "الشركة",
      icon: Building2,
      color: "from-blue-500 to-indigo-600",
      links: [
        { name: "الرئيسية", href: "/" },
        { name: "من نحن", href: "/about" },
        { name: "قصتنا", href: "/story" },
        { name: "فريق العمل", href: "/team" },
        { name: "رؤيتنا", href: "/vision" },
        { name: "شركاتنا التابعة", href: "/subsidiaries" },
        { name: "شركاؤنا", href: "/partnerships" },
        { name: "تواجدنا العالمي", href: "/global-presence" },
        { name: "المسؤولية الاجتماعية", href: "/social-responsibility" },
        { name: "أعمالنا", href: "/our-works" },
        { name: "الملف التعريفي", href: "/company-profile" },
      ]
    },
    {
      title: "الخدمات",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-600",
      links: [
        { name: "كتالوج الخدمات", href: "/services-catalog" },
        { name: "الخدمات التقنية", href: "/technical-services" },
        { name: "الذكاء الاصطناعي", href: "/ai-solutions" },
        { name: "التحول الرقمي", href: "/business-services/transformation" },
        { name: "الحلول السحابية", href: "/cloud-solutions" },
        { name: "التسويق الرقمي", href: "/digital-marketing" },
        { name: "حلول التصميم", href: "/design-solutions" },
        { name: "الاستشارات", href: "/business-services/consulting" },
        { name: "الاستضافة", href: "/hosting-services" },
        { name: "خدمات الأعمال", href: "/business-services" },
        { name: "التخطيط المالي", href: "/business-services/financial" },
      ]
    },
    {
      title: "المنتجات",
      icon: Package,
      color: "from-purple-500 to-pink-600",
      links: [
        { name: "البرمجيات", href: "/software-products" },
        { name: "تطبيقات الجوال", href: "/mobile-apps" },
        { name: "المواقع", href: "/websites" },
        { name: "مشاريع جاهزة", href: "/ready-projects" },
        { name: "المشاريع التقنية", href: "/tech-projects" },
        { name: "المنظومة التقنية", href: "/tech-ecosystem" },
        { name: "نظام CRM", href: "/crm-system" },
        { name: "الأتمتة", href: "/automation" },
        { name: "التقنيات", href: "/technologies" },
      ]
    },
    {
      title: "الدعم",
      icon: Headphones,
      color: "from-amber-500 to-orange-600",
      links: [
        { name: "تواصل معنا", href: "/contact" },
        { name: "مركز الدعم", href: "/support" },
        { name: "الأسئلة الشائعة", href: "/faq" },
        { name: "دليل المستخدم", href: "/user-guide" },
        { name: "الشكاوى", href: "/complaints" },
        { name: "حجز استشارة", href: "/book-consultation" },
        { name: "ابدأ مشروعك", href: "/start-project" },
        { name: "تجربة مجانية", href: "/free-trial" },
      ]
    },
    {
      title: "الموارد",
      icon: BookOpen,
      color: "from-cyan-500 to-blue-600",
      links: [
        { name: "الأخبار", href: "/news" },
        { name: "البيانات الصحفية", href: "/press" },
        { name: "الفعاليات", href: "/events" },
        { name: "التقارير السنوية", href: "/reports" },
        { name: "التدريب", href: "/training" },
        { name: "الوظائف", href: "/careers" },
        { name: "التطوع", href: "/volunteer" },
        { name: "التسويق بالعمولة", href: "/affiliate" },
        { name: "التحديثات", href: "/updates" },
      ]
    },
    {
      title: "الصفحات القانونية",
      icon: Scale,
      color: "from-rose-500 to-red-600",
      links: [
        { name: "سياسة الخصوصية", href: "/privacy" },
        { name: "الشروط والأحكام", href: "/terms" },
        { name: "سياسة الكوكيز", href: "/cookie-policy" },
        { name: "العقود", href: "/contracts" },
        { name: "العقود الرقمية", href: "/digital-contracts" },
        { name: "الأسعار", href: "/pricing" },
        { name: "العروض الحالية", href: "/offers" },
        { name: "طرق الدفع", href: "/payment-methods" },
      ]
    },
    {
      title: "بوابة العملاء",
      icon: Users,
      color: "from-indigo-500 to-violet-600",
      links: [
        { name: "تسجيل الدخول", href: "/auth/login" },
        { name: "إنشاء حساب", href: "/auth/register" },
        { name: "لوحة التحكم", href: "/portal" },
        { name: "لوحة الإدارة", href: "/admin" },
      ]
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <main className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full">
                خريطة الموقع
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
              <span className="text-foreground">تصفح جميع </span>
              <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
                صفحات الموقع
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              دليل شامل لجميع صفحات وأقسام موقع ASH HOLDING
            </p>
          </motion.div>

          {/* Sitemap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                </div>

                {/* Links List */}
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + linkIndex * 0.03 }}
                    >
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
                      >
                        <ChevronLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        <span>{link.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-6 px-8 py-4 bg-muted/50 rounded-2xl border border-border">
              <div className="text-center">
                <p className="text-2xl font-black text-primary">170+</p>
                <p className="text-sm text-muted-foreground">صفحة</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-black text-primary">7</p>
                <p className="text-sm text-muted-foreground">أقسام</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-black text-primary">50+</p>
                <p className="text-sm text-muted-foreground">خدمة</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
