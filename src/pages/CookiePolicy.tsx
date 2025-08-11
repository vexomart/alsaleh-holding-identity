import SEO from "@/components/SEO";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie as CookieIcon, ShieldCheck, Lock, Settings, Globe } from "lucide-react";

function CookieAnimation() {
  return (
    <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full corporate-gradient shadow-glow social-float">
      <div className="absolute inset-0 rounded-full bg-white/5" />
      <div className="absolute inset-3 rounded-full bg-white/10 border border-white/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary/20 flex items-center justify-center backdrop-blur-sm border border-secondary/40 animate-fade-in">
          <CookieIcon className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
        </div>
      </div>
      {/* crumbs */}
      <span className="absolute w-3 h-3 rounded-full bg-secondary left-6 top-6 opacity-80 animate-fade-in" style={{ animationDelay: "150ms" }} />
      <span className="absolute w-2.5 h-2.5 rounded-full bg-secondary/90 right-8 top-10 animate-fade-in" style={{ animationDelay: "300ms" }} />
      <span className="absolute w-2 h-2 rounded-full bg-secondary/70 left-10 bottom-8 animate-fade-in" style={{ animationDelay: "450ms" }} />
    </div>
  );
}

export default function CookiePolicy() {
  const title = "سياسة ملفات تعريف الارتباط | علي الشهري القابضة";
  const description = "تعرّف على كيفية استخدامنا لملفات تعريف الارتباط لتحسين تجربتك، وأنواع الكوكيز وخيارات التحكم بها.";

  return (
    <PageLayout>
      <SEO
        title={title}
        description={description}
        canonicalUrl={typeof window !== "undefined" ? `${window.location.origin}/cookie-policy` : "/cookie-policy"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "سياسة ملفات تعريف الارتباط",
          inLanguage: "ar"
        }}
      />

      <header className="relative overflow-hidden">
        <div className="container-fluid py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 animate-fade-in">
              <Badge variant="secondary" className="text-sm">سياسات الشركة</Badge>
              <h1 className="text-responsive-3xl font-extrabold tracking-tight text-gradient-primary">
                سياسة ملفات تعريف الارتباط
              </h1>
              <p className="text-muted-foreground text-responsive-base max-w-prose">
                نستخدم ملفات تعريف الارتباط لتمكين الوظائف الأساسية للموقع، وتحسين الأداء، وتخصيص التجربة. يمكنك إدارة تفضيلاتك في أي وقت.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge>الأساسية</Badge>
                <Badge variant="outline">التحليلية</Badge>
                <Badge variant="outline">الوظيفية</Badge>
                <Badge variant="outline">التسويقية</Badge>
              </div>
            </div>
            <div className="flex justify-center md:justify-end animate-fade-in">
              <CookieAnimation />
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container-fluid spacing-responsive">
          <div className="grid-responsive-1-2">
            <Card className="shadow-corporate">
              <CardHeader>
                <CardTitle className="text-responsive-xl flex items-center gap-2">
                  <ShieldCheck className="icon-responsive text-accent" />
                  نظرة عامة
                </CardTitle>
                <CardDescription>
                  نوضح في هذه الصفحة أنواع ملفات تعريف الارتباط المستخدمة وأغراضها وكيفية إدارتها.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-responsive-base text-foreground/90">
                - الكوكيز الأساسية: مطلوبة لتشغيل الموقع وضمان الأمان.
                <br />- الكوكيز التحليلية: تساعدنا على فهم استخدامك للموقع لتحسين الأداء.
                <br />- الكوكيز الوظيفية: تتذكر تفضيلاتك مثل اللغة والمنطقة.
                <br />- الكوكيز التسويقية: تُستخدم لعرض محتوى وعروض ذات صلة باهتماماتك.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-responsive-xl flex items-center gap-2">
                  <Settings className="icon-responsive text-primary" />
                  إدارة التفضيلات
                </CardTitle>
                <CardDescription>
                  يمكنك ضبط إعدادات ملفات تعريف الارتباط من متصفحك أو عبر لافتة الموافقة إن وُجدت.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-responsive-base text-foreground/90">
                - يمكنك تعطيل الكوكيز غير الضرورية من إعدادات المتصفح.
                <br />- قد يؤثر رفض بعض الأنواع على بعض الخصائص غير الأساسية.
                <br />- نحترم اختياراتك ونحدّث تفضيلاتك تلقائيًا عند تغييرها.
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-responsive-xl flex items-center gap-2">
                <Lock className="icon-responsive text-secondary" />
                الأمان والخصوصية
              </CardTitle>
              <CardDescription>
                يتم التعامل مع أي بيانات مرتبطة بملفات تعريف الارتباط وفق سياسات الخصوصية وأفضل الممارسات الأمنية.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-responsive-base text-foreground/90">
              - لا نستخدم الكوكيز لتخزين بيانات حساسة مباشرة.
              <br />- نُطبّق ضوابط وصول وحدود زمنية مناسبة لعمر الكوكيز.
              <br />- قد نستخدم خدمات تحليل موثوقة مع إخفاء الهوية عندما يكون ذلك ممكنًا.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-responsive-xl flex items-center gap-2">
                <Globe className="icon-responsive text-muted-foreground" />
                التغييرات على هذه السياسة
              </CardTitle>
              <CardDescription>
                قد نقوم بتحديث هذه السياسة من وقت لآخر. تاريخ آخر تحديث يظهر هنا.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-responsive-base text-foreground/90">
              آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
            </CardContent>
          </Card>
        </section>
      </main>
    </PageLayout>
  );
}
