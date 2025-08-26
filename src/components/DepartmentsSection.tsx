import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { 
  Smartphone, 
  Globe, 
  Palette, 
  BarChart3, 
  Shield, 
  Code2,
  Zap,
  Brain,
  Cloud,
  Database,
  LucideIcon,
  ChevronRight,
  ExternalLink,
  Star,
  Sparkles
} from "lucide-react";

// Define global-scale departments with advanced technologies
const departments = [
  {
    name: "تطوير التطبيقات المتقدمة",
    description: "تطوير تطبيقات ذكية بتقنيات الذكاء الاصطناعي والواقع المعزز",
    icon: "Smartphone",
    services: ["تطبيقات AI-powered", "الواقع المعزز AR", "تطبيقات البلوك تشين", "Progressive Web Apps"],
    color: "from-blue-600 to-cyan-500",
    globalTech: "React Native • Flutter • AI/ML Integration",
    projects: "500+",
    rating: "4.9",
    trend: "+25%"
  },
  {
    name: "التسويق الرقمي العالمي",
    description: "استراتيجيات التسويق الرقمي بمعايير عالمية وذكاء اصطناعي",
    icon: "Globe",
    services: ["التسويق بالذكاء الاصطناعي", "التحليل التنبؤي", "الأتمتة المتقدمة", "حملات عالمية"],
    color: "from-emerald-600 to-teal-500",
    globalTech: "Google Analytics 4 • Marketing Automation • Predictive AI",
    projects: "300+",
    rating: "4.8",
    trend: "+40%"
  },
  {
    name: "التصميم والإبداع الرقمي",
    description: "تصميم تجارب مستخدم متطورة بأحدث أدوات التصميم العالمية",
    icon: "Palette",
    services: ["تصميم UX/UI متقدم", "تصميم ثلاثي الأبعاد", "الهوية الرقمية", "Motion Graphics"],
    color: "from-purple-600 to-pink-500",
    globalTech: "Figma • Adobe CC • Blender • After Effects",
    projects: "800+",
    rating: "4.9",
    trend: "+30%"
  },
  {
    name: "علوم البيانات والذكاء الاصطناعي",
    description: "تحليل البيانات الضخمة وتطوير نماذج الذكاء الاصطناعي المتقدمة",
    icon: "Brain",
    services: ["Machine Learning", "Big Data Analytics", "تعلم الآلة العميق", "معالجة اللغة الطبيعية"],
    color: "from-orange-600 to-red-500",
    globalTech: "Python • TensorFlow • AWS SageMaker • Apache Spark",
    projects: "200+",
    rating: "5.0",
    trend: "+60%"
  },
  {
    name: "الأمن السيبراني المتقدم",
    description: "حماية متطورة بأحدث تقنيات الأمان العالمية والذكاء الاصطناعي",
    icon: "Shield",
    services: ["AI-Powered Security", "Zero Trust Architecture", "حماية السحابة", "تحليل التهديدات"],
    color: "from-gray-700 to-slate-600",
    globalTech: "Microsoft Sentinel • CrowdStrike • Splunk • Palo Alto",
    projects: "150+",
    rating: "4.9",
    trend: "+45%"
  },
  {
    name: "الحلول السحابية المتقدمة",
    description: "تطوير وإدارة البنية التحتية السحابية بمعايير المؤسسات العالمية",
    icon: "Cloud",
    services: ["Multi-Cloud Strategy", "Kubernetes", "Microservices", "DevOps/GitOps"],
    color: "from-indigo-600 to-blue-600",
    globalTech: "AWS • Azure • GCP • Docker • Terraform",
    projects: "400+",
    rating: "4.8",
    trend: "+35%"
  },
  {
    name: "إدارة البيانات المؤسسية",
    description: "حلول قواعد البيانات المتقدمة وإدارة البيانات الضخمة عالمياً",
    icon: "Database",
    services: ["Data Warehousing", "Real-time Analytics", "Data Governance", "BI Solutions"],
    color: "from-teal-600 to-green-500",
    globalTech: "MongoDB • PostgreSQL • Snowflake • Power BI",
    projects: "250+",
    rating: "4.7",
    trend: "+28%"
  },
  {
    name: "الابتكار والأتمتة",
    description: "تطوير حلول الأتمتة الذكية وعمليات الابتكار التقني المتقدم",
    icon: "Zap",
    services: ["RPA Solutions", "Process Automation", "Innovation Labs", "Digital Transformation"],
    color: "from-yellow-500 to-orange-500",
    globalTech: "UiPath • Microsoft Power Platform • Zapier • Custom APIs",
    projects: "350+",
    rating: "4.8",
    trend: "+50%"
  }
];

const DepartmentsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedDept, setSelectedDept] = useState<number>(0);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent via-blue-400/10 to-purple-400/10 opacity-50"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Modern Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-400">أقسام متخصصة • تقنيات عالمية</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            أقسامنا <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">التقنية</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            نقدم خدمات متكاملة عبر أقسام متخصصة تعمل بأحدث التقنيات العالمية والذكاء الاصطناعي المتقدم
          </p>
          
          {/* Stats Overview */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">2500+</div>
              <div className="text-sm text-gray-400">مشروع مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">8</div>
              <div className="text-sm text-gray-400">أقسام متخصصة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">4.8★</div>
              <div className="text-sm text-gray-400">تقييم العملاء</div>
            </div>
          </div>
        </div>

        {/* Interactive Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16">
          {departments.map((dept, index) => {
            const IconComponent = {
              Smartphone,
              Globe,
              Palette,
              BarChart3,
              Shield,
              Code2,
              Brain,
              Cloud,
              Database,
              Zap
            }[dept.icon as keyof typeof import("lucide-react")] as LucideIcon;

            const isHovered = hoveredCard === index;

            return (
              <Card 
                key={index} 
                className={`group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 cursor-pointer hover:bg-white/10 hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/20 ${
                  isHovered ? 'scale-105 -translate-y-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedDept(index)}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-20 transition-all duration-500 ${isHovered ? 'animate-pulse' : ''}`} />
                
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} blur-xl opacity-30`} />
                </div>
                
                <CardContent className="p-8 relative z-10 h-full">
                  <div className="flex flex-col h-full">
                    {/* Department Icon & Stats */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-white font-medium">{dept.rating}</span>
                        </div>
                        <div className="text-xs text-green-400">{dept.trend}</div>
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300 min-h-[3rem]">
                      {dept.name}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed flex-grow">
                      {dept.description}
                    </p>
                    
                    {/* Project Count */}
                    <div className="mb-4">
                      <span className="text-xs text-gray-400">{dept.projects} مشروع مكتمل</span>
                    </div>
                    
                    {/* Services */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {dept.services.slice(0, 2).map((service, serviceIndex) => (
                          <Badge 
                            key={serviceIndex} 
                            variant="outline"
                            className="text-xs transition-all duration-200 hover:bg-purple-500 hover:text-white bg-white/10 border-white/20 text-white"
                          >
                            {service}
                          </Badge>
                        ))}
                        {dept.services.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-purple-300">
                            +{dept.services.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Tech Stack */}
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-gray-400">
                          <span className="text-purple-400 font-medium">Tech:</span> {dept.globalTech.split('•')[0]}...
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover Action */}
                    <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-2'}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-purple-500 hover:border-purple-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          const departmentIds = ["mobile-development", "digital-marketing", "design-solutions", "ai-data-science", "cybersecurity", "cloud-solutions", "data-management", "innovation-automation"];
                          window.location.href = `/department/${departmentIds[index]}`;
                        }}
                      >
                        عرض التفاصيل
                        <ChevronRight className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div className={`h-full bg-gradient-to-r ${dept.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technology Partners */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <ExternalLink className="w-6 h-6 text-purple-400" />
            شركاؤنا التقنيون العالميون
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: "Microsoft", logo: "/src/assets/partners/microsoft-logo.png", site: "microsoft.com" },
              { name: "AWS", logo: "/src/assets/partners/aws-logo.png", site: "aws.amazon.com" },
              { name: "Google Cloud", logo: "/src/assets/partners/google-cloud-logo.png", site: "cloud.google.com" },
              { name: "MongoDB", logo: "/src/assets/partners/mongodb-logo.png", site: "mongodb.com" },
              { name: "Figma", logo: "/src/assets/partners/figma-logo.png", site: "figma.com" },
              { name: "Docker", logo: "/src/assets/partners/docker-logo.png", site: "docker.com" },
              { name: "Kubernetes", logo: "/src/assets/partners/kubernetes-logo.svg", site: "kubernetes.io" },
              { name: "Oracle", logo: "https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png", site: "oracle.com" }
            ].map((partner, index) => (
              <div 
                key={index} 
                className="group p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => window.open(`https://${partner.site}`, '_blank')}
              >
                <div className="w-12 h-12 bg-white/90 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const sibling = target.nextElementSibling as HTMLElement;
                      target.style.display = 'none';
                      if (sibling) sibling.style.display = 'block';
                    }}
                  />
                  <div className="text-lg font-bold text-gray-700 hidden">
                    {partner.name.charAt(0)}
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors block">
                  {partner.name}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-purple-300 transition-colors block mt-1">
                  {partner.site}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
          >
            ابدأ مشروعك التقني
            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;