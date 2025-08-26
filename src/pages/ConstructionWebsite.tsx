import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Award, Truck, CheckCircle2, Star, Users, Clock, Phone, Mail, MapPin, Calendar, Shield, Zap, Globe, Wrench, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import ConstructionHeader from "@/components/construction/ConstructionHeader";
import ConstructionHero from "@/components/construction/ConstructionHero";
import ConstructionServices from "@/components/construction/ConstructionServices";
import ConstructionProjects from "@/components/construction/ConstructionProjects";
import ConstructionFooter from "@/components/construction/ConstructionFooter";

const ConstructionWebsite = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [processingServiceId, setProcessingServiceId] = useState<string | null>(null);

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
      description: "تنفيذ مشاريع البناء السكنية والتجارية والصناعية بأعلى معايير الجودة والسلامة العالمية",
      price: "ابتداءً من 250,000 ر.س",
      features: ["تصميم معماري", "تنفيذ شامل", "ضمان 10 سنوات", "صيانة دورية"]
    },
    {
      icon: Award,
      title: "الاستشارات الهندسية",
      description: "خدمات استشارية متخصصة في التصميم والتخطيط الهندسي من قبل فريق من أمهر المهندسين",
      price: "ابتداءً من 15,000 ر.س",
      features: ["دراسات جدوى", "تصميمات تفصيلية", "إشراف هندسي", "مراجعة فنية"]
    },
    {
      icon: Truck,
      title: "إدارة المشاريع",
      description: "إدارة شاملة للمشاريع من مرحلة التخطيط والتصميم حتى التسليم النهائي والصيانة",
      price: "ابتداءً من 50,000 ر.س",
      features: ["تخطيط زمني", "إدارة الموارد", "مراقبة الجودة", "تقارير دورية"]
    },
    {
      icon: CheckCircle2,
      title: "ضمان الجودة",
      description: "نظام شامل لضمان الجودة ومراقبة جميع مراحل التنفيذ وفق المعايير العالمية",
      price: "ابتداءً من 25,000 ر.س",
      features: ["فحص شامل", "تقارير تقنية", "شهادات معتمدة", "متابعة مستمرة"]
    }
  ];

  // Payment handler
  const handlePayment = async (service: any) => {
    if (processingServiceId === service.title) return;
    
    setProcessingServiceId(service.title);
    
    try {
      // Extract numeric value from price string
      const priceMatch = service.price.match(/(\d+,?\d*)/);
      if (!priceMatch) {
        throw new Error('Invalid price format');
      }
      
      const priceInSAR = parseInt(priceMatch[1].replace(',', ''));
      
      const paymentData = {
        amount: priceInSAR,
        currency: 'SAR',
        customer_name: 'عميل',
        customer_email: 'customer@example.com',
        customer_phone: '966500000000',
        offer_title: service.title,
        description: `شراء خدمة: ${service.title}`,
        success_url: window.location.origin
      };

      // Use Paylink as primary payment gateway
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: paymentData
      });

      if (error) {
        throw error;
      }

      if (data.success && data.url) {
        // Redirect to payment page
        window.location.href = data.url;
      } else {
        throw new Error('فشل في إنشاء رابط الدفع');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('حدث خطأ في عملية الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      setProcessingServiceId(null);
    }
  };

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
            <ConstructionServices 
              services={services} 
              isPreview={false} 
              onPayment={handlePayment}
              processingServiceId={processingServiceId}
            />
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
              onPayment={handlePayment}
              processingServiceId={processingServiceId}
            />
            <CertificationsSection />
            <ConstructionProjects 
              projects={projects} 
              isPreview={true} 
              onViewAll={() => setCurrentPage("projects")}
            />
            <TechnologiesSection />
            <TeamSection />
            <TestimonialsSection />
            <PartnersSection />
          </>
        );
    }
  };

  // Certifications Section
  const CertificationsSection = () => {
    const certifications = [
      {
        name: "ISO 9001:2015",
        description: "نظام إدارة الجودة",
        icon: Shield,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "ISO 45001",
        description: "إدارة الصحة والسلامة المهنية",
        icon: CheckCircle2,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "ISO 14001",
        description: "نظام الإدارة البيئية",
        icon: Globe,
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "LEED معتمد",
        description: "البناء الأخضر والاستدامة",
        icon: Award,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80"
      }
    ];

    return (
      <section className="py-20 bg-gradient-to-b from-slate-100 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">🏅 شهاداتنا واعتماداتنا</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-green-700 bg-clip-text text-transparent">
              معايير عالمية للجودة والتميز
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نحن معتمدون من أرقى المؤسسات العالمية ونلتزم بأعلى معايير الجودة والسلامة في جميع مشاريعنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 hover-scale group">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <cert.icon className="h-8 w-8 mb-2 text-green-400" />
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{cert.name}</h3>
                  <p className="text-slate-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Technologies Section
  const TechnologiesSection = () => {
    const technologies = [
      {
        name: "BIM Technology",
        description: "نمذجة معلومات البناء",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
        icon: Building2
      },
      {
        name: "Drones & AI",
        description: "طائرات مسيرة وذكاء اصطناعي",
        image: "https://images.unsplash.com/photo-1508444845599-5c89863c80c8?auto=format&fit=crop&w=800&q=80",
        icon: Zap
      },
      {
        name: "3D Printing",
        description: "الطباعة ثلاثية الأبعاد",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        icon: Wrench
      },
      {
        name: "Smart Materials",
        description: "مواد البناء الذكية",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        icon: Star
      }
    ];

    return (
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">🚀 التقنيات المتطورة</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
              نواكب أحدث التقنيات العالمية
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نستخدم أحدث التقنيات والأدوات المتطورة لضمان تنفيذ مشاريع بجودة عالية وكفاءة استثنائية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 hover-scale group bg-white border-0 shadow-lg">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={tech.image} 
                    alt={tech.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <tech.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{tech.name}</h3>
                  <p className="text-slate-600">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Team Section
  const TeamSection = () => {
    const teamMembers = [
      {
        name: "م. أحمد العبدالله",
        position: "المدير التنفيذي",
        experience: "20+ سنة خبرة",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        specialization: "إدارة المشاريع الكبرى"
      },
      {
        name: "م. فاطمة الشهري",
        position: "مديرة الهندسة المعمارية",
        experience: "15+ سنة خبرة",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?auto=format&fit=crop&w=800&q=80",
        specialization: "التصميم المعماري المستدام"
      },
      {
        name: "م. خالد القحطاني",
        position: "مدير الهندسة المدنية",
        experience: "18+ سنة خبرة",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
        specialization: "الهياكل والأسس"
      },
      {
        name: "م. نورا الدوسري",
        position: "مديرة ضمان الجودة",
        experience: "12+ سنة خبرة",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
        specialization: "معايير الجودة العالمية"
      }
    ];

    return (
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">👨‍💼 فريق الخبراء</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              خبرات متراكمة وقيادة متميزة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              يقود شركتنا نخبة من أمهر المهندسين والخبراء في مجال البناء والتشييد
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 hover-scale group">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-blue-200 text-sm">{member.position}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-primary font-medium mb-2">{member.experience}</p>
                    <p className="text-slate-600 text-sm">{member.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Testimonials Section
  const TestimonialsSection = () => {
    const testimonials = [
      {
        name: "م. سعد الغامدي",
        position: "مدير مشروع برج الرياض",
        company: "شركة الرياض للتطوير",
        content: "شركة المقاولات العالمية نفذت مشروعنا بأعلى معايير الجودة وفي الوقت المحدد. فريق العمل محترف ومتعاون.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80",
        rating: 5
      },
      {
        name: "د. منى الزهراني",
        position: "مديرة المشاريع",
        company: "مؤسسة الإسكان التنموي",
        content: "تعاملنا معهم في عدة مشاريع سكنية وكانت النتائج مذهلة. الالتزام بالمواعيد والجودة العالية هما أبرز ما يميزهم.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
        rating: 5
      },
      {
        name: "أ. محمد الحربي",
        position: "رئيس قسم المشاريع",
        company: "شركة التطوير الحضري",
        content: "أسلوبهم المتطور في إدارة المشاريع واستخدام أحدث التقنيات جعل مشروعنا نموذجاً يحتذى به في المنطقة.",
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=80",
        rating: 5
      }
    ];

    return (
      <section className="py-20 bg-gradient-to-b from-slate-100 to-amber-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800">💬 آراء عملائنا</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-transparent">
              ثقة العملاء هي أغلى إنجازاتنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نفخر بثقة عملائنا وشهاداتهم التي تعكس جودة عملنا والتزامنا بالتميز
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-500 hover-scale bg-white border-0 shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{testimonial.name}</h3>
                    <p className="text-sm text-primary">{testimonial.position}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-amber-400 mb-4" />
                <p className="text-slate-600 leading-relaxed italic">"{testimonial.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Partners Section
  const PartnersSection = () => {
    const partners = [
      {
        name: "أرامكو السعودية",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80",
        category: "شريك استراتيجي"
      },
      {
        name: "شركة سابك",
        logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80",
        category: "شريك تجاري"
      },
      {
        name: "مجموعة بن لادن",
        logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
        category: "شريك تنفيذي"
      },
      {
        name: "شركة إعمار",
        logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
        category: "شريك تطوير"
      },
      {
        name: "مؤسسة محمد الراجحي",
        logo: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80",
        category: "شريك استثماري"
      },
      {
        name: "شركة أكوا باور",
        logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80",
        category: "شريك طاقة"
      }
    ];

    return (
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-800">🤝 شركاؤنا</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              شراكات استراتيجية مع كبرى الشركات
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتعاون مع أبرز الشركات والمؤسسات لتقديم حلول متكاملة ومتطورة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 hover-scale group bg-white border-0 shadow-lg">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{partner.name}</h3>
                    <Badge className="bg-white/20 text-white text-xs">{partner.category}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white px-8 py-4"
            >
              انضم كشريك معنا
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    );
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