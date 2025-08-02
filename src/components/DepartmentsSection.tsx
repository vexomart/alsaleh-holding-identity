import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Megaphone, GraduationCap, TrendingUp, Users, Cog } from "lucide-react";

const DepartmentsSection = () => {
  const departments = [
    {
      name: "قسم التقنية والبرمجة",
      description: "يركز على تطوير الحلول التقنية المبتكرة والبرمجيات المتقدمة",
      icon: Code,
      services: ["تطوير التطبيقات", "البرمجة المتقدمة", "الذكاء الاصطناعي", "أنظمة إدارة البيانات"],
      color: "bg-blue-500"
    },
    {
      name: "قسم التسويق والإعلام",
      description: "متخصص في استراتيجيات التسويق الرقمي وإنتاج المحتوى الإعلامي",
      icon: Megaphone,
      services: ["التسويق الرقمي", "إنتاج المحتوى", "إدارة وسائل التواصل", "الحملات الإعلانية"],
      color: "bg-green-500"
    },
    {
      name: "قسم التعليم والأبحاث",
      description: "يقدم خدمات تعليمية متقدمة وحلول البحث العلمي والأكاديمي",
      icon: GraduationCap,
      services: ["التعليم المتخصص", "الأبحاث العلمية", "الترجمة المهنية", "النشر الأكاديمي"],
      color: "bg-purple-500"
    },
    {
      name: "قسم التطوير والاستثمار",
      description: "يركز على تحديد الفرص الاستثمارية وتطوير المشاريع الجديدة",
      icon: TrendingUp,
      services: ["تحليل الاستثمارات", "تطوير المشاريع", "دراسات الجدوى", "إدارة المحافظ"],
      color: "bg-orange-500"
    },
    {
      name: "قسم الموارد البشرية",
      description: "يهتم بتطوير المواهب وإدارة الكفاءات البشرية في جميع الشركات الفرعية",
      icon: Users,
      services: ["إدارة المواهب", "التدريب والتطوير", "التوظيف المتخصص", "تقييم الأداء"],
      color: "bg-pink-500"
    },
    {
      name: "قسم العمليات والإدارة",
      description: "يضمن كفاءة العمليات التشغيلية والإدارية عبر جميع الشركات",
      icon: Cog,
      services: ["إدارة العمليات", "ضمان الجودة", "الامتثال والحوكمة", "التطوير المؤسسي"],
      color: "bg-indigo-500"
    }
  ];

  return (
    <section className="section-spacing bg-accent/30">
      <div className="container mx-auto container-responsive">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="responsive-title text-primary mb-4 md:mb-6">
            أقسام الشركة
          </h2>
          <p className="responsive-text text-muted-foreground max-w-3xl mx-auto">
            تضم شركتنا القابضة أقساماً متخصصة تعمل بتناغم لتقديم خدمات شاملة ومتكاملة
          </p>
        </div>
        
        <div className="responsive-grid">
          {departments.map((dept, index) => {
            const IconComponent = dept.icon;
            return (
              <Card 
                key={index} 
                className="card-animated shadow-elegant border-0 bg-card animate-scale-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center space-x-reverse space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${dept.color} rounded-full flex items-center justify-center icon-float group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <CardTitle className="text-base sm:text-lg text-primary">
                      {dept.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {dept.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div>
                    <h4 className="font-semibold text-primary mb-2 sm:mb-3 text-sm sm:text-base">الخدمات المقدمة:</h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {dept.services.map((service, serviceIndex) => (
                        <Badge 
                          key={serviceIndex} 
                          variant="outline" 
                          className="text-xs border-primary/30 text-primary"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;