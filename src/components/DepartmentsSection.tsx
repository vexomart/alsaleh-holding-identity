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
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            أقسام الشركة
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            تضم شركتنا القابضة أقساماً متخصصة تعمل بتناغم لتقديم خدمات شاملة ومتكاملة
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-reverse space-x-4 mb-4">
                  <div className={`w-12 h-12 ${dept.color} rounded-full flex items-center justify-center`}>
                    <dept.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-primary">
                    {dept.name}
                  </CardTitle>
                </div>
                <p className="text-foreground leading-relaxed">
                  {dept.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div>
                  <h4 className="font-semibold text-primary mb-3">الخدمات المقدمة:</h4>
                  <div className="flex flex-wrap gap-2">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;