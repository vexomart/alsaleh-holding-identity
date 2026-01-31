import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Sparkles, Award, Users, Star, Target, Flower } from 'lucide-react';
import AbayaHeader from '@/components/abaya-store/AbayaHeader';
import AbayaFooter from '@/components/abaya-store/AbayaFooter';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50" dir="rtl">
      <AbayaHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-12 h-12 text-yellow-300 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
                من نحن - متجر عبايتي
              </h1>
              <Crown className="w-12 h-12 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl leading-relaxed">
              رحلة من الإبداع والتميز في عالم الأزياء النسائية العربية الأصيلة
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-rose-500 animate-pulse" />
                <h2 className="text-4xl font-bold text-gray-800">قصتنا</h2>
                <Heart className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>
              <p className="text-xl text-gray-700 leading-relaxed">
                بدأت رحلة "عبايتي" من شغف عميق بالأناقة العربية الأصيلة ورؤية لتطوير عبايات تجمع بين التراث العريق والعصرية الحديثة. 
                منذ تأسيسنا، نحن ملتزمون بتقديم أجود أنواع العبايات التي تعكس جمال وأناقة المرأة العربية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 bg-gradient-to-br from-purple-50/80 to-rose-50/80 border-0 shadow-lg animate-fade-in">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">رؤيتنا</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    أن نكون الوجهة الأولى للمرأة العربية الباحثة عن الأناقة والتميز، 
                    ونشر ثقافة الجمال والأصالة العربية في كل بيت.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-rose-50/80 to-pink-50/80 border-0 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full flex items-center justify-center animate-pulse">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">رسالتنا</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    تقديم عبايات عالية الجودة بتصاميم فريدة تلبي احتياجات المرأة العصرية 
                    مع الحفاظ على الهوية العربية الأصيلة.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 to-rose-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-8 h-8 text-purple-500 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-800">قيمنا</h2>
              <Award className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-white/70 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in">
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">الجودة</h4>
                <p className="text-gray-600">
                  نلتزم بأعلى معايير الجودة في كل تفصيل
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/70 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">الأصالة</h4>
                <p className="text-gray-600">
                  نحافظ على التراث العربي في كل تصاميمنا
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/70 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">العملاء</h4>
                <p className="text-gray-600">
                  رضا عملائنا هو أولويتنا الأولى
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white/70 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-0">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">الإبداع</h4>
                <p className="text-gray-600">
                  نبتكر تصاميم جديدة تواكب الموضة العالمية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h2 className="text-4xl font-bold text-gray-800">إنجازاتنا</h2>
              <Star className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="text-4xl font-bold text-purple-600 mb-2">5000+</div>
              <div className="text-lg text-gray-700 font-semibold">عميلة راضية</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-rose-600 mb-2">300+</div>
              <div className="text-lg text-gray-700 font-semibold">تصميم حصري</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-lg text-gray-700 font-semibold">معدل رضا العملاء</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl font-bold text-amber-600 mb-2">5/5</div>
              <div className="text-lg text-gray-700 font-semibold">التقييم</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-lg text-gray-700 font-semibold">خدمة العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Flower className="w-8 h-8 text-yellow-300 animate-pulse" />
              <h2 className="text-4xl font-bold">لماذا تختارين عبايتي؟</h2>
              <Flower className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">تصاميم حصرية</h4>
              <p className="text-white/90 leading-relaxed">
                فريق متخصص من أفضل المصممين لابتكار تصاميم فريدة تناسب ذوقك الرفيع
              </p>
            </div>

            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">جودة عالمية</h4>
              <p className="text-white/90 leading-relaxed">
                خامات مستوردة من أفضل المصانع العالمية مع ضمان الجودة والدوام
              </p>
            </div>

            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">خدمة مميزة</h4>
              <p className="text-white/90 leading-relaxed">
                فريق نسائي متخصص يفهم احتياجاتك ويقدم لك تجربة تسوق استثنائية
              </p>
            </div>
          </div>
        </div>
      </section>

      <AbayaFooter />
    </div>
  );
};

export default AboutUs;