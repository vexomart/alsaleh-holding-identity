import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Building, Users2, Send, Loader2, Shield, CheckCircle, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Individual Form Schema
const individualSchema = z.object({
  fullName: z.string().min(3, "يرجى إدخال الاسم الكامل (3 أحرف على الأقل)"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  phone: z.string().regex(/^(05|5)[0-9]{8}$/, "يرجى إدخال رقم هاتف سعودي صحيح (05xxxxxxxx)"),
  nationalId: z.string().regex(/^[12][0-9]{9}$/, "يرجى إدخال رقم هوية وطنية صحيح (10 أرقام)"),
  city: z.string().min(2, "يرجى تحديد المدينة"),
  serviceType: z.string().min(1, "يرجى اختيار نوع الخدمة المطلوبة"),
  projectDescription: z.string().min(50, "يرجى تقديم وصف مفصل للمشروع (50 حرف على الأقل)"),
  budget: z.string().min(1, "يرجى تحديد الميزانية المتوقعة"),
  timeline: z.string().min(1, "يرجى تحديد الجدول الزمني المطلوب"),
  urgency: z.string().min(1, "يرجى تحديد أولوية المشروع"),
  experience: z.string().optional(),
});

// Institution Form Schema
const institutionSchema = z.object({
  institutionName: z.string().min(3, "يرجى إدخال اسم المؤسسة كاملاً"),
  contactPerson: z.string().min(3, "يرجى إدخال اسم المسؤول كاملاً"),
  position: z.string().min(2, "يرجى تحديد المنصب الوظيفي"),
  email: z.string().email("يرجى إدخال بريد إلكتروني رسمي صحيح"),
  phone: z.string().regex(/^(05|5)[0-9]{8}$/, "يرجى إدخال رقم هاتف صحيح"),
  officePhone: z.string().optional(),
  institutionType: z.string().min(1, "يرجى تحديد نوع المؤسسة"),
  licenseNumber: z.string().min(5, "يرجى إدخال رقم ترخيص المؤسسة"),
  city: z.string().min(2, "يرجى تحديد المدينة"),
  address: z.string().min(10, "يرجى إدخال العنوان مفصلاً"),
  serviceType: z.string().min(1, "يرجى اختيار نوع الخدمة المطلوبة"),
  projectDescription: z.string().min(100, "يرجى تقديم وصف مفصل للمشروع (100 حرف على الأقل)"),
  budget: z.string().min(1, "يرجى تحديد الميزانية المعتمدة"),
  timeline: z.string().min(1, "يرجى تحديد الجدول الزمني المطلوب"),
  teamSize: z.string().optional(),
  decisionMaker: z.string().min(3, "يرجى تحديد صاحب القرار في المؤسسة"),
});

// Company Form Schema
const companySchema = z.object({
  companyName: z.string().min(3, "يرجى إدخال اسم الشركة كما هو مسجل رسمياً"),
  contactPerson: z.string().min(3, "يرجى إدخال اسم المسؤول كاملاً"),
  position: z.string().min(2, "يرجى تحديد المنصب الوظيفي"),
  email: z.string().email("يرجى إدخال البريد الإلكتروني الرسمي للشركة"),
  phone: z.string().regex(/^(05|5)[0-9]{8}$/, "يرجى إدخال رقم هاتف صحيح"),
  officePhone: z.string().optional(),
  companyType: z.string().min(1, "يرجى تحديد نوع الشركة"),
  crNumber: z.string().regex(/^[0-9]{10}$/, "يرجى إدخال رقم السجل التجاري (10 أرقام)"),
  taxNumber: z.string().regex(/^[0-9]{15}$/, "يرجى إدخال الرقم الضريبي (15 رقم)"),
  city: z.string().min(2, "يرجى تحديد مدينة المقر الرئيسي"),
  address: z.string().min(10, "يرجى إدخال عنوان الشركة مفصلاً"),
  website: z.string().optional(),
  companySize: z.string().min(1, "يرجى تحديد حجم الشركة"),
  industry: z.string().min(1, "يرجى تحديد قطاع العمل"),
  serviceType: z.string().min(1, "يرجى اختيار نوع الخدمة المطلوبة"),
  projectDescription: z.string().min(100, "يرجى تقديم وصف تفصيلي للمشروع (100 حرف على الأقل)"),
  budget: z.string().min(1, "يرجى تحديد الميزانية المعتمدة"),
  timeline: z.string().min(1, "يرجى تحديد الجدول الزمني المطلوب"),
  teamSize: z.string().optional(),
  previousExperience: z.string().optional(),
  decisionMaker: z.string().min(3, "يرجى تحديد صاحب القرار في الشركة"),
});

type IndividualFormData = z.infer<typeof individualSchema>;
type InstitutionFormData = z.infer<typeof institutionSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

export const ContractForms = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const individualForm = useForm<IndividualFormData>({
    resolver: zodResolver(individualSchema),
  });

  const institutionForm = useForm<InstitutionFormData>({
    resolver: zodResolver(institutionSchema),
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const submitForm = async (data: any, formType: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://vhgjzmpozrxbifvgwfjw.supabase.co/functions/v1/contract-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZ2p6bXBvenJ4Ymlmdmd3Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNjI3OTksImV4cCI6MjA1MDgzODc5OX0.EtZmWpSSa0nOA1s6WpjZf1PZcxKHNIHIYB8xBpA6qPw'
        },
        body: JSON.stringify({ ...data, formType }),
      });

      if (response.ok) {
        toast({
          title: "✅ تم إرسال الطلب بنجاح",
          description: "سيتم مراجعة طلبكم والتواصل معكم خلال 24 ساعة عمل",
        });
        
        // Reset the appropriate form
        if (formType === 'individual') individualForm.reset();
        else if (formType === 'institution') institutionForm.reset();
        else companyForm.reset();
      } else {
        throw new Error('فشل في إرسال النموذج');
      }
    } catch (error) {
      toast({
        title: "❌ حدث خطأ في الإرسال",
        description: "يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    "تطوير مواقع الويب المتقدمة",
    "تطوير التطبيقات الذكية",
    "حلول الحوسبة السحابية",
    "تطبيقات الذكاء الاصطناعي",
    "الاستشارات التقنية المتخصصة",
    "حلول التسويق الرقمي",
    "خدمات التصميم والهوية البصرية",
    "أنظمة إدارة المحتوى",
    "حلول الأمن السيبراني",
    "التحول الرقمي للمؤسسات",
    "أخرى - يرجى التوضيح في الوصف"
  ];

  const budgetRanges = [
    "أقل من 25,000 ريال سعودي",
    "25,000 - 75,000 ريال سعودي",
    "75,000 - 150,000 ريال سعودي",
    "150,000 - 300,000 ريال سعودي",
    "300,000 - 500,000 ريال سعودي",
    "500,000 - 1,000,000 ريال سعودي",
    "أكثر من 1,000,000 ريال سعودي"
  ];

  const timelineOptions = [
    "عاجل - خلال أسبوعين",
    "خلال شهر واحد",
    "2-3 أشهر",
    "3-6 أشهر",
    "6-12 شهر",
    "أكثر من سنة واحدة",
    "مرونة في التوقيت"
  ];

  const urgencyOptions = [
    "عاجل جداً - أولوية قصوى",
    "عاجل - أولوية عالية",
    "عادي - أولوية متوسطة",
    "غير عاجل - أولوية منخفضة"
  ];

  const saudiCities = [
    "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران",
    "تبوك", "بريدة", "خميس مشيط", "حائل", "الجبيل", "الطائف", "ينبع", "أبها",
    "عرعر", "سكاكا", "نجران", "جازان", "القطيف", "الأحساء", "رفحاء", "وادي الدواسر"
  ];

  const FormHeader = ({ icon: Icon, title, description, color }: any) => (
    <CardHeader className={`${color} border-b`} dir="rtl">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white/20 rounded-full">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl text-white font-bold mb-2">{title}</CardTitle>
          <CardDescription className="text-white/90 text-lg max-w-2xl mx-auto">
            {description}
          </CardDescription>
        </div>
        <div className="flex justify-center gap-2 text-sm text-white/80">
          <span>نموذج رسمي معتمد</span>
          <CheckCircle className="w-4 h-4" />
          <span>بيانات محمية ومشفرة</span>
          <Shield className="w-4 h-4" />
        </div>
      </div>
    </CardHeader>
  );

  return (
    <div className="max-w-7xl mx-auto" dir="rtl" style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}>
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
          <span>نماذج التعاقد الرسمية</span>
          <FileText className="w-4 h-4 mr-2" />
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          اختر النموذج المناسب لك
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          يرجى اختيار النموذج المناسب وتعبئة جميع البيانات المطلوبة بدقة. 
          سيتم مراجعة طلبكم من قبل فريقنا المختص والتواصل معكم خلال 24 ساعة عمل.
        </p>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-16" dir="rtl">
          <TabsTrigger value="individual" className="flex items-center gap-3 h-full text-lg text-right">
            <div className="text-right">
              <div className="font-bold">الأفراد</div>
              <div className="text-xs text-gray-500">للمشاريع الشخصية</div>
            </div>
            <User className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="institution" className="flex items-center gap-3 h-full text-lg text-right">
            <div className="text-right">
              <div className="font-bold">المؤسسات</div>
              <div className="text-xs text-gray-500">الحكومية وغير الربحية</div>
            </div>
            <Users2 className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-3 h-full text-lg text-right">
            <div className="text-right">
              <div className="font-bold">الشركات</div>
              <div className="text-xs text-gray-500">التجارية والخاصة</div>
            </div>
            <Building className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>

        {/* Individual Form */}
        <TabsContent value="individual">
          <Card className="shadow-2xl border-2">
            <FormHeader 
              icon={User}
              title="نموذج طلب التعاقد للأفراد"
              description="مخصص للمشاريع الشخصية والمبادرات الفردية. يرجى تعبئة جميع الحقول المطلوبة بدقة."
              color="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
            />
            <CardContent className="p-8" dir="rtl">
              <Form {...individualForm}>
                <form onSubmit={individualForm.handleSubmit((data) => submitForm(data, 'individual'))} className="space-y-8">
                  
                  {/* Personal Information Section */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>البيانات الشخصية</span>
                      <User className="w-5 h-5 text-blue-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={individualForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الاسم الكامل *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الأول والثاني والعائلة" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="nationalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">رقم الهوية الوطنية *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="1XXXXXXXXX (10 أرقام)" 
                                className="h-12 text-lg text-right" 
                                dir="rtl"
                                maxLength={10}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">البريد الإلكتروني *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="example@email.com" 
                                className="h-12 text-lg text-left"
                                dir="ltr"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">رقم الهاتف *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="05XXXXXXXX" 
                                className="h-12 text-lg text-right" 
                                dir="rtl"
                                maxLength={10}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">المدينة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر المدينة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {saudiCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Project Information Section */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>تفاصيل المشروع</span>
                      <FileText className="w-5 h-5 text-green-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={individualForm.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">نوع الخدمة المطلوبة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر نوع الخدمة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {serviceTypes.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">أولوية المشروع *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر الأولوية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {urgencyOptions.map((urgency) => (
                                  <SelectItem key={urgency} value={urgency}>
                                    {urgency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الميزانية المتوقعة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر الميزانية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {budgetRanges.map((budget) => (
                                  <SelectItem key={budget} value={budget}>
                                    {budget}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الجدول الزمني المطلوب *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر المدة الزمنية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {timelineOptions.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline}>
                                    {timeline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <FormField
                        control={individualForm.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">وصف المشروع بالتفصيل *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="يرجى تقديم وصف شامل ومفصل للمشروع المطلوب، يشمل الأهداف المطلوب تحقيقها، والميزات المطلوبة، والجمهور المستهدف، وأي متطلبات خاصة..."
                                className="min-h-[150px] text-lg leading-relaxed text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={individualForm.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem className="mt-6">
                            <FormLabel className="text-lg font-semibold text-right">خبرتك السابقة في المجال (اختياري)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="إذا كان لديك خبرة سابقة في مشاريع مشابهة أو في المجال التقني، يرجى مشاركتها معنا..."
                                className="min-h-[100px] text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      disabled={isSubmitting}
                      dir="rtl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          إرسال طلب التعاقد الرسمي
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institution Form */}
        <TabsContent value="institution">
          <Card className="shadow-2xl border-2">
            <FormHeader 
              icon={Users2}
              title="نموذج طلب التعاقد للمؤسسات"
              description="مخصص للمؤسسات الحكومية والتعليمية والصحية وغير الربحية. نموذج رسمي معتمد للعقود المؤسسية."
              color="bg-gradient-to-r from-green-600 via-green-700 to-green-800"
            />
            <CardContent className="p-8" dir="rtl">
              <Form {...institutionForm}>
                <form onSubmit={institutionForm.handleSubmit((data) => submitForm(data, 'institution'))} className="space-y-8">
                  
                  {/* Institution Information */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>بيانات المؤسسة</span>
                      <Building className="w-5 h-5 text-green-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={institutionForm.control}
                        name="institutionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">اسم المؤسسة الرسمي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الكامل للمؤسسة كما هو مسجل رسمياً" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="institutionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">نوع المؤسسة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر نوع المؤسسة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                <SelectItem value="government">مؤسسة حكومية</SelectItem>
                                <SelectItem value="non-profit">مؤسسة غير ربحية</SelectItem>
                                <SelectItem value="educational">مؤسسة تعليمية</SelectItem>
                                <SelectItem value="healthcare">مؤسسة صحية</SelectItem>
                                <SelectItem value="religious">مؤسسة دينية</SelectItem>
                                <SelectItem value="cultural">مؤسسة ثقافية</SelectItem>
                                <SelectItem value="charity">مؤسسة خيرية</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">رقم الترخيص *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="رقم ترخيص المؤسسة" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">مدينة المقر الرئيسي *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر المدينة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {saudiCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <FormField
                        control={institutionForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">عنوان المؤسسة مفصلاً *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الحي، الشارع، رقم المبنى، الرمز البريدي" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>بيانات الشخص المسؤول</span>
                      <User className="w-5 h-5 text-blue-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={institutionForm.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">اسم المسؤول كاملاً *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الكامل للشخص المخول بالتعاقد" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">المنصب الوظيفي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="مدير، رئيس قسم، منسق، إلخ" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">البريد الإلكتروني الرسمي *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="example@institution.gov.sa" 
                                className="h-12 text-lg text-left"
                                dir="ltr"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">رقم الهاتف المحمول *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="05XXXXXXXX" 
                                className="h-12 text-lg text-right" 
                                dir="rtl"
                                maxLength={10}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="officePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">هاتف المكتب (اختياري)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="011XXXXXXX" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="decisionMaker"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">صاحب القرار النهائي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الشخص المخول بالموافقة على العقود" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>تفاصيل المشروع المطلوب</span>
                      <FileText className="w-5 h-5 text-purple-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={institutionForm.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">نوع الخدمة المطلوبة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر نوع الخدمة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {serviceTypes.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الميزانية المعتمدة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر الميزانية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {budgetRanges.map((budget) => (
                                  <SelectItem key={budget} value={budget}>
                                    {budget}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الجدول الزمني المطلوب *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر المدة الزمنية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {timelineOptions.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline}>
                                    {timeline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={institutionForm.control}
                        name="teamSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">حجم الفريق المتوقع (اختياري)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="عدد الأشخاص المطلوبين للمشروع" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <FormField
                        control={institutionForm.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">وصف المشروع التفصيلي *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="يرجى تقديم وصف شامل للمشروع المطلوب تنفيذه، يشمل الأهداف الإستراتيجية، النتائج المطلوبة، الجمهور المستفيد، المتطلبات التقنية، ومعايير النجاح..."
                                className="min-h-[150px] text-lg leading-relaxed text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      disabled={isSubmitting}
                      dir="rtl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          إرسال طلب التعاقد الرسمي
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Form */}
        <TabsContent value="company">
          <Card className="shadow-2xl border-2">
            <FormHeader 
              icon={Building}
              title="نموذج طلب التعاقد للشركات"
              description="مخصص للشركات التجارية والمؤسسات الخاصة. نموذج رسمي شامل للعقود التجارية والمشاريع الكبيرة."
              color="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800"
            />
            <CardContent className="p-8" dir="rtl">
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit((data) => submitForm(data, 'company'))} className="space-y-8">
                  
                  {/* Company Information */}
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>بيانات الشركة الرسمية</span>
                      <Building className="w-5 h-5 text-purple-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">اسم الشركة الرسمي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الكامل للشركة كما هو مسجل في السجل التجاري" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">نوع الشركة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر نوع الشركة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                <SelectItem value="llc">شركة ذات مسؤولية محدودة</SelectItem>
                                <SelectItem value="joint-stock">شركة مساهمة مقفلة</SelectItem>
                                <SelectItem value="public-joint-stock">شركة مساهمة عامة</SelectItem>
                                <SelectItem value="partnership">شركة تضامن</SelectItem>
                                <SelectItem value="limited-partnership">شركة توصية بسيطة</SelectItem>
                                <SelectItem value="sole-proprietorship">مؤسسة فردية</SelectItem>
                                <SelectItem value="branch">فرع شركة أجنبية</SelectItem>
                                <SelectItem value="non-profit-company">شركة غير ربحية</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="crNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">رقم السجل التجاري *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="1010XXXXXX (10 أرقام)" 
                                className="h-12 text-lg text-right" 
                                dir="rtl"
                                maxLength={10}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الرقم الضريبي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="3XXXXXXXXXX003 (15 رقم)" 
                                className="h-12 text-lg text-right" 
                                dir="rtl"
                                maxLength={15}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">قطاع العمل *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر قطاع العمل" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                <SelectItem value="technology">التكنولوجيا والمعلومات</SelectItem>
                                <SelectItem value="finance">الخدمات المالية والمصرفية</SelectItem>
                                <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
                                <SelectItem value="education">التعليم والتدريب</SelectItem>
                                <SelectItem value="retail">التجارة والتجزئة</SelectItem>
                                <SelectItem value="manufacturing">التصنيع والإنتاج</SelectItem>
                                <SelectItem value="construction">الإنشاءات والمقاولات</SelectItem>
                                <SelectItem value="energy">الطاقة والبترول</SelectItem>
                                <SelectItem value="telecommunications">الاتصالات</SelectItem>
                                <SelectItem value="transportation">النقل واللوجستيات</SelectItem>
                                <SelectItem value="real-estate">العقارات والاستثمار</SelectItem>
                                <SelectItem value="hospitality">الضيافة والسياحة</SelectItem>
                                <SelectItem value="agriculture">الزراعة والثروة الحيوانية</SelectItem>
                                <SelectItem value="media">الإعلام والنشر</SelectItem>
                                <SelectItem value="consulting">الاستشارات المهنية</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">حجم الشركة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر حجم الشركة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                <SelectItem value="startup">ناشئة (1-10 موظفين)</SelectItem>
                                <SelectItem value="small">صغيرة (11-50 موظف)</SelectItem>
                                <SelectItem value="medium">متوسطة (51-200 موظف)</SelectItem>
                                <SelectItem value="large">كبيرة (201-1000 موظف)</SelectItem>
                                <SelectItem value="enterprise">مؤسسية (أكثر من 1000 موظف)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">مدينة المقر الرئيسي *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر المدينة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {saudiCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الموقع الإلكتروني (اختياري)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://www.company.com" 
                                className="h-12 text-lg text-left"
                                dir="ltr"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <FormField
                        control={companyForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">عنوان الشركة مفصلاً *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الحي، الشارع، رقم المبنى، الدور، المكتب، الرمز البريدي" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>بيانات الشخص المسؤول</span>
                      <User className="w-5 h-5 text-blue-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">اسم المسؤول كاملاً *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الكامل للشخص المخول بالتعاقد" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">المنصب الوظيفي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="المدير العام، مدير التقنية، مدير المشاريع، إلخ" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">البريد الإلكتروني الرسمي *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="example@company.com" 
                                className="h-12 text-lg text-left"
                                dir="ltr"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">رقم الهاتف المحمول *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="05XXXXXXXX" 
                                className="h-12 text-lg text-right" 
                                dir="rtl"
                                maxLength={10}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="officePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">هاتف المكتب (اختياري)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="011XXXXXXX" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="decisionMaker"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">صاحب القرار النهائي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الشخص المخول بالموافقة على العقود والميزانيات" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-right">
                      <span>تفاصيل المشروع التجاري</span>
                      <FileText className="w-5 h-5 text-orange-600" />
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">نوع الخدمة المطلوبة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر نوع الخدمة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {serviceTypes.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الميزانية المعتمدة *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر الميزانية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {budgetRanges.map((budget) => (
                                  <SelectItem key={budget} value={budget}>
                                    {budget}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الجدول الزمني المطلوب *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg text-right" dir="rtl">
                                  <SelectValue placeholder="اختر المدة الزمنية" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                {timelineOptions.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline}>
                                    {timeline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="teamSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">حجم الفريق المطلوب (اختياري)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="عدد الأشخاص أو الفرق المطلوبة للمشروع" 
                                className="h-12 text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6 space-y-6">
                      <FormField
                        control={companyForm.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">وصف المشروع التفصيلي *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="يرجى تقديم وصف شامل ومفصل للمشروع التجاري، يشمل الأهداف الإستراتيجية، النتائج المطلوبة، الجمهور المستهدف، المتطلبات التقنية والوظيفية، معايير النجاح، والتكامل مع الأنظمة الحالية..."
                                className="min-h-[150px] text-lg leading-relaxed text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={companyForm.control}
                        name="previousExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold text-right">الخبرة السابقة في مشاريع مماثلة (اختياري)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="إذا كان لديكم خبرة سابقة في مشاريع تقنية مشابهة، يرجى مشاركة التفاصيل معنا لفهم احتياجاتكم بشكل أفضل..."
                                className="min-h-[100px] text-lg text-right"
                                dir="rtl"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      disabled={isSubmitting}
                      dir="rtl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          إرسال طلب التعاقد الرسمي
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Information */}
      <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">معلومات مهمة</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">استجابة سريعة</h4>
            <p className="text-gray-600">سيتم التواصل معكم خلال 24 ساعة عمل من استلام الطلب</p>
          </Card>
          
          <Card className="text-center p-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">حماية البيانات</h4>
            <p className="text-gray-600">جميع البيانات محمية ومشفرة وفقاً لأعلى معايير الأمان</p>
          </Card>
          
          <Card className="text-center p-6">
            <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">استشارة مجانية</h4>
            <p className="text-gray-600">احصل على استشارة مجانية لمناقشة تفاصيل مشروعك</p>
          </Card>
        </div>
      </div>
    </div>
  );
};