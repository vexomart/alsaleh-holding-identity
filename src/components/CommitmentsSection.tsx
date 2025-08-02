import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Lightbulb, Target, Users, Globe } from "lucide-react";

const CommitmentsSection = () => {
  const commitments = [
    {
      icon: Shield,
      title: "الجودة والموثوقية",
      description: "نلتزم بتقديم أعلى معايير الجودة في جميع خدماتنا ومنتجاتنا"
    },
    {
      icon: Heart,
      title: "المسؤولية المجتمعية",
      description: "نساهم في التنمية المستدامة ودعم المجتمع المحلي"
    },
    {
      icon: Lightbulb,
      title: "الابتكار المستمر",
      description: "نستثمر في البحث والتطوير لتقديم حلول مبتكرة ومتطورة"
    },
    {
      icon: Target,
      title: "تحقيق الأهداف",
      description: "نعمل بشغف لتحقيق أهداف عملائنا وتجاوز توقعاتهم"
    },
    {
      icon: Users,
      title: "تطوير الكوادر",
      description: "نستثمر في موظفينا ونطور قدراتهم باستمرار"
    },
    {
      icon: Globe,
      title: "التوسع العالمي",
      description: "نسعى للوصول إلى الأسواق العالمية بمعايير محلية عالية"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            التزاماتنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نحن ملتزمون بمجموعة من القيم والمبادئ التي توجه عملنا وتحدد علاقتنا مع عملائنا وشركائنا
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commitments.map((commitment, index) => {
            const IconComponent = commitment.icon;
            return (
              <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {commitment.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {commitment.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommitmentsSection;