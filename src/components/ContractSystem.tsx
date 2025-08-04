import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Shield, Clock, CheckCircle } from 'lucide-react';

const contractSchema = z.object({
  client_type: z.enum(['individual', 'company', 'institution']),
  client_name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  client_email: z.string().email('البريد الإلكتروني غير صحيح'),
  client_phone: z.string().min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام'),
  client_address: z.string().optional(),
  client_id_number: z.string().optional(),
  commercial_register: z.string().optional(),
  authorized_person: z.string().optional(),
  service_type: z.string().min(1, 'يرجى اختيار نوع الخدمة'),
  service_description: z.string().optional(),
  service_price: z.string().min(1, 'يرجى إدخال سعر الخدمة'),
  contract_duration: z.string().optional(),
  payment_terms: z.string().min(1, 'يرجى اختيار شروط الدفع'),
});

type ContractFormData = z.infer<typeof contractSchema>;

const services = [
  { value: 'ai_solutions', label: 'حلول الذكاء الاصطناعي', price: '50000' },
  { value: 'web_development', label: 'تطوير المواقع الإلكترونية', price: '25000' },
  { value: 'mobile_development', label: 'تطوير التطبيقات المحمولة', price: '40000' },
  { value: 'cloud_solutions', label: 'الحلول السحابية', price: '35000' },
  { value: 'cybersecurity', label: 'الأمن السيبراني', price: '60000' },
  { value: 'data_analytics', label: 'تحليل البيانات', price: '45000' },
  { value: 'iot_solutions', label: 'حلول إنترنت الأشياء', price: '55000' },
  { value: 'consulting', label: 'الاستشارات التقنية', price: '30000' },
];

const saudiCities = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الطائف',
  'بريدة', 'تبوك', 'خميس مشيط', 'حفر الباطن', 'الجبيل', 'نجران', 'ينبع'
];

export default function ContractSystem() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nafathVerified, setNafathVerified] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      client_type: 'individual',
      payment_terms: 'monthly',
    },
  });

  const selectedService = services.find(s => s.value === form.watch('service_type'));

  const handleNafathVerification = async () => {
    // Simulate NAFATH verification process
    setIsSubmitting(true);
    
    try {
      // In real implementation, this would integrate with NAFATH API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setNafathVerified(true);
      toast({
        title: "تم التحقق بنجاح",
        description: "تم التحقق من هويتك عبر نفاذ بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحقق",
        description: "حدث خطأ أثناء التحقق من الهوية",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ContractFormData) => {
    if (!nafathVerified) {
      toast({
        title: "يرجى التحقق من الهوية",
        description: "يجب التحقق من الهوية عبر نفاذ قبل إنشاء العقد",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the edge function to handle the contract creation and email sending
      const response = await fetch('/functions/v1/contract-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          service_price: parseFloat(data.service_price),
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const contract = { contract_number: result.contract_number };

      toast({
        title: "تم إنشاء العقد بنجاح",
        description: `رقم العقد: ${contract.contract_number}`,
      });

      form.reset();
      setNafathVerified(false);
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "خطأ في إنشاء العقد",
        description: "حدث خطأ أثناء إنشاء العقد، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">نظام العقود الموحد</h1>
          <p className="text-xl text-muted-foreground">
            إنشاء وإدارة العقود بسهولة وأمان مع التحقق عبر نفاذ
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">تحقق آمن</h3>
                <p className="text-sm text-muted-foreground">التحقق من الهوية عبر نفاذ</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">عقود احترافية</h3>
                <p className="text-sm text-muted-foreground">عقود قانونية محكمة</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">معالجة سريعة</h3>
                <p className="text-sm text-muted-foreground">إنجاز فوري للعقود</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              إنشاء عقد جديد
            </CardTitle>
            <CardDescription>
              املأ البيانات المطلوبة وسيتم إنشاء العقد فوراً
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* NAFATH Verification */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-2">التحقق من الهوية - نفاذ</h3>
                        <p className="text-sm text-muted-foreground">
                          يرجى التحقق من هويتك عبر نفاذ قبل المتابعة
                        </p>
                      </div>
                      <div className="text-right">
                        {nafathVerified ? (
                          <Badge variant="default" className="bg-green-500 text-white">
                            <CheckCircle className="w-4 h-4 ml-2" />
                            تم التحقق
                          </Badge>
                        ) : (
                          <Button 
                            type="button" 
                            onClick={handleNafathVerification}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'جاري التحقق...' : 'التحقق عبر نفاذ'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="client" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="client">بيانات العميل</TabsTrigger>
                    <TabsTrigger value="service">تفاصيل الخدمة</TabsTrigger>
                    <TabsTrigger value="terms">الشروط والأحكام</TabsTrigger>
                  </TabsList>

                  <TabsContent value="client" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="client_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع العميل</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع العميل" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">فرد</SelectItem>
                              <SelectItem value="company">شركة</SelectItem>
                              <SelectItem value="institution">مؤسسة</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="client_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل الاسم الكامل" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="client_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="client_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input placeholder="05xxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>

                    <FormField
                      control={form.control}
                      name="client_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل العنوان الكامل" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('client_type') === 'individual' && (
                      <FormField
                        control={form.control}
                        name="client_id_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهوية الوطنية</FormLabel>
                            <FormControl>
                              <Input placeholder="1xxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {(form.watch('client_type') === 'company' || form.watch('client_type') === 'institution') && (
                      <>
                        <FormField
                          control={form.control}
                          name="commercial_register"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>رقم السجل التجاري</FormLabel>
                              <FormControl>
                                <Input placeholder="xxxxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="authorized_person"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الشخص المخول</FormLabel>
                              <FormControl>
                                <Input placeholder="اسم الشخص المخول بالتوقيع" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="service" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="service_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع الخدمة</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            const service = services.find(s => s.value === value);
                            if (service) {
                              form.setValue('service_price', service.price);
                            }
                          }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع الخدمة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.value} value={service.value}>
                                  <div className="flex justify-between items-center w-full">
                                    <span>{service.label}</span>
                                    <span className="text-primary font-semibold mr-4">
                                      {Number(service.price).toLocaleString()} ر.س
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وصف الخدمة</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="أدخل تفاصيل الخدمة المطلوبة" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="service_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>سعر الخدمة (ر.س)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                disabled={!!selectedService}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contract_duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>مدة التنفيذ</FormLabel>
                            <FormControl>
                              <Input placeholder="30 يوم" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="terms" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="payment_terms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>شروط الدفع</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر شروط الدفع" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full_advance">دفع كامل مقدماً</SelectItem>
                              <SelectItem value="50_advance">50% مقدم والباقي عند التسليم</SelectItem>
                              <SelectItem value="monthly">دفع شهري</SelectItem>
                              <SelectItem value="quarterly">دفع ربع سنوي</SelectItem>
                              <SelectItem value="on_delivery">دفع عند التسليم</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </TabsContent>
                </Tabs>

                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting || !nafathVerified}
                    className="px-8"
                  >
                    {isSubmitting ? 'جاري إنشاء العقد...' : 'إنشاء العقد'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}