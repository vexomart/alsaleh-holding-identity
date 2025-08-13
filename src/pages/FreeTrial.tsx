import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Image as ImageIcon, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';

const FreeTrial = () => {
  const [currentDemo, setCurrentDemo] = useState('chatbot');
  const [demoResults, setDemoResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoSubmit = async (demoType: string, inputData: any) => {
    setIsLoading(true);
    
    // محاكاة معالجة الذكاء الاصطناعي
    setTimeout(() => {
      const mockResults = {
        chatbot: {
          response: "أهلاً بك! يمكنني مساعدتك في أي استفسار. هذا مثال على قدرات الذكاء الاصطناعي المتقدمة لدينا في فهم ومعالجة اللغة العربية.",
          confidence: 98
        },
        textAnalysis: {
          sentiment: "إيجابي",
          keywords: ["ذكاء اصطناعي", "تطوير", "تقنية"],
          summary: "النص يتحدث عن تقنيات الذكاء الاصطناعي والتطوير التقني",
          score: 85
        },
        imageAnalysis: {
          objects: ["شخص", "مكتب", "كمبيوتر"],
          confidence: 92,
          description: "صورة لشخص يعمل في مكتب مع جهاز كمبيوتر"
        },
        dataAnalysis: {
          trend: "ارتفاع",
          prediction: "نمو بنسبة 25% خلال الأشهر القادمة",
          insights: ["ذروة في الساعات المسائية", "انخفاض نهاية الأسبوع"]
        }
      };
      
      setDemoResults({
        ...demoResults,
        [demoType]: mockResults[demoType as keyof typeof mockResults]
      });
      setIsLoading(false);
      
      toast({
        title: "تم تحليل البيانات بنجاح",
        description: "تمت معالجة طلبك باستخدام نماذج الذكاء الاصطناعي المتقدمة",
      });
    }, 2000);
  };

  const demoSections = [
    {
      id: 'chatbot',
      title: 'المساعد الذكي',
      description: 'جرب محادثة مع مساعدنا الذكي',
      icon: Bot,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'textAnalysis',
      title: 'تحليل النصوص',
      description: 'احصل على تحليل متقدم للنصوص',
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'imageAnalysis',
      title: 'تحليل الصور',
      description: 'رفع وتحليل الصور بالذكاء الاصطناعي',
      icon: ImageIcon,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'dataAnalysis',
      title: 'تحليل البيانات',
      description: 'احصل على رؤى من بياناتك',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <>
      <SEO 
        title="تجربة مجانية - خدمات الذكاء الاصطناعي"
        description="جرب خدمات الذكاء الاصطناعي المتقدمة مجاناً. تحليل النصوص، معالجة الصور، المساعد الذكي والمزيد."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <Sparkles className="h-4 w-4 ml-2" />
                تجربة مجانية
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                جرب قوة الذكاء الاصطناعي
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                اكتشف إمكانيات لا محدودة مع حلولنا المتقدمة في الذكاء الاصطناعي. 
                جرب الآن مجاناً واستكشف المستقبل اليوم.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Demo Tabs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs value={currentDemo} onValueChange={setCurrentDemo} className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                {demoSections.map((section) => (
                  <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Chatbot Demo */}
              <TabsContent value="chatbot">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      المساعد الذكي
                    </CardTitle>
                    <CardDescription>
                      اطرح أي سؤال وسيجيب عليك مساعدنا الذكي بتقنية الذكاء الاصطناعي المتقدمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Input
                        placeholder="اكتب سؤالك هنا..."
                        className="text-right"
                        id="chatInput"
                      />
                      <Button 
                        onClick={() => {
                          const input = document.getElementById('chatInput') as HTMLInputElement;
                          handleDemoSubmit('chatbot', input.value);
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        {isLoading ? "جاري المعالجة..." : "أرسل السؤال"}
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                    
                    {demoResults.chatbot && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start gap-3">
                          <Bot className="h-6 w-6 text-blue-500 mt-1" />
                          <div className="flex-1">
                            <p className="text-foreground">{demoResults.chatbot.response}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="secondary">دقة {demoResults.chatbot.confidence}%</Badge>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Text Analysis Demo */}
              <TabsContent value="textAnalysis">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      تحليل النصوص
                    </CardTitle>
                    <CardDescription>
                      احصل على تحليل شامل لأي نص - المشاعر، الكلمات المفتاحية، والملخص
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="الصق النص المراد تحليله هنا..."
                        className="min-h-32 text-right"
                        id="textInput"
                      />
                      <Button 
                        onClick={() => {
                          const input = document.getElementById('textInput') as HTMLTextAreaElement;
                          handleDemoSubmit('textAnalysis', input.value);
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        {isLoading ? "جاري التحليل..." : "تحليل النص"}
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                    
                    {demoResults.textAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800 space-y-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">تحليل المشاعر</h4>
                            <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                              {demoResults.textAnalysis.sentiment}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">النقاط</h4>
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                              {demoResults.textAnalysis.score}/100
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">الكلمات المفتاحية</h4>
                          <div className="flex flex-wrap gap-2">
                            {demoResults.textAnalysis.keywords.map((keyword: string, index: number) => (
                              <Badge key={index} variant="secondary">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">الملخص</h4>
                          <p className="text-muted-foreground">{demoResults.textAnalysis.summary}</p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Image Analysis Demo */}
              <TabsContent value="imageAnalysis">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                      تحليل الصور
                    </CardTitle>
                    <CardDescription>
                      ارفع صورة واحصل على تحليل تفصيلي لمحتوياتها باستخدام الذكاء الاصطناعي
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">اسحب الصورة هنا أو انقر للرفع</p>
                      <Button 
                        onClick={() => handleDemoSubmit('imageAnalysis', 'demo-image')}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                      >
                        {isLoading ? "جاري التحليل..." : "تجربة مع صورة نموذجية"}
                      </Button>
                    </div>
                    
                    {demoResults.imageAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4"
                      >
                        <div>
                          <h4 className="font-semibold mb-2">الكائنات المكتشفة</h4>
                          <div className="flex flex-wrap gap-2">
                            {demoResults.imageAnalysis.objects.map((object: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-purple-100 dark:bg-purple-900">
                                {object}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">الوصف</h4>
                          <p className="text-muted-foreground">{demoResults.imageAnalysis.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">دقة {demoResults.imageAnalysis.confidence}%</Badge>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Analysis Demo */}
              <TabsContent value="dataAnalysis">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      تحليل البيانات
                    </CardTitle>
                    <CardDescription>
                      احصل على رؤى وتنبؤات من بياناتك باستخدام نماذج التعلم الآلي المتقدمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="رفع ملف البيانات" type="file" />
                      <Button 
                        onClick={() => handleDemoSubmit('dataAnalysis', 'demo-data')}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        {isLoading ? "جاري التحليل..." : "تحليل البيانات النموذجية"}
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                    
                    {demoResults.dataAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg border border-orange-200 dark:border-orange-800 space-y-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">الاتجاه العام</h4>
                            <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900">
                              {demoResults.dataAnalysis.trend}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">التنبؤ</h4>
                            <p className="text-sm text-muted-foreground">{demoResults.dataAnalysis.prediction}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">الرؤى المستخلصة</h4>
                          <ul className="space-y-1">
                            {demoResults.dataAnalysis.insights.map((insight: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                جاهز لبدء رحلتك مع الذكاء الاصطناعي؟
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                تواصل معنا الآن للحصول على حلول مخصصة وخطة مناسبة لاحتياجاتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  onClick={() => window.location.href = '/book-consultation'}
                >
                  احجز استشارة مجانية
                  <ArrowRight className="h-5 w-5 mr-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = '/contact'}
                >
                  تواصل معنا
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FreeTrial;