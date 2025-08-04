import { Heart, Star, Target, Zap, Clock, Users, Trophy, Lightbulb, ArrowUp, Sparkles } from "lucide-react";

const InspirationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 bg-grid-white/5"></div>
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Title with more animation */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">قصة نجاح حقيقية</span>
              <Sparkles className="h-5 w-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-6 animate-scale-in">
              رحلة من التعب... إلى الإبداع
            </h2>
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-primary rounded-full animate-slide-in-right"></div>
              <div className="w-8 h-1 bg-primary rounded-full animate-pulse"></div>
              <div className="w-16 h-1 bg-gradient-to-l from-transparent to-secondary rounded-full animate-slide-in-right" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              كل نجاح عظيم يبدأ بحلم صغير وإرادة قوية لا تعرف الاستسلام
            </p>
          </div>

          {/* Main inspirational content with enhanced design */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border border-primary/20 mb-16 animate-scale-in relative overflow-hidden">
            {/* Floating animation elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-8">
              <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed font-medium">
                <span className="text-primary font-bold animate-fade-in">تعبنا كثيراً</span> في البدايات الصعبة...
                <br className="hidden md:block" />
                واجهنا التحديات بـ<span className="text-secondary font-bold animate-fade-in" style={{ animationDelay: '0.5s' }}>الصبر والإصرار</span>
                <br className="hidden md:block" />
                ولا زلنا <span className="text-primary font-bold animate-fade-in" style={{ animationDelay: '1s' }}>نتعب أكثر</span> للوصول إلى أحلامنا الكبيرة
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border-r-4 border-primary">
                <blockquote className="text-xl md:text-2xl italic text-primary/90 font-medium">
                  "النجاح ليس مجرد وجهة، بل رحلة مليئة بالعزيمة والإصرار والأحلام التي لا تنتهي"
                </blockquote>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-amber-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Journey timeline */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              مراحل رحلتنا الملهمة
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: "الفكرة الأولى",
                  description: "بدأت بحلم بسيط وإيمان كبير بأن التقنية يمكنها تغيير العالم",
                  color: "from-yellow-500 to-orange-500",
                  delay: "0s"
                },
                {
                  icon: Target,
                  title: "التخطيط والعمل",
                  description: "وضعنا خططاً واضحة وبدأنا العمل بجد واجتهاد رغم كل الصعوبات",
                  color: "from-blue-500 to-cyan-500",
                  delay: "0.2s"
                },
                {
                  icon: Zap,
                  title: "التحديات والنمو",
                  description: "كل تحدٍ جعلنا أقوى وكل عقبة علمتنا درساً جديداً في الحياة",
                  color: "from-purple-500 to-pink-500",
                  delay: "0.4s"
                },
                {
                  icon: Trophy,
                  title: "الإنجازات المستمرة",
                  description: "حققنا نجاحات مهمة ولكن رحلتنا لم تنتهِ، فالحلم يكبر معنا",
                  color: "from-green-500 to-emerald-500",
                  delay: "0.6s"
                }
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-primary/10 animate-fade-in relative overflow-hidden"
                  style={{ animationDelay: step.delay }}
                >
                  {/* Card background decoration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className={`p-4 bg-gradient-to-r ${step.color} rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-primary mb-4 text-center">{step.title}</h4>
                    <p className="text-muted-foreground text-center leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats section with animation */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Clock, number: "5+", label: "سنوات من العمل الجاد", color: "text-blue-500" },
              { icon: Users, number: "100+", label: "عميل راضٍ عن خدماتنا", color: "text-green-500" },
              { icon: Trophy, number: "50+", label: "مشروع ناجح ومميز", color: "text-purple-500" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in border border-primary/10"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Call to action with more content */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-10 text-white text-center animate-fade-in relative overflow-hidden">
            {/* Floating elements inside CTA */}
            <div className="absolute top-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1.5s' }}></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full">
                  <ArrowUp className="h-8 w-8 text-white animate-bounce" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">انضم إلى رحلتنا الملهمة</h3>
              <p className="text-xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
                معاً نبني المستقبل ونحقق الأحلام الكبيرة. رحلتنا مستمرة ونحن بحاجة لشركاء يؤمنون بالتميز والإبداع
              </p>
              
              <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse mb-6">
                {[...Array(7)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-6 w-6 text-yellow-300 fill-current animate-pulse hover:scale-125 transition-transform cursor-pointer" 
                    style={{ animationDelay: `${i * 0.15}s` }} 
                  />
                ))}
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2">رؤيتنا</h4>
                  <p className="text-sm opacity-90">أن نكون الرائدين في تقديم الحلول التقنية المبتكرة</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2">قيمنا</h4>
                  <p className="text-sm opacity-90">الجودة والابتكار والتفاني في خدمة عملائنا</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h4 className="font-bold text-lg mb-2">هدفنا</h4>
                  <p className="text-sm opacity-90">تحويل الأحلام إلى واقع رقمي مميز</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;