import React from 'react';
import { AdvancedSEO } from "@/components/AdvancedSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const SimpleIndex = () => {
  return (
    <>
      <AdvancedSEO 
        title="شركة علي صالح الشهري القابضة - الرئيسية"
        description="شركة قابضة رائدة في الاستثمار التقني والإعلامي في المملكة العربية السعودية"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center">
              شركة علي صالح الشهري القابضة
            </h1>
            <p className="text-center mt-2 text-primary-foreground/90">
              الاستثمار التقني والإعلامي
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              مرحباً بكم في موقعنا
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              نحن شركة رائدة في مجال الاستثمار التقني والإعلامي، نقدم حلولاً متكاملة ومبتكرة لعملائنا
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/contact">
                <Button size="lg" className="text-lg px-8 py-3">
                  تواصل معنا
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  من نحن
                </Button>
              </Link>
            </div>
          </section>

          {/* Services Grid */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
              خدماتنا الرئيسية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">تطوير التطبيقات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    تطوير تطبيقات ذكية ومواقع إلكترونية متطورة بأحدث التقنيات
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">التسويق الرقمي</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    استراتيجيات تسويقية متقدمة لزيادة الوصول والمبيعات
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">التصميم الإبداعي</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    تصميم هويات بصرية ومواد تسويقية عالية الجودة
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-muted/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
              معلومات التواصل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span dir="ltr">+966 55 581 2567</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@alshahri-holding.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2024 شركة علي صالح الشهري القابضة. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SimpleIndex;