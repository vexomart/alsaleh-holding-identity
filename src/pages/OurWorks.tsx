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
      year: "2025",
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
      year: "2025",
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                  {filteredWorks.map((work, index) => (
                    <Card 
                      key={work.id} 
                      className="group overflow-hidden relative bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border-0 transition-all duration-700 hover:scale-[1.03] rounded-3xl animate-fade-in-up opacity-0 shadow-lg hover:shadow-2xl"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animationFillMode: 'forwards',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Premium Border Effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                      <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-background via-background/98 to-background/95 z-10"></div>
                      
                      {/* Luxury Image Section */}
                      <div className="relative overflow-hidden h-40 rounded-t-3xl z-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                        <img 
                          src={work.image} 
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 filter group-hover:brightness-110"
                        />
                        
                        {/* Elegant Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                        
                        {/* Premium Status Badges */}
                        <div className="absolute top-3 left-3 flex gap-2 z-30">
                          <Badge className={`${work.status === 'مكتمل' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-amber-600'} text-white border-0 text-xs font-semibold px-3 py-1 shadow-lg transform transition-all duration-300 group-hover:scale-110 backdrop-blur-sm`}>
                            ✨ {work.status}
                          </Badge>
                          <Badge className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 text-white border-0 text-xs font-medium px-3 py-1 shadow-lg backdrop-blur-md transform transition-all duration-300 group-hover:scale-110">
                            {work.type}
                          </Badge>
                        </div>

                        {/* Luxury Rating */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full px-3 py-2 shadow-xl transform transition-all duration-300 group-hover:scale-110 border border-white/20 z-30">
                          {[...Array(work.rating)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-3 h-3 text-amber-500 fill-current transition-all duration-300 group-hover:text-amber-400" 
                              style={{ 
                                animationDelay: `${i * 0.1}s`,
                                filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3))'
                              }}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-1">{work.rating}.0</span>
                        </div>
                        
                        {/* Enhanced Action Button */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 z-30">
                          <Button size="sm" asChild className="w-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl text-white border border-white/30 hover:from-white/30 hover:to-white/20 rounded-xl text-xs font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-500">
                            <a href={work.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              مشاهدة المشروع
                              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                            </a>
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-5 relative z-20 bg-gradient-to-br from-background/95 to-background/90">
                        {/* Luxury Header with Glass Effect */}
                        <div className="mb-4 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-xl opacity-50"></div>
                          <div className="relative p-3 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 pr-2">
                                <h3 className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                                  {work.title}
                                </h3>
                                <p className="text-xs font-medium text-primary/80 mb-1 line-clamp-1">
                                  {work.subtitle}
                                </p>
                              </div>
                              <div className="text-right text-xs">
                                <div className="flex items-center gap-1 mb-1 px-2 py-1 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                  <Calendar className="w-3 h-3 text-primary" />
                                  <span className="font-semibold text-primary">{work.year}</span>
                                </div>
                                <div className="font-bold text-xs text-center mt-1 px-2 py-1 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full text-secondary">
                                  {work.duration}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed text-xs mb-3 line-clamp-2 opacity-80">
                              {work.description}
                            </p>
                          </div>
                        </div>

                        {/* Premium Technologies Section */}
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                            <Code2 className="w-3 h-3 text-primary group-hover:rotate-12 transition-transform" />
                            التقنيات المستخدمة
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {work.technologies.slice(0, 4).map((tech, techIndex) => (
                              <Badge 
                                key={techIndex} 
                                className={`${tech.color} text-white border-0 text-xs font-semibold px-2 py-1 hover:scale-110 transition-all duration-500 cursor-default shadow-lg relative overflow-hidden`}
                                style={{ animationDelay: `${techIndex * 0.1}s` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <span className="mr-1 text-xs relative z-10">{tech.icon}</span>
                                <span className="relative z-10">{tech.name}</span>
                              </Badge>
                            ))}
                            {work.technologies.length > 4 && (
                              <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs px-2 py-1 shadow-lg">
                                +{work.technologies.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Luxury Features Grid */}
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                            <Star className="w-3 h-3 text-amber-500 group-hover:rotate-12 transition-transform" />
                            المميزات الأساسية
                          </h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {work.features.map((feature, featureIndex) => (
                              <div 
                                key={featureIndex}
                                className="group/feature p-2 bg-gradient-to-br from-primary/8 via-primary/5 to-secondary/8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 cursor-default shadow-sm hover:shadow-lg backdrop-blur-sm relative overflow-hidden"
                                style={{ animationDelay: `${featureIndex * 0.1}s` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover/feature:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="flex items-center gap-1.5 mb-1 relative z-10">
                                  <feature.icon className="w-3 h-3 text-primary group-hover/feature:scale-125 group-hover/feature:rotate-12 transition-all duration-300" />
                                  <span className="text-xs font-semibold text-foreground truncate">{feature.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-tight line-clamp-1 relative z-10">{feature.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Premium Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gradient-to-r from-border/50 via-primary/20 to-border/50">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                            <Users className="w-3 h-3 text-primary" />
                            <span className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">{work.client}</span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild 
                            className="group/btn bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary hover:to-secondary hover:text-white border-primary/30 hover:border-primary text-xs px-3 py-1.5 h-auto transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-xl backdrop-blur-sm font-semibold"
                          >
                            <a href={work.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                              <ExternalLink className="w-3 h-3 group-hover/btn:scale-125 transition-transform" />
                              زيارة المشروع
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