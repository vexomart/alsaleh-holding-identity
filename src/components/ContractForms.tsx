import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Building, Users2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Individual Form Schema
const individualSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف مطلوب"),
  nationalId: z.string().min(10, "رقم الهوية مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  projectDescription: z.string().min(10, "وصف المشروع مطلوب"),
  budget: z.string().min(1, "الميزانية المتوقعة مطلوبة"),
  timeline: z.string().min(1, "الجدول الزمني مطلوب"),
  experience: z.string().optional(),
});

// Institution Form Schema
const institutionSchema = z.object({
  institutionName: z.string().min(2, "اسم المؤسسة مطلوب"),
  contactPerson: z.string().min(2, "اسم الشخص المسؤول مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف مطلوب"),
  institutionType: z.string().min(1, "نوع المؤسسة مطلوب"),
  licenseNumber: z.string().min(5, "رقم الترخيص مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  projectDescription: z.string().min(10, "وصف المشروع مطلوب"),
  budget: z.string().min(1, "الميزانية المتوقعة مطلوبة"),
  timeline: z.string().min(1, "الجدول الزمني مطلوب"),
  teamSize: z.string().optional(),
});

// Company Form Schema
const companySchema = z.object({
  companyName: z.string().min(2, "اسم الشركة مطلوب"),
  contactPerson: z.string().min(2, "اسم الشخص المسؤول مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف مطلوب"),
  companyType: z.string().min(1, "نوع الشركة مطلوب"),
  crNumber: z.string().min(10, "رقم السجل التجاري مطلوب"),
  taxNumber: z.string().min(15, "الرقم الضريبي مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  website: z.string().optional(),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  projectDescription: z.string().min(10, "وصف المشروع مطلوب"),
  budget: z.string().min(1, "الميزانية المتوقعة مطلوبة"),
  timeline: z.string().min(1, "الجدول الزمني مطلوب"),
  teamSize: z.string().optional(),
  previousExperience: z.string().optional(),
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
          title: "تم إرسال النموذج بنجاح",
          description: "سيتم التواصل معك خلال 24 ساعة",
        });
        
        // Reset the appropriate form
        if (formType === 'individual') individualForm.reset();
        else if (formType === 'institution') institutionForm.reset();
        else companyForm.reset();
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    "تطوير المواقع الإلكترونية",
    "تطوير التطبيقات",
    "الحلول السحابية",
    "الذكاء الاصطناعي",
    "الاستشارات التقنية",
    "التسويق الرقمي",
    "التصميم والجرافيك",
    "أخرى"
  ];

  const budgetRanges = [
    "أقل من 10,000 ريال",
    "10,000 - 50,000 ريال",
    "50,000 - 100,000 ريال",
    "100,000 - 500,000 ريال",
    "أكثر من 500,000 ريال"
  ];

  const timelineOptions = [
    "أسبوع واحد",
    "شهر واحد",
    "2-3 أشهر",
    "3-6 أشهر",
    "6-12 شهر",
    "أكثر من سنة"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الأفراد
          </TabsTrigger>
          <TabsTrigger value="institution" className="flex items-center gap-2">
            <Users2 className="w-4 h-4" />
            المؤسسات
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            الشركات
          </TabsTrigger>
        </TabsList>

        {/* Individual Form */}
        <TabsContent value="individual">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User className="w-6 h-6 text-blue-600" />
                نموذج التعاقد للأفراد
              </CardTitle>
              <CardDescription className="text-lg">
                قم بتعبئة النموذج أدناه وسيتم التواصل معك خلال 24 ساعة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...individualForm}>
                <form onSubmit={individualForm.handleSubmit((data) => submitForm(data, 'individual'))} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={individualForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الكامل *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسمك الكامل" {...field} />
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
                          <FormLabel>البريد الإلكتروني *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" {...field} />
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
                          <FormLabel>رقم الهاتف *</FormLabel>
                          <FormControl>
                            <Input placeholder="+966 5X XXX XXXX" {...field} />
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
                          <FormLabel>رقم الهوية الوطنية *</FormLabel>
                          <FormControl>
                            <Input placeholder="1XXXXXXXXX" {...field} />
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
                          <FormLabel>المدينة *</FormLabel>
                          <FormControl>
                            <Input placeholder="الرياض" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={individualForm.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الخدمة المطلوبة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الخدمة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الميزانية المتوقعة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الميزانية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>الجدول الزمني المطلوب *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المدة الزمنية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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

                  <FormField
                    control={individualForm.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المشروع بالتفصيل *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اشرح لنا تفاصيل مشروعك والأهداف المطلوب تحقيقها..."
                            className="min-h-[120px]"
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
                      <FormItem>
                        <FormLabel>خبرتك في المجال (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أخبرنا عن خبرتك السابقة في المجال إن وجدت..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        إرسال طلب التعاقد
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Institution Form */}
        <TabsContent value="institution">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users2 className="w-6 h-6 text-green-600" />
                نموذج التعاقد للمؤسسات
              </CardTitle>
              <CardDescription className="text-lg">
                نموذج خاص للمؤسسات الحكومية وغير الربحية
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...institutionForm}>
                <form onSubmit={institutionForm.handleSubmit((data) => submitForm(data, 'institution'))} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={institutionForm.control}
                      name="institutionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المؤسسة *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم المؤسسة" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={institutionForm.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الشخص المسؤول *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم المسؤول" {...field} />
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
                          <FormLabel>البريد الإلكتروني *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@institution.gov.sa" {...field} />
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
                          <FormLabel>رقم الهاتف *</FormLabel>
                          <FormControl>
                            <Input placeholder="+966 11 XXX XXXX" {...field} />
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
                          <FormLabel>نوع المؤسسة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع المؤسسة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="government">حكومية</SelectItem>
                              <SelectItem value="non-profit">غير ربحية</SelectItem>
                              <SelectItem value="educational">تعليمية</SelectItem>
                              <SelectItem value="healthcare">صحية</SelectItem>
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
                          <FormLabel>رقم الترخيص *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل رقم الترخيص" {...field} />
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
                          <FormLabel>المدينة *</FormLabel>
                          <FormControl>
                            <Input placeholder="الرياض" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={institutionForm.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الخدمة المطلوبة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الخدمة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>الميزانية المتوقعة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الميزانية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>الجدول الزمني المطلوب *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المدة الزمنية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>حجم الفريق المتوقع (اختياري)</FormLabel>
                          <FormControl>
                            <Input placeholder="عدد الأشخاص المطلوبين" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={institutionForm.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المشروع بالتفصيل *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اشرح لنا تفاصيل مشروعك والأهداف المطلوب تحقيقها..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        إرسال طلب التعاقد
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Form */}
        <TabsContent value="company">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Building className="w-6 h-6 text-purple-600" />
                نموذج التعاقد للشركات
              </CardTitle>
              <CardDescription className="text-lg">
                نموذج مخصص للشركات والمؤسسات التجارية
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit((data) => submitForm(data, 'company'))} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الشركة *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم الشركة" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الشخص المسؤول *</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم المسؤول" {...field} />
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
                          <FormLabel>البريد الإلكتروني *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@company.com" {...field} />
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
                          <FormLabel>رقم الهاتف *</FormLabel>
                          <FormControl>
                            <Input placeholder="+966 11 XXX XXXX" {...field} />
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
                          <FormLabel>نوع الشركة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الشركة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="llc">شركة ذات مسؤولية محدودة</SelectItem>
                              <SelectItem value="joint-stock">شركة مساهمة</SelectItem>
                              <SelectItem value="partnership">شركة تضامن</SelectItem>
                              <SelectItem value="sole-proprietorship">مؤسسة فردية</SelectItem>
                              <SelectItem value="branch">فرع شركة أجنبية</SelectItem>
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
                          <FormLabel>رقم السجل التجاري *</FormLabel>
                          <FormControl>
                            <Input placeholder="1010XXXXXX" {...field} />
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
                          <FormLabel>الرقم الضريبي *</FormLabel>
                          <FormControl>
                            <Input placeholder="3XXXXXXXXXX003" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدينة *</FormLabel>
                          <FormControl>
                            <Input placeholder="الرياض" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الموقع الإلكتروني (اختياري)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الخدمة المطلوبة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الخدمة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>الميزانية المتوقعة *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الميزانية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>الجدول الزمني المطلوب *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المدة الزمنية" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
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
                          <FormLabel>حجم الفريق المتوقع (اختياري)</FormLabel>
                          <FormControl>
                            <Input placeholder="عدد الأشخاص المطلوبين" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={companyForm.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المشروع بالتفصيل *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اشرح لنا تفاصيل مشروعك والأهداف المطلوب تحقيقها..."
                            className="min-h-[120px]"
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
                        <FormLabel>الخبرة السابقة في مشاريع مماثلة (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أخبرنا عن خبرتكم السابقة في مشاريع مماثلة..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        إرسال طلب التعاقد
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};