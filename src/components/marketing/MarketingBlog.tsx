import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, Share2, BookOpen, TrendingUp } from "lucide-react";
import { trackServiceInterest } from "./GoogleAnalytics";
import { trackFBEvent } from "./FacebookPixel";

const MarketingBlog = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const categories = ["الكل", "التسويق الرقمي", "تطوير المواقع", "التصميم", "التجارة الإلكترونية", "الذكاء الاصطناعي"];

  const blogPosts = [
    {
      id: 1,
      title: "استراتيجيات التسويق الرقمي الفعالة في 2024",
      excerpt: "اكتشف أحدث الاستراتيجيات التي تحقق نتائج حقيقية في التسويق الرقمي وزيادة المبيعات",
      category: "التسويق الرقمي",
      readTime: "8 دقائق",
      publishDate: "2024-01-15",
      views: 2845,
      author: {
        name: "أحمد محمد",
        avatar: "/placeholder.svg",
        role: "خبير تسويق رقمي"
      },
      image: "/placeholder.svg",
      featured: true
    },
    {
      id: 2,
      title: "كيفية تحسين موقعك للظهور في محركات البحث",
      excerpt: "دليل شامل لتحسين SEO وزيادة ظهور موقعك في نتائج البحث الأولى",
      category: "تطوير المواقع",
      readTime: "12 دقيقة",
      publishDate: "2024-01-10",
      views: 3122,
      author: {
        name: "سارة أحمد",
        avatar: "/placeholder.svg",
        role: "مطورة مواقع"
      },
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: 3,
      title: "أساسيات التصميم الحديث للمواقع الإلكترونية",
      excerpt: "تعرف على أحدث اتجاهات التصميم وكيفية إنشاء واجهات مستخدم جذابة وفعالة",
      category: "التصميم",
      readTime: "6 دقائق",
      publishDate: "2024-01-08",
      views: 1967,
      author: {
        name: "محمد علي",
        avatar: "/placeholder.svg",
        role: "مصمم UI/UX"
      },
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: 4,
      title: "دور الذكاء الاصطناعي في تطوير الأعمال",
      excerpt: "كيف يمكن للذكاء الاصطناعي أن يحول أعمالك ويحقق نمواً استثنائياً",
      category: "الذكاء الاصطناعي",
      readTime: "10 دقائق",
      publishDate: "2024-01-05",
      views: 4231,
      author: {
        name: "د. خالد الأحمد",
        avatar: "/placeholder.svg",
        role: "خبير ذكاء اصطناعي"
      },
      image: "/placeholder.svg",
      featured: true
    }
  ];

  const filteredPosts = selectedCategory === "الكل" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const handlePostClick = (post: any) => {
    trackServiceInterest(`blog_${post.category.replace(/\s+/g, '_')}`);
    trackFBEvent('ViewContent', { 
      content_name: post.title,
      content_type: 'blog_post',
      content_category: post.category
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              مدونة التسويق والتطوير
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              أحدث المقالات والنصائح التقنية
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف أحدث الاتجاهات والاستراتيجيات في عالم التكنولوجيا والتسويق
            </p>
          </div>

          {/* فلاتر الفئات */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* المقالات المميزة */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* المقال الرئيسي */}
            <div className="lg:col-span-2">
              {filteredPosts.filter(post => post.featured)[0] && (
                <Card 
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20"
                  onClick={() => handlePostClick(filteredPosts.filter(post => post.featured)[0])}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={filteredPosts.filter(post => post.featured)[0].image}
                      alt={filteredPosts.filter(post => post.featured)[0].title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-primary to-secondary">
                        مميز
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline">
                        {filteredPosts.filter(post => post.featured)[0].category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(filteredPosts.filter(post => post.featured)[0].publishDate)}
                      </div>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {filteredPosts.filter(post => post.featured)[0].title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {filteredPosts.filter(post => post.featured)[0].excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={filteredPosts.filter(post => post.featured)[0].author.avatar} />
                          <AvatarFallback>{filteredPosts.filter(post => post.featured)[0].author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{filteredPosts.filter(post => post.featured)[0].author.name}</div>
                          <div className="text-xs text-muted-foreground">{filteredPosts.filter(post => post.featured)[0].author.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {filteredPosts.filter(post => post.featured)[0].readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {filteredPosts.filter(post => post.featured)[0].views}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* المقالات الفرعية */}
            <div className="space-y-6">
              {filteredPosts.filter(post => !post.featured).slice(0, 3).map((post) => (
                <Card 
                  key={post.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => handlePostClick(post)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishDate)}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* إحصائيات المدونة */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    إحصائيات المدونة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">مجموع المقالات</span>
                      <span className="font-semibold">150+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">القراء الشهريين</span>
                      <span className="font-semibold">25K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">متوسط وقت القراءة</span>
                      <span className="font-semibold">8 دقائق</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* دعوة للعمل */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-4">هل تريد كتابة مقال ضيف؟</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  شارك خبرتك مع مجتمعنا واكتب مقالاً في مدونتنا للوصول إلى آلاف القراء
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  onClick={() => window.open('https://wa.me/966505234567?text=أريد كتابة مقال ضيف في مدونتكم', '_blank')}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  اقترح مقالاً
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingBlog;