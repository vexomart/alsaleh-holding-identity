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
    <section className="section-spacing bg-muted/30">
      <div className="container mx-auto container-responsive">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="responsive-title text-primary mb-4 md:mb-6">
            التزاماتنا
          </h2>
          <p className="responsive-text text-muted-foreground max-w-3xl mx-auto">
            نحن ملتزمون بمجموعة من القيم والمبادئ التي توجه عملنا وتحدد علاقتنا مع عملائنا وشركائنا
          </p>
        </div>
        
        <div className="responsive-grid">
          {commitments.map((commitment, index) => {
            const IconComponent = commitment.icon;
            return (
              <Card 
                key={index} 
                className="card-animated shadow-elegant border-0 bg-card animate-scale-in group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-full flex items-center justify-center icon-float group-hover:bg-primary/20 transition-all duration-300">
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <h3 className="responsive-subtitle text-primary mb-3 sm:mb-4">
                    {commitment.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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