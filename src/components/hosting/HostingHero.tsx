import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HostingHero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 mb-6">
            <Globe className="w-4 h-4 mr-2" />
            استضافة المواقع الإلكترونية
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            استضافة احترافية وموثوقة
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            خدمات استضافة متطورة مع أعلى معايير الأمان والأداء لضمان تشغيل موقعك بسلاسة
          </p>
          <Link to="/consultation">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4">
              احصل على استشارة مجانية
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HostingHero;