import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Download, 
  ExternalLink,
  ArrowLeft,
  Building,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const PressReleases = () => {
  const pressReleases = [
    {
      title: "مجموعة علي صالح الشهري تعلن عن استثمار بقيمة 100 مليون ريال في الذكاء الاصطناعي",
      summary: "الشركة تكشف عن خططها الطموحة لتطوير حلول الذكاء الاصطناعي المتقدمة وتوطين التقنية في المملكة",
      date: "15 ديسمبر 2024",
      category: "استثمار",
      downloadUrl: "#",
      priority: "عالية",
      media: ["صور", "فيديو"],
      contacts: [
        { name: "أحمد المالكي", role: "مدير الإعلام", phone: "0555123456" },
        { name: "فاطمة السالم", role: "مسؤولة العلاقات العامة", phone: "0555654321" }
      ]
    },
    {
      title: "توقيع اتفاقية شراكة استراتيجية مع وزارة الاتصالات وتقنية المعلومات",
      summary: "شراكة متميزة لدعم التحول الرقمي ومبادرات الذكاء الاصطناعي في إطار رؤية المملكة 2030",
      date: "10 ديسمبر 2024",
      category: "شراكات",
      downloadUrl: "#",
      priority: "عالية",
      media: ["صور"],
      contacts: [
        { name: "سعد العتيبي", role: "مدير الشراكات", phone: "0555789012" }
      ]
    },
    {
      title: "حصول المجموعة على شهادة الآيزو 27001 للأمن السيبراني",
      summary: "تأكيد التزام الشركة بأعلى معايير الأمن والحماية في جميع عملياتها التقنية",
      date: "5 ديسمبر 2024",
      category: "جوائز",
      downloadUrl: "#",
      priority: "متوسطة",
      media: ["صور"],
      contacts: [
        { name: "محمد الحربي", role: "مدير الأمن السيبراني", phone: "0555345678" }
      ]
    },
    {
      title: "افتتاح مركز الابتكار التقني الجديد في الرياض",
      summary: "مركز متطور مخصص للبحث والتطوير وحاضنة للشركات الناشئة التقنية",
      date: "28 نوفمبر 2024",
      category: "توسع",
      downloadUrl: "#",
      priority: "عالية",
      media: ["صور", "فيديو", "جولة افتراضية"],
      contacts: [
        { name: "نورا القحطاني", role: "مديرة مركز الابتكار", phone: "0555901234" }
      ]
    },
    {
      title: "إطلاق صندوق الاستثمار التقني بقيمة 200 مليون ريال",
      summary: "صندوق مخصص لدعم الشركات الناشئة في مجال التقنية والذكاء الاصطناعي",
      date: "20 نوفمبر 2024",
      category: "استثمار",
      downloadUrl: "#",
      priority: "عالية",
      media: ["صور"],
      contacts: [
        { name: "خالد الدوسري", role: "مدير الاستثمار", phone: "0555567890" }
      ]
    },
    {
      title: "المجموعة تحصل على جائزة أفضل شركة قابضة في المملكة",
      summary: "تكريم المجموعة في حفل جوائز الشركات السعودية لعام 2024",
      date: "15 نوفمبر 2024",
      category: "جوائز",
      downloadUrl: "#",
      priority: "متوسطة",
      media: ["صور"],
      contacts: [
        { name: "ريم العنزي", role: "مديرة التسويق", phone: "0555234567" }
      ]
    }
  ];

  const categories = ["جميع البيانات", "استثمار", "شراكات", "جوائز", "توسع"];

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "استثمار":
        return <TrendingUp className="w-4 h-4" />;
      case "شراكات":
        return <Users className="w-4 h-4" />;
      case "جوائز":
        return <Award className="w-4 h-4" />;
      case "توسع":
        return <Building className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "bg-red-500";
      case "متوسطة":
        return "bg-yellow-500";
      case "منخفضة":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-purple-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-500/20 mb-8">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">البيانات الصحفية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              البيانات
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> الصحفية الرسمية</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              احصل على البيانات الصحفية الرسمية ومعلومات التواصل الإعلامي لمجموعة علي صالح الشهري
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                تحميل آخر البيانات
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <Users className="w-5 h-5 mr-2" />
                التواصل الإعلامي
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">25+</div>
                <div className="text-sm text-slate-600">بيان صحفي</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                <div className="text-sm text-slate-600">جهة إعلامية</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">90%</div>
                <div className="text-sm text-slate-600">معدل التغطية</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-sm text-slate-600">دعم إعلامي</div>
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
                className={`rounded-full ${index === 0 ? 'bg-gradient-to-r from-emerald-600 to-blue-600' : ''}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">البيانات الصحفية الحديثة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              البيانات الصحفية الرسمية مع معلومات التواصل وروابط التحميل
            </p>
          </div>

          <div className="space-y-8">
            {pressReleases.map((release, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                        {getIconForCategory(release.category)}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {release.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="w-4 h-4" />
                          {release.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(release.priority)}`}></div>
                      <span className="text-sm text-slate-600">{release.priority}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                    {release.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed text-base">
                    {release.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Media Types */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">المرفقات الإعلامية:</h4>
                      <div className="flex flex-wrap gap-2">
                        {release.media.map((media, mediaIndex) => (
                          <Badge key={mediaIndex} variant="secondary" className="text-xs">
                            {media}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contacts */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">جهات التواصل:</h4>
                      <div className="space-y-2">
                        {release.contacts.map((contact, contactIndex) => (
                          <div key={contactIndex} className="text-sm">
                            <div className="font-medium text-slate-900">{contact.name}</div>
                            <div className="text-slate-600">{contact.role}</div>
                            <div className="text-slate-500">{contact.phone}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل البيان
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        مشاهدة التفاصيل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">التواصل الإعلامي</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              للاستفسارات الإعلامية والحصول على معلومات إضافية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">قسم العلاقات العامة</h3>
                <p className="text-slate-300 mb-4">للاستفسارات الإعلامية العامة</p>
                <p className="text-sm">media@ash.holdings</p>
                <p className="text-sm">0555-100-200</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">المحتوى الإعلامي</h3>
                <p className="text-slate-300 mb-4">للحصول على المواد الإعلامية</p>
                <p className="text-sm">content@ash.holdings</p>
                <p className="text-sm">0555-100-300</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">المقابلات الصحفية</h3>
                <p className="text-slate-300 mb-4">لتنسيق المقابلات مع الإدارة</p>
                <p className="text-sm">interviews@ash.holdings</p>
                <p className="text-sm">0555-100-400</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default PressReleases;