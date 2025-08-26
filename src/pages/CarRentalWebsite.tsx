import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import InteractiveMap from "@/components/InteractiveMap";
import BackButton from "@/components/ui/back-button";
import { 
  Car,
  MapPin,
  Star,
  Search,
  Calendar,
  MessageCircle,
  Navigation,
  Award,
  Sparkles,
  Zap,
  Target
} from "lucide-react";

const CarRentalWebsite = () => {
  const [activeTab, setActiveTab] = useState("tracker");

  const features = [
    {
      icon: Search,
      title: "تتبع حجزك",
      description: "تابع حالة حجزك في الوقت الفعلي",
      color: "bg-blue-500"
    },
    {
      icon: MapPin,
      title: "خريطة الفروع", 
      description: "ابحث عن أقرب فرع لك بسهولة",
      color: "bg-green-500"
    },
    {
      icon: Star,
      title: "آراء العملاء",
      description: "اقرأ تجارب العملاء واكتب مراجعتك",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <BackButton />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white border-0 mb-6 text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 ml-1" />
              موقع تأجير السيارات المتطور
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              كار رنت برو
              <span className="block text-blue-200 text-3xl md:text-4xl mt-2">
                Car Rent Pro
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              تجربة تأجير سيارات ذكية ومتطورة مع أحدث التقنيات والميزات التفاعلية
            </p>

            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-8 py-6 shadow-2xl"
              asChild
            >
              <a href="/car-rental-landing">
                <Car className="w-6 h-6 ml-2" />
                استكشف الموقع
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg rounded-xl h-16">
              <TabsTrigger value="tracker" className="flex items-center gap-2 text-sm">
                <Search className="w-4 h-4" />
                تتبع الحجز
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2 text-sm">
                <Navigation className="w-4 h-4" />
                خريطة الفروع
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" />
                آراء العملاء
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracker" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">تتبع حجزك</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  تابع حالة حجزك ومراحل التنفيذ بالتفصيل مع إشعارات فورية
                </p>
              </div>
              
            </TabsContent>

            <TabsContent value="map" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">فروعنا في المملكة</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  اكتشف مواقع فروعنا بالخريطة التفاعلية واعرف تفاصيل كل فرع
                </p>
              </div>
              <InteractiveMap />
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">آراء عملائنا</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  اقرأ تجارب العملاء الحقيقية وشاركنا تجربتك معنا
                </p>
              </div>
              <div className="text-center py-12">
                <p className="text-muted-foreground">نظام التقييمات غير متوفر حاليًا</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CarRentalWebsite;