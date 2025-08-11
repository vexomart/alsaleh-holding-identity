import React from "react";
import { FileSignature, ClipboardList, CreditCard, CheckCircle2 } from "lucide-react";

const items = [
  {
    icon: ClipboardList,
    title: "اختيار الخدمات",
    desc: "حدد الخدمات المطلوبة مع الأسعار المبدئية والوصف",
  },
  {
    icon: FileSignature,
    title: "إدخال البيانات والتوقيع",
    desc: "أدخل بياناتك ثم وقّع رقمياً لضمان المصداقية",
  },
  {
    icon: CreditCard,
    title: "سداد الدفعة المقدمة",
    desc: "العقد يصبح معتمداً بعد سداد 50% كدفعة أولى",
  },
  {
    icon: CheckCircle2,
    title: "التنفيذ والتسليم",
    desc: "يتم السداد النهائي قبل التسليم ثم التسليم باحترافية",
  },
];

const ContractSteps: React.FC = () => {
  return (
    <section id="steps" className="py-8 md:py-12" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition p-5 text-right">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-muted-foreground">{idx + 1}/4</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContractSteps;
