import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Code, TrendingUp, Building2, Shield, Star, Award, ChevronRight, Sparkles, Brain, Heart, Zap } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "أ/أحمد بن عبدالعزيز العتيبي",
      nameEn: "Ahmed Bin Abdulaziz Al-Otaibi",
      position: "رئيس مجلس الإدارة والمؤسس",
      positionEn: "Chairman & Founder",
      department: "القيادة الاستراتيجية",
      departmentEn: "Strategic Leadership",
      specialties: ["الريادة", "الإبداع", "الاستراتيجية"],
      achievements: "قائد 100+ مشروع عالمي",
      color: "from-purple-600 to-blue-600",
      icon: Crown,
      bgEffect: "from-purple-500/10 to-blue-500/10"
    },
    {
      name: "م/فهد بن سعد القحطاني",
      nameEn: "Fahad Bin Saad Al-Qahtani",
      position: "المدير التنفيذي للعمليات",
      positionEn: "Chief Operating Officer",
      department: "العمليات والتطوير",
      departmentEn: "Operations & Development",
      specialties: ["إدارة العمليات", "التحسين", "الكفاءة"],
      achievements: "زيادة الكفاءة بنسبة 300%",
      color: "from-emerald-600 to-teal-600",
      icon: Building2,
      bgEffect: "from-emerald-500/10 to-teal-500/10"
    },
    {
      name: "د/نوره بنت محمد الغامدي",
      nameEn: "Dr. Norah Bint Mohammed Al-Ghamdi",
      position: "رئيسة قسم الموارد البشرية",
      positionEn: "Head of Human Resources",
      department: "تطوير المواهب",
      departmentEn: "Talent Development",
      specialties: ["تطوير المواهب", "التدريب", "الثقافة المؤسسية"],
      achievements: "تطوير +850 موظف",
      color: "from-blue-600 to-cyan-600",
      icon: Users,
      bgEffect: "from-blue-500/10 to-cyan-500/10"
    },
    {
      name: "م/عبدالله بن يوسف الشمري",
      nameEn: "Abdullah Bin Youssef Al-Shamri",
      position: "رئيس قسم التقنية والابتكار",
      positionEn: "Chief Technology Officer",
      department: "التقنية والذكاء الاصطناعي",
      departmentEn: "Technology & AI",
      specialties: ["الذكاء الاصطناعي", "البرمجة المتقدمة", "الابتكار"],
      achievements: "تطوير 50+ منتج تقني",
      color: "from-indigo-600 to-purple-600",
      icon: Code,
      bgEffect: "from-indigo-500/10 to-purple-500/10"
    },
    {
      name: "أ/مشعل بن ناصر المطيري",
      nameEn: "Meshal Bin Nasser Al-Mutairi",
      position: "مدير الاستثمارات والنمو",
      positionEn: "Investment & Growth Director",
      department: "الاستثمار والتطوير",
      departmentEn: "Investment & Development",
      specialties: ["الاستثمار الذكي", "التحليل المالي", "النمو"],
      achievements: "إدارة استثمارات +500 مليون",
      color: "from-orange-600 to-red-600",
      icon: TrendingUp,
      bgEffect: "from-orange-500/10 to-red-500/10"
    },
    {
      name: "أ/سارة بنت علي الدوسري",
      nameEn: "Sarah Bint Ali Al-Dosari",
      position: "مديرة الجودة والامتثال",
      positionEn: "Quality & Compliance Director",
      department: "الجودة والأمان",
      departmentEn: "Quality & Security",
      specialties: ["إدارة الجودة", "الامتثال", "الأمان"],
      achievements: "تحقيق 99.8% معدل الجودة",
      color: "from-green-600 to-emerald-600",
      icon: Shield,
      bgEffect: "from-green-500/10 to-emerald-500/10"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">فريق الخبراء • قادة التميز</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
                فريق <span className="text-gradient-primary">النخبة</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                نخبة من أفضل الخبراء والقادة الذين يقودون رؤيتنا نحو مستقبل التقنية والابتكار العالمي
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {teamMembers.map((member, index) => {
                const IconComponent = member.icon;
                
                return (
                  <Card 
                    key={index} 
                    className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in hover:transform hover:scale-105 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardContent className="p-8 relative h-full">
                      {/* Background overlay with member color */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float top-4 right-4" />
                        <div className="absolute w-1 h-1 bg-secondary/30 rounded-full animate-float-delayed top-8 right-8" />
                        <div className="absolute w-1.5 h-1.5 bg-primary/15 rounded-full animate-float bottom-8 left-6" />
                      </div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                        {/* Header with Enhanced Icon */}
                        <div className="flex items-start justify-between mb-6">
                          <div className={`relative w-24 h-24 bg-gradient-to-br ${member.color} rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-2xl group-hover:shadow-glow`}>
                            <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <IconComponent className="w-12 h-12 text-white group-hover:animate-pulse relative z-10" />
                            {/* Icon glow effect */}
                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${member.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-700`} />
                          </div>
                          
                          {/* Status indicator */}
                          <div className="flex flex-col items-end">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mb-2" />
                            <span className="text-xs text-green-400 font-medium">متاح</span>
                          </div>
                        </div>
                        
                        {/* Enhanced Member Info */}
                        <div className="mb-6 flex-grow">
                          <Badge variant="secondary" className="text-xs font-bold mb-4 bg-white/15 border-white/30 text-primary/90 px-3 py-1 rounded-full">
                            {member.department}
                          </Badge>
                          
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-gradient-primary transition-all duration-500 group-hover:scale-105 transform-gpu">
                              {member.name}
                            </h3>
                            <p className="text-sm text-secondary/80 font-medium mb-3 group-hover:text-secondary transition-colors duration-300">
                              {member.nameEn}
                            </p>
                            <div className="border-l-4 border-gradient-primary pl-3 space-y-1">
                              <p className="text-base font-bold text-primary/90 group-hover:text-primary transition-colors duration-300">
                                {member.position}
                              </p>
                              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                                {member.positionEn}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Specialties */}
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                            <Brain className="w-4 h-4 animate-pulse" />
                            <span>التخصصات المتقدمة</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {member.specialties.map((specialty, specialtyIndex) => (
                              <Badge 
                                key={specialtyIndex} 
                                className={`text-xs bg-gradient-to-r ${member.color} text-white border-0 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg font-medium px-3 py-1`}
                                style={{ animationDelay: `${specialtyIndex * 0.1}s` }}
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Enhanced Achievement */}
                        <div className="mb-4">
                          <div className="flex items-start gap-3 text-sm bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-3 group-hover:from-white/15 group-hover:to-white/10 transition-all duration-500 shadow-inner">
                            <Award className="w-5 h-5 text-yellow-500 mt-0.5 group-hover:rotate-12 transition-transform duration-300" />
                            <div>
                              <div className="text-xs text-primary/80 font-medium mb-1">الإنجاز البارز</div>
                              <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                                {member.achievements}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Bottom Accent with pulse effect */}
                        <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${member.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-b-xl`} />
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.color} opacity-50 animate-pulse`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Team Stats Summary */}
            <div className="text-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-12 animate-fade-in border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <h3 className="text-4xl font-bold text-primary">فريق النخبة المتميز</h3>
                <Zap className="w-8 h-8 text-secondary animate-bounce" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
                  <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">85+</div>
                  <div className="text-xl font-semibold text-primary mb-1">سنة خبرة مجمعة</div>
                  <div className="text-sm text-muted-foreground">Years of Combined Experience</div>
                </div>
                
                <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
                  <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">1,200+</div>
                  <div className="text-xl font-semibold text-primary mb-1">مشروع قادوه بنجاح</div>
                  <div className="text-sm text-muted-foreground">Successfully Led Projects</div>
                </div>
                
                <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
                  <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">98.5%</div>
                  <div className="text-xl font-semibold text-primary mb-1">معدل نجاح المشاريع</div>
                  <div className="text-sm text-muted-foreground">Project Success Rate</div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
                  🏆 أفضل فريق في الشرق الأوسط
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
                  🌟 قادة الابتكار التقني
                </Badge>
                <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
                  🚀 رواد التحول الرقمي
                </Badge>
              </div>

              <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                <p className="text-lg text-primary font-semibold mb-2">
                  فريق متعدد التخصصات يجمع بين الخبرة العالمية والفهم المحلي العميق
                </p>
                <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>نعمل معاً لتحقيق رؤية 2030 وتطوير المملكة رقمياً</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
    </div>
  );
};

export default Team;