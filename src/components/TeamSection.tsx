import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Code, TrendingUp, Building2, Shield, Star, Award, ChevronRight, Sparkles, Brain, Heart, Zap } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "أحمد محمد السعيد",
      nameEn: "Ahmed Mohamed Al-Saeed",
      position: "رئيس مجلس الإدارة والمؤسس",
      positionEn: "Chairman & Founder",
      department: "القيادة الاستراتيجية",
      departmentEn: "Strategic Leadership",
      experience: "18+ سنة",
      specialties: ["الريادة", "الإبداع", "الاستراتيجية"],
      achievements: "قائد 100+ مشروع عالمي",
      color: "from-purple-600 to-blue-600",
      icon: Crown,
      rating: "5.0",
      bgEffect: "from-purple-500/10 to-blue-500/10"
    },
    {
      name: "سارة أحمد الزهراني",
      nameEn: "Sarah Ahmed Al-Zahrani",
      position: "المديرة التنفيذية للعمليات",
      positionEn: "Chief Operating Officer",
      department: "العمليات والتطوير",
      departmentEn: "Operations & Development",
      experience: "15+ سنة",
      specialties: ["إدارة العمليات", "التحسين", "الكفاءة"],
      achievements: "زيادة الكفاءة بنسبة 300%",
      color: "from-emerald-600 to-teal-600",
      icon: Building2,
      rating: "4.9",
      bgEffect: "from-emerald-500/10 to-teal-500/10"
    },
    {
      name: "محمد عبدالله الأحمري",
      nameEn: "Mohammed Abdullah Al-Ahmari",
      position: "رئيس قسم الموارد البشرية",
      positionEn: "Head of Human Resources",
      department: "تطوير المواهب",
      departmentEn: "Talent Development",
      experience: "12+ سنة",
      specialties: ["تطوير المواهب", "التدريب", "الثقافة المؤسسية"],
      achievements: "تطوير +850 موظف",
      color: "from-blue-600 to-cyan-600",
      icon: Users,
      rating: "4.8",
      bgEffect: "from-blue-500/10 to-cyan-500/10"
    },
    {
      name: "لينا سعد القحطاني",
      nameEn: "Lina Saad Al-Qahtani",
      position: "رئيسة قسم التقنية والابتكار",
      positionEn: "Chief Technology Officer",
      department: "التقنية والذكاء الاصطناعي",
      departmentEn: "Technology & AI",
      experience: "14+ سنة",
      specialties: ["الذكاء الاصطناعي", "البرمجة المتقدمة", "الابتكار"],
      achievements: "تطوير 50+ منتج تقني",
      color: "from-indigo-600 to-purple-600",
      icon: Code,
      rating: "4.9",
      bgEffect: "from-indigo-500/10 to-purple-500/10"
    },
    {
      name: "عبدالرحمن فهد الدوسري",
      nameEn: "Abdulrahman Fahad Al-Dosari",
      position: "مدير الاستثمارات والنمو",
      positionEn: "Investment & Growth Director",
      department: "الاستثمار والتطوير",
      departmentEn: "Investment & Development",
      experience: "16+ سنة",
      specialties: ["الاستثمار الذكي", "التحليل المالي", "النمو"],
      achievements: "إدارة استثمارات +500 مليون",
      color: "from-orange-600 to-red-600",
      icon: TrendingUp,
      rating: "4.8",
      bgEffect: "from-orange-500/10 to-red-500/10"
    },
    {
      name: "نورا يوسف العتيبي",
      nameEn: "Nora Yousef Al-Otaibi",
      position: "مديرة الجودة والامتثال",
      positionEn: "Quality & Compliance Director",
      department: "الجودة والأمان",
      departmentEn: "Quality & Security",
      experience: "11+ سنة",
      specialties: ["إدارة الجودة", "الامتثال", "الأمان"],
      achievements: "تحقيق 99.8% معدل الجودة",
      color: "from-green-600 to-emerald-600",
      icon: Shield,
      rating: "4.9",
      bgEffect: "from-green-500/10 to-emerald-500/10"
    }
  ];

  return (
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
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            فريق <span className="text-gradient-primary">النخبة</span>
          </h2>
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
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.bgEffect} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Header with Icon */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                        <IconComponent className="w-10 h-10 text-white animate-pulse" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-primary">{member.rating}</span>
                        </div>
                        <Badge className={`bg-gradient-to-r ${member.color} text-white border-0 font-bold text-xs`}>
                          {member.experience}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Member Info */}
                    <div className="mb-6">
                      <Badge variant="secondary" className="text-xs font-medium mb-3 bg-white/10 border-white/20">
                        {member.department}
                      </Badge>
                      <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-gradient-primary transition-all duration-300">
                        {member.name}
                      </h3>
                      <p className="text-sm text-secondary font-medium mb-2">
                        {member.nameEn}
                      </p>
                      <p className="text-base font-semibold text-primary/90 mb-1">
                        {member.position}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.positionEn}
                      </p>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        التخصصات:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, specialtyIndex) => (
                          <Badge 
                            key={specialtyIndex} 
                            className={`text-xs bg-gradient-to-r ${member.color} text-white border-0 hover:scale-105 transition-transform duration-200`}
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Achievement */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">{member.achievements}</span>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="mt-4">
                      <button className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 group/btn text-sm w-full justify-center">
                        <Heart className="w-4 h-4 group-hover/btn:animate-pulse" />
                        <div className="text-center">
                          <div className="font-medium">تواصل مع الخبير</div>
                          <div className="text-xs opacity-90">Professional Contact</div>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>

                    {/* Bottom Accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
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
  );
};

export default TeamSection;