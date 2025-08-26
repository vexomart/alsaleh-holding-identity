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
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";

const globalPartners = [
  {
    id: 1,
    name: "Microsoft",
    logo: "/src/assets/partners/microsoft-logo.png",
    category: "Cloud Technology",
    tier: "Strategic",
    color: "bg-blue-500",
    shadow: "shadow-blue-500/25"
  },
  {
    id: 2,
    name: "Amazon Web Services",
    logo: "/src/assets/partners/aws-logo.png",
    category: "Cloud Infrastructure",
    tier: "Strategic",
    color: "bg-orange-500",
    shadow: "shadow-orange-500/25"
  },
  {
    id: 3,
    name: "Google Cloud",
    logo: "/src/assets/partners/google-cloud-logo.png",
    category: "AI & Machine Learning",
    tier: "Premium",
    color: "bg-green-500",
    shadow: "shadow-green-500/25"
  },
  {
    id: 4,
    name: "Figma",
    logo: "/src/assets/partners/figma-logo.png",
    category: "Design Platform",
    tier: "Premium",
    color: "bg-purple-500",
    shadow: "shadow-purple-500/25"
  },
  {
    id: 5,
    name: "MongoDB",
    logo: "/src/assets/partners/mongodb-logo.png",
    category: "Database Solutions",
    tier: "Technology",
    color: "bg-green-600",
    shadow: "shadow-green-600/25"
  },
  {
    id: 6,
    name: "Docker",
    logo: "/src/assets/partners/docker-logo.png",
    category: "Containerization",
    tier: "Technology",
    color: "bg-blue-600",
    shadow: "shadow-blue-600/25"
  },
  {
    id: 7,
    name: "Kubernetes",
    logo: "/src/assets/partners/kubernetes-logo.svg",
    category: "Orchestration",
    tier: "Technology",
    color: "bg-indigo-500",
    shadow: "shadow-indigo-500/25"
  },
  {
    id: 8,
    name: "AWS Advanced",
    logo: "/src/assets/partners/aws-clean-logo.png",
    category: "Advanced Solutions",
    tier: "Strategic",
    color: "bg-yellow-500",
    shadow: "shadow-yellow-500/25"
  }
];

const partnerStats = [
  {
    icon: Crown,
    value: "50+",
    label: "شراكة عالمية",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    icon: Globe,
    value: "25",
    label: "دولة حول العالم",
    gradient: "from-blue-400 to-purple-500"
  },
  {
    icon: Award,
    value: "15+",
    label: "شهادة اعتماد",
    gradient: "from-green-400 to-teal-500"
  },
  {
    icon: Zap,
    value: "99.9%",
    label: "وقت تشغيل",
    gradient: "from-purple-400 to-pink-500"
  }
];

const PartnersSection = () => {
  const [activePartner, setActivePartner] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-12 w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
            <Handshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">شركاء النجاح العالميون</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
            شراكات تقنية
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">عالمية</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            نتعاون مع أكبر الشركات التقنية في العالم لنقدم لك حلولاً مبتكرة وموثوقة
            <br />
            تعتمد على أحدث التقنيات والمعايير العالمية
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {partnerStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`
                  group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm 
                  border border-slate-200/50 dark:border-slate-700/50 p-6 text-center
                  hover:scale-105 transition-all duration-500 cursor-pointer
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                
                <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Partners Showcase */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              شركاؤنا التقنيون
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              شبكة عالمية من أقوى الشركات التقنية
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {globalPartners.map((partner, index) => (
              <div
                key={partner.id}
                className={`
                  group relative overflow-hidden rounded-xl bg-white/90 dark:bg-slate-800/90 
                  backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50
                  hover:scale-110 hover:rotate-2 hover:${partner.shadow} hover:shadow-xl
                  transition-all duration-500 cursor-pointer aspect-square
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
                style={{ transitionDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setActivePartner(partner.id)}
                onMouseLeave={() => setActivePartner(null)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${partner.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Tier Indicator */}
                <div className="absolute top-2 right-2 z-10">
                  <div className={`w-3 h-3 rounded-full ${partner.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>

                {/* Logo Container */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                  <div className="w-full h-full bg-white dark:bg-slate-100 rounded-lg flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="text-lg font-bold text-slate-600">${partner.name.substring(0, 2)}</div>`;
                      }}
                    />
                  </div>
                </div>

                {/* Hover Info Card */}
                <div className={`
                  absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                  transition-all duration-300 pointer-events-none z-20
                  ${activePartner === partner.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                `}>
                  <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-sm rounded-lg p-3 text-center min-w-[160px] shadow-xl border border-slate-700/50 dark:border-slate-200/50">
                    <h4 className="text-sm font-semibold text-white dark:text-slate-900 mb-1">
                      {partner.name}
                    </h4>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mb-1">
                      {partner.category}
                    </p>
                    <Badge variant="outline" className="text-xs border-slate-600 dark:border-slate-300 text-slate-300 dark:text-slate-600">
                      {partner.tier} Partner
                    </Badge>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900/95 dark:border-t-white/95"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-3xl p-12 backdrop-blur-sm border border-blue-200/30 dark:border-slate-600/30 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">مزايا الشراكة</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              لماذا نختار أفضل الشركاء؟
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              شراكاتنا الاستراتيجية تضمن حصولك على أحدث التقنيات وأعلى معايير الجودة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">تقنيات متطورة</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                الوصول المباشر إلى أحدث التقنيات والأدوات المتطورة من الشركات الرائدة عالمياً
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">أمان وموثوقية</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                معايير أمان عالمية وموثوقية مضمونة من خلال شراكاتنا مع عمالقة التقنية
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">نمو مستمر</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                دعم مستمر وتطوير دائم لضمان نمو أعمالك ومواكبة أحدث التطورات التقنية
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-800 dark:to-blue-800 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">
                جاهز للانضمام لشبكة شركائنا؟
              </h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                اكتشف كيف يمكن لشراكاتنا العالمية أن تساعد في نمو أعمالك وتحقيق أهدافك التقنية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/partnerships">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 px-8 group">
                    اعرف المزيد عن الشراكات
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 px-8">
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