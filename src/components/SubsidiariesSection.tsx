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
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            شركاتنا الفرعية
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بمحفظة متنوعة من الشركات المتخصصة في التقنية والإعلام الرقمي
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subsidiaries.map((company, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 border-0 bg-card">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-secondary-foreground">
                    {company.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {company.established}
                  </span>
                </div>
                <CardTitle className="text-xl text-primary mb-2">
                  {company.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {company.nameEn}
                </p>
              </CardHeader>
              
              <CardContent>
                <p className="text-foreground leading-relaxed mb-6">
                  {company.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-primary mb-3">خدماتنا:</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.services.map((service, serviceIndex) => (
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

export default SubsidiariesSection;