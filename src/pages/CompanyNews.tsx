import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp,
  Eye,
  ArrowLeft,
  ExternalLink,
  Building,
  Award,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const CompanyNews = () => {
  const newsArticles = [
    {
      title: "مجموعة علي صالح الشهري تطلق مبادرة الابتكار الرقمي 2024",
      excerpt: "إطلاق مبادرة جديدة بقيمة 50 مليون ريال لدعم الشركات الناشئة والابتكار التقني في المملكة",
      date: "15 ديسمبر 2024",
      category: "استثمار",
      readTime: "3 دقائق",
      image: "/api/placeholder/400/250",
      featured: true,
      tags: ["استثمار", "ابتكار", "تقنية"]
    },
    {
      title: "توقيع شراكة استراتيجية مع جامعة الملك عبدالعزيز",
      excerpt: "شراكة متميزة في مجال البحث والتطوير وتدريب الكوادر التقنية المتخصصة",
      date: "10 ديسمبر 2024",
      category: "شراكات",
      readTime: "2 دقيقة",
      image: "/api/placeholder/400/250",
      featured: false,
      tags: ["تعليم", "شراكة", "بحث"]
    },
    {
      title: "حصول الشركة على جائزة أفضل شركة قابضة تقنية",
      excerpt: "تكريم مجموعة الشهري في منتدى الاستثمار التقني السعودي كأفضل شركة قابضة",
      date: "5 ديسمبر 2024",
      category: "جوائز",
      readTime: "2 دقيقة",
      image: "/api/placeholder/400/250",
      featured: false,
      tags: ["جوائز", "تكريم", "إنجاز"]
    },
    {
      title: "افتتاح مكتب جديد في الرياض",
      excerpt: "توسع نشاط الشركة بافتتاح مكتب متطور في العاصمة لخدمة عملاء المنطقة الوسطى",
      date: "28 نوفمبر 2024",
      category: "توسع",
      readTime: "1 دقيقة",
      image: "/api/placeholder/400/250",
      featured: false,
      tags: ["توسع", "مكاتب", "نمو"]
    },
    {
      title: "استثمار 30 مليون ريال في الذكاء الاصطناعي",
      excerpt: "الشركة تعلن عن استثمار ضخم في تطوير حلول الذكاء الاصطناعي المحلية",
      date: "20 نوفمبر 2024",
      category: "استثمار",
      readTime: "4 دقائق",
      image: "/api/placeholder/400/250",
      featured: true,
      tags: ["ذكاء اصطناعي", "استثمار", "تطوير"]
    },
    {
      title: "إطلاق برنامج المنح للمطورين الشباب",
      excerpt: "برنامج جديد لدعم المواهب الشابة في مجال البرمجة والتطوير التقني",
      date: "15 نوفمبر 2024",
      category: "مبادرات",
      readTime: "3 دقائق",
      image: "/api/placeholder/400/250",
      featured: false,
      tags: ["تدريب", "منح", "شباب"]
    }
  ];

  const categories = ["جميع الأخبار", "استثمار", "شراكات", "جوائز", "توسع", "مبادرات"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-8">
              <Globe className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-slate-800">أخبار الشركة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              آخر
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> أخبار وتطورات</span>
              <br />الشركة
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              تابع آخر الأخبار والتطورات في مجموعة علي صالح الشهري، من الاستثمارات الجديدة إلى الشراكات الاستراتيجية والجوائز المحققة
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-sm text-slate-600">خبر هذا العام</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">15</div>
                <div className="text-sm text-slate-600">شراكة جديدة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">8</div>
                <div className="text-sm text-slate-600">جائزة محققة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">200M</div>
                <div className="text-sm text-slate-600">ريال استثمارات</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={`rounded-full ${index === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">الأخبار الرئيسية</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              أهم الأخبار والتطورات الحديثة في مجموعة علي صالح الشهري
            </p>
          </div>

          {/* Featured Article */}
          {newsArticles.filter(article => article.featured).slice(0, 1).map((article, index) => (
            <Card key={index} className="mb-12 overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                    عاجل
                  </Badge>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      اقرأ المزيد
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.filter(article => !article.featured).map((article, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-white/90 text-slate-700 text-xs">
                    {article.category}
                  </Badge>
                </div>
                
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                    <Eye className="w-4 h-4 mr-2" />
                    اقرأ التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              اشترك في النشرة الإخبارية
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              احصل على آخر الأخبار والتطورات مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-1 px-6 py-3 rounded-xl border-0 text-slate-900"
              />
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-slate-50 px-8 rounded-xl">
                اشترك الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyNews;