import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HostingCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 to-cyan-500">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          جاهز لبدء موقعك؟
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          احصل على أفضل خدمات الاستضافة مع دعم فني متخصص
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/consultation">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
              تواصل معنا الآن
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            عرض الباقات
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HostingCTA;