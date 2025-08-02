import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SubsidiariesSection = () => {
  const subsidiaries = [
    {
      name: "شركة فكرة",
      nameEn: "Fikra Company",
      description: "شركة متخصصة في تطوير الحلول التقنية المبتكرة والاستشارات الرقمية",
      category: "تقنية",
      established: "2024",
      services: ["البرمجة", "تطوير التطبيقات", "الاستشارات التقنية", "التحول الرقمي"]
    },
    {
      name: "أدفيكسو ميديا",
      nameEn: "advixo.media",
      description: "وكالة إعلامية رقمية متخصصة في إنتاج المحتوى والتسويق الرقمي",
      category: "إعلام",
      established: "2024",
      services: ["التسويق", "إنتاج المحتوى", "التسويق الرقمي", "إدارة وسائل التواصل"]
    },
    {
      name: "فكرة تيك",
      nameEn: "Fikra Tech",
      description: "شركة تقنية متقدمة تركز على تطوير البرمجيات والذكاء الاصطناعي",
      category: "تقنية متقدمة",
      established: "2024",
      services: ["البرمجة", "الذكاء الاصطناعي", "تطوير البرمجيات", "حلول البيانات"]
    },
    {
      name: "فكرة هولدينق",
      nameEn: "Fikra Holding",
      description: "شركة متخصصة في خدمات التعليم والأبحاث والترجمة والتحليل الإحصائي والنشر بالمجلات المعتمدة",
      category: "تعليم وأبحاث",
      established: "2024",
      services: ["التعليم", "الأبحاث", "الترجمة", "التحليل الإحصائي", "النشر بالمجلات المعتمدة"]
    }
  ];

  return (
    <section className="section-spacing bg-accent/30">
      <div className="container mx-auto container-responsive">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="responsive-title text-primary mb-4 md:mb-6">
            شركاتنا الفرعية
          </h2>
          <p className="responsive-text text-muted-foreground max-w-3xl mx-auto">
            نفخر بمحفظة متنوعة من الشركات المتخصصة في التقنية والإعلام الرقمي
          </p>
        </div>
        
        <div className="responsive-grid">
          {subsidiaries.map((company, index) => (
            <Card 
              key={index} 
              className="card-animated shadow-elegant border-0 bg-card animate-scale-in group"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-secondary-foreground text-xs sm:text-sm group-hover:scale-105 transition-transform duration-300">
                    {company.category}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {company.established}
                  </span>
                </div>
                <CardTitle className="text-lg sm:text-xl text-primary mb-2">
                  {company.name}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {company.nameEn}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4 sm:mb-6">
                  {company.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-primary mb-2 sm:mb-3 text-sm sm:text-base">خدماتنا:</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {company.services.map((service, serviceIndex) => (
                      <Badge 
                        key={serviceIndex} 
                        variant="outline" 
                        className="text-xs border-primary/30 text-primary hover:bg-primary/10 transition-colors duration-300"
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

export default SubsidiariesSection;