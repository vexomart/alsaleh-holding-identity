import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  Building2, 
  Shield, 
  CheckCircle
} from "lucide-react";

const PaymentMethods = () => {
  const paymentMethods = [
    {
      id: 1,
      name: "الدفع الإلكتروني",
      description: "ادفع بسهولة عبر البطاقات الائتمانية والمحافظ الرقمية الآمنة",
      icon: CreditCard,
      features: ["Visa", "Mastercard", "Mada", "Apple Pay", "Google Pay"]
    },
    {
      id: 2,
      name: "تمارا",
      description: "قسم مشترياتك واشتري الآن وادفع لاحقاً",
      icon: Calendar,
      features: ["تقسيط 3 أشهر", "تقسيط 4 أشهر", "ادفع الشهر القادم"]
    },
    {
      id: 3,
      name: "حوالة بنكية",
      description: "تحويل بنكي مباشر لحساب الشركة",
      icon: Building2,
      features: ["تحويل مباشر", "IBAN متاح", "مؤكد خلال 24 ساعة"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">بوابة دفع آمنة ومعتمدة</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-primary to-primary-variant bg-clip-text text-transparent">
            طرق الدفع المتاحة
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اختر طريقة الدفع التي تناسبك من بين الخيارات المتعددة والآمنة
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            
            return (
              <Card key={method.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary-variant rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {method.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {method.description}
                  </p>
                  
                  <div className="space-y-3">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Badge className="w-full justify-center py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      متاح الآن
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Security Features */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                  الأمان والحماية
                </h2>
                <p className="text-emerald-600 dark:text-emerald-400">
                  نلتزم بأعلى معايير الأمان لحماية معاملاتك المالية
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Shield, text: "تشفير SSL 256-bit" },
                  { icon: CheckCircle, text: "مطابق PCI DSS" },
                  { icon: CreditCard, text: "حماية 3D Secure" },
                  { icon: Building2, text: "معتمد من SAMA" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-variant text-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
            <CreditCard className="w-6 h-6" />
            <span className="font-bold text-lg">ابدأ الدفع الآن</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;