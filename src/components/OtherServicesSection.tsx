import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ui/service-card";
import { Printer, Briefcase, Mic, Camera, Wrench, Truck } from "lucide-react";

const whatsappNumber = "966555812567";

const otherServices = [
  {
    title: "الطباعة الرقمية",
    description: "تصميم وطباعة مواد تسويقية بجودة عالية وتسليم سريع",
    icon: Printer,
    features: ["بطاقات أعمال", "بروشورات", "بنرات ولوحات"],
    badge: "خدمة مساندة",
  },
  {
    title: "استشارات الأعمال",
    description: "تحليل الأعمال، تحسين العمليات، وخطط النمو",
    icon: Briefcase,
    features: ["تحليل الوضع", "تحسين إجراءات", "خارطة طريق"],
    badge: "خبير",
  },
  {
    title: "تسجيل صوتي",
    description: "إنتاج وتعليق صوتي للبودكاست والإعلانات",
    icon: Mic,
    features: ["بودكاست", "إعلانات", "رسائل IVR"],
  },
  {
    title: "التصوير الفوتوغرافي",
    description: "تصوير منتجات وفعاليات بجودة احترافية",
    icon: Camera,
    features: ["منتجات", "فعاليات", "جلسات تصوير"],
  },
  {
    title: "صيانة تقنية",
    description: "خدمات دعم وصيانة للشبكات والأجهزة والبرمجيات",
    icon: Wrench,
    features: ["شبكات", "أجهزة", "برمجيات"],
  },
  {
    title: "الخدمات اللوجستية",
    description: "حلول توصيل وتخزين وتتبع للشحنات",
    icon: Truck,
    features: ["توصيل", "تخزين", "تتبع"],
  },
];

const OtherServicesSection = () => {
  return (
    <section aria-labelledby="other-services-title" className="mt-16">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-gradient-to-r from-secondary to-accent text-white">خدمات إضافية</Badge>
        <h3 id="other-services-title" className="scroll-mt-28 lg:scroll-mt-40 text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-4">
          خدماتنا الأخرى
        </h3>
        <p className="text-xl text-muted-foreground">مجموعة متنوعة من الخدمات المساندة لتلبية جميع احتياجاتك</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherServices.map((s, index) => (
          <ServiceCard
            key={index}
            title={s.title}
            description={s.description}
            icon={s.icon}
            features={s.features}
            badge={s.badge}
            onClick={() =>
              window.open(
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`أرغب بخدمة ${s.title} من قسم خدماتنا الأخرى`)}`,
                "_blank"
              )
            }
          />
        ))}
      </div>
    </section>
  );
};

export default OtherServicesSection;
