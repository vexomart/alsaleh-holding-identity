import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Service {
  icon: any;
  title: string;
  description: string;
  price?: string;
  features?: string[];
}

interface ConstructionServicesProps {
  services: Service[];
  isPreview?: boolean;
  onViewAll?: () => void;
  onPayment?: (service: Service) => void;
  processingServiceId?: string | null;
}

const ConstructionServices = ({ services, isPreview = false, onViewAll, onPayment, processingServiceId }: ConstructionServicesProps) => {
  const displayServices = isPreview ? services.slice(0, 4) : services;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            🏗️ {isPreview ? "خدماتنا المتميزة" : "جميع خدماتنا"}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            {isPreview ? "حلول شاملة لكل احتياجاتكم" : "خدماتنا المتخصصة"}
          </h2>
          {!isPreview && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات الإنشائية والهندسية بأعلى معايير الجودة
            </p>
          )}
        </div>

        <div className={`grid ${isPreview ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {displayServices.map((service, index) => (
            <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover-scale group bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
              <CardContent className={`${isPreview ? 'p-8' : 'p-10'} text-center`}>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:shadow-blue-500/25 transition-all duration-500">
                  <service.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">{service.description}</p>
                
                {service.features && (
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {service.price && (
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  </div>
                )}
                
                {!isPreview && onPayment && service.price ? (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    onClick={() => onPayment(service)}
                    disabled={processingServiceId === service.title}
                  >
                    {processingServiceId === service.title ? "جاري المعالجة..." : "احجز الآن"}
                  </Button>
                ) : !isPreview ? (
                  <Button variant="outline" className="w-full">
                    اعرف المزيد
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        {isPreview && onViewAll && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={onViewAll}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4"
            >
              عرض جميع الخدمات
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConstructionServices;