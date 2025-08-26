import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  CheckCircle,
  Award,
  Handshake,
  Zap,
  Shield,
  Sparkles,
  Crown,
  Rocket,
  Target,
  Code,
  Database,
  Cloud,
  Cpu,
  Settings,
  Network,
  Lock,
  Layers,
  Monitor,
  Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";

const globalPartners = [
  {
    id: 1,
    name: "Microsoft",
    logo: "/src/assets/partners/microsoft-logo.png",
    category: "Cloud Technology",
    tier: "Strategic",
    color: "from-blue-500 to-blue-700",
    shadow: "shadow-blue-500/40",
    description: "منصة Microsoft Azure للحوسبة السحابية وحلول الذكاء الاصطناعي",
    services: ["Azure Cloud", "AI Services", "Office 365", "Power Platform"]
  },
  {
    id: 2,
    name: "Amazon Web Services",
    logo: "/src/assets/partners/aws-logo.png",
    category: "Cloud Infrastructure",
    tier: "Strategic",
    color: "from-orange-500 to-orange-700",
    shadow: "shadow-orange-500/40",
    description: "البنية التحتية السحابية الأكثر تطوراً وموثوقية في العالم",
    services: ["EC2", "S3 Storage", "Lambda", "RDS Database"]
  },
  {
    id: 3,
    name: "Google Cloud",
    logo: "/src/assets/partners/google-cloud-logo.png",
    category: "AI & Machine Learning",
    tier: "Premium",
    color: "from-green-500 to-green-700",
    shadow: "shadow-green-500/40",
    description: "منصة التعلم الآلي والذكاء الاصطناعي المتقدمة من Google",
    services: ["BigQuery", "AI Platform", "Kubernetes", "TensorFlow"]
  },
  {
    id: 4,
    name: "Figma",
    logo: "/src/assets/partners/figma-logo.png",
    category: "Design Platform",
    tier: "Premium",
    color: "from-purple-500 to-purple-700",
    shadow: "shadow-purple-500/40",
    description: "أداة التصميم التعاونية الرائدة لتصميم واجهات المستخدم",
    services: ["UI Design", "Prototyping", "Team Collaboration", "Design Systems"]
  },
  {
    id: 5,
    name: "MongoDB",
    logo: "/src/assets/partners/mongodb-logo.png",
    category: "Database Solutions",
    tier: "Technology",
    color: "from-green-600 to-green-800",
    shadow: "shadow-green-600/40",
    description: "قاعدة البيانات المرنة والقابلة للتطوير للتطبيقات الحديثة",
    services: ["NoSQL Database", "Atlas Cloud", "Compass", "Charts"]
  },
  {
    id: 6,
    name: "Docker",
    logo: "/src/assets/partners/docker-logo.png",
    category: "Containerization",
    tier: "Technology",
    color: "from-blue-600 to-blue-800",
    shadow: "shadow-blue-600/40",
    description: "منصة الحاويات الرائدة لتطوير ونشر التطبيقات",
    services: ["Container Platform", "Docker Hub", "Desktop", "Enterprise"]
  },
  {
    id: 7,
    name: "Kubernetes",
    logo: "/src/assets/partners/kubernetes-logo.svg",
    category: "Orchestration",
    tier: "Technology",
    color: "from-indigo-500 to-indigo-700",
    shadow: "shadow-indigo-500/40",
    description: "نظام إدارة الحاويات الأكثر تطوراً لتشغيل التطبيقات على نطاق واسع",
    services: ["Container Orchestration", "Service Mesh", "Auto Scaling", "Load Balancing"]
  },
  {
    id: 8,
    name: "AWS Advanced",
    logo: "/src/assets/partners/aws-clean-logo.png",
    category: "Advanced Solutions",
    tier: "Strategic",
    color: "from-yellow-500 to-yellow-700",
    shadow: "shadow-yellow-500/40",
    description: "شراكة متقدمة مع Amazon لحلول المؤسسات الكبيرة",
    services: ["Enterprise Support", "Professional Services", "Training", "Consulting"]
  }
];

const partnerStats = [
  {
    icon: Crown,
    value: "50+",
    label: "شراكة عالمية",
    sublabel: "شركة تقنية رائدة",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    glow: "shadow-yellow-500/50"
  },
  {
    icon: Globe,
    value: "25",
    label: "دولة حول العالم",
    sublabel: "تغطية جغرافية شاملة",
    gradient: "from-blue-400 via-purple-500 to-pink-500",
    glow: "shadow-blue-500/50"
  },
  {
    icon: Award,
    value: "15+",
    label: "شهادة اعتماد",
    sublabel: "معايير جودة عالمية",
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    glow: "shadow-green-500/50"
  },
  {
    icon: Zap,
    value: "99.9%",
    label: "وقت تشغيل",
    sublabel: "موثوقية مضمونة",
    gradient: "from-purple-400 via-violet-500 to-indigo-500",
    glow: "shadow-purple-500/50"
  }
];

const techCategories = [
  {
    name: "الحوسبة السحابية",
    icon: Cloud,
    color: "from-blue-500 to-cyan-500",
    partners: ["Microsoft", "AWS", "Google Cloud"]
  },
  {
    name: "الذكاء الاصطناعي",
    icon: Cpu,
    color: "from-purple-500 to-pink-500",
    partners: ["Google Cloud", "Microsoft", "AWS"]
  },
  {
    name: "قواعد البيانات",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    partners: ["MongoDB", "AWS", "Google Cloud"]
  },
  {
    name: "التطوير والتصميم",
    icon: Code,
    color: "from-orange-500 to-red-500",
    partners: ["Figma", "Docker", "Kubernetes"]
  }
];

