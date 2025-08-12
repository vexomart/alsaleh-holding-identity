import { useState } from "react";
import { Building2, Award, Truck, CheckCircle2, Star, Users, Clock, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ConstructionHeader from "@/components/construction/ConstructionHeader";
import ConstructionHero from "@/components/construction/ConstructionHero";
import ConstructionServices from "@/components/construction/ConstructionServices";
import ConstructionProjects from "@/components/construction/ConstructionProjects";
import ConstructionFooter from "@/components/construction/ConstructionFooter";

const ConstructionWebsite = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const projects = [
    {
      id: 1,
      title: "مجمع برج الإمارات",
      location: "دبي، الإمارات",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      status: "مكتمل",
      area: "250,000 م²",
      year: "2023"
    },
    {
      id: 2,
      title: "مشروع الملك عبدالله",
      location: "الرياض، السعودية",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      status: "قيد التنفيذ",
      area: "500,000 م²",
      year: "2024"
    },
    {
      id: 3,
      title: "مجمع الأعمال الدولي",
      location: "الدوحة، قطر",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      status: "مكتمل",
      area: "180,000 م²",
      year: "2022"
    }
  ];

  const services = [
    {
      icon: Building2,
      title: "البناء والتشييد",
      description: "تنفيذ مشاريع البناء السكنية والتجارية والصناعية بأعلى معايير الجودة والسلامة العالمية"
    },
    {
      icon: Award,
      title: "الاستشارات الهندسية",
      description: "خدمات استشارية متخصصة في التصميم والتخطيط الهندسي من قبل فريق من أمهر المهندسين"
    },
    {
      icon: Truck,
      title: "إدارة المشاريع",
      description: "إدارة شاملة للمشاريع من مرحلة التخطيط والتصميم حتى التسليم النهائي والصيانة"
    },
    {
      icon: CheckCircle2,
      title: "ضمان الجودة",
      description: "نظام شامل لضمان الجودة ومراقبة جميع مراحل التنفيذ وفق المعايير العالمية"
    }
  ];

  const stats = [
    { number: "200+", label: "مشروع مكتمل", icon: Building2 },
    { number: "15+", label: "سنة خبرة", icon: Clock },
    { number: "50+", label: "مهندس متخصص", icon: Users },
    { number: "98%", label: "رضا العملاء", icon: Star }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case "services":
        return (
          <div className="pt-24">
            <ConstructionServices services={services} isPreview={false} />
          </div>
        );
      case "projects":
        return (
          <div className="pt-24">
            <ConstructionProjects projects={projects} isPreview={false} />
          </div>
        );
      case "about":
        return <AboutPage />;
      case "careers":
        return <CareersPage />;
      case "contact":
        return <ContactPage />;
      default:
        return (
          <>
            <ConstructionHero stats={stats} />
            <ConstructionServices 
              services={services} 
              isPreview={true} 
              onViewAll={() => setCurrentPage("services")}
            />
            <ConstructionProjects 
              projects={projects} 
              isPreview={true} 
              onViewAll={() => setCurrentPage("projects")}
            />
          </>
        );
    }
  };

  const AboutPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">شركة رائدة في مجال البناء والتشييد</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">رؤيتنا</h2>
            <p className="text-lg leading-relaxed">أن نكون الشركة الرائدة عالمياً في مجال البناء والتشييد</p>
          </Card>
        </div>
      </div>
    </div>
  );

  const CareersPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">انضم لفريقنا</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">فرص وظيفية متميزة</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">مهندس مدني</h3>
            <p className="text-muted-foreground mb-4">نبحث عن مهندس مدني ذو خبرة</p>
            <Button>قدم الآن</Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">تواصل معنا</h1>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="h-6 w-6 ml-3 text-primary" />
                <span className="text-lg">+966 11 234 5678</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <ConstructionHeader currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
      <ConstructionFooter />
    </div>
  );
};

export default ConstructionWebsite;