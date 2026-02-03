import React from "react";
import { motion } from "framer-motion";
import { 
  ClipboardList, 
  FileSignature, 
  CreditCard, 
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  FileCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ContractStepsSection: React.FC = () => {
  const steps = [
    {
      icon: ClipboardList,
      number: "01",
      title: "اختيار الخدمات",
      description: "حدد الخدمات المطلوبة من قائمة خدماتنا الشاملة مع عرض الأسعار والتفاصيل",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      features: ["أسعار شفافة", "وصف مفصل", "تخصيص حسب الطلب"]
    },
    {
      icon: FileSignature,
      number: "02", 
      title: "إدخال البيانات والتوقيع",
      description: "أدخل بياناتك الشخصية أو التجارية ثم وقّع رقمياً لضمان المصداقية القانونية",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      features: ["بيانات مشفرة", "توقيع رقمي", "حماية قانونية"]
    },
    {
      icon: CreditCard,
      number: "03",
      title: "سداد الدفعة المقدمة",
      description: "العقد يصبح معتمداً ونافذاً بعد سداد 50% كدفعة أولى عبر بوابة دفع آمنة",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      features: ["دفع آمن", "فواتير رسمية", "إيصال فوري"]
    },
    {
      icon: CheckCircle2,
      number: "04",
      title: "التنفيذ والتسليم",
      description: "يتم تنفيذ المشروع باحترافية مع سداد الدفعة النهائية قبل التسليم الكامل",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      features: ["متابعة مستمرة", "جودة عالية", "ضمان شامل"]
    }
  ];

  const benefits = [
    { icon: Shield, text: "حماية قانونية 100%" },
    { icon: Clock, text: "توفير الوقت والجهد" },
    { icon: FileCheck, text: "توثيق رسمي معتمد" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 ml-2" />
            خطوات بسيطة وواضحة
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            كيف يعمل نظام التعاقد؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أربع خطوات بسيطة للحصول على عقد إلكتروني معتمد وموثق رسمياً
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -left-3 w-6 z-10">
                  <ArrowLeft className="w-6 h-6 text-muted-foreground/30 transform rotate-180" />
                </div>
              )}

              <div className={`relative h-full rounded-2xl border ${step.borderColor} ${step.bgColor} p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 overflow-hidden`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Step Number */}
                <div className={`absolute top-4 left-4 text-5xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{step.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {step.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${step.color}`} />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-l from-primary/10 via-blue-500/10 to-indigo-500/10 rounded-2xl p-6 md:p-8 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                لماذا التعاقد الإلكتروني؟
              </h3>
              <p className="text-muted-foreground">
                توفير الوقت والجهد مع ضمان الحقوق القانونية لجميع الأطراف
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border shadow-sm"
                >
                  <benefit.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContractStepsSection;
