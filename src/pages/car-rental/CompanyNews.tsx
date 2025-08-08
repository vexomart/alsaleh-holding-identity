import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/ui/back-button";
import { 
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Car,
  Globe,
  Users,
  Star,
  Sparkles,
  Target,
  Heart,
  MessageCircle,
  ArrowRight,
  Play,
  Download,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";

const CompanyNews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const newsCategories = [
    { id: 'all', label: 'جميع الأخبار', icon: Globe },
    { id: 'updates', label: 'تحديثات الخدمة', icon: Zap },
    { id: 'fleet', label: 'أسطول السيارات', icon: Car },
    { id: 'achievements', label: 'الإنجازات', icon: Award },
    { id: 'partnerships', label: 'الشراكات', icon: Users },
    { id: 'events', label: 'الفعاليات', icon: Calendar }
  ];

  const featuredNews = [
    {
      id: 1,
      title: "إطلاق أسطول جديد من السيارات الكهربائية",
      summary: "نضيف 100 سيارة كهربائية حديثة لأسطولنا لدعم التنقل المستدام",
      content: "في إطار التزامنا بالاستدامة البيئية ودعم رؤية السعودية 2030، أعلنت شركة علي الشهري القابضة عن إضافة 100 سيارة كهربائية حديثة إلى أسطول تأجير السيارات. تتضمن السيارات الجديدة طرازات متنوعة من تسلا، بي إم دبليو i4، ومرسيدس EQC، مما يوفر للعملاء خيارات متطورة وصديقة للبيئة.",
      image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "fleet",
      date: "2024-01-15",
      readTime: "3 دقائق",
      views: 2547,
      featured: true,
      tags: ["سيارات كهربائية", "استدامة", "رؤية 2030"]
    },
    {
      id: 2,
      title: "شراكة استراتيجية مع تطبيق كريم",
      summary: "تعاون جديد لتوفير خدمات تأجير السيارات عبر تطبيق كريم",
      content: "وقعت شركة علي الشهري القابضة اتفاقية شراكة استراتيجية مع تطبيق كريم لتوفير خدمات تأجير السيارات من خلال المنصة الرقمية. ستتيح هذه الشراكة للعملاء حجز السيارات بسهولة عبر التطبيق مع إمكانية الاستلام والإرجاع في نقاط متعددة.",
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "partnerships",
      date: "2024-01-10",
      readTime: "2 دقيقة",
      views: 1832,
      featured: true,
      tags: ["شراكات", "تطبيقات", "تقنية"]
    },
    {
      id: 3,
      title: "تحديث تطبيق الهاتف المحمول",
      summary: "إصدار جديد من التطبيق مع ميزات محسنة وواجهة مستخدم جديدة",
      content: "أطلقنا الإصدار الجديد من تطبيق تأجير السيارات للهواتف الذكية، والذي يتضمن تحسينات جوهرية على تجربة المستخدم، إضافة ميزة التتبع المباشر للسيارة، ونظام دفع محسن، وخدمة دعم العملاء المدمجة.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "updates",
      date: "2024-01-05",
      readTime: "4 دقائق",
      views: 3241,
      featured: false,
      tags: ["تطبيق", "تحديث", "تقنية"]
    }
  ];

  const regularNews = [
    {
      id: 4,
      title: "افتتاح فرع جديد في جدة",
      summary: "توسعة خدماتنا لتشمل منطقة جدة مع مكتب جديد في شارع التحلية",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "updates",
      date: "2024-01-12",
      readTime: "2 دقيقة",
      views: 1456
    },
    {
      id: 5,
      title: "حصول الشركة على شهادة الجودة ISO 9001",
      summary: "اعتماد دولي يؤكد التزامنا بأعلى معايير الجودة في الخدمة",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "achievements",
      date: "2024-01-08",
      readTime: "3 دقائق",
      views: 987
    },
    {
      id: 6,
      title: "برنامج ولاء العملاء الجديد",
      summary: "نقاط مكافآت وخصومات حصرية للعملاء المنتظمين",
      image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "updates",
      date: "2024-01-03",
      readTime: "2 دقيقة",
      views: 2103
    },
    {
      id: 7,
      title: "مشاركة في معرض السيارات الدولي",
      summary: "عرض أحدث السيارات والخدمات في معرض الرياض للسيارات",
      image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "events",
      date: "2023-12-28",
      readTime: "3 دقائق",
      views: 1678
    },
    {
      id: 8,
      title: "تدشين خدمة التوصيل المنزلي",
      summary: "استلام وإرجاع السيارات في منزلك أو مكان عملك",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "updates",
      date: "2023-12-25",
      readTime: "2 دقيقة",
      views: 2856
    },
    {
      id: 9,
      title: "شراكة مع فنادق الرياض الكبرى",
      summary: "خصومات حصرية لنزلاء الفنادق الشريكة",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "partnerships",
      date: "2023-12-22",
      readTime: "2 دقيقة",
      views: 1234
    }
  ];

  const allNews = [...featuredNews, ...regularNews];
  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      updates: 'bg-blue-500',
      fleet: 'bg-green-500',
      achievements: 'bg-yellow-500',
      partnerships: 'bg-purple-500',
      events: 'bg-red-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const openNewsDetail = (news: any) => {
    setSelectedNews(news);
  };

  const closeNewsDetail = () => {
    setSelectedNews(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
              <BackButton fallbackPath="/car-rental-landing" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  أخبار الشركة
                </h1>
                <p className="text-lg text-muted-foreground">
                  آخر التطورات والأخبار من عالم تأجير السيارات
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ابحث في الأخبار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {newsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-muted-foreground hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Featured News */}
          {featuredNews.some(news => 
            filteredNews.includes(news) && 
            (selectedCategory === 'all' || news.category === selectedCategory)
          ) && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                الأخبار المميزة
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews
                  .filter(news => filteredNews.includes(news))
                  .slice(0, 2)
                  .map((news, index) => (
                  <Card key={news.id} className={`group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 ${index === 0 ? 'lg:col-span-2' : ''}`} onClick={() => openNewsDetail(news)}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${index === 0 ? 'h-80' : 'h-64'}`}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(news.category)} text-white`}>
                          {newsCategories.find(cat => cat.id === news.category)?.label}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          مميز
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(news.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {news.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {news.views.toLocaleString()}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {news.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {news.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular News */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-500" />
              جميع الأخبار
            </h2>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews
                .filter(news => filteredNews.includes(news))
                .map((news) => (
                <Card key={news.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50" onClick={() => openNewsDetail(news)}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryColor(news.category)} text-white`}>
                        {newsCategories.find(cat => cat.id === news.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(news.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {news.views}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {news.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {news.readTime}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Subscription */}
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white animate-fade-in">
            <CardContent className="p-8 text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">اشترك في النشرة الإخبارية</h3>
              <p className="text-lg mb-6 opacity-90">
                احصل على آخر الأخبار والتحديثات مباشرة في بريدك الإلكتروني
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="البريد الإلكتروني"
                  className="bg-white/10 border-white/20 text-white placeholder-white/70"
                />
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  اشتراك
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Detail Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
              <div className="relative">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={closeNewsDetail}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ×
                </button>
                <div className="absolute bottom-4 left-4">
                  <Badge className={`${getCategoryColor(selectedNews.category)} text-white`}>
                    {newsCategories.find(cat => cat.id === selectedNews.category)?.label}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedNews.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedNews.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedNews.views.toLocaleString()}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{selectedNews.title}</h1>
                
                <p className="text-lg text-muted-foreground mb-6">{selectedNews.summary}</p>
                
                {selectedNews.content && (
                  <div className="prose prose-lg max-w-none mb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedNews.content}
                    </p>
                  </div>
                )}
                
                {selectedNews.tags && (
                  <div className="flex gap-2 mb-6">
                    {selectedNews.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      مشاركة
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      حفظ
                    </Button>
                  </div>
                  
                  <Button onClick={closeNewsDetail}>
                    إغلاق
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <a href="/car-rental-landing" className="hover:text-blue-400 transition-colors">
                  العودة للرئيسية
                </a>
                <a href="/car-rental/contact" className="hover:text-blue-400 transition-colors">
                  اتصل بنا
                </a>
                <a href="/car-rental/about" className="hover:text-blue-400 transition-colors">
                  من نحن
                </a>
              </div>
              <p className="text-sm text-gray-400">
                © 2024 علي الشهري القابضة. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyNews;