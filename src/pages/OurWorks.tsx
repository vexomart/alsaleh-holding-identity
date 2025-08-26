import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Monitor, Smartphone, Globe, ExternalLink, Calendar, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import masterEduPathScreenshot from "@/assets/works/masteredupath-screenshot.png";

const OurWorks = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButtons = [
    { id: "all", label: "كل الأعمال", color: "bg-gradient-to-r from-amber-500 to-orange-500" },
    { id: "websites", label: "المواقع الإلكترونية", color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { id: "mobile", label: "تطبيقات الجوال", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  ];

  // أعمالنا
  const works = [
    {
      id: 1,
      title: "وكالة ماستر إيدو باث",
      description: "شريكك الموثوق في التعليم العالي والبحث العلمي. نقدم حلولاً متطورة ومعتمدة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم.",
      image: masterEduPathScreenshot,
      url: "https://masteredupath.com",
      category: "websites",
      technologies: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
      year: "2024",
      client: "MasterEduPath Agency",
      type: "موقع إلكتروني"
    }
  ];

  // تصفية الأعمال
  const filteredWorks = activeFilter === "all" 
    ? works 
    : works.filter(work => work.category === activeFilter);

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
            {filteredWorks.length > 0 ? (
              /* Works Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredWorks.map((work, index) => (
                  <Card key={work.id} className="group hover:scale-105 transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={work.image} 
                        alt={work.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-slate-800">
                          {work.type}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" asChild className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                          <a href={work.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            زيارة الموقع
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {work.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {work.year}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                        {work.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {work.client}
                        </div>
                      </div>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {work.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={work.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            زيارة الموقع
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State for filtered results */
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
                  <Monitor className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  لا توجد أعمال في هذا القسم بعد
                </h3>
                <p className="text-muted-foreground mb-6">
                  نعمل على إضافة المزيد من الأعمال في هذا القسم قريباً
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveFilter("all")}
                >
                  عرض جميع الأعمال
                </Button>
              </div>
            )}

            {/* CTA Section */}
            {filteredWorks.length > 0 && (
              <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-border/50 text-center">
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
            )}
          </div>
        </section>
      </PageContainer>

      <Footer />
    </div>
  );
};

export default OurWorks;