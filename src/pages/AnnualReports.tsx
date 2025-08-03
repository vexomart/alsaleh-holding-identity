import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart,
  ArrowLeft,
  Building,
  Users,
  Globe,
  Target,
  FileText,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

const AnnualReports = () => {
  const annualReports = [
    {
      year: "2024",
      title: "التقرير السنوي 2024 - نمو وابتكار",
      summary: "تقرير شامل يغطي إنجازات المجموعة والنمو المحقق في جميع القطاعات خلال عام 2024",
      status: "قيد الإعداد",
      releaseDate: "مارس 2025",
      highlights: [
        "نمو الإيرادات بنسبة 45%",
        "توسع في 3 أسواق جديدة",
        "استثمار 200 مليون ريال في التقنية",
        "إطلاق 15 منتج جديد"
      ],
      downloadUrl: "#",
      previewAvailable: false,
      fileSize: "تحت الإعداد",
      language: ["العربية", "الإنجليزية"],
      sections: ["رسالة الرئيس التنفيذي", "الأداء المالي", "الاستدامة", "الحوكمة"]
    },
    {
      year: "2023",
      title: "التقرير السنوي 2023 - تحقيق الرؤية",
      summary: "استعراض شامل للإنجازات المحققة والنمو المستمر في مختلف القطاعات والأسواق",
      status: "متاح للتحميل",
      releaseDate: "مارس 2024",
      highlights: [
        "نمو الإيرادات بنسبة 38%",
        "دخول السوق الأوروبية",
        "حصول على 5 جوائز دولية",
        "توظيف 500 موظف جديد"
      ],
      downloadUrl: "#",
      previewAvailable: true,
      fileSize: "12.5 MB",
      language: ["العربية", "الإنجليزية"],
      sections: ["نظرة عامة", "الأداء المالي", "الاستراتيجية", "المسؤولية الاجتماعية"]
    },
    {
      year: "2022",
      title: "التقرير السنوي 2022 - توسع واستدامة",
      summary: "تقرير يسلط الضوء على استراتيجية التوسع والنمو المستدام في الأسواق المحلية والإقليمية",
      status: "متاح للتحميل",
      releaseDate: "أبريل 2023",
      highlights: [
        "نمو الإيرادات بنسبة 32%",
        "افتتاح 6 مكاتب جديدة",
        "استثمار 150 مليون ريال",
        "شراكات مع 20 جهة حكومية"
      ],
      downloadUrl: "#",
      previewAvailable: true,
      fileSize: "10.8 MB",
      language: ["العربية", "الإنجليزية"],
      sections: ["رؤية القيادة", "النتائج المالية", "التوسع الجغرافي", "الابتكار"]
    },
    {
      year: "2021",
      title: "التقرير السنوي 2021 - التحول الرقمي",
      summary: "التقرير يركز على جهود التحول الرقمي والاستثمار في التقنيات الحديثة",
      status: "متاح للتحميل",
      releaseDate: "مايو 2022",
      highlights: [
        "نمو الإيرادات بنسبة 28%",
        "استثمار 100 مليون في التقنية",
        "إطلاق 3 منصات رقمية",
        "تدريب 1000 موظف"
      ],
      downloadUrl: "#",
      previewAvailable: true,
      fileSize: "9.2 MB",
      language: ["العربية", "الإنجليزية"],
      sections: ["التحول الرقمي", "الأداء المالي", "الموارد البشرية", "الشراكات"]
    }
  ];

  const financialHighlights = [
    {
      metric: "إجمالي الإيرادات",
      value: "1.2 مليار ريال",
      growth: "+45%",
      icon: TrendingUp,
      color: "text-emerald-600"
    },
    {
      metric: "صافي الربح",
      value: "320 مليون ريال",
      growth: "+52%",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      metric: "إجمالي الأصول",
      value: "2.8 مليار ريال",
      growth: "+35%",
      icon: Building,
      color: "text-purple-600"
    },
    {
      metric: "عدد الموظفين",
      value: "2,500 موظف",
      growth: "+25%",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const reportCategories = ["جميع التقارير", "مالية", "استدامة", "حوكمة", "استراتيجية"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح للتحميل":
        return "bg-green-500";
      case "قيد الإعداد":
        return "bg-yellow-500";
      case "قريباً":
        return "bg-blue-500";
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
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">التقارير السنوية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              التقارير
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> المالية السنوية</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              تقارير شاملة وشفافة تعكس الأداء المالي والإنجازات المحققة لمجموعة علي صالح الشهري على مر السنين
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                <Download className="w-5 h-5 mr-2" />
                تحميل آخر تقرير
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl">
                <PieChart className="w-5 h-5 mr-2" />
                البيانات المالية
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Highlights */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">أبرز المؤشرات المالية 2023</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نظرة سريعة على أهم المؤشرات المالية والإنجازات المحققة خلال العام الماضي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {financialHighlights.map((highlight, index) => {
              const IconComponent = highlight.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 mb-2">{highlight.metric}</h3>
                    <div className="text-3xl font-bold text-slate-900 mb-2">{highlight.value}</div>
                    <div className={`text-sm font-semibold ${highlight.color} bg-emerald-50 px-3 py-1 rounded-full inline-block`}>
                      {highlight.growth}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Report Categories */}
      <section className="py-8 bg-slate-100/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {reportCategories.map((category, index) => (
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

      {/* Annual Reports */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">التقارير السنوية</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              تقارير مالية شاملة تعكس شفافية الأداء والنمو المستمر للمجموعة
            </p>
          </div>

          <div className="space-y-8">
            {annualReports.map((report, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Report Info */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                          {report.year}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-slate-900">{report.title}</h3>
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {report.releaseDate}
                            </span>
                            {report.fileSize && (
                              <span>{report.fileSize}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={`${report.status === 'متاح للتحميل' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6">{report.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Highlights */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">أبرز الإنجازات:</h4>
                        <ul className="space-y-2">
                          {report.highlights.map((highlight, highlightIndex) => (
                            <li key={highlightIndex} className="text-sm text-slate-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sections */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">أقسام التقرير:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {report.sections.map((section, sectionIndex) => (
                            <Badge key={sectionIndex} variant="outline" className="text-xs justify-center">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">متوفر باللغات:</h4>
                      <div className="flex gap-2">
                        {report.language.map((lang, langIndex) => (
                          <Badge key={langIndex} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gradient-to-br from-slate-50 to-white p-8 flex flex-col justify-center space-y-4">
                    {report.status === "متاح للتحميل" ? (
                      <>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          تحميل التقرير الكامل
                        </Button>
                        {report.previewAvailable && (
                          <Button variant="outline" className="w-full">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            معاينة التقرير
                          </Button>
                        )}
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          الملخص التنفيذي
                        </Button>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-yellow-600" />
                        </div>
                        <p className="text-sm text-slate-600 mb-4">التقرير قيد الإعداد</p>
                        <Button variant="outline" className="w-full" disabled>
                          متوقع في {report.releaseDate}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Relations */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">علاقات المستثمرين</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              معلومات وخدمات مخصصة للمستثمرين الحاليين والمحتملين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">البيانات المالية</h3>
                <p className="text-slate-300 text-sm mb-4">تقارير ربع سنوية ومالية مفصلة</p>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-slate-900">
                  عرض البيانات
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">أداء الأسهم</h3>
                <p className="text-slate-300 text-sm mb-4">معلومات حية عن أداء الأسهم</p>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-slate-900">
                  تتبع الأسهم
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">جدول الأعمال</h3>
                <p className="text-slate-300 text-sm mb-4">اجتماعات وفعاليات المستثمرين</p>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-slate-900">
                  عرض الجدول
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-slate-700 text-white text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">التواصل المباشر</h3>
                <p className="text-slate-300 text-sm mb-4">تواصل مع فريق علاقات المستثمرين</p>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-slate-900">
                  تواصل معنا
                </Button>
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

export default AnnualReports;