import React from "react";
import heroBg from "@/assets/digital-services-banner.jpg";

const ContractHero: React.FC = () => {
  return (
    <header className="relative isolate overflow-hidden rounded-3xl mb-10 shadow-xl">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-primary/80 via-background/60 to-background/90" aria-hidden="true" />

      <div className="container mx-auto px-6 py-16 md:py-24" dir="rtl">
        <div className="max-w-3xl ml-auto text-right">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            نظام التعاقد الإلكتروني المتقدم
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-background">
            عقد إلكتروني بمعايير عالمية وموثوقية سعودية
          </h1>
          <p className="mt-4 text-base md:text-lg text-background/90">
            تجربة تعاقد احترافية تشمل كل خدماتنا وختم وتوقيع رقمي، مع تنبيهات دفع واضحة لضمان حقوق الطرفين.
          </p>
          <div className="mt-6 flex gap-3 justify-end">
            <a href="#services" className="inline-flex items-center px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
              ابدأ باختيار الخدمات
            </a>
            <a href="#steps" className="inline-flex items-center px-5 py-3 rounded-lg border border-border bg-background/70 backdrop-blur hover:bg-background transition">
              كيف يعمل النظام؟
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ContractHero;
