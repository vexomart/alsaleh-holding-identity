import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  TrendingUp,
  Users,
  Heart
} from "lucide-react";
import { trackServiceInterest } from "./GoogleAnalytics";
import { trackFBEvent } from "./FacebookPixel";

const SocialMediaLinks = () => {
  const socialPlatforms = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/tasaheel.sa",
      followers: "15K",
      description: "تابعنا للحصول على أحدث أعمالنا وإلهام التصميم",
      color: "from-pink-500 to-purple-600",
      engagement: "عالي"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/tasaheel",
      followers: "8K",
      description: "اكتشف فرص العمل والتطوير المهني معنا",
      color: "from-blue-600 to-blue-700",
      engagement: "متوسط"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/tasaheel_sa",
      followers: "12K",
      description: "آخر الأخبار والتحديثات التقنية",
      color: "from-sky-400 to-sky-600",
      engagement: "عالي"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@tasaheel",
      followers: "25K",
      description: "شاهد فيديوهات تعليمية وعروض المشاريع",
      color: "from-red-500 to-red-600",
      engagement: "ممتاز"
    }
  ];

  const handleSocialClick = (platform: string, url: string) => {
    trackServiceInterest(`social_${platform.toLowerCase()}`);
    trackFBEvent('Contact', { content_name: `social_${platform}` });
    window.open(url, '_blank');
  };

  const stats = [
    { label: "مجموع المتابعين", value: "60K+", icon: Users },
    { label: "معدل التفاعل", value: "8.5%", icon: TrendingUp },
    { label: "المحتوى الشهري", value: "150+", icon: Heart }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              تواصل معنا
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              تابعنا على وسائل التواصل الاجتماعي
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              كن جزءاً من مجتمعنا النشط واحصل على آخر الأخبار والعروض
            </p>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-2 border-primary/10 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* منصات التواصل */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialPlatforms.map((platform, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20"
                onClick={() => handleSocialClick(platform.name, platform.url)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <platform.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{platform.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {platform.followers} متابع
                    </Badge>
                    <Badge 
                      variant={platform.engagement === 'ممتاز' ? 'default' : platform.engagement === 'عالي' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {platform.engagement}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-sm mb-4">
                    {platform.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    تابع الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* دعوة للعمل */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-4">انضم إلى مجتمعنا المتنامي</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  احصل على محتوى حصري، نصائح قيمة، وكن أول من يعرف بعروضنا الخاصة
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={() => window.open('https://wa.me/966505234567', '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    تواصل مباشر
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => handleSocialClick('Instagram', 'https://instagram.com/tasaheel.sa')}
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    تابع على انستقرام
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaLinks;