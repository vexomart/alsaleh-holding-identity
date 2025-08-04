import { Heart, Star, Target, Zap, Clock, Users, Trophy, Lightbulb, Rocket, Globe, Award } from "lucide-react";

const Story = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-24">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Title with glassmorphism effect */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
              <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">
                <Rocket className="h-5 w-5 text-white animate-bounce-gentle" />
              </div>
              <span className="text-white font-semibold text-lg">رحلة الإبداع والتميز</span>
              <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
                <Star className="h-5 w-5 text-white animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 animate-scale-in leading-tight">
              من الحلم... إلى الواقع
            </h1>
            
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-glow"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full animate-glow" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              كل قصة نجاح عظيمة تبدأ بلحظة قرار... قررنا أن نحول الأحلام إلى إنجازات ملموسة
            </p>
          </div>

          {/* Hero story card with modern glassmorphism */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-20 shadow-2xl border border-white/20 mb-20 animate-scale-in relative overflow-hidden">
            {/* Floating animation elements */}
            <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            
            <div className="text-center space-y-10 relative z-10">
              <div className="flex justify-center mb-10">
                <div className="p-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-500 animate-glow">
                  <Heart className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-8">
                <p className="text-3xl md:text-4xl text-white leading-relaxed font-medium">
                  <span className="text-cyan-400 font-bold animate-fade-in">بدأنا بأحلام كبيرة</span> وعزيمة لا تنكسر...
                  <br className="hidden md:block" />
                  واجهنا التحديات بـ<span className="text-purple-400 font-bold animate-fade-in" style={{ animationDelay: '0.5s' }}>الصبر والإبداع</span>
                  <br className="hidden md:block" />
                  واليوم نحن <span className="text-pink-400 font-bold animate-fade-in" style={{ animationDelay: '1s' }}>نكتب قصة نجاح</span> جديدة كل يوم
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-10 border border-purple-400/30">
                <blockquote className="text-2xl md:text-3xl italic text-purple-300 font-medium mb-6">
                  "الإبداع لا يحدث بالصدفة، بل هو نتيجة العمل الجاد والرؤية الواضحة والإيمان بالمستحيل"
                </blockquote>
                <div className="flex justify-center space-x-1 rtl:space-x-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-current animate-pulse hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Journey phases with modern cards */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                مراحل رحلتنا المذهلة
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: "شرارة الإبداع",
                  description: "لحظة الإلهام الأولى التي غيرت مسار حياتنا وجعلتنا نؤمن بقوة التقنية",
                  gradient: "from-yellow-400 to-orange-500",
                  bgGradient: "from-yellow-500/10 to-orange-500/10",
                  delay: "0s",
                  borderColor: "border-yellow-400/30"
                },
                {
                  icon: Target,
                  title: "التخطيط الاستراتيجي",
                  description: "وضعنا خارطة طريق واضحة ومحددة لتحويل الأحلام إلى أهداف قابلة للتحقيق",
                  gradient: "from-blue-400 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/10",
                  delay: "0.2s",
                  borderColor: "border-blue-400/30"
                },
                {
                  icon: Zap,
                  title: "التنفيذ والتطوير",
                  description: "مرحلة العمل الجاد والتطوير المستمر، حيث تحولت الأفكار إلى منتجات رقمية",
                  gradient: "from-purple-400 to-pink-500",
                  bgGradient: "from-purple-500/10 to-pink-500/10",
                  delay: "0.4s",
                  borderColor: "border-purple-400/30"
                },
                {
                  icon: Trophy,
                  title: "النجاح والتوسع",
                  description: "حققنا إنجازات مهمة وبدأنا في التوسع، لكن رحلتنا نحو التميز مستمرة",
                  gradient: "from-emerald-400 to-teal-500",
                  bgGradient: "from-emerald-500/10 to-teal-500/10",
                  delay: "0.6s",
                  borderColor: "border-emerald-400/30"
                }
              ].map((phase, index) => (
                <div 
                  key={index} 
                  className={`group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 border ${phase.borderColor} animate-fade-in relative overflow-hidden hover:bg-white/10`}
                  style={{ animationDelay: phase.delay }}
                >
                  {/* Card background decoration */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${phase.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                      <div className={`p-5 bg-gradient-to-r ${phase.gradient} rounded-full group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                        <phase.icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-cyan-300 transition-colors">{phase.title}</h3>
                    <p className="text-gray-300 text-center leading-relaxed group-hover:text-white transition-colors">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced stats with modern design */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { 
                icon: Clock, 
                number: "5+", 
                label: "سنوات من الإبداع المتواصل", 
                gradient: "from-blue-400 to-cyan-500",
                bgGradient: "from-blue-500/10 to-cyan-500/10"
              },
              { 
                icon: Users, 
                number: "150+", 
                label: "عميل سعيد بخدماتنا المميزة", 
                gradient: "from-purple-400 to-pink-500",
                bgGradient: "from-purple-500/10 to-pink-500/10"
              },
              { 
                icon: Award, 
                number: "80+", 
                label: "مشروع ناجح يفخر به فريقنا", 
                gradient: "from-emerald-400 to-teal-500",
                bgGradient: "from-emerald-500/10 to-teal-500/10"
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`text-center bg-white/5 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in border border-white/10 hover:scale-105 group relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-full shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-5xl font-black text-white mb-4 group-hover:text-cyan-300 transition-colors">{stat.number}</div>
                  <div className="text-gray-300 font-medium text-lg group-hover:text-white transition-colors">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA with modern glassmorphism */}
          <div className="bg-gradient-to-r from-slate-800/60 via-purple-900/60 to-slate-800/60 backdrop-blur-xl rounded-3xl p-12 text-center animate-fade-in relative overflow-hidden border border-white/20 shadow-2xl">
            {/* Floating elements inside CTA */}
            <div className="absolute top-6 left-6 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-6 right-6 w-28 h-28 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1.5s' }}></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl animate-glow">
                  <Globe className="h-10 w-10 text-white animate-bounce-gentle" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">كن جزءاً من قصة نجاحنا</h2>
              <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                انضم إلينا في رحلة استثنائية نحو تحقيق أحلام أكبر وإنجازات أعظم. معاً نصنع المستقبل ونبني عالماً رقمياً أفضل
              </p>
              
              <div className="flex justify-center items-center space-x-3 rtl:space-x-reverse mb-10">
                {[...Array(7)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-7 w-7 text-yellow-400 fill-current animate-pulse hover:scale-125 transition-transform cursor-pointer hover:text-yellow-300" 
                    style={{ animationDelay: `${i * 0.15}s` }} 
                  />
                ))}
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "رؤيتنا المستقبلية",
                    description: "نطمح لأن نكون الشركة الرائدة عالمياً في تقديم الحلول التقنية المبتكرة والمتطورة",
                    icon: Rocket,
                    gradient: "from-cyan-400/20 to-blue-500/20"
                  },
                  {
                    title: "قيمنا الأساسية",
                    description: "الجودة والابتكار والشفافية والتفاني في خدمة عملائنا وتحقيق تطلعاتهم",
                    icon: Heart,
                    gradient: "from-purple-400/20 to-pink-500/20"
                  },
                  {
                    title: "هدفنا النبيل",
                    description: "تحويل الأحلام والأفكار إلى واقع رقمي مميز يضيف قيمة حقيقية للمجتمع",
                    icon: Target,
                    gradient: "from-emerald-400/20 to-teal-500/20"
                  }
                ].map((item, index) => (
                  <div key={index} className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 group`}>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-white mb-4 group-hover:text-cyan-300 transition-colors">{item.title}</h4>
                    <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;