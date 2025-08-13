import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot,
  Settings, 
  Workflow, 
  Zap, 
  Clock, 
  Target, 
  ArrowRight, 
  Check, 
  Star,
  Download,
  Play,
  Cpu,
  Database,
  Cloud,
  FileText,
  MessageSquare,
  Calendar,
  Mail,
  BarChart3,
  Users,
  Shield,
  Briefcase,
  Layers,
  ChevronRight,
  RefreshCw,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const AutomationSystem = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [automatedTasks, setAutomatedTasks] = useState([
    { id: 1, name: "معالجة البيانات", status: "active", lastRun: "منذ 5 دقائق", efficiency: 95 },
    { id: 2, name: "إرسال التقارير", status: "active", lastRun: "منذ ساعة", efficiency: 88 },
    { id: 3, name: "تحديث المخزون", status: "paused", lastRun: "منذ 3 ساعات", efficiency: 92 }
  ]);

  const automationTemplates = [
    {
      name: "أتمتة إدارة العملاء",
      description: "أتمتة عمليات إدارة بيانات العملاء والمتابعة",
      icon: Users,
      steps: ["استقبال البيانات", "التحقق والتصنيف", "إرسال الترحيب", "جدولة المتابعة"],
      category: "CRM"
    },
    {
      name: "أتمتة الفواتير",
      description: "أتمتة إنشاء وإرسال الفواتير والمتابعة",
      icon: FileText,
      steps: ["إنشاء الفاتورة", "إرسال للعميل", "تذكير بالدفع", "تحديث السجلات"],
      category: "Finance"
    },
    {
      name: "أتمتة التسويق",
      description: "أتمتة الحملات التسويقية والتواصل",
      icon: BarChart3,
      steps: ["تحليل الجمهور", "إنشاء المحتوى", "النشر المجدول", "تحليل النتائج"],
      category: "Marketing"
    },
    {
      name: "أتمتة الدعم التقني",
      description: "أتمتة استقبال ومعالجة طلبات الدعم",
      icon: MessageSquare,
      steps: ["استقبال الطلب", "التصنيف الذكي", "التوجيه للمختص", "متابعة الحل"],
      category: "Support"
    }
  ];

  const triggers = [
    { value: "email", label: "وصول بريد إلكتروني", icon: Mail },
    { value: "time", label: "وقت محدد", icon: Clock },
    { value: "webhook", label: "Webhook", icon: Database },
    { value: "file", label: "رفع ملف", icon: FileText }
  ];

  const actions = [
    { value: "send-email", label: "إرسال بريد إلكتروني", icon: Mail },
    { value: "create-task", label: "إنشاء مهمة", icon: Briefcase },
    { value: "update-database", label: "تحديث قاعدة البيانات", icon: Database },
    { value: "generate-report", label: "إنشاء تقرير", icon: BarChart3 }
  ];

  const handleCreateWorkflow = async () => {
    if (!workflowName || !selectedTrigger || !selectedAction) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setProcessing(true);
    setProgress(0);

    // محاكاة عملية إنشاء سير العمل
    const steps = [
      "تحليل المتطلبات...",
      "إنشاء سير العمل...",
      "اختبار الاتصالات...",
      "تفعيل التشغيل التلقائي...",
      "تم الإنشاء بنجاح!"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress((i + 1) * 20);
      toast.info(steps[i]);
    }

    // إضافة سير العمل الجديد
    const newWorkflow = {
      id: automatedTasks.length + 1,
      name: workflowName,
      status: "active",
      lastRun: "الآن",
      efficiency: 100
    };

    setAutomatedTasks([...automatedTasks, newWorkflow]);
    setProcessing(false);
    setProgress(100);
    
    toast.success("تم إنشاء سير العمل بنجاح!");
    
    // إعادة تعيين النموذج
    setWorkflowName('');
    setWorkflowDescription('');
    setSelectedTrigger('');
    setSelectedAction('');
  };

  const handleEmailAutomation = async () => {
    if (!emailSubject || !emailContent) {
      toast.error("يرجى ملء موضوع ومحتوى البريد الإلكتروني");
      return;
    }

    setProcessing(true);
    
    // محاكاة إرسال البريد الإلكتروني التلقائي
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("تم إعداد نظام الإرسال التلقائي للبريد الإلكتروني!");
    setProcessing(false);
    setEmailSubject('');
    setEmailContent('');
  };

  const handleTemplateSelect = (template: any) => {
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    toast.info(`تم تحديد قالب: ${template.name}`);
  };

  const toggleTaskStatus = (taskId: number) => {
    setAutomatedTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === 'active' ? 'paused' : 'active' }
          : task
      )
    );
    toast.success("تم تحديث حالة المهمة");
  };

  return (
    <>
      <SEO 
        title="نظام الأتمتة المتكامل - شركة علي صالح الشهري القابضة"
        description="نظام أتمتة ذكي متكامل لإدارة العمليات التجارية وتحسين الكفاءة باستخدام أحدث تقنيات الذكاء الاصطناعي"
      />

      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" dir="rtl">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Bot className="w-20 h-20 mx-auto text-indigo-600" />
              </motion.div>
              
              <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none px-6 py-2 text-lg">
                ⚡ نظام أتمتة متكامل
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  أتمت عملياتك
                </span>
                <br />
                <span className="text-slate-800">بذكاء وسهولة</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                نظام أتمتة ذكي ومتكامل يمكنك من إنشاء وإدارة العمليات التلقائية بسهولة
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm border border-slate-200/50">
                  <Target className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">85% تحسن في الكفاءة</h3>
                  <p className="text-slate-600">زيادة الإنتاجية وتقليل الوقت المهدر</p>
                </div>
                
                <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm border border-slate-200/50">
                  <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">+5,000 ساعة توفير شهرياً</h3>
                  <p className="text-slate-600">توفير الوقت للمهام الأهم</p>
                </div>
                
                <div className="bg-white/70 rounded-2xl p-6 backdrop-blur-sm border border-slate-200/50">
                  <Settings className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">+10,000 مهمة مؤتمتة</h3>
                  <p className="text-slate-600">تشغيل آلاف العمليات تلقائياً</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Automation System */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto" dir="rtl">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="workflow" className="flex items-center gap-2 text-right">
                  <Workflow className="w-4 h-4" />
                  إنشاء سير عمل
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2 text-right">
                  <Layers className="w-4 h-4" />
                  القوالب الجاهزة
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-2 text-right">
                  <Mail className="w-4 h-4" />
                  أتمتة الإيميل
                </TabsTrigger>
                <TabsTrigger value="monitor" className="flex items-center gap-2 text-right">
                  <BarChart3 className="w-4 h-4" />
                  مراقبة المهام
                </TabsTrigger>
              </TabsList>

              {/* إنشاء سير العمل */}
              <TabsContent value="workflow" className="space-y-6">
                <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm" dir="rtl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 text-right">
                      <Workflow className="w-6 h-6 text-indigo-600" />
                      إنشاء سير عمل مخصص
                    </CardTitle>
                    <CardDescription className="text-right">
                      أنشئ سير عمل تلقائي مخصص لاحتياجاتك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="workflow-name" className="text-right block">اسم سير العمل</Label>
                          <Input 
                            id="workflow-name"
                            placeholder="مثال: أتمتة معالجة الطلبات"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="workflow-description" className="text-right block">الوصف</Label>
                          <Textarea 
                            id="workflow-description"
                            placeholder="وصف مختصر لما يقوم به سير العمل"
                            value={workflowDescription}
                            onChange={(e) => setWorkflowDescription(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-right block">المحفز (متى يبدأ)</Label>
                          <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المحفز" />
                            </SelectTrigger>
                            <SelectContent>
                              {triggers.map((trigger) => (
                                <SelectItem key={trigger.value} value={trigger.value}>
                                  <div className="flex items-center gap-2">
                                    <trigger.icon className="w-4 h-4" />
                                    {trigger.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-right block">الإجراء (ماذا يحدث)</Label>
                          <Select value={selectedAction} onValueChange={setSelectedAction}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الإجراء" />
                            </SelectTrigger>
                            <SelectContent>
                              {actions.map((action) => (
                                <SelectItem key={action.value} value={action.value}>
                                  <div className="flex items-center gap-2">
                                    <action.icon className="w-4 h-4" />
                                    {action.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {processing && (
                      <div className="space-y-4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-center text-slate-600">جاري إنشاء سير العمل...</p>
                      </div>
                    )}

                    <Button 
                      onClick={handleCreateWorkflow}
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      size="lg"
                    >
                      {processing ? (
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-5 h-5 mr-2" />
                      )}
                      إنشاء سير العمل
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* القوالب الجاهزة */}
              <TabsContent value="templates" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                  {automationTemplates.map((template, index) => (
                    <Card 
                      key={index}
                      className="bg-white/70 border-slate-200/50 backdrop-blur-sm hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <template.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                              <CardTitle className="text-lg text-slate-900 text-right">{template.name}</CardTitle>
                              <Badge variant="secondary">{template.category}</Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4 text-right">
                          {template.description}
                        </CardDescription>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-slate-900 text-sm text-right">خطوات الأتمتة:</h4>
                          {template.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {stepIndex + 1}
                              </div>
                              <span className="text-slate-600">{step}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* أتمتة الإيميل */}
              <TabsContent value="automation" className="space-y-6">
                <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm" dir="rtl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 text-right">
                      <Mail className="w-6 h-6 text-indigo-600" />
                      أتمتة البريد الإلكتروني
                    </CardTitle>
                    <CardDescription className="text-right">
                      إعداد نظام إرسال تلقائي للبريد الإلكتروني
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-subject" className="text-right block">موضوع البريد الإلكتروني</Label>
                        <Input 
                          id="email-subject"
                          placeholder="مثال: ترحيب بالعملاء الجدد"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email-content" className="text-right block">محتوى البريد الإلكتروني</Label>
                        <Textarea 
                          id="email-content"
                          placeholder="أكتب محتوى البريد الإلكتروني هنا..."
                          className="min-h-[150px]"
                          value={emailContent}
                          onChange={(e) => setEmailContent(e.target.value)}
                        />
                      </div>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        سيتم إرسال هذا البريد تلقائياً عند تفعيل المحفز المحدد. تأكد من المحتوى قبل التفعيل.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleEmailAutomation}
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      size="lg"
                    >
                      {processing ? (
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5 mr-2" />
                      )}
                      إعداد الإرسال التلقائي
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* مراقبة المهام */}
              <TabsContent value="monitor" className="space-y-6">
                <Card className="bg-white/70 border-slate-200/50 backdrop-blur-sm" dir="rtl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 text-right">
                      <BarChart3 className="w-6 h-6 text-indigo-600" />
                      مراقبة المهام المؤتمتة
                    </CardTitle>
                    <CardDescription className="text-right">
                      عرض ومراقبة جميع المهام التلقائية النشطة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {automatedTasks.map((task) => (
                        <div 
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              task.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                            }`} />
                            <div>
                              <h4 className="font-semibold text-slate-900">{task.name}</h4>
                              <p className="text-sm text-slate-600">آخر تشغيل: {task.lastRun}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-900">{task.efficiency}%</div>
                              <div className="text-xs text-slate-600">كفاءة</div>
                            </div>
                            
                            <Button
                              variant={task.status === 'active' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => toggleTaskStatus(task.id)}
                            >
                              {task.status === 'active' ? 'إيقاف مؤقت' : 'تفعيل'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="container mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                جاهز لبدء الأتمتة؟
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                ابدأ في أتمتة عملياتك اليوم واحصل على كفاءة استثنائية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-slate-100 border-0"
                  onClick={() => setActiveTab('workflow')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  ابدأ إنشاء سير العمل
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 border-2"
                  onClick={() => window.location.href = '/contact'}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  اطلب استشارة
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AutomationSystem;