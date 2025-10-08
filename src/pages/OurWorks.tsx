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
import bookingSystemImg from "@/assets/systems/booking-system.jpg";
import schoolSystemImg from "@/assets/systems/school-system.jpg";
import hotelSystemImg from "@/assets/systems/hotel-system.jpg";
import gymSystemImg from "@/assets/systems/gym-system.jpg";
import maintenanceSystemImg from "@/assets/systems/maintenance-system.jpg";
import logisticsSystemImg from "@/assets/systems/logistics-system.jpg";
import workshopSystemImg from "@/assets/systems/workshop-system.jpg";
import librarySystemImg from "@/assets/systems/library-system.jpg";
import eventSystemImg from "@/assets/systems/event-system.jpg";
import ecommerceSystemImg from "@/assets/systems/ecommerce-system.jpg";
import supplierSystemImg from "@/assets/systems/supplier-system.jpg";
import manufacturingSystemImg from "@/assets/systems/manufacturing-system.jpg";
import pharmacySystemImg from "@/assets/systems/pharmacy-system.jpg";
import legalSystemImg from "@/assets/systems/legal-system.jpg";
import agricultureSystemImg from "@/assets/systems/agriculture-system.jpg";
import travelSystemImg from "@/assets/systems/travel-system.jpg";
import insuranceSystemImg from "@/assets/systems/insurance-system.jpg";
import dentalSystemImg from "@/assets/systems/dental-system.jpg";
import carRentalSystemImg from "@/assets/systems/car-rental-system.jpg";
import recruitmentSystemImg from "@/assets/systems/recruitment-system.jpg";
import salonSystemImg from "@/assets/systems/salon-system.jpg";
import veterinarySystemImg from "@/assets/systems/veterinary-system.jpg";
import constructionSystemImg from "@/assets/systems/construction-system.jpg";
import laboratorySystemImg from "@/assets/systems/laboratory-system.jpg";
import charitySystemImg from "@/assets/systems/charity-system.jpg";
import ticketingSystemImg from "@/assets/systems/ticketing-system.jpg";
import wasteManagementSystemImg from "@/assets/systems/waste-management-system.jpg";
import sportsClubSystemImg from "@/assets/systems/sports-club-system.jpg";
import zooSystemImg from "@/assets/systems/zoo-system.jpg";
import cinemaSystemImg from "@/assets/systems/cinema-system.jpg";
import gasStationSystemImg from "@/assets/systems/gas-station-system.jpg";
import poolSystemImg from "@/assets/systems/pool-system.jpg";
import trainingCenterSystemImg from "@/assets/systems/training-center-system.jpg";
import postOfficeSystemImg from "@/assets/systems/post-office-system.jpg";
import bankSystemImg from "@/assets/systems/bank-system.jpg";
import universitySystemImg from "@/assets/systems/university-system.jpg";
import hospitalSystemImg from "@/assets/systems/hospital-system.jpg";
import mallSystemImg from "@/assets/systems/mall-system.jpg";
import advertisingSystemImg from "@/assets/systems/advertising-system.jpg";
import deliverySystemImg from "@/assets/systems/delivery-system.jpg";
import opticalSystemImg from "@/assets/systems/optical-system.jpg";
import laserCenterSystemImg from "@/assets/systems/laser-center-system.jpg";
import carWashSystemImg from "@/assets/systems/car-wash-system.jpg";
import bakerySystemImg from "@/assets/systems/bakery-system.jpg";
import laundrySystemImg from "@/assets/systems/laundry-system.jpg";
import photographySystemImg from "@/assets/systems/photography-system.jpg";
import parkingSystemImg from "@/assets/systems/parking-system.jpg";
import printingSystemImg from "@/assets/systems/printing-system.jpg";
import clinicAppointmentsSystemImg from "@/assets/systems/clinic-appointments-system.jpg";
import taxiSystemImg from "@/assets/systems/taxi-system.jpg";
import jewelrySystemImg from "@/assets/systems/jewelry-system.jpg";
import furnitureSystemImg from "@/assets/systems/furniture-system.jpg";
import carRepairSystemImg from "@/assets/systems/car-repair-system.jpg";
import petrolStationSystemImg from "@/assets/systems/petrol-station-system.jpg";
import callCenterSystemImg from "@/assets/systems/call-center-system.jpg";
import movingCompanySystemImg from "@/assets/systems/moving-company-system.jpg";
import electronicsRepairSystemImg from "@/assets/systems/electronics-repair-system.jpg";
import realEstateAgencySystemImg from "@/assets/systems/real-estate-agency-system.jpg";
import coffeeShopSystemImg from "@/assets/systems/coffee-shop-system.jpg";
import evChargingSystemImg from "@/assets/systems/ev-charging-system.jpg";
import dialysisCenterSystemImg from "@/assets/systems/dialysis-center-system.jpg";
import physiotherapySystemImg from "@/assets/systems/physiotherapy-system.jpg";
import drivingSchoolSystemImg from "@/assets/systems/driving-school-system.jpg";
import kindergartenSystemImg from "@/assets/systems/kindergarten-system.jpg";
import carAuctionSystemImg from "@/assets/systems/car-auction-system.jpg";
import daycareSystemImg from "@/assets/systems/daycare-system.jpg";
import giftShopSystemImg from "@/assets/systems/gift-shop-system.jpg";
import medicalAestheticsSystemImg from "@/assets/systems/medical-aesthetics-system.jpg";
import tireShopSystemImg from "@/assets/systems/tire-shop-system.jpg";
import cleaningServiceSystemImg from "@/assets/systems/cleaning-service-system.jpg";
import securityServiceSystemImg from "@/assets/systems/security-service-system.jpg";
import toyStoreSystemImg from "@/assets/systems/toy-store-system.jpg";
import lasikCenterSystemImg from "@/assets/systems/lasik-center-system.jpg";
import customsClearanceSystemImg from "@/assets/systems/customs-clearance-system.jpg";
import flowerShopSystemImg from "@/assets/systems/flower-shop-system.jpg";
import oxygenTherapySystemImg from "@/assets/systems/oxygen-therapy-system.jpg";
import specializedLabSystemImg from "@/assets/systems/specialized-lab-system.jpg";
import { products } from "@/components/software-products/ProductsData";

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
    },
    {
      id: 13,
      title: "نظام إدارة الحجوزات والمواعيد",
      subtitle: "حلول ذكية لإدارة الحجوزات",
      description: "نظام متقدم لإدارة الحجوزات والمواعيد مع تقويم تفاعلي وإشعارات تلقائية وتأكيد آلي للمواعيد عبر الرسائل",
      image: bookingSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Calendar API", color: "bg-purple-600", icon: "📅" },
        { name: "Twilio", color: "bg-red-500", icon: "📱" }
      ],
      features: [
        { name: "التقويم التفاعلي", icon: Calendar, description: "جدولة سهلة ومرنة" },
        { name: "الإشعارات التلقائية", icon: Zap, description: "تذكير بالمواعيد" },
        { name: "إدارة العملاء", icon: Users, description: "سجل كامل للعملاء" },
        { name: "التقارير", icon: TrendingUp, description: "إحصائيات الحجوزات" }
      ],
      year: "2025",
      client: "مراكز خدمية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 14,
      title: "نظام إدارة المدارس والطلاب",
      subtitle: "منصة تعليمية شاملة للمدارس",
      description: "نظام متكامل لإدارة المدارس يشمل سجلات الطلاب والدرجات والحضور وجداول الدراسة مع بوابة إلكترونية لأولياء الأمور",
      image: schoolSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Prisma", color: "bg-indigo-600", icon: "🔷" },
        { name: "Tailwind", color: "bg-cyan-500", icon: "🎨" }
      ],
      features: [
        { name: "سجلات الطلاب", icon: Database, description: "ملفات إلكترونية شاملة" },
        { name: "الدرجات", icon: Star, description: "نظام تقييم متقدم" },
        { name: "الحضور", icon: CheckCircle, description: "تتبع يومي دقيق" },
        { name: "بوابة الأهل", icon: Users, description: "تواصل مباشر" }
      ],
      year: "2025",
      client: "مدارس خاصة",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 15,
      title: "نظام إدارة الفنادق",
      subtitle: "حلول فندقية متطورة",
      description: "نظام شامل لإدارة الفنادق يتضمن الحجوزات والغرف والخدمات الفندقية وإدارة النزلاء مع نظام فوترة متكامل",
      image: hotelSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "Redis", color: "bg-red-600", icon: "⚡" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" }
      ],
      features: [
        { name: "إدارة الغرف", icon: Database, description: "حالة الغرف الفورية" },
        { name: "الحجوزات", icon: Calendar, description: "نظام حجز متقدم" },
        { name: "خدمة الغرف", icon: Zap, description: "طلبات فورية" },
        { name: "الفواتير", icon: TrendingUp, description: "نظام محاسبي" }
      ],
      year: "2025",
      client: "فنادق ومنتجعات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    },
    {
      id: 16,
      title: "نظام إدارة الصالات الرياضية",
      subtitle: "إدارة احترافية للنوادي الرياضية",
      description: "نظام متطور لإدارة الصالات الرياضية مع تتبع العضويات والحصص والمدربين وبرامج التمارين الشخصية",
      image: gymSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Socket.io", color: "bg-gray-800", icon: "🔌" },
        { name: "Chart.js", color: "bg-pink-500", icon: "📊" }
      ],
      features: [
        { name: "إدارة العضويات", icon: Users, description: "اشتراكات متنوعة" },
        { name: "جدول الحصص", icon: Calendar, description: "حجز الحصص" },
        { name: "برامج التمارين", icon: Target, description: "خطط مخصصة" },
        { name: "متابعة التقدم", icon: TrendingUp, description: "تقارير الأداء" }
      ],
      year: "2025",
      client: "صالات رياضية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 17,
      title: "نظام إدارة الصيانة",
      subtitle: "حلول ذكية لإدارة الصيانة",
      description: "نظام متكامل لإدارة طلبات الصيانة والأصول والفنيين مع جدولة تلقائية وتتبع حالة الطلبات لحظياً",
      image: maintenanceSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Docker", color: "bg-blue-600", icon: "🐳" }
      ],
      features: [
        { name: "طلبات الصيانة", icon: Database, description: "نظام تذاكر متقدم" },
        { name: "إدارة الفنيين", icon: Users, description: "جدولة ذكية" },
        { name: "إدارة الأصول", icon: Briefcase, description: "سجل الأصول" },
        { name: "التقارير", icon: TrendingUp, description: "تحليلات الأداء" }
      ],
      year: "2025",
      client: "شركات الصيانة",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 18,
      title: "نظام إدارة النقل والشحن",
      subtitle: "حلول لوجستية متطورة",
      description: "نظام شامل لإدارة النقل والشحن مع تتبع الشحنات في الوقت الفعلي وإدارة الأسطول وتحسين المسارات",
      image: logisticsSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Google Maps", color: "bg-blue-500", icon: "🗺️" },
        { name: "WebSocket", color: "bg-gray-800", icon: "🔌" }
      ],
      features: [
        { name: "تتبع الشحنات", icon: Target, description: "تتبع مباشر" },
        { name: "إدارة الأسطول", icon: Database, description: "إدارة المركبات" },
        { name: "تحسين المسارات", icon: Zap, description: "مسارات ذكية" },
        { name: "التقارير", icon: TrendingUp, description: "تحليلات النقل" }
      ],
      year: "2025",
      client: "شركات الشحن",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 19,
      title: "نظام إدارة الورش",
      subtitle: "إدارة احترافية لورش السيارات",
      description: "نظام متطور لإدارة ورش السيارات مع سجلات المركبات وطلبات الإصلاح وإدارة قطع الغيار والفواتير",
      image: workshopSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "ASP.NET", color: "bg-purple-600", icon: "🔷" },
        { name: "SQL Server", color: "bg-red-700", icon: "🗄️" },
        { name: "SignalR", color: "bg-blue-600", icon: "📡" },
        { name: "Azure", color: "bg-blue-500", icon: "☁️" }
      ],
      features: [
        { name: "سجلات المركبات", icon: Database, description: "تاريخ الصيانة" },
        { name: "طلبات الإصلاح", icon: CheckCircle, description: "إدارة الطلبات" },
        { name: "قطع الغيار", icon: Briefcase, description: "إدارة المخزون" },
        { name: "الفواتير", icon: TrendingUp, description: "نظام محاسبي" }
      ],
      year: "2025",
      client: "ورش سيارات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 20,
      title: "نظام إدارة المكتبات",
      subtitle: "حلول رقمية للمكتبات",
      description: "نظام متكامل لإدارة المكتبات مع فهرسة الكتب والإعارة والإرجاع وإدارة الأعضاء والأرشفة الرقمية",
      image: librarySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Django", color: "bg-green-700", icon: "🐍" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Elasticsearch", color: "bg-yellow-500", icon: "🔍" },
        { name: "Docker", color: "bg-blue-600", icon: "🐳" }
      ],
      features: [
        { name: "فهرسة الكتب", icon: Database, description: "كتالوج شامل" },
        { name: "الإعارة والإرجاع", icon: CheckCircle, description: "نظام آلي" },
        { name: "إدارة الأعضاء", icon: Users, description: "سجل المستفيدين" },
        { name: "البحث المتقدم", icon: Target, description: "بحث ذكي" }
      ],
      year: "2025",
      client: "مكتبات عامة",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 21,
      title: "نظام إدارة الفعاليات والمؤتمرات",
      subtitle: "منصة شاملة لإدارة الفعاليات",
      description: "نظام متطور لإدارة الفعاليات والمؤتمرات مع التسجيل الإلكتروني والتذاكر وإدارة المتحدثين والحضور",
      image: eventSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" },
        { name: "SendGrid", color: "bg-blue-600", icon: "📧" }
      ],
      features: [
        { name: "التسجيل الإلكتروني", icon: Database, description: "تسجيل سهل" },
        { name: "إدارة التذاكر", icon: CheckCircle, description: "تذاكر ذكية" },
        { name: "إدارة المتحدثين", icon: Users, description: "جدول المتحدثين" },
        { name: "تقارير الحضور", icon: TrendingUp, description: "إحصائيات مفصلة" }
      ],
      year: "2025",
      client: "منظمو الفعاليات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 22,
      title: "نظام إدارة التجارة الإلكترونية",
      subtitle: "منصة متكاملة للبيع أونلاين",
      description: "نظام شامل للتجارة الإلكترونية مع إدارة المنتجات والطلبات والمدفوعات والشحن والتقارير التحليلية",
      image: ecommerceSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" },
        { name: "AWS", color: "bg-orange-500", icon: "☁️" }
      ],
      features: [
        { name: "إدارة المنتجات", icon: Database, description: "كتالوج شامل" },
        { name: "سلة التسوق", icon: Briefcase, description: "تسوق سهل" },
        { name: "المدفوعات", icon: CheckCircle, description: "بوابات آمنة" },
        { name: "التحليلات", icon: TrendingUp, description: "تقارير المبيعات" }
      ],
      year: "2025",
      client: "متاجر إلكترونية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 23,
      title: "نظام إدارة الموردين",
      subtitle: "إدارة احترافية للموردين والمشتريات",
      description: "نظام متكامل لإدارة الموردين وطلبات الشراء والعقود والمدفوعات مع تقييم أداء الموردين",
      image: supplierSystemImg,
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
        { name: "إدارة الموردين", icon: Users, description: "قاعدة بيانات شاملة" },
        { name: "طلبات الشراء", icon: Database, description: "نظام آلي" },
        { name: "إدارة العقود", icon: CheckCircle, description: "عقود إلكترونية" },
        { name: "تقييم الأداء", icon: Star, description: "تقييم الموردين" }
      ],
      year: "2025",
      client: "شركات صناعية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    },
    {
      id: 24,
      title: "نظام إدارة المصانع",
      subtitle: "حلول صناعية ذكية",
      description: "نظام متطور لإدارة المصانع مع مراقبة خطوط الإنتاج والجودة والصيانة الوقائية وإدارة المعدات",
      image: manufacturingSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Python", color: "bg-blue-600", icon: "🐍" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "IoT", color: "bg-green-600", icon: "📡" },
        { name: "Docker", color: "bg-blue-600", icon: "🐳" }
      ],
      features: [
        { name: "مراقبة الإنتاج", icon: Target, description: "تتبع لحظي" },
        { name: "مراقبة الجودة", icon: Star, description: "ضمان الجودة" },
        { name: "الصيانة الوقائية", icon: CheckCircle, description: "جدولة آلية" },
        { name: "التقارير", icon: TrendingUp, description: "تحليلات الإنتاج" }
      ],
      year: "2025",
      client: "مصانع ومنشآت صناعية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "5 أشهر"
    },
    {
      id: 25,
      title: "نظام إدارة الصيدليات",
      subtitle: "حلول طبية ذكية للصيدليات",
      description: "نظام شامل لإدارة الصيدليات مع تتبع المخزون الدوائي والوصفات الطبية وتواريخ الصلاحية والمبيعات",
      image: pharmacySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Barcode", color: "bg-gray-700", icon: "📊" }
      ],
      features: [
        { name: "إدارة المخزون الدوائي", icon: Database, description: "تتبع دقيق للأدوية" },
        { name: "الوصفات الطبية", icon: CheckCircle, description: "معالجة إلكترونية" },
        { name: "تنبيهات الصلاحية", icon: Zap, description: "إشعارات تلقائية" },
        { name: "نظام المبيعات", icon: TrendingUp, description: "إدارة متكاملة" }
      ],
      year: "2025",
      client: "صيدليات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 26,
      title: "نظام إدارة المكاتب القانونية",
      subtitle: "إدارة محترفة للقضايا والعملاء",
      description: "نظام متطور لإدارة المكاتب القانونية مع متابعة القضايا والجلسات والوثائق القانونية وإدارة العملاء",
      image: legalSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "ASP.NET", color: "bg-purple-600", icon: "🔷" },
        { name: "SQL Server", color: "bg-red-700", icon: "🗄️" },
        { name: "Azure", color: "bg-blue-500", icon: "☁️" },
        { name: "PDF", color: "bg-red-500", icon: "📄" }
      ],
      features: [
        { name: "إدارة القضايا", icon: Database, description: "متابعة شاملة" },
        { name: "جدول الجلسات", icon: Calendar, description: "تذكير تلقائي" },
        { name: "الوثائق القانونية", icon: Briefcase, description: "أرشفة آمنة" },
        { name: "إدارة العملاء", icon: Users, description: "قاعدة بيانات كاملة" }
      ],
      year: "2025",
      client: "مكاتب محاماة",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 27,
      title: "نظام إدارة المزارع",
      subtitle: "حلول زراعية ذكية ومتطورة",
      description: "نظام متكامل لإدارة المزارع مع مراقبة المحاصيل والري والثروة الحيوانية وجدولة الحصاد",
      image: agricultureSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Django", color: "bg-green-700", icon: "🐍" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "IoT", color: "bg-green-600", icon: "📡" },
        { name: "Maps", color: "bg-blue-500", icon: "🗺️" }
      ],
      features: [
        { name: "مراقبة المحاصيل", icon: Target, description: "تتبع النمو" },
        { name: "إدارة الري", icon: Zap, description: "جدولة ذكية" },
        { name: "الثروة الحيوانية", icon: Database, description: "سجلات شاملة" },
        { name: "جدولة الحصاد", icon: Calendar, description: "تخطيط محكم" }
      ],
      year: "2025",
      client: "مزارع ومشاريع زراعية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 28,
      title: "نظام إدارة وكالات السفر",
      subtitle: "منصة شاملة للسياحة والسفر",
      description: "نظام متطور لإدارة وكالات السفر مع الحجوزات والرحلات السياحية والفنادق والطيران",
      image: travelSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" },
        { name: "APIs", color: "bg-blue-600", icon: "🔌" }
      ],
      features: [
        { name: "حجوزات الطيران", icon: Target, description: "تكامل مع شركات الطيران" },
        { name: "حجوزات الفنادق", icon: Database, description: "شبكة واسعة" },
        { name: "الرحلات السياحية", icon: Calendar, description: "برامج متنوعة" },
        { name: "المدفوعات", icon: CheckCircle, description: "معالجة آمنة" }
      ],
      year: "2025",
      client: "وكالات سياحة وسفر",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 29,
      title: "نظام إدارة شركات التأمين",
      subtitle: "حلول تأمينية متكاملة",
      description: "نظام شامل لإدارة شركات التأمين مع البوليصات والمطالبات والأقساط وتقييم المخاطر",
      image: insuranceSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "Spring Boot", color: "bg-green-600", icon: "🍃" },
        { name: "Oracle", color: "bg-red-600", icon: "🗄️" },
        { name: "AWS", color: "bg-orange-500", icon: "☁️" },
        { name: "Blockchain", color: "bg-purple-600", icon: "⛓️" }
      ],
      features: [
        { name: "إدارة البوليصات", icon: Database, description: "سجلات شاملة" },
        { name: "معالجة المطالبات", icon: CheckCircle, description: "سير عمل آلي" },
        { name: "حساب الأقساط", icon: TrendingUp, description: "حسابات دقيقة" },
        { name: "تقييم المخاطر", icon: Shield, description: "تحليل متقدم" }
      ],
      year: "2025",
      client: "شركات تأمين",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "5 أشهر"
    },
    {
      id: 30,
      title: "نظام إدارة العيادات السنية",
      subtitle: "حلول طب الأسنان الرقمية",
      description: "نظام متكامل لإدارة عيادات الأسنان مع سجلات المرضى والصور الشعاعية والعلاجات والمواعيد",
      image: dentalSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "DICOM", color: "bg-blue-600", icon: "🏥" },
        { name: "Cloud", color: "bg-cyan-500", icon: "☁️" }
      ],
      features: [
        { name: "سجلات المرضى", icon: Database, description: "ملفات إلكترونية شاملة" },
        { name: "الصور الشعاعية", icon: Target, description: "عرض وتحليل" },
        { name: "خطط العلاج", icon: CheckCircle, description: "متابعة دقيقة" },
        { name: "المواعيد", icon: Calendar, description: "جدولة ذكية" }
      ],
      year: "2025",
      client: "عيادات أسنان",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 31,
      title: "نظام إدارة تأجير السيارات",
      subtitle: "حلول ذكية لتأجير المركبات",
      description: "نظام متطور لإدارة تأجير السيارات مع الأسطول والحجوزات والعقود وتتبع المركبات",
      image: carRentalSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "GPS", color: "bg-blue-500", icon: "📍" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" }
      ],
      features: [
        { name: "إدارة الأسطول", icon: Database, description: "كتالوج شامل" },
        { name: "الحجوزات", icon: Calendar, description: "نظام متقدم" },
        { name: "تتبع المركبات", icon: Target, description: "GPS مباشر" },
        { name: "العقود", icon: CheckCircle, description: "توقيع إلكتروني" }
      ],
      year: "2025",
      client: "شركات تأجير سيارات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 32,
      title: "نظام إدارة التوظيف والتعيين",
      subtitle: "منصة توظيف احترافية",
      description: "نظام شامل لإدارة التوظيف مع نشر الوظائف وتتبع المتقدمين والمقابلات وعملية التعيين",
      image: recruitmentSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "AI", color: "bg-purple-600", icon: "🤖" },
        { name: "LinkedIn API", color: "bg-blue-600", icon: "💼" }
      ],
      features: [
        { name: "نشر الوظائف", icon: Database, description: "منصات متعددة" },
        { name: "تتبع المتقدمين", icon: Users, description: "نظام ATS" },
        { name: "جدولة المقابلات", icon: Calendar, description: "تنسيق آلي" },
        { name: "تقييم المرشحين", icon: Star, description: "تقييم شامل" }
      ],
      year: "2025",
      client: "شركات ومكاتب توظيف",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    },
    {
      id: 33,
      title: "نظام إدارة الصالونات والسبا",
      subtitle: "حلول جمالية راقية",
      description: "نظام متكامل لإدارة الصالونات ومراكز التجميل مع الحجوزات والخدمات والمنتجات وإدارة الموظفين",
      image: salonSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "SMS", color: "bg-green-600", icon: "📱" },
        { name: "POS", color: "bg-gray-700", icon: "🛒" }
      ],
      features: [
        { name: "نظام الحجوزات", icon: Calendar, description: "جدولة مرنة" },
        { name: "إدارة الخدمات", icon: Database, description: "كتالوج شامل" },
        { name: "مبيعات المنتجات", icon: TrendingUp, description: "نقطة بيع" },
        { name: "إدارة الموظفين", icon: Users, description: "جداول وعمولات" }
      ],
      year: "2025",
      client: "صالونات ومراكز تجميل",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 34,
      title: "نظام إدارة العيادات البيطرية",
      subtitle: "رعاية صحية متكاملة للحيوانات",
      description: "نظام شامل لإدارة العيادات البيطرية مع سجلات الحيوانات والتطعيمات والعلاجات والجراحات",
      image: veterinarySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Cloud", color: "bg-cyan-500", icon: "☁️" }
      ],
      features: [
        { name: "سجلات الحيوانات", icon: Database, description: "ملفات شاملة" },
        { name: "جدول التطعيمات", icon: Calendar, description: "تذكير تلقائي" },
        { name: "العلاجات", icon: CheckCircle, description: "متابعة دقيقة" },
        { name: "المواعيد", icon: Users, description: "نظام حجز" }
      ],
      year: "2025",
      client: "عيادات بيطرية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 35,
      title: "نظام إدارة المشاريع الإنشائية",
      subtitle: "إدارة احترافية للمشاريع الهندسية",
      description: "نظام متطور لإدارة المشاريع الإنشائية مع التخطيط والموارد والميزانيات ومتابعة التقدم",
      image: constructionSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "ASP.NET", color: "bg-purple-600", icon: "🔷" },
        { name: "SQL Server", color: "bg-red-700", icon: "🗄️" },
        { name: "AutoCAD API", color: "bg-red-500", icon: "📐" },
        { name: "Power BI", color: "bg-yellow-500", icon: "📊" }
      ],
      features: [
        { name: "إدارة المشاريع", icon: Briefcase, description: "تخطيط شامل" },
        { name: "الموارد والعمالة", icon: Users, description: "تنظيم فعال" },
        { name: "الميزانيات", icon: TrendingUp, description: "مراقبة التكاليف" },
        { name: "متابعة التقدم", icon: Target, description: "تقارير مرحلية" }
      ],
      year: "2025",
      client: "شركات المقاولات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر ونصف"
    },
    {
      id: 36,
      title: "نظام إدارة المختبرات الطبية",
      subtitle: "حلول مختبرية رقمية متقدمة",
      description: "نظام متكامل لإدارة المختبرات الطبية مع العينات والفحوصات والنتائج والجودة",
      image: laboratorySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Django", color: "bg-green-700", icon: "🐍" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "HL7", color: "bg-blue-600", icon: "🏥" },
        { name: "Barcode", color: "bg-gray-700", icon: "📊" }
      ],
      features: [
        { name: "تتبع العينات", icon: Database, description: "باركود ذكي" },
        { name: "إدارة الفحوصات", icon: CheckCircle, description: "أنواع متعددة" },
        { name: "النتائج", icon: TrendingUp, description: "تقارير آلية" },
        { name: "ضمان الجودة", icon: Shield, description: "معايير صارمة" }
      ],
      year: "2025",
      client: "مختبرات طبية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    },
    {
      id: 37,
      title: "نظام إدارة الجمعيات الخيرية",
      subtitle: "منصة للعمل الخيري والإنساني",
      description: "نظام شامل لإدارة الجمعيات الخيرية مع التبرعات والمتطوعين والمستفيدين والحملات",
      image: charitySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" },
        { name: "Email", color: "bg-blue-600", icon: "📧" }
      ],
      features: [
        { name: "إدارة التبرعات", icon: TrendingUp, description: "بوابات متعددة" },
        { name: "المتطوعين", icon: Users, description: "قاعدة بيانات" },
        { name: "المستفيدين", icon: Database, description: "سجلات شاملة" },
        { name: "الحملات", icon: Target, description: "إدارة فعالة" }
      ],
      year: "2025",
      client: "جمعيات خيرية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 38,
      title: "نظام إدارة التذاكر والدعم الفني",
      subtitle: "حلول دعم العملاء الاحترافية",
      description: "نظام متطور لإدارة التذاكر والدعم الفني مع تتبع الطلبات وقاعدة المعرفة وتقارير الأداء",
      image: ticketingSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Socket.io", color: "bg-gray-800", icon: "🔌" },
        { name: "Elasticsearch", color: "bg-yellow-500", icon: "🔍" }
      ],
      features: [
        { name: "نظام التذاكر", icon: Database, description: "إدارة متقدمة" },
        { name: "الدعم المباشر", icon: Zap, description: "محادثة فورية" },
        { name: "قاعدة المعرفة", icon: Briefcase, description: "مقالات مساعدة" },
        { name: "تقارير الأداء", icon: TrendingUp, description: "تحليلات شاملة" }
      ],
      year: "2025",
      client: "شركات الدعم الفني",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 39,
      title: "نظام إدارة النفايات والتدوير",
      subtitle: "حلول بيئية ذكية ومستدامة",
      description: "نظام متكامل لإدارة النفايات مع مسارات الجمع والمركبات والتدوير والتحليلات البيئية",
      image: wasteManagementSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "Google Maps", color: "bg-blue-500", icon: "🗺️" },
        { name: "IoT", color: "bg-green-600", icon: "📡" }
      ],
      features: [
        { name: "مسارات الجمع", icon: Target, description: "تحسين المسارات" },
        { name: "إدارة المركبات", icon: Database, description: "تتبع الأسطول" },
        { name: "التدوير", icon: CheckCircle, description: "معالجة النفايات" },
        { name: "التقارير البيئية", icon: TrendingUp, description: "تحليلات بيئية" }
      ],
      year: "2025",
      client: "شركات خدمات النظافة",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 40,
      title: "نظام إدارة النوادي الرياضية",
      subtitle: "إدارة ذكية للمرافق الرياضية",
      description: "نظام متكامل لإدارة النوادي الرياضية مع العضويات والحجوزات والمدربين والبرامج التدريبية والمدفوعات",
      image: sportsClubSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" }
      ],
      features: [
        { name: "إدارة العضويات", icon: Users, description: "تتبع الأعضاء" },
        { name: "حجز المرافق", icon: Calendar, description: "نظام الحجز" },
        { name: "البرامج التدريبية", icon: Target, description: "جدولة التمارين" },
        { name: "نظام الدفع", icon: TrendingUp, description: "معالجة المدفوعات" }
      ],
      year: "2025",
      client: "نوادي رياضية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 41,
      title: "نظام إدارة حدائق الحيوان",
      subtitle: "إدارة شاملة للمحميات الطبيعية",
      description: "نظام متطور لإدارة حدائق الحيوان مع سجلات الحيوانات والرعاية الصحية والحجوزات والفعاليات",
      image: zooSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Supabase", color: "bg-emerald-600", icon: "🔥" },
        { name: "Maps", color: "bg-blue-500", icon: "🗺️" }
      ],
      features: [
        { name: "سجلات الحيوانات", icon: Database, description: "ملفات تفصيلية" },
        { name: "الرعاية الصحية", icon: CheckCircle, description: "متابعة طبية" },
        { name: "إدارة الزوار", icon: Users, description: "حجز التذاكر" },
        { name: "الفعاليات", icon: Calendar, description: "تنظيم الأنشطة" }
      ],
      year: "2025",
      client: "حدائق الحيوان",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 42,
      title: "نظام إدارة دور السينما",
      subtitle: "تجربة سينمائية رقمية متكاملة",
      description: "نظام شامل لإدارة دور السينما مع حجز التذاكر والعروض والقاعات والمبيعات والتقارير",
      image: cinemaSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" },
        { name: "QR Code", color: "bg-gray-700", icon: "📱" }
      ],
      features: [
        { name: "حجز التذاكر", icon: Database, description: "نظام حجز أونلاين" },
        { name: "إدارة العروض", icon: Calendar, description: "جدولة الأفلام" },
        { name: "القاعات", icon: CheckCircle, description: "إدارة المقاعد" },
        { name: "تقارير المبيعات", icon: TrendingUp, description: "تحليلات الإيرادات" }
      ],
      year: "2025",
      client: "دور السينما",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 43,
      title: "نظام إدارة محطات الوقود",
      subtitle: "إدارة ذكية لمحطات البنزين",
      description: "نظام متكامل لإدارة محطات الوقود مع المبيعات والمخزون والموظفين والصيانة والتقارير المالية",
      image: gasStationSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "IoT", color: "bg-green-600", icon: "📡" }
      ],
      features: [
        { name: "نقاط البيع", icon: Database, description: "نظام POS متقدم" },
        { name: "إدارة المخزون", icon: TrendingUp, description: "تتبع الوقود" },
        { name: "الموظفين", icon: Users, description: "إدارة الورديات" },
        { name: "تقارير مالية", icon: Target, description: "تحليلات شاملة" }
      ],
      year: "2025",
      client: "محطات الوقود",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    },
    {
      id: 44,
      title: "نظام إدارة المسابح",
      subtitle: "إدارة احترافية للمرافق المائية",
      description: "نظام شامل لإدارة المسابح والنوادي المائية مع العضويات والحجوزات والدروس والفعاليات",
      image: poolSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "Spring Boot", color: "bg-green-600", icon: "🍃" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Cloud", color: "bg-cyan-500", icon: "☁️" }
      ],
      features: [
        { name: "إدارة العضويات", icon: Users, description: "تتبع الأعضاء" },
        { name: "حجز المسارات", icon: Calendar, description: "جدولة السباحة" },
        { name: "دروس السباحة", icon: Target, description: "إدارة التدريب" },
        { name: "الفعاليات", icon: CheckCircle, description: "تنظيم المسابقات" }
      ],
      year: "2025",
      client: "مسابح ونوادي مائية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 45,
      title: "نظام إدارة مراكز التدريب",
      subtitle: "منصة تدريب شاملة ومتطورة",
      description: "نظام متكامل لإدارة مراكز التدريب مع الدورات والمدربين والمتدربين والشهادات والتقييمات",
      image: trainingCenterSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Zoom API", color: "bg-blue-600", icon: "📹" }
      ],
      features: [
        { name: "إدارة الدورات", icon: Database, description: "منهج شامل" },
        { name: "المدربين", icon: Users, description: "قاعدة بيانات" },
        { name: "المتدربين", icon: Target, description: "تتبع التقدم" },
        { name: "الشهادات", icon: CheckCircle, description: "إصدار آلي" }
      ],
      year: "2025",
      client: "مراكز تدريب",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 46,
      title: "نظام إدارة مكاتب البريد",
      subtitle: "حلول بريدية رقمية متطورة",
      description: "نظام شامل لإدارة مكاتب البريد مع الطرود والرسائل والتتبع والمدفوعات والخدمات البريدية",
      image: postOfficeSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Maps API", color: "bg-blue-500", icon: "🗺️" },
        { name: "Barcode", color: "bg-gray-700", icon: "📊" }
      ],
      features: [
        { name: "إدارة الطرود", icon: Database, description: "تتبع الشحنات" },
        { name: "نظام التتبع", icon: Target, description: "GPS متقدم" },
        { name: "الخدمات البريدية", icon: CheckCircle, description: "متعددة" },
        { name: "المدفوعات", icon: TrendingUp, description: "معالجة آمنة" }
      ],
      year: "2025",
      client: "مكاتب البريد",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 47,
      title: "نظام إدارة البنوك",
      subtitle: "حلول مصرفية رقمية متقدمة",
      description: "نظام بنكي شامل مع الحسابات والتحويلات والقروض والاستثمارات والخدمات المصرفية الإلكترونية",
      image: bankSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Java", color: "bg-red-600", icon: "☕" },
        { name: "Spring Boot", color: "bg-green-600", icon: "🍃" },
        { name: "Oracle", color: "bg-red-700", icon: "🗄️" },
        { name: "Security", color: "bg-gray-900", icon: "🔐" },
        { name: "Blockchain", color: "bg-purple-600", icon: "⛓️" }
      ],
      features: [
        { name: "الحسابات البنكية", icon: Database, description: "إدارة شاملة" },
        { name: "التحويلات", icon: TrendingUp, description: "آمنة وسريعة" },
        { name: "القروض", icon: Target, description: "نظام متكامل" },
        { name: "الأمان", icon: Shield, description: "حماية متقدمة" }
      ],
      year: "2025",
      client: "مؤسسات مصرفية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "6 أشهر"
    },
    {
      id: 48,
      title: "نظام إدارة الجامعات",
      subtitle: "منصة تعليمية أكاديمية متكاملة",
      description: "نظام جامعي شامل مع القبول والتسجيل والمقررات والدرجات والخريجين والبحث العلمي",
      image: universitySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "ASP.NET", color: "bg-purple-600", icon: "🔷" },
        { name: "SQL Server", color: "bg-red-700", icon: "🗄️" },
        { name: "Azure", color: "bg-blue-600", icon: "☁️" },
        { name: "Power BI", color: "bg-yellow-500", icon: "📊" }
      ],
      features: [
        { name: "القبول والتسجيل", icon: Users, description: "نظام متطور" },
        { name: "إدارة المقررات", icon: Database, description: "منهج شامل" },
        { name: "الدرجات", icon: Target, description: "تتبع الأداء" },
        { name: "البحث العلمي", icon: CheckCircle, description: "إدارة الأبحاث" }
      ],
      year: "2025",
      client: "جامعات ومعاهد",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "8 أشهر"
    },
    {
      id: 49,
      title: "نظام إدارة المستشفيات الكبرى",
      subtitle: "نظام صحي إلكتروني متكامل",
      description: "نظام مستشفى شامل مع المرضى والأطباء والعيادات والصيدلية والمختبرات والعمليات والإدارة",
      image: hospitalSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "HL7/FHIR", color: "bg-blue-600", icon: "🏥" },
        { name: "DICOM", color: "bg-purple-600", icon: "🩻" }
      ],
      features: [
        { name: "السجلات الطبية", icon: Database, description: "ملفات إلكترونية" },
        { name: "إدارة العيادات", icon: Calendar, description: "جدولة المواعيد" },
        { name: "الصيدلية", icon: CheckCircle, description: "إدارة الأدوية" },
        { name: "العمليات الجراحية", icon: Target, description: "تنظيم العمليات" }
      ],
      year: "2025",
      client: "مستشفيات كبرى",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "10 أشهر"
    },
    {
      id: 50,
      title: "نظام إدارة المولات التجارية",
      subtitle: "إدارة ذكية للمراكز التجارية",
      description: "نظام متكامل لإدارة المولات مع المحلات والإيجارات والصيانة والفعاليات والتسويق",
      image: mallSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "Maps", color: "bg-blue-500", icon: "🗺️" },
        { name: "IoT", color: "bg-green-600", icon: "📡" }
      ],
      features: [
        { name: "إدارة المحلات", icon: Database, description: "قاعدة بيانات" },
        { name: "الإيجارات", icon: TrendingUp, description: "العقود والدفعات" },
        { name: "الصيانة", icon: CheckCircle, description: "طلبات الخدمة" },
        { name: "الفعاليات", icon: Calendar, description: "تنظيم الأنشطة" }
      ],
      year: "2025",
      client: "مولات تجارية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "5 أشهر"
    },
    {
      id: 51,
      title: "نظام إدارة الحملات الإعلانية",
      subtitle: "منصة تسويق رقمي متكاملة",
      description: "نظام متطور لإدارة الحملات الإعلانية مع التخطيط والإنتاج والنشر والتحليلات والعملاء",
      image: advertisingSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Analytics", color: "bg-orange-500", icon: "📊" },
        { name: "Social API", color: "bg-blue-600", icon: "📱" }
      ],
      features: [
        { name: "إدارة الحملات", icon: Target, description: "تخطيط شامل" },
        { name: "الإنتاج الإبداعي", icon: Palette, description: "إدارة المحتوى" },
        { name: "النشر", icon: Zap, description: "قنوات متعددة" },
        { name: "التحليلات", icon: TrendingUp, description: "تقارير الأداء" }
      ],
      year: "2025",
      client: "وكالات إعلانية",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر"
    },
    {
      id: 52,
      title: "نظام إدارة خدمات التوصيل",
      subtitle: "حلول لوجستية ذكية ومتطورة",
      description: "نظام توصيل شامل مع الطلبات والسائقين والمسارات والتتبع والمدفوعات والتقييمات",
      image: deliverySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React Native", color: "bg-blue-500", icon: "📱" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Google Maps", color: "bg-blue-500", icon: "🗺️" },
        { name: "Socket.io", color: "bg-gray-800", icon: "🔌" }
      ],
      features: [
        { name: "إدارة الطلبات", icon: Database, description: "نظام متكامل" },
        { name: "السائقين", icon: Users, description: "تتبع الأسطول" },
        { name: "التتبع الحي", icon: Target, description: "GPS فوري" },
        { name: "المدفوعات", icon: TrendingUp, description: "معالجة آمنة" }
      ],
      year: "2025",
      client: "شركات التوصيل",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "4 أشهر ونصف"
    },
    {
      id: 53,
      title: "نظام إدارة محلات النظارات",
      subtitle: "حلول بصرية رقمية متقدمة",
      description: "نظام متكامل لإدارة محلات النظارات مع العملاء والنظارات والفحوصات والمبيعات والمخزون",
      image: opticalSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Cloud", color: "bg-cyan-500", icon: "☁️" }
      ],
      features: [
        { name: "سجلات العملاء", icon: Users, description: "ملفات شاملة" },
        { name: "فحص النظر", icon: CheckCircle, description: "نتائج دقيقة" },
        { name: "المبيعات", icon: TrendingUp, description: "نقاط البيع" },
        { name: "المخزون", icon: Database, description: "تتبع المنتجات" }
      ],
      year: "2025",
      client: "محلات النظارات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 54,
      title: "نظام إدارة مراكز الليزر",
      subtitle: "إدارة تجميلية طبية متطورة",
      description: "نظام شامل لإدارة مراكز الليزر مع العملاء والجلسات والأجهزة والمواعيد والمدفوعات",
      image: laserCenterSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Angular", color: "bg-red-600", icon: "🅰️" },
        { name: "Spring Boot", color: "bg-green-600", icon: "🍃" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "SMS", color: "bg-purple-600", icon: "📨" }
      ],
      features: [
        { name: "إدارة العملاء", icon: Users, description: "سجلات شاملة" },
        { name: "الجلسات", icon: Calendar, description: "جدولة متقدمة" },
        { name: "الأجهزة", icon: Target, description: "متابعة الاستخدام" },
        { name: "المدفوعات", icon: TrendingUp, description: "نظام آمن" }
      ],
      year: "2025",
      client: "مراكز الليزر",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 55,
      title: "نظام إدارة محطات غسيل السيارات",
      subtitle: "حلول عصرية لغسيل المركبات",
      description: "نظام متكامل لإدارة محطات غسيل السيارات مع الحجوزات والخدمات والعملاء والمدفوعات",
      image: carWashSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" },
        { name: "QR Code", color: "bg-gray-700", icon: "📱" }
      ],
      features: [
        { name: "نظام الحجز", icon: Calendar, description: "حجز أونلاين" },
        { name: "إدارة الخدمات", icon: Database, description: "باقات متنوعة" },
        { name: "العملاء", icon: Users, description: "برنامج الولاء" },
        { name: "المدفوعات", icon: TrendingUp, description: "معالجة سريعة" }
      ],
      year: "2025",
      client: "محطات غسيل",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين"
    },
    {
      id: 56,
      title: "نظام إدارة المخابز",
      subtitle: "حلول رقمية للمخابز الحديثة",
      description: "نظام متكامل لإدارة المخابز مع الإنتاج والمبيعات والمخزون والتوزيع والطلبات",
      image: bakerySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Vue.js", color: "bg-emerald-500", icon: "🖖" },
        { name: "Laravel", color: "bg-red-500", icon: "🔺" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "POS", color: "bg-gray-700", icon: "💰" },
        { name: "Reports", color: "bg-blue-600", icon: "📊" }
      ],
      features: [
        { name: "إدارة الإنتاج", icon: Target, description: "جدولة يومية" },
        { name: "نقاط البيع", icon: Database, description: "نظام POS" },
        { name: "المخزون", icon: CheckCircle, description: "تتبع المكونات" },
        { name: "التوزيع", icon: TrendingUp, description: "إدارة التوصيل" }
      ],
      year: "2025",
      client: "مخابز ومطاحن",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين ونصف"
    },
    {
      id: 57,
      title: "نظام إدارة المغاسل",
      subtitle: "حلول غسيل وكي احترافية",
      description: "نظام شامل لإدارة المغاسل مع الطلبات والعملاء والخدمات والتسليم والمدفوعات",
      image: laundrySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Express", color: "bg-gray-700", icon: "🚂" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "Barcode", color: "bg-gray-700", icon: "📊" },
        { name: "SMS", color: "bg-purple-600", icon: "📨" }
      ],
      features: [
        { name: "إدارة الطلبات", icon: Database, description: "تتبع دقيق" },
        { name: "العملاء", icon: Users, description: "سجلات شاملة" },
        { name: "الخدمات", icon: CheckCircle, description: "أسعار مرنة" },
        { name: "التسليم", icon: Target, description: "نظام توصيل" }
      ],
      year: "2025",
      client: "مغاسل",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين"
    },
    {
      id: 58,
      title: "نظام إدارة استوديوهات التصوير",
      subtitle: "إدارة احترافية للتصوير الفوتوغرافي",
      description: "نظام متكامل لإدارة استوديوهات التصوير مع الحجوزات والجلسات والمعارض والعملاء والمدفوعات",
      image: photographySystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "MongoDB", color: "bg-green-700", icon: "🍃" },
        { name: "Cloud Storage", color: "bg-cyan-500", icon: "☁️" },
        { name: "Stripe", color: "bg-purple-500", icon: "💳" }
      ],
      features: [
        { name: "نظام الحجز", icon: Calendar, description: "جدولة الجلسات" },
        { name: "معرض الصور", icon: Palette, description: "إدارة الألبومات" },
        { name: "العملاء", icon: Users, description: "ملفات شاملة" },
        { name: "المدفوعات", icon: TrendingUp, description: "معالجة آمنة" }
      ],
      year: "2025",
      client: "استوديوهات تصوير",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر"
    },
    {
      id: 59,
      title: "نظام إدارة مواقف السيارات",
      subtitle: "حلول ذكية لإدارة المواقف",
      description: "نظام متطور لإدارة مواقف السيارات مع الحجوزات والدخول والخروج والمدفوعات والأمان",
      image: parkingSystemImg,
      url: "#",
      category: "systems",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" },
        { name: "PostgreSQL", color: "bg-blue-700", icon: "🐘" },
        { name: "IoT", color: "bg-green-600", icon: "📡" },
        { name: "RFID", color: "bg-gray-700", icon: "📡" }
      ],
      features: [
        { name: "نظام الدخول", icon: Database, description: "بوابات ذكية" },
        { name: "الحجوزات", icon: Calendar, description: "حجز مسبق" },
        { name: "المدفوعات", icon: TrendingUp, description: "آلي وآمن" },
        { name: "الأمان", icon: Shield, description: "كاميرات مراقبة" }
      ],
      year: "2025",
      client: "مواقف السيارات",
      type: "نظام إداري",
      status: "مكتمل",
      rating: 5,
      duration: "3 أشهر ونصف"
    }
  ];

  // دمج الأنظمة من ProductsData مع الأعمال الحالية
  const systemsFromProducts = products.map((product, index) => ({
    id: works.length + index + 1,
    title: product.name,
    subtitle: product.description.substring(0, 50) + "...",
    description: product.description,
    image: accountingSystemImg, // استخدام صورة افتراضية
    url: product.demoUrl || "#",
    category: "systems",
    technologies: [
      { name: "React", color: "bg-blue-500", icon: "⚛️" },
      { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
      { name: "Supabase", color: "bg-emerald-600", icon: "🔥" },
      { name: "Tailwind CSS", color: "bg-cyan-500", icon: "🎨" },
    ],
    features: product.features.slice(0, 4).map((feat: string, i: number) => ({
      name: feat.replace(/[^\u0600-\u06FF\s]/g, '').trim(),
      icon: [Database, Shield, TrendingUp, CheckCircle][i % 4],
      description: feat
    })),
    year: "2025",
    client: "متاح للجميع",
    type: "نظام إداري",
    status: product.status || "متاح الآن",
    rating: product.rating || 5,
    duration: product.estimatedDelivery || "متاح فوراً"
  }));

  const allWorks = [...works, ...systemsFromProducts];

  // Filter works and reset to page 1 when filter changes
  const filteredWorks = allWorks.filter(work => 
    activeFilter === "all" ? true : work.category === activeFilter
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = filteredWorks.slice(startIndex, endIndex);

  // دالة لحساب أرقام الصفحات المرئية (للأجهزة الصغيرة)
  const getVisiblePages = () => {
    const maxVisiblePages = 5; // عدد الصفحات المرئية على الجوال
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages + 2) {
      // إذا كان العدد قليل، اعرض الكل
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // دائماً اعرض الصفحة الأولى
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // اعرض الصفحات المجاورة للصفحة الحالية
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // دائماً اعرض الصفحة الأخيرة
    pages.push(totalPages);
    
    return pages;
  };

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

                {/* Pagination Component - متجاوب مع جميع الأجهزة */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap" dir="rtl">
                      {/* Next Button - على اليمين */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="group px-3 sm:px-4 py-2 rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm"
                      >
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">التالي</span>
                        <span className="sm:hidden">›</span>
                      </Button>

                      {/* Page Numbers - متجاوب */}
                      <div className="flex gap-1 sm:gap-2 flex-wrap justify-center max-w-full">
                        {getVisiblePages().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center text-muted-foreground text-sm sm:text-base">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page as number)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-xs sm:text-sm ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105 sm:scale-110"
                                  : "border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                              }`}
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>

                      {/* Previous Button - على اليسار */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="group px-3 sm:px-4 py-2 rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">السابق</span>
                        <span className="sm:hidden">‹</span>
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 rotate-180 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>
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