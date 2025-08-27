import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Clock, Database } from "lucide-react";

const HostingFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "حماية شاملة ضد التهديدات السيبرانية والبرمجيات الخبيثة"
    },
    {
      icon: Zap,
      title: "أداء فائق",
      description: "خوادم SSD عالية السرعة مع تقنيات التسريع المتقدمة"
    },
    {
      icon: Clock,
      title: "وقت تشغيل 99.9%",
      description: "ضمان استمرارية الخدمة مع اتفاقية مستوى الخدمة"
    },
    {
      icon: Database,
      title: "قواعد بيانات متطورة",
      description: "دعم جميع أنواع قواعد البيانات مع إدارة محترفة"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            لماذا تختار استضافتنا؟
          </h2>
          <p className="text-muted-foreground text-lg">
            نوفر لك أفضل تجربة استضافة مع ميزات متقدمة
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostingFeatures;