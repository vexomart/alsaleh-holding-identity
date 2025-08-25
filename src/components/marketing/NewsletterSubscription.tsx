import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Gift, TrendingUp, Bell } from "lucide-react";
import { trackFBEvent } from "./FacebookPixel";
import { trackEvent } from "./GoogleAnalytics";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { 
          email, 
          name,
          source: 'website_newsletter',
          interests: ['تطوير المواقع', 'التسويق الرقمي', 'التصميم']
        }
      });

      if (error) throw error;

      // تتبع الاشتراك
      trackEvent('newsletter_subscribe', 'conversion', 'main_form');
      trackFBEvent('Subscribe', { content_name: 'Newsletter' });

      toast({
        title: "تم الاشتراك بنجاح! 🎉",
        description: "سنرسل لك آخر الأخبار والعروض الحصرية",
      });

      setEmail("");
      setName("");
    } catch (error) {
      toast({
        title: "خطأ في الاشتراك",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "نصائح تسويقية حصرية",
      description: "استراتيجيات مثبتة لنمو أعمالك"
    },
    {
      icon: Gift,
      title: "عروض وخصومات خاصة",
      description: "اشتراكك يضمن لك الحصول على أفضل العروض"
    },
    {
      icon: Bell,
      title: "آخر الأخبار التقنية",
      description: "كن أول من يعرف بأحدث التطورات"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Mail className="w-4 h-4 mr-2" />
              النشرة الإخبارية
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ابق على اطلاع بآخر أخبار التكنولوجيا والتسويق
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اشترك في نشرتنا الإخبارية للحصول على نصائح قيمة وعروض حصرية
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* نموذج الاشتراك */}
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  اشترك الآن مجاناً
                </CardTitle>
                <CardDescription className="text-center">
                  احصل على محتوى حصري مباشرة في بريدك الإلكتروني
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="اسمك الكامل"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-lg"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {isLoading ? "جاري الاشتراك..." : "اشترك الآن"}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* المزايا */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* إحصائيات */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">5000+</div>
              <div className="text-sm text-muted-foreground">مشترك نشط</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">معدل الرضا</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">2x</div>
              <div className="text-sm text-muted-foreground">زيادة المبيعات</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">دعم مستمر</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;