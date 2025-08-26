import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  ExternalLink, 
  Calendar, 
  Users, 
  Code2, 
  Star, 
  Award,
  Palette,
  Zap,
  Shield,
  Layers,
  Database,
  Server,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import masterEduPathScreenshot from "@/assets/works/masteredupath-screenshot.png";
import fekrahAcademyScreenshot from "@/assets/works/fekrah-academy-screenshot.png";

const OurWorks = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButtons = [
    { id: "all", label: "كل الأعمال", color: "bg-gradient-to-r from-amber-500 to-orange-500", icon: Award },
    { id: "websites", label: "المواقع الإلكترونية", color: "bg-gradient-to-r from-blue-500 to-indigo-500", icon: Globe },
    { id: "mobile", label: "تطبيقات الجوال", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: Smartphone },
    { id: "systems", label: "الأنظمة الإدارية", color: "bg-gradient-to-r from-emerald-500 to-teal-500", icon: Database },
  ];

  // أعمالنا
  const works = [
    {
      id: 1,
      title: "وكالة ماستر إيدو باث",
      subtitle: "منصة التعليم العالي والبحث العلمي",
      description: "شريكك الموثوق في التعليم العالي والبحث العلمي. نقدم حلولاً متطورة ومعتمدة للجامعات والمراكز البحثية والطلاب المتميزين حول العالم.",
      image: masterEduPathScreenshot,
      url: "https://masteredupath.com",
      category: "websites",
      technologies: [
        { name: "React", color: "bg-blue-500", icon: "⚛️" },
        { name: "Next.js", color: "bg-black", icon: "▲" },
        { name: "Tailwind CSS", color: "bg-cyan-500", icon: "🎨" },
        { name: "TypeScript", color: "bg-blue-600", icon: "📘" },
        { name: "Node.js", color: "bg-green-600", icon: "🟢" }
      ],
      features: [
        { name: "تصميم متجاوب", icon: Monitor, description: "يعمل على جميع الأجهزة" },
        { name: "سرعة عالية", icon: Zap, description: "تحميل فائق السرعة" },
        { name: "أمان متقدم", icon: Shield, description: "حماية شاملة للبيانات" },
        { name: "تجربة مستخدم ممتازة", icon: Star, description: "واجهة سهلة وجذابة" }
      ],
      year: "2024",
      client: "MasterEduPath Agency",
      type: "موقع إلكتروني",
      status: "مكتمل",
      rating: 5,
      duration: "35 يوم"
    },
    {
      id: 2,
      title: "فكرة أكاديمي",
      subtitle: "الشريك الموثوق للنشر العلمي المعتمد",
      description: "تحول أفكارك العلمية إلى أبحاث منشورة في أرقى المجلات العالمية. نحن نوفر خدمة عالية الجودة مع نسبة نجاح 98% ودعم مستمر للباحثين.",
      image: fekrahAcademyScreenshot,
      url: "https://fekrah-academy.com",
      category: "websites",
      technologies: [
        { name: "WordPress", color: "bg-blue-700", icon: "🔷" },
        { name: "PHP", color: "bg-purple-600", icon: "🐘" },
        { name: "MySQL", color: "bg-orange-500", icon: "🗃️" },
        { name: "JavaScript", color: "bg-yellow-500", icon: "⚡" },
        { name: "CSS3", color: "bg-blue-500", icon: "🎨" }
      ],
      features: [
        { name: "نظام إدارة محتوى", icon: Database, description: "إدارة سهلة وفعالة" },
        { name: "تصميم احترافي", icon: Palette, description: "واجهة جذابة ومتميزة" },
        { name: "أمان عالي", icon: Shield, description: "حماية متقدمة للبيانات" },
        { name: "دعم متعدد اللغات", icon: Globe, description: "متاح بلغات متعددة" }
      ],
      year: "2024",
      client: "Fekrah Academy",
      type: "موقع إلكتروني",
      status: "مكتمل",
      rating: 5,
      duration: "شهرين"
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
        {/* Enhanced Hero Section */}
        <div className="relative py-24 lg:py-40 overflow-hidden">
          {/* Advanced Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/12"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent"></div>
          
          {/* Animated Background Shapes */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent/12 to-primary/8 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Geometric Patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full border border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-primary">معرض أعمالنا</span>
                </div>
                <div className="w-px h-6 bg-border"></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>مشاريع متميزة</span>
                </div>
              </div>
              
              {/* Enhanced Title */}
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                  أعمالنا
                </span>
                <br />
                <span className="text-3xl lg:text-4xl font-medium text-muted-foreground">
                  المتميزة والمبتكرة
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto">
                ألقِ نظرة على معرض أعمالنا بأنواعها المختلفة واكتشف كيف نحول الأفكار إلى واقع رقمي مبهر
              </p>

              {/* Enhanced Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                {filterButtons.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      className={`group px-8 py-4 text-base font-medium transition-all duration-300 rounded-2xl ${
                        activeFilter === filter.id 
                          ? `${filter.color} text-white hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105` 
                          : "hover:bg-primary hover:text-primary-foreground border-border/50 hover:border-primary/50 transform hover:scale-105"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      {filter.label}
                      {activeFilter === filter.id && (
                        <div className="ml-3 w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { number: "50+", label: "مشروع مكتمل", icon: CheckCircle, color: "text-emerald-500" },
                  { number: "100%", label: "رضا العملاء", icon: Star, color: "text-amber-500" },
                  { number: "24/7", label: "دعم فني", icon: Shield, color: "text-blue-500" }
                ].map((stat, index) => (
                  <div key={index} className="group p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Works Grid Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/5"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            {filteredWorks.length > 0 ? (
              <div className="space-y-16">
                {/* Works Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredWorks.map((work, index) => (
                    <Card key={work.id} className="group overflow-hidden bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:scale-[1.01] hover:shadow-xl rounded-2xl">
                      {/* Compact Image Section */}
                      <div className="relative overflow-hidden h-48">
                        <img 
                          src={work.image} 
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className={`${work.status === 'مكتمل' ? 'bg-emerald-500' : 'bg-amber-500'} text-white border-0 text-xs`}>
                            {work.status}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/90 text-slate-800 border-0 text-xs">
                            {work.type}
                          </Badge>
                        </div>

                        {/* Rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                          {[...Array(work.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-current" />
                          ))}
                        </div>
                        
                        {/* Bottom Action */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Button size="sm" asChild className="w-full bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 rounded-lg text-xs">
                            <a href={work.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              زيارة الموقع
                              <ArrowUpRight className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-5">
                        {/* Compact Header */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                {work.title}
                              </h3>
                              <p className="text-xs font-medium text-primary/80 mb-2">
                                {work.subtitle}
                              </p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground ml-3">
                              <div className="flex items-center gap-1 mb-1">
                                <Calendar className="w-3 h-3" />
                                {work.year}
                              </div>
                              <div className="font-medium text-primary">{work.duration}</div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground leading-relaxed text-xs mb-4 line-clamp-2">
                            {work.description}
                          </p>
                        </div>

                        {/* Compact Technologies */}
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            التقنيات
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {work.technologies.map((tech, techIndex) => (
                              <Badge 
                                key={techIndex} 
                                className={`${tech.color} text-white border-0 text-xs font-medium px-2 py-0.5 hover:scale-105 transition-transform cursor-default`}
                              >
                                <span className="mr-1 text-xs">{tech.icon}</span>
                                {tech.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Compact Features */}
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            المميزات
                          </h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {work.features.map((feature, featureIndex) => (
                              <div 
                                key={featureIndex}
                                className="group/feature p-2 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border/30 hover:border-primary/40 transition-all duration-300 hover:scale-105 cursor-default"
                              >
                                <div className="flex items-center gap-1.5 mb-1">
                                  <feature.icon className="w-3 h-3 text-primary group-hover/feature:scale-110 transition-transform" />
                                  <span className="text-xs font-medium text-foreground">{feature.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-tight">{feature.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Compact Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span className="truncate">{work.client}</span>
                          </div>
                          
                          <Button variant="outline" size="sm" asChild className="group/btn hover:bg-primary hover:text-primary-foreground border-primary/20 hover:border-primary text-xs px-3 py-1">
                            <a href={work.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1 group-hover/btn:scale-110 transition-transform" />
                              المشروع
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* Enhanced Empty State */
              <div className="text-center py-24">
                <div className="relative mb-12">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center relative overflow-hidden">
                    <Monitor className="w-16 h-16 text-muted-foreground z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    لا توجد أعمال في هذا القسم بعد
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    نعمل على إضافة المزيد من الأعمال المتميزة في هذا القسم قريباً. 
                    ترقبوا إبداعاتنا القادمة!
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => setActiveFilter("all")}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      عرض جميع الأعمال
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/contact">تواصل معنا</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced CTA Section */}
            {filteredWorks.length > 0 && (
              <div className="mt-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent rounded-3xl"></div>
                
                <div className="relative p-12 lg:p-16 text-center border border-border/50 rounded-3xl backdrop-blur-sm">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                        <Briefcase className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                      هل تريد أن يكون مشروعك ضمن أعمالنا المميزة؟
                    </h3>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      تواصل معنا الآن لبدء رحلة تحويل فكرتك إلى واقع رقمي مبهر. 
                      نحن هنا لنساعدك في إنشاء مشروع استثنائي يحقق أهدافك ويتفوق على توقعاتك.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                      <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        <a href="/contact">
                          <Target className="w-5 h-5 mr-2" />
                          بدء مشروعك الآن
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 rounded-2xl border-primary/20 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all">
                        <a href="/services-catalog">
                          <Layers className="w-5 h-5 mr-2" />
                          استكشف خدماتنا
                        </a>
                      </Button>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ضمان الجودة
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        نتائج مضمونة
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        دعم مستمر
                      </div>
                    </div>
                  </div>
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