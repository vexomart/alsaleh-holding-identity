import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Award, Users, Star, ArrowLeft, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50" dir="rtl">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-rose-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <Link to="/abayati-store" className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-rose-200 to-purple-200 bg-clip-text text-transparent">
              من نحن - متجر عبايتي
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed">
              رحلة من الإبداع والأناقة في عالم العبايات العربية الأصيلة
            </p>
          </div>
        </div>
      </header>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">قصتنا</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              بدأت رحلة "عبايتي" من شغف عميق بالأناقة العربية الأصيلة ورؤية لتطوير عبايات تجمع بين التراث العريق والعصرية الحديثة. 
              منذ انطلاقتنا، كان هدفنا واضحاً: تصميم عبايات تعكس جمال وقوة المرأة العربية، وتمنحها الثقة والأناقة في كل خطوة.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">2018</h3>
                <p className="text-gray-600">تأسيس العلامة التجارية</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">+1500</h3>
                <p className="text-gray-600">عميلة سعيدة</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">4.9/5</h3>
                <p className="text-gray-600">تقييم العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gray-800">رؤيتنا ورسالتنا</h2>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-purple-600 flex items-center gap-3">
                  <Crown className="w-6 h-6" />
                  رؤيتنا
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  أن نكون الخيار الأول للمرأة العربية الباحثة عن الأناقة والجودة في العبايات، 
                  وأن نصبح علامة تجارية عالمية تفخر بالتراث العربي وتطوره بلمسة عصرية.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-rose-600 flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  رسالتنا
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  نسعى لتوفير عبايات عالية الجودة تجمع بين الأصالة والعصرية، مصنوعة بعناية فائقة 
                  من أجود الخامات لتمنح كل امرأة إطلالة مميزة تعكس شخصيتها وتعزز ثقتها بنفسها.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2">
                  <Sparkles className="w-4 h-4 ml-2" />
                  الإبداع والابتكار
                </Badge>
                <Badge className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2">
                  الجودة العالية
                </Badge>
                <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2">
                  خدمة العملاء المميزة
                </Badge>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-rose-100 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Crown className="w-24 h-24 text-purple-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">تراث يلتقي بالعصرية</h3>
                  <p className="text-gray-600">
                    نفخر بدمج عراقة التراث العربي مع أحدث صيحات الموضة العالمية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-rose-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">قيمنا</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              نؤمن بقيم راسخة تحكم عملنا وتوجه رؤيتنا نحو التميز والإبداع
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-xl font-bold mb-3">الجودة</h3>
                <p className="text-sm text-purple-100">
                  نلتزم بأعلى معايير الجودة في كل تفصيل
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-rose-300" />
                <h3 className="text-xl font-bold mb-3">الشغف</h3>
                <p className="text-sm text-purple-100">
                  نعمل بحب وشغف لتحقيق أحلام عملائنا
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-xl font-bold mb-3">التميز</h3>
                <p className="text-sm text-purple-100">
                  نسعى للتميز في كل ما نقدمه من منتجات وخدمات
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h3 className="text-xl font-bold mb-3">العملاء</h3>
                <p className="text-sm text-purple-100">
                  رضا عملائنا هو أولويتنا وهدفنا الأسمى
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">فريق العمل</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              فريق متخصص من المصممين والحرفيين المهرة يعملون بدقة وإتقان لتحقيق رؤيتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">فريق التصميم</h3>
              <p className="text-gray-600 mb-4">
                مصممون مبدعون متخصصون في الأزياء العربية والعالمية
              </p>
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                +10 سنوات خبرة
              </Badge>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-rose-600 to-rose-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">فريق الإنتاج</h3>
              <p className="text-gray-600 mb-4">
                حرفيات ماهرات متخصصات في التطريز والخياطة الراقية
              </p>
              <Badge className="bg-gradient-to-r from-rose-600 to-rose-700 text-white">
                حرفية عالية
              </Badge>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">خدمة العملاء</h3>
              <p className="text-gray-600 mb-4">
                فريق نسائي متخصص يفهم احتياجات العميلة ويساعدها في الاختيار
              </p>
              <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                دعم 24/7
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-rose-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">تواصلي معنا</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            نحن هنا لمساعدتك في اختيار العباءة المثالية. تواصلي معنا عبر الواتساب للاستفسار أو الطلب
          </p>
          <Link 
            to="https://wa.me/966500000000"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            <Phone className="w-6 h-6" />
            تواصلي معنا عبر الواتساب
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;