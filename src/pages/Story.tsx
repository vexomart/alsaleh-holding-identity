import { 
  Heart, Star, Target, Zap, Clock, Users, Trophy, Lightbulb, 
  Rocket, Globe, Award, TrendingUp, Sparkles, Crown, Diamond,
  ArrowRight, CheckCircle, Briefcase, Building2, Layers,
  Palette, Code, Database, Cloud, Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Story = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden pt-24">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900/60 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Modern Typography */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
                <span className="text-white font-bold text-lg">رحلة الإبداع والتميز</span>
                <Diamond className="h-5 w-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 leading-tight">
              من الرؤية إلى الريادة
            </h1>
            
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
              <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-12">
              قصة شركة تحولت من حلم صغير إلى واقع كبير، ومن فكرة بسيطة إلى إمبراطورية تقنية رائدة
            </p>

            {/* Key Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: TrendingUp, text: "نمو مستمر", color: "text-green-400 bg-green-400/10" },
                { icon: Award, text: "جودة عالمية", color: "text-yellow-400 bg-yellow-400/10" },
                { icon: Users, text: "فريق متميز", color: "text-blue-400 bg-blue-400/10" },
                { icon: Shield, text: "موثوقية", color: "text-purple-400 bg-purple-400/10" }
              ].map((badge, index) => (
                <Badge 
                  key={index} 
                  className={`px-4 py-2 ${badge.color} border-0 text-sm font-semibold animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <badge.icon className="w-4 h-4 mr-2" />
                  {badge.text}
                </Badge>
              ))}
            </div>
          </div>

          {/* Main Story Card with Enhanced Design */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 lg:p-16 mb-20 animate-scale-in relative overflow-hidden shadow-2xl">
            {/* Floating decorative elements */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-xl">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">قصتنا الملهمة</h2>
                  </div>
                  
                  <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
                    <p>
                      بدأت رحلتنا في عام <span className="text-cyan-400 font-bold">2016</span> بحلم بسيط: 
                      تطوير حلول تقنية تُحدث فرقاً حقيقياً في حياة الناس.
                    </p>
                    <p>
                      واجهنا تحديات كبيرة، لكن إيماننا بـ<span className="text-purple-400 font-bold">قوة التقنية</span> 
                      ودورها في صناعة المستقبل جعلنا نستمر.
                    </p>
                    <p>
                      اليوم، نفخر بكوننا <span className="text-yellow-400 font-bold">شركة رائدة</span> 
                      تخدم آلاف العملاء حول العالم.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-slate-800/60 to-purple-900/60 rounded-2xl p-6 border border-purple-400/30">
                    <blockquote className="text-xl italic text-purple-300 mb-4">
                      "النجاح ليس مجرد وصول، بل رحلة مستمرة من التعلم والنمو والإبداع"
                    </blockquote>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-400">مؤسس الشركة</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Achievement Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { number: "8+", label: "سنوات خبرة", icon: Clock, color: "from-blue-400 to-cyan-500" },
                      { number: "15K+", label: "عميل راضٍ", icon: Users, color: "from-purple-400 to-pink-500" },
                      { number: "10K+", label: "مشروع ناجح", icon: Briefcase, color: "from-emerald-400 to-teal-500" },
                      { number: "99%", label: "نسبة النجاح", icon: CheckCircle, color: "from-yellow-400 to-orange-500" }
                    ].map((stat, index) => (
                      <Card key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center hover:scale-105 transition-transform">
                        <div className={`inline-flex p-2 bg-gradient-to-r ${stat.color} rounded-full mb-2`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Journey Timeline */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                محطات رحلتنا التاريخية
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
              {[
                {
                  year: "2016",
                  icon: Lightbulb,
                  title: "البداية والإلهام",
                  description: "انطلقنا بفكرة بسيطة وحلم كبير لتطوير حلول تقنية مبتكرة",
                  gradient: "from-yellow-400 to-orange-500",
                  bgGradient: "from-yellow-500/10 to-orange-500/10"
                },
                {
                  year: "2018",
                  icon: Code,
                  title: "التطوير والنمو",
                  description: "بناء فريق قوي وتطوير أول منتجاتنا التقنية المتميزة",
                  gradient: "from-blue-400 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/10"
                },
                {
                  year: "2020",
                  icon: Building2,
                  title: "التوسع والانتشار",
                  description: "افتتاح مكاتب جديدة وتوسيع نطاق خدماتنا محلياً وإقليمياً",
                  gradient: "from-purple-400 to-pink-500",
                  bgGradient: "from-purple-500/10 to-pink-500/10"
                },
                {
                  year: "2024",
                  icon: Crown,
                  title: "الريادة والتميز",
                  description: "ترسيخ مكانتنا كشركة رائدة في مجال التقنية والابتكار",
                  gradient: "from-emerald-400 to-teal-500",
                  bgGradient: "from-emerald-500/10 to-teal-500/10"
                }
              ].map((milestone, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:scale-105 transition-all duration-500 relative overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${milestone.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-white/10 text-white border-0 px-3 py-1">
                        {milestone.year}
                      </Badge>
                      <div className={`p-3 bg-gradient-to-r ${milestone.gradient} rounded-full shadow-lg`}>
                        <milestone.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {milestone.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                      {milestone.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Services & Expertise */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                خبراتنا ومجالاتنا
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                نقدم مجموعة شاملة من الخدمات التقنية المتطورة
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {[
                { icon: Palette, title: "التصميم الإبداعي", desc: "تصاميم عصرية تجمع بين الجمال والوظائف" },
                { icon: Code, title: "تطوير البرمجيات", desc: "حلول برمجية متقدمة وتطبيقات ذكية" },
                { icon: Database, title: "إدارة البيانات", desc: "أنظمة قواعد بيانات قوية وآمنة" },
                { icon: Cloud, title: "الحوسبة السحابية", desc: "خدمات سحابية متطورة وموثوقة" },
                { icon: Shield, title: "الأمن السيبراني", desc: "حماية شاملة للأنظمة والبيانات" },
                { icon: Layers, title: "التكامل التقني", desc: "دمج الأنظمة والحلول المختلفة" }
              ].map((service, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:scale-105 transition-all duration-300 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-xl group-hover:scale-110 transition-transform">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors">
                    {service.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-slate-800/60 via-indigo-900/60 to-slate-800/60 backdrop-blur-xl border border-white/20 p-12 text-center animate-fade-in relative overflow-hidden shadow-2xl">
            <div className="absolute top-8 left-8 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1.5s' }}></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl animate-pulse">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                انضم إلى قصة نجاحنا
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                كن جزءاً من رحلتنا المستمرة نحو الابتكار والتميز. معاً نبني مستقبلاً تقنياً أفضل
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-xl">
                  ابدأ مشروعك معنا
                  <ArrowRight className="mr-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  تعرف على خدماتنا
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Story;