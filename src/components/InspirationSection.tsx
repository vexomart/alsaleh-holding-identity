import { Heart, Star, Target, Zap } from "lucide-react";

const InspirationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-white/5"></div>
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
              رحلة من التعب... إلى الإبداع
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Main inspirational content */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-primary/20 mb-12 animate-scale-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-secondary rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 font-medium">
              <span className="text-primary font-bold">تعبنا كثيراً</span> حتى وصلنا إلى ما نحن عليه اليوم...
              <br className="hidden md:block" />
              ولا زلنا <span className="text-secondary font-bold">نتعب أكثر</span> للوصول إلى أحلامنا الكبيرة
            </p>
            
            <blockquote className="text-lg md:text-xl italic text-primary/80 border-r-4 border-primary pr-6 mr-4">
              "النجاح ليس مجرد وجهة، بل رحلة مليئة بالعزيمة والإصرار والأحلام التي لا تنتهي"
            </blockquote>
          </div>

          {/* Journey milestones */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-primary/10">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">البداية المتواضعة</h3>
              <p className="text-muted-foreground">
                بدأنا بحلم صغير وعزيمة كبيرة، نؤمن أن كل خطوة تقربنا من هدفنا
              </p>
            </div>

            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-secondary/10">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">التحديات والنمو</h3>
              <p className="text-muted-foreground">
                كل تحدٍ واجهناه جعلنا أقوى، وكل صعوبة علمتنا درساً جديداً
              </p>
            </div>

            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-primary/10">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full group-hover:scale-110 transition-transform">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">الحلم المستمر</h3>
              <p className="text-muted-foreground">
                رحلتنا لم تنتهِ بعد، فالحلم يكبر مع كل إنجاز نحققه
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">انضم إلى رحلتنا</h3>
            <p className="text-lg mb-6 opacity-90">
              معاً نحو المزيد من الإبداع والتميز والأحلام التي تتحقق
            </p>
            <div className="flex justify-center space-x-2 rtl:space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-300 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;