const PartnersSection = () => {
  const [activePartner, setActivePartner] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Effects - Enhanced */}
      <div className="absolute inset-0">
        {/* Primary Gradient Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/30 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-green-400/30 via-blue-500/20 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 via-pink-500/15 to-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute bottom-32 left-1/3 w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rotate-45 animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-12 w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '3s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section - Enhanced */}
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 px-8 py-4 rounded-full mb-8 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 shadow-lg shadow-blue-500/20">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Handshake className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-800 to-purple-800 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">شركاء النجاح العالميون</span>
          </div>
          
          <h2 className="text-6xl lg:text-8xl xl:text-9xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">شراكات</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">تقنية عالمية</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              نتعاون مع أكبر وأقوى الشركات التقنية في العالم
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              لنقدم لك حلولاً مبتكرة وموثوقة تعتمد على أحدث التقنيات والمعايير العالمية
            </p>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {partnerStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`
                  group relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl 
                  border border-slate-200/50 dark:border-slate-700/50 p-8 text-center
                  hover:scale-110 transition-all duration-700 cursor-pointer
                  ${stat.glow} hover:shadow-2xl
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                
                {/* Floating Elements */}
                <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-3 group-hover:scale-125 transition-transform duration-500">
                  {stat.value}
                </div>
                
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {stat.label}
                </div>
                
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.sublabel}
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`}></div>
              </div>
            );
          })}
        </div>

        {/* Technology Categories */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              فئات التقنيات المتقدمة
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              شراكاتنا تغطي جميع جوانب التكنولوجيا الحديثة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {techCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 hover:scale-105 transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {category.name}
                  </h4>
                  
                  <div className="space-y-1">
                    {category.partners.map((partner, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                        {partner}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partners Showcase - Enhanced */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              شبكة الشركاء العالمية
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              أقوى التحالفات التقنية في العالم تحت تصرفك
            </p>
          </div>

          {/* Partners Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {globalPartners.map((partner, index) => (
              <div
                key={partner.id}
                className={`
                  group relative overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-800/95 
                  backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50
                  hover:scale-105 hover:rotate-1 transition-all duration-700 cursor-pointer
                  ${partner.shadow} hover:shadow-2xl
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setActivePartner(partner.id)}
                onMouseLeave={() => setActivePartner(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                
                {/* Tier Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className={`bg-gradient-to-r ${partner.color} text-white border-0 text-xs px-3 py-1`}>
                    {partner.tier}
                  </Badge>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Logo Container */}
                  <div className="w-full h-32 bg-white dark:bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-sm overflow-hidden">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-w-full max-h-full object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="text-2xl font-bold text-slate-600">${partner.name.substring(0, 2)}</div>`;
                      }}
                    />
                  </div>

                  {/* Partner Info */}
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {partner.category}
                    </p>
                    
                    {/* Expandable Description */}
                    <div className={`transition-all duration-500 overflow-hidden ${activePartner === partner.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {partner.description}
                      </p>
                      
                      {/* Services */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">الخدمات الرئيسية</h5>
                        <div className="flex flex-wrap gap-1">
                          {partner.services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${partner.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Benefits - Enhanced */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-800 dark:via-blue-800 dark:to-purple-800 rounded-3xl p-16 backdrop-blur-sm border border-slate-700/30 mb-16 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg font-bold">مزايا الشراكة الاستراتيجية</span>
              </div>
              <h3 className="text-5xl font-bold text-white mb-6">
                لماذا نختار أفضل الشركاء في العالم؟
              </h3>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                شراكاتنا الاستراتيجية تضمن حصولك على أحدث التقنيات وأعلى معايير الجودة العالمية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-blue-500/30">
                  <Star className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-6">تقنيات متطورة</h4>
                <p className="text-blue-100 leading-relaxed text-lg">
                  الوصول المباشر إلى أحدث التقنيات والأدوات المتطورة من الشركات الرائدة عالمياً في جميع المجالات التقنية
                </p>
              </div>

              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-green-500/30">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-6">أمان وموثوقية</h4>
                <p className="text-blue-100 leading-relaxed text-lg">
                  معايير أمان عالمية وموثوقية مضمونة من خلال شراكاتنا مع عمالقة التقنية وأكبر المؤسسات العالمية
                </p>
              </div>

              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-purple-500/30">
                  <Rocket className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-6">نمو مستمر</h4>
                <p className="text-blue-100 leading-relaxed text-lg">
                  دعم مستمر وتطوير دائم لضمان نمو أعمالك ومواكبة أحدث التطورات التقنية والرقمية المتسارعة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - Enhanced */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-16 relative overflow-hidden border border-slate-200/50 dark:border-slate-600/50 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
                <Target className="w-5 h-5" />
                <span className="font-bold">ابدأ رحلتك معنا</span>
              </div>
              
              <h3 className="text-5xl font-bold text-slate-900 dark:text-white mb-8">
                جاهز للانضمام لشبكة شركائنا العالمية؟
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                اكتشف كيف يمكن لشراكاتنا العالمية أن تساعد في نمو أعمالك وتحقيق أهدافك التقنية بأعلى المعايير العالمية
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/partnerships">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-bold group shadow-xl hover:shadow-2xl transition-all duration-300">
                    اعرف المزيد عن الشراكات
                    <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-10 py-4 text-lg font-bold transition-all duration-300">
                    تواصل معنا
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;