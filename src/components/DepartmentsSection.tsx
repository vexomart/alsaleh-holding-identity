import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  LucideIcon 
} from "lucide-react";

// Define global-scale departments with advanced technologies
const departments = [
  {
    name: "تطوير التطبيقات المتقدمة",
    description: "تطوير تطبيقات ذكية بتقنيات الذكاء الاصطناعي والواقع المعزز",
    icon: "Smartphone",
    services: ["تطبيقات AI-powered", "الواقع المعزز AR", "تطبيقات البلوك تشين", "Progressive Web Apps"],
    color: "from-blue-600 to-cyan-500",
    globalTech: "React Native • Flutter • AI/ML Integration"
  },
  {
    name: "التسويق الرقمي العالمي",
    description: "استراتيجيات التسويق الرقمي بمعايير عالمية وذكاء اصطناعي",
    icon: "Globe",
    services: ["التسويق بالذكاء الاصطناعي", "التحليل التنبؤي", "الأتمتة المتقدمة", "حملات عالمية"],
    color: "from-emerald-600 to-teal-500",
    globalTech: "Google Analytics 4 • Marketing Automation • Predictive AI"
  },
  {
    name: "التصميم والإبداع الرقمي",
    description: "تصميم تجارب مستخدم متطورة بأحدث أدوات التصميم العالمية",
    icon: "Palette",
    services: ["تصميم UX/UI متقدم", "تصميم ثلاثي الأبعاد", "الهوية الرقمية", "Motion Graphics"],
    color: "from-purple-600 to-pink-500",
    globalTech: "Figma • Adobe CC • Blender • After Effects"
  },
  {
    name: "علوم البيانات والذكاء الاصطناعي",
    description: "تحليل البيانات الضخمة وتطوير نماذج الذكاء الاصطناعي المتقدمة",
    icon: "Brain",
    services: ["Machine Learning", "Big Data Analytics", "تعلم الآلة العميق", "معالجة اللغة الطبيعية"],
    color: "from-orange-600 to-red-500",
    globalTech: "Python • TensorFlow • AWS SageMaker • Apache Spark"
  },
  {
    name: "الأمن السيبراني المتقدم",
    description: "حماية متطورة بأحدث تقنيات الأمان العالمية والذكاء الاصطناعي",
    icon: "Shield",
    services: ["AI-Powered Security", "Zero Trust Architecture", "حماية السحابة", "تحليل التهديدات"],
    color: "from-gray-700 to-slate-600",
    globalTech: "Microsoft Sentinel • CrowdStrike • Splunk • Palo Alto"
  },
  {
    name: "الحلول السحابية المتقدمة",
    description: "تطوير وإدارة البنية التحتية السحابية بمعايير المؤسسات العالمية",
    icon: "Cloud",
    services: ["Multi-Cloud Strategy", "Kubernetes", "Microservices", "DevOps/GitOps"],
    color: "from-indigo-600 to-blue-600",
    globalTech: "AWS • Azure • GCP • Docker • Terraform"
  },
  {
    name: "إدارة البيانات المؤسسية",
    description: "حلول قواعد البيانات المتقدمة وإدارة البيانات الضخمة عالمياً",
    icon: "Database",
    services: ["Data Warehousing", "Real-time Analytics", "Data Governance", "BI Solutions"],
    color: "from-teal-600 to-green-500",
    globalTech: "MongoDB • PostgreSQL • Snowflake • Power BI"
  },
  {
    name: "الابتكار والأتمتة",
    description: "تطوير حلول الأتمتة الذكية وعمليات الابتكار التقني المتقدم",
    icon: "Zap",
    services: ["RPA Solutions", "Process Automation", "Innovation Labs", "Digital Transformation"],
    color: "from-yellow-500 to-orange-500",
    globalTech: "UiPath • Microsoft Power Platform • Zapier • Custom APIs"
  }
];

const DepartmentsSection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-900 dark:via-pink-900 dark:to-fuchsia-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-pink-100/40"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-fuchsia-400/5 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">أقسام متخصصة • تقنيات عالمية</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            أقسامنا <span className="text-gradient-primary">التقنية</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            نقدم خدمات متكاملة عبر أقسام متخصصة تعمل بأحدث التقنيات العالمية والذكاء الاصطناعي المتقدم
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {departments.map((dept, index) => {
            // Dynamically import icon components
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

            return (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-500 cursor-pointer border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-20 h-20 bg-gradient-to-br ${dept.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow`}>
                      <IconComponent className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300 min-h-[3rem]">
                      {dept.name}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-grow">
                      {dept.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {dept.services.map((service, serviceIndex) => (
                          <Badge 
                            key={serviceIndex} 
                            variant="outline"
                            className="text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground bg-white/10 border-white/20"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-muted-foreground font-medium">
                          <span className="text-primary">Tech Stack:</span> {dept.globalTech}
                        </p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Global Technology Partners */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-primary mb-8">شركاؤنا التقنيون العالميون</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Microsoft", "AWS", "Google Cloud", "Adobe", "Figma", "MongoDB", "Docker", "Kubernetes"].map((partner, index) => (
              <div key={index} className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <span className="text-sm font-medium text-primary">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;