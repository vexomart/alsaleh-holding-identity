import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Monitor, Smartphone, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const OurWorks = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButtons = [
    { id: "all", label: "كل الأعمال", color: "bg-gradient-to-r from-amber-500 to-orange-500" },
    { id: "websites", label: "المواقع الإلكترونية", color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { id: "mobile", label: "تطبيقات الجوال", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      <PageContainer>
        {/* Hero Section */}
        <div className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/8"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          
          {/* Animated Background Shapes */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-secondary/12 to-accent/8 rounded-full blur-3xl animate-float-delayed"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 px-6 py-2 text-sm font-medium">
                معرض أعمالنا
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                أعمالنا
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                ألقِ نظرة على معرض أعمالنا بأنواعها المختلفة
              </p>

              {/* Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {filterButtons.map((filter) => (
                  <Button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    className={`px-8 py-3 text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter.id 
                        ? `${filter.color} text-white hover:opacity-90` 
                        : "hover:bg-primary hover:text-primary-foreground border-border/50"
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Works Grid Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/5"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            {/* Empty State */}
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                <Monitor className="w-16 h-16 text-muted-foreground" />
              </div>
              
              <h2 className="text-3xl font-bold text-foreground mb-4">
                قريباً... أعمال مذهلة
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                نعمل حالياً على إضافة مجموعة متميزة من أعمالنا وإنجازاتنا. 
                ستتمكن قريباً من استكشاف مشاريعنا المتنوعة في مختلف المجالات.
              </p>

              {/* Feature Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
                {[
                  {
                    icon: Globe,
                    title: "المواقع الإلكترونية",
                    description: "مواقع احترافية متجاوبة مع جميع الأجهزة",
                    color: "from-blue-500 to-indigo-600"
                  },
                  {
                    icon: Smartphone,
                    title: "تطبيقات الجوال",
                    description: "تطبيقات ذكية وسهلة الاستخدام",
                    color: "from-purple-500 to-pink-600"
                  },
                  {
                    icon: Monitor,
                    title: "أنظمة إدارية",
                    description: "حلول تقنية متكاملة للأعمال",
                    color: "from-emerald-500 to-teal-600"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group hover:scale-105 transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-border/50">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  هل تريد أن يكون مشروعك ضمن أعمالنا المميزة؟
                </h3>
                <p className="text-muted-foreground mb-6">
                  تواصل معنا الآن لبدء رحلة تحويل فكرتك إلى واقع رقمي مبهر
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <a href="/contact">تواصل معنا</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/services-catalog">استكشف خدماتنا</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>

      <Footer />
    </div>
  );
};

export default OurWorks;