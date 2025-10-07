import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  Calendar, 
  Users, 
  Code2, 
  Star, 
  Award,
  Palette,
  Zap,
  Shield,
  Layers,
  Database,
  Server,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import masterEduPathScreenshot from "@/assets/works/masteredupath-screenshot.png";
import fekrahAcademyScreenshot from "@/assets/works/fekrah-academy-screenshot.png";
import accountingSystemImg from "@/assets/systems/accounting-system.jpg";
import projectManagementImg from "@/assets/systems/project-management-system.jpg";
import inventorySystemImg from "@/assets/systems/inventory-system.jpg";
import hrSystemImg from "@/assets/systems/hr-system.jpg";
import crmSystemImg from "@/assets/systems/crm-system.jpg";
import posSystemImg from "@/assets/systems/pos-system.jpg";
import restaurantSystemImg from "@/assets/systems/restaurant-system.jpg";
import lmsSystemImg from "@/assets/systems/lms-system.jpg";
import realEstateSystemImg from "@/assets/systems/real-estate-system.jpg";
import healthcareSystemImg from "@/assets/systems/healthcare-system.jpg";

const OurWorks = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // عرض 6 أعمال في كل صفحة
  const filterButtons = [
    { id: "all", label: "كل الأعمال", color: "bg-gradient-to-r from-amber-500 to-orange-500", icon: Award },
    { id: "websites", label: "المواقع الإلكترونية", color: "bg-gradient-to-r from-blue-500 to-indigo-500", icon: Globe },
    { id: "mobile", label: "تطبيقات الجوال", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: Smartphone },
    { id: "systems", label: "الأنظمة الإدارية", color: "bg-gradient-to-r from-emerald-500 to-teal-500", icon: Database },
  ];

  // أعمالنا
  const works = [
    {
      id: 1,
      title: "وكالة ماستر إيدو باث",
      subtitle: "منصة التعليم العالي والبحث العلمي",
      description: "شريكك الموثوق في التعليم العالي والبحث العلمي. نقدم حلولاً متطورة ومعتمدة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم.",
      image: masterEduPathScreenshot,
      url: "https://masteredupath.com",
      category: "websites",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Tailwind CSS", color: "bg-cyan-500", icon: "🎨" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" }
      ],
      features: [
        { name: "تصميم متجاوب", icon: Monitor, description: "يعمل على جميع الأجهزة" },
        { name: "سرعة عالية", icon: Zap, description: "تحميل فائق السرعة" },
        { name: "أمان متقدم", icon: Shield, description: "حماية شاملة للبيانات" },
        { name: "تجربة مستخدم ممتازة", icon: Star, description: "واجهة سهلة وجذابة" }
      ],
      year: "2025",
      client: "MasterEduPath Agency",
      type: "موقع إلكتروني",
      status: "مكتمل",
      rating: 5,
      duration: "35 يوم"
    },
    {
      id: 2,
      title: "فكرة أكاديمي",
      subtitle: "الشريك الموثوق للنشر العلمي المعتمد",
      description: "تحول أفكارك العلمية إلى أبحاث منشورة في أرقى المجلات العالمية. نحن نوفر خدمة عالية الجودة مع نسبة نجاح 98% ودعم مستمر للباحثين.",
      image: fekrahAcademyScreenshot,
      url: "https://fekrah-academy.com",
      category: "websites",
      technologies: [
        { name: "PHP", color: "bg-purple-600", icon: "🐘" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "JavaScript", color: "bg-yellow-500", icon: "⚡" },
        { name: "CSS3", color: "bg-blue-500", icon: "🎨" },
        { name: "HTML5", color: "bg-red-500", icon: "📝" }
      ],
      features: [
        { name: "نظام إدارة محتوى", icon: Database, description: "إدارة سهلة وفعالة" },
        { name: "تصميم احترافي", icon: Palette, description: "واجهة جذابة ومتميزة" },
        { name: "أمان عالي", icon: Shield, description: "حماية متقدمة للبيانات" },
        { name: "دعم متعدد اللغات", icon: Globe, description: "متاح بلغات متعددة" }
      ],
      year: "2025",
      client: "Fekrah Academy",
      type: "موقع إلكتروني",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين"
    },
    {
      id: 3,
      title: "نظام إدارة المحاسبة والفواتير",
      subtitle: "نظام محاسبي متكامل للشركات",
      description: "نظام محاسبي شامل يساعد الشركات على إدارة الفواتير والعروض والمدفوعات والعملاء بكفاءة عالية مع تقارير مالية تفصيلية",
      image: accountingSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Supabase", color: "bg-emerald-600", icon: "🔥" }
      ],
      features: [
        { name: "إدارة الفواتير", icon: Database, description: "إنشاء وتتبع الفواتير" },
        { name: "إدارة العملاء", icon: Users, description: "قاعدة بيانات شاملة للعملاء" },
        { name: "التقارير المالية", icon: TrendingUp, description: "تقارير مالية تفصيلية" },
        { name: "نظام آمن", icon: Shield, description: "حماية متقدمة للبيانات المالية" }
      ],
      year: "2025",
      client: "شركة علي صالح الشهري القابضة",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين"
    },
    {
      id: 4,
      title: "نظام إدارة المشاريع",
      subtitle: "إدارة احترافية للمشاريع والفرق",
      description: "نظام متقدم لإدارة المشاريع يتيح تتبع المهام والجداول الزمنية والموارد بطريقة احترافية مع لوحات تحكم تفاعلية",
      image: projectManagementImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Socket.io", color: "bg-gray-800", icon: "🔌" }
      ],
      features: [
        { name: "تتبع المهام", icon: CheckCircle, description: "إدارة المهام بكفاءة" },
        { name: "لوحات كانبان", icon: Layers, description: "تنظيم بصري للمهام" },
        { name: "التعاون الفوري", icon: Users, description: "تواصل مباشر بين الفريق" },
        { name: "تقارير الأداء", icon: TrendingUp, description: "تحليلات شاملة للإنتاجية" }
      ],
      year: "2025",
      client: "عدة شركات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 5,
      title: "نظام إدارة المخزون",
      subtitle: "حلول متكاملة لإدارة المخازن",
      description: "نظام ذكي لإدارة المخزون والمستودعات مع تتبع دقيق للمنتجات والكميات والحركات اليومية وإشعارات تلقائية",
      image: inventorySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "Redis", color: "bg-red-600", icon: "⚡" },
        { name: "Docker", color: "bg-blue-600", icon: "🐳" }
      ],
      features: [
        { name: "إدارة المخزون", icon: Database, description: "تتبع شامل للمنتجات" },
        { name: "تنبيهات ذكية", icon: Zap, description: "إشعارات عند نقص المخزون" },
        { name: "إدارة الموردين", icon: Briefcase, description: "قاعدة بيانات للموردين" },
        { name: "تقارير مفصلة", icon: TrendingUp, description: "تحليلات حركة المخزون" }
      ],
      year: "2025",
      client: "شركات تجارية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 6,
      title: "نظام إدارة الموارد البشرية",
      subtitle: "إدارة شاملة للموظفين والموارد",
      description: "نظام متطور لإدارة الموارد البشرية يشمل الرواتب والحضور والإجازات والتقييم والتدريب مع تكامل كامل",
      image: hrSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "Spring Boot", color: "bg-green-600", icon: "🍃" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Kafka", color: "bg-gray-900", icon: "📨" },
        { name: "AWS", color: "bg-orange-500", icon: "☁️" }
      ],
      features: [
        { name: "إدارة الرواتب", icon: TrendingUp, description: "حساب آلي للرواتب" },
        { name: "تتبع الحضور", icon: Calendar, description: "نظام بصمة متقدم" },
        { name: "إدارة الإجازات", icon: CheckCircle, description: "موافقة إلكترونية" },
        { name: "تقييم الأداء", icon: Star, description: "نظام تقييم شامل" }
      ],
      year: "2025",
      client: "مؤسسات كبرى",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 7,
      title: "نظام إدارة علاقات العملاء CRM",
      subtitle: "إدارة ذكية لعلاقات العملاء",
      description: "نظام CRM متطور لإدارة العملاء والمبيعات والفرص التجارية مع أتمتة ذكية وتحليلات متقدمة لزيادة الإيرادات",
      image: crmSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "GraphQL", color: "bg-pink-600", icon: "◆" },
        { name: "Docker", color: "bg-blue-600", icon: "🐳" }
      ],
      features: [
        { name: "إدارة العملاء", icon: Users, description: "قاعدة بيانات شاملة" },
        { name: "تتبع المبيعات", icon: TrendingUp, description: "إدارة خط المبيعات" },
        { name: "أتمتة التسويق", icon: Zap, description: "حملات تسويقية آلية" },
        { name: "تحليلات متقدمة", icon: Target, description: "تقارير ذكاء أعمال" }
      ],
      year: "2025",
      client: "شركات تسويق",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 8,
      title: "نظام نقاط البيع POS",
      subtitle: "نظام كاشير ذكي متكامل",
      description: "نظام نقاط بيع حديث للمحلات التجارية مع إدارة المبيعات والمخزون والتقارير اليومية وربط مع طابعة الفواتير",
      image: posSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Electron", color: "bg-cyan-600", icon: "⚡" },
        { name: "SQLite", color: "bg-blue-400", icon: "💾" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "Thermal Printer", color: "bg-gray-700", icon: "🖨️" }
      ],
      features: [
        { name: "واجهة كاشير سريعة", icon: Zap, description: "معاملات فورية" },
        { name: "إدارة المنتجات", icon: Database, description: "كتالوج شامل" },
        { name: "طباعة الفواتير", icon: CheckCircle, description: "فواتير احترافية" },
        { name: "تقارير المبيعات", icon: TrendingUp, description: "تحليلات يومية" }
      ],
      year: "2025",
      client: "محلات تجارية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين"
    },
    {
      id: 9,
      title: "نظام إدارة المطاعم",
      subtitle: "حلول شاملة لإدارة المطاعم",
      description: "نظام متكامل لإدارة المطاعم يشمل الطلبات والمطبخ والتوصيل وحجز الطاولات مع واجهة سهلة للعملاء والموظفين",
      image: restaurantSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React Native", color: "bg-blue-500", icon: "📱" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Socket.io", color: "bg-gray-800", icon: "🔌" },
        { name: "Firebase", color: "bg-orange-500", icon: "🔥" }
      ],
      features: [
        { name: "إدارة القوائم", icon: Database, description: "قوائم طعام ديناميكية" },
        { name: "نظام المطبخ", icon: Zap, description: "شاشة المطبخ الذكية" },
        { name: "حجز الطاولات", icon: Calendar, description: "حجوزات مباشرة" },
        { name: "التوصيل", icon: Target, description: "تتبع الطلبات" }
      ],
      year: "2025",
      client: "سلسلة مطاعم",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 10,
      title: "نظام إدارة التعلم LMS",
      subtitle: "منصة تعليمية إلكترونية متكاملة",
      description: "نظام إدارة التعلم الإلكتروني مع الدورات التدريبية والاختبارات والشهادات وتتبع تقدم الطلاب بشكل تفاعلي",
      image: lmsSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Prisma", color: "bg-indigo-600", icon: "🔷" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Mux", color: "bg-purple-600", icon: "🎥" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" }
      ],
      features: [
        { name: "إدارة الدورات", icon: Database, description: "محتوى تفاعلي" },
        { name: "الاختبارات", icon: CheckCircle, description: "تقييم ذكي" },
        { name: "الشهادات", icon: Award, description: "شهادات معتمدة" },
        { name: "تتبع التقدم", icon: TrendingUp, description: "تقارير مفصلة" }
      ],
      year: "2025",
      client: "مؤسسات تعليمية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 11,
      title: "نظام إدارة العقارات",
      subtitle: "إدارة احترافية للعقارات",
      description: "نظام شامل لإدارة العقارات والإيجارات والمستأجرين مع متابعة الصيانة والمدفوعات وعقود الإيجار الإلكترونية",
      image: realEstateSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Django", color: "bg-green-700", icon: "🐍" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Google Maps", color: "bg-blue-500", icon: "🗺️" },
        { name: "AWS S3", color: "bg-orange-500", icon: "☁️" }
      ],
      features: [
        { name: "إدارة العقارات", icon: Database, description: "كتالوج شامل" },
        { name: "المستأجرين", icon: Users, description: "قاعدة بيانات كاملة" },
        { name: "العقود", icon: CheckCircle, description: "توقيع إلكتروني" },
        { name: "الصيانة", icon: Target, description: "طلبات الصيانة" }
      ],
      year: "2025",
      client: "شركات عقارية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    },
    {
      id: 12,
      title: "نظام إدارة العيادات الطبية",
      subtitle: "حلول صحية رقمية متقدمة",
      description: "نظام متطور لإدارة العيادات الطبية مع سجلات المرضى والمواعيد والوصفات الطبية والتكامل مع الأجهزة الطبية",
      image: healthcareSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "ASP.NET", color: "bg-purple-600", icon: "🔷" },
        { name: "SQL Server", color: "bg-red-700", icon: "🗄️" },
        { name: "HL7 FHIR", color: "bg-blue-600", icon: "🏥" },
        { name: "Azure", color: "bg-blue-500", icon: "☁️" }
      ],
      features: [
        { name: "سجلات المرضى", icon: Database, description: "ملفات إلكترونية" },
        { name: "المواعيد", icon: Calendar, description: "جدولة ذكية" },
        { name: "الوصفات", icon: CheckCircle, description: "وصفات رقمية" },
        { name: "التقارير الطبية", icon: TrendingUp, description: "تحليلات صحية" }
      ],
      year: "2025",
      client: "عيادات طبية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "5 أشهر"
    }
  ];

  // Filter works and reset to page 1 when filter changes
  const filteredWorks = works.filter(work => 
    activeFilter === "all" ? true : work.category === activeFilter
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = filteredWorks.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of works section
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      <PageContainer>
        {/* Enhanced Hero Section */}
        <div className="relative py-24 lg:py-40 overflow-hidden">
          {/* Advanced Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/12"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent"></div>
          
          {/* Animated Background Shapes */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent/12 to-primary/8 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Geometric Patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full border border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-primary">معرض أعمالنا</span>
                </div>
                <div className="w-px h-6 bg-border"></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>مشاريع متميزة</span>
                </div>
              </div>
              
              {/* Enhanced Title */}
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                  أعمالنا
                </span>
                <br />
                <span className="text-3xl lg:text-4xl font-medium text-muted-foreground">
                  المتميزة والمبتكرة
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                ألقِ نظرة على معرض أعمالنا بأنواعها المختلفة واكتشف كيف نحول الأفكار إلى واقع رقمي مبهر
              </p>

              {/* Enhanced Intellectual Property Notice with Alert Indicator - Fully Responsive with Corporate Font */}
              <div className="max-w-4xl mx-auto mb-12 px-4" dir="rtl">
                <div className="relative group">
                  {/* Animated Background Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-2xl lg:rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Main Notice Card */}
                  <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-amber-500/5 to-background rounded-2xl lg:rounded-3xl border-2 border-amber-500/30 backdrop-blur-xl shadow-2xl font-['Cairo',sans-serif]">
                    {/* Animated Alert Indicator - Responsive */}
                    <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl lg:rounded-2xl shadow-2xl flex items-center justify-center animate-bounce">
                      <div className="relative">
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white relative z-10" />
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                      </div>
                    </div>

                    {/* Decorative Corner Elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-tr-2xl lg:rounded-tr-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-bl-2xl lg:rounded-bl-3xl"></div>

                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      {/* Pulsing Icon Container - Hidden on mobile, shown on larger screens */}
                      <div className="hidden sm:flex flex-shrink-0 relative order-last">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white relative z-10" />
                        </div>
                        {/* Pulsing Ring */}
                        <div className="absolute inset-0 border-4 border-amber-500/30 rounded-xl lg:rounded-2xl animate-ping"></div>
                      </div>

                      {/* Content - Full width on mobile */}
                      <div className="flex-1 text-right w-full sm:pt-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 sm:gap-3 mb-3">
                          <div className="flex gap-1 order-last sm:order-first">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                            ملاحظة هامة بخصوص الحقوق الفكرية
                          </h3>
                        </div>
                        
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                          نحترم خصوصية عملائنا واتفاقيات السرية المُبرمة معهم. بعض أعمالنا المميزة غير معروضة هنا بناءً على طلب العملاء وحفاظاً على حقوقهم الفكرية وسرية أعمالهم.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 sm:gap-3 pt-3 border-t border-amber-500/20">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 order-last sm:order-first" />
                          <span className="text-xs sm:text-sm font-semibold text-amber-600">المعروض هنا جزء من محفظة أعمالنا المتاح مشاركتها</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                {filterButtons.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      onClick={() => handleFilterChange(filter.id)}
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      className={`group px-8 py-4 text-base font-medium transition-all duration-300 rounded-2xl ${
                        activeFilter === filter.id 
                          ? `${filter.color} text-white hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105` 
                          : "hover:bg-primary hover:text-primary-foreground border-border/50 hover:border-primary/50 transform hover:scale-105"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      {filter.label}
                      {activeFilter === filter.id && (
                        <div className="ml-3 w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { number: "50+", label: "مشروع مكتمل", icon: CheckCircle, color: "text-emerald-500" },
                  { number: "100%", label: "رضا العملاء", icon: Star, color: "text-amber-500" },
                  { number: "24/7", label: "دعم فني", icon: Shield, color: "text-blue-500" }
                ].map((stat, index) => (
                  <div key={index} className="group p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Works Grid Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/5"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            {filteredWorks.length > 0 ? (
              <div className="space-y-16">
                {/* Works Grid - Responsive for all devices */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                  {currentWorks.map((work, index) => (
                    <Card 
                      key={work.id} 
                      className={`group overflow-hidden relative bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border-0 transition-all duration-700 hover:scale-[1.03] rounded-3xl animate-fade-in-up opacity-0 shadow-lg hover:shadow-2xl ${
                        index === 0 
                          ? 'before:absolute before:inset-0 before:rounded-3xl before:p-[3px] before:bg-gradient-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:-z-10' 
                          : 'before:absolute before:inset-0 before:rounded-3xl before:p-[3px] before:bg-gradient-to-r before:from-emerald-500 before:via-teal-500 before:to-cyan-500 before:-z-10'
                      } hover:before:from-primary hover:before:via-secondary hover:before:to-accent`}
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animationFillMode: 'forwards',
                        boxShadow: index === 0 
                          ? '0 8px 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          : '0 8px 32px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Colorful Premium Border Effect */}
                      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm ${
                        index === 0 
                          ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-pink-500/30' 
                          : 'bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-cyan-500/30'
                      }`}></div>
                      <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-background via-background/98 to-background/95 z-10"></div>
                      
                      {/* Luxury Image Section with Colored Overlay */}
                      <div className="relative overflow-hidden h-40 rounded-t-3xl z-20">
                        <div className={`absolute inset-0 ${
                          index === 0 
                            ? 'bg-gradient-to-br from-blue-500/8 via-transparent to-purple-500/8' 
                            : 'bg-gradient-to-br from-emerald-500/8 via-transparent to-teal-500/8'
                        }`}></div>
                        <img 
                          src={work.image} 
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 filter group-hover:brightness-110"
                        />
                        
                        {/* Elegant Gradient Overlay with Colored Accents */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700"></div>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${
                          index === 0 
                            ? 'bg-gradient-to-br from-blue-500/15 via-transparent to-purple-500/15' 
                            : 'bg-gradient-to-br from-emerald-500/15 via-transparent to-teal-500/15'
                        }`}></div>
                        
                        {/* Premium Status Badges */}
                        <div className="absolute top-3 left-3 flex gap-2 z-30">
                          <Badge className={`${work.status === 'مكتمل' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-amber-600'} text-white border-0 text-xs font-semibold px-3 py-1 shadow-lg transform transition-all duration-300 group-hover:scale-110 backdrop-blur-sm`}>
                            ✨ {work.status}
                          </Badge>
                          <Badge className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 text-white border-0 text-xs font-medium px-3 py-1 shadow-lg backdrop-blur-md transform transition-all duration-300 group-hover:scale-110">
                            {work.type}
                          </Badge>
                        </div>

                        {/* Luxury Rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full px-3 py-2 shadow-xl transform transition-all duration-300 group-hover:scale-110 border border-white/20 z-30">
                          {[...Array(work.rating)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-3 h-3 text-amber-500 fill-current transition-all duration-300 group-hover:text-amber-400" 
                              style={{ 
                                animationDelay: `${i * 0.1}s`,
                                filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3))'
                              }}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-1">{work.rating}.0</span>
                        </div>
                      </div>
                      
                      <CardContent className="p-5 relative z-20 bg-gradient-to-br from-background/95 to-background/90">
                        {/* Luxury Header with Glass Effect */}
                        <div className="mb-4 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-xl opacity-50"></div>
                          <div className="relative p-3 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 pr-2">
                                <h3 className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                                  {work.title}
                                </h3>
                                <p className="text-xs font-medium text-primary/80 mb-1 line-clamp-1">
                                  {work.subtitle}
                                </p>
                              </div>
                              <div className="text-right text-xs">
                                <div className="flex items-center gap-1 mb-1 px-2 py-1 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                  <Calendar className="w-3 h-3 text-primary" />
                                  <span className="font-semibold text-primary">{work.year}</span>
                                </div>
                                <div className="font-bold text-xs text-center mt-1 px-2 py-1 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full text-secondary">
                                  {work.duration}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed text-xs mb-3 line-clamp-2 opacity-80">
                              {work.description}
                            </p>
                          </div>
                        </div>

                        {/* Premium Technologies Section */}
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                            <div className={`w-1 h-4 rounded-full ${
                              index === 0 ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-gradient-to-b from-emerald-500 to-teal-500'
                            }`}></div>
                            <Code2 className="w-3 h-3 text-primary group-hover:rotate-12 transition-transform" />
                            التقنيات المستخدمة
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {work.technologies.slice(0, 4).map((tech, techIndex) => (
                              <Badge 
                                key={techIndex} 
                                className={`${tech.color} text-white border-0 text-xs font-semibold px-2 py-1 hover:scale-110 transition-all duration-500 cursor-default shadow-lg relative overflow-hidden`}
                                style={{ animationDelay: `${techIndex * 0.1}s` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <span className="mr-1 text-xs relative z-10">{tech.icon}</span>
                                <span className="relative z-10">{tech.name}</span>
                              </Badge>
                            ))}
                            {work.technologies.length > 4 && (
                              <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs px-2 py-1 shadow-lg">
                                +{work.technologies.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Luxury Features Grid */}
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                            <div className={`w-1 h-4 rounded-full ${
                              index === 0 ? 'bg-gradient-to-b from-amber-400 to-orange-500' : 'bg-gradient-to-b from-green-400 to-emerald-500'
                            }`}></div>
                            <Star className="w-3 h-3 text-amber-500 group-hover:rotate-12 transition-transform" />
                            المميزات الأساسية
                          </h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {work.features.map((feature, featureIndex) => (
                              <div 
                                key={featureIndex}
                                className="group/feature p-2 bg-gradient-to-br from-primary/8 via-primary/5 to-secondary/8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 cursor-default shadow-sm hover:shadow-lg backdrop-blur-sm relative overflow-hidden"
                                style={{ animationDelay: `${featureIndex * 0.1}s` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover/feature:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="flex items-center gap-1.5 mb-1 relative z-10">
                                  <feature.icon className="w-3 h-3 text-primary group-hover/feature:scale-125 group-hover/feature:rotate-12 transition-all duration-300" />
                                  <span className="text-xs font-semibold text-foreground truncate">{feature.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-tight line-clamp-1 relative z-10">{feature.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Premium Footer */}
                        <div className="flex items-center justify-center pt-3 border-t border-border/30">
                          <div className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            }`}></div>
                            <Users className="w-3 h-3 text-primary" />
                            <span className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">{work.client}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Component - أسفل الأعمال مباشرة */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 flex-wrap" dir="rtl">
                    {/* Next Button - على اليمين */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="group px-4 py-2 rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ArrowUpRight className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                      <span>التالي</span>
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-110"
                              : "border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    {/* Previous Button - على اليسار */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="group px-4 py-2 rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <span>السابق</span>
                      <ArrowUpRight className="w-4 h-4 mr-2 rotate-180 group-hover:scale-110 transition-transform" />
                    </Button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center mt-8">
                  <p className="text-sm text-muted-foreground font-['Cairo',sans-serif]">
                    عرض {startIndex + 1} - {Math.min(endIndex, filteredWorks.length)} من أصل {filteredWorks.length} عمل
                  </p>
                </div>
              </div>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-24">
                <div className="relative mb-12">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center relative overflow-hidden">
                    <Monitor className="w-16 h-16 text-muted-foreground z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    لا توجد أعمال في هذا القسم بعد
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    نعمل على إضافة المزيد من الأعمال المتميزة في هذا القسم قريباً. 
                    ترقبوا إبداعاتنا القادمة!
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setActiveFilter("all")}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      عرض جميع الأعمال
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/contact">تواصل معنا</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced CTA Section */}
            {filteredWorks.length > 0 && (
              <div className="mt-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent rounded-3xl"></div>
                
                <div className="relative p-12 lg:p-16 text-center border border-border/50 rounded-3xl backdrop-blur-sm">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                        <Briefcase className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                      هل تريد أن يكون مشروعك ضمن أعمالنا المميزة؟
                    </h3>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      تواصل معنا الآن لبدء رحلة تحويل فكرتك إلى واقع رقمي مبهر. 
                      نحن هنا لنساعدك في إنشاء مشروع استثنائي يحقق أهدافك ويتفوق على توقعاتك.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                      <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <a href="/contact">
                          <Target className="w-5 h-5 mr-2" />
                          بدء مشروعك الآن
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-2xl border-primary/20 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all">
                        <a href="/services-catalog">
                          <Layers className="w-5 h-5 mr-2" />
                          استكشف خدماتنا
                        </a>
                      </Button>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ضمان الجودة
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        نتائج مضمونة
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        دعم مستمر
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </PageContainer>

      <Footer />
    </div>
  );
};

export default OurWorks;