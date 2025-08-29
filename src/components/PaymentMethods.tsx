import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CreditCard, Building2, Smartphone } from 'lucide-react';

interface PaymentMethodsProps {
  onMethodSelect?: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [rajhiForm, setRajhiForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    receipt: null as File | null
  });

  const [tamaraForm, setTamaraForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    amount: ''
  });

  const [stcForm, setStcForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    transactionId: ''
  });

  const [visaForm, setVisaForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: ''
  });

  const paymentMethods = [
    {
      id: 'alrajhi',
      name: 'البنك الراجحي',
      icon: <Building2 className="h-8 w-8" />,
      color: 'from-blue-600 to-blue-700',
      description: 'تحويل بنكي مع إرفاق الإيصال',
      type: 'bank'
    },
    {
      id: 'tamara',
      name: 'تمارا',
      icon: <CreditCard className="h-8 w-8" />,
      color: 'from-green-600 to-green-700',
      description: 'الدفع الآجل والتقسيط',
      type: 'financing'
    },
    {
      id: 'stc',
      name: 'STC Pay',
      icon: <Smartphone className="h-8 w-8" />,
      color: 'from-purple-600 to-purple-700',
      description: 'الدفع عبر محفظة STC',
      type: 'wallet'
    },
    {
      id: 'visa',
      name: 'Visa/MasterCard',
      icon: <CreditCard className="h-8 w-8" />,
      color: 'from-indigo-600 to-indigo-700',
      description: 'بطاقة ائتمانية أو مدينة',
      type: 'card'
    }
  ];

  const handleSubmitRajhi = async () => {
    if (!rajhiForm.name || !rajhiForm.email || !rajhiForm.phone || !rajhiForm.amount || !rajhiForm.receipt) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول وإرفاق الإيصال",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('bank-transfer-request', {
        body: {
          bank: 'alrajhi',
          ...rajhiForm,
          receiptAttached: true
        }
      });

      if (error) throw error;

      toast({
        title: "تم الإرسال بنجاح",
        description: "تم إرسال طلبك وسيتم التواصل معك قريباً"
      });
      
      setSelectedMethod(null);
      setRajhiForm({ name: '', email: '', phone: '', amount: '', receipt: null });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTamara = async () => {
    if (!tamaraForm.name || !tamaraForm.email || !tamaraForm.phone || !tamaraForm.whatsapp || !tamaraForm.amount) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('tamara-payment-request', {
        body: tamaraForm
      });

      if (error) throw error;

      toast({
        title: "تم الإرسال بنجاح",
        description: "تم إرسال طلبك وسيتم التواصل معك قريباً"
      });
      
      setSelectedMethod(null);
      setTamaraForm({ name: '', email: '', phone: '', whatsapp: '', amount: '' });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSTC = async () => {
    if (!stcForm.name || !stcForm.email || !stcForm.phone || !stcForm.amount || !stcForm.transactionId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('stc-pay-request', {
        body: stcForm
      });

      if (error) throw error;

      toast({
        title: "تم الإرسال بنجاح",
        description: "تم إرسال طلبك وسيتم التواصل معك قريباً"
      });
      
      setSelectedMethod(null);
      setStcForm({ name: '', email: '', phone: '', amount: '', transactionId: '' });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitVisa = async () => {
    if (!visaForm.name || !visaForm.email || !visaForm.phone || !visaForm.amount) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('visa-payment-request', {
        body: visaForm
      });

      if (error) throw error;

      toast({
        title: "تم الإرسال بنجاح",
        description: "تم إرسال طلبك وسيتم التواصل معك قريباً"
      });
      
      setSelectedMethod(null);
      setVisaForm({ name: '', email: '', phone: '', amount: '' });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800">طرق الدفع المتاحة</CardTitle>
          <p className="text-slate-600">اختر طريقة الدفع المناسبة لك</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <Dialog key={method.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200">
                    <CardContent className="p-6">
                      <div className={`w-full h-24 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                        {method.icon}
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-slate-800 mb-1">{method.name}</h3>
                        <p className="text-sm text-slate-600">{method.description}</p>
                        <Button 
                          className="mt-3 w-full"
                          variant="outline"
                          size="sm"
                        >
                          اختيار
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-center flex items-center justify-center gap-2">
                      {method.icon}
                      طلب دفع عبر {method.name}
                    </DialogTitle>
                  </DialogHeader>

                  {method.id === 'alrajhi' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rajhi-name">الاسم الكامل</Label>
                        <Input
                          id="rajhi-name"
                          value={rajhiForm.name}
                          onChange={(e) => setRajhiForm({...rajhiForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-email">البريد الإلكتروني</Label>
                        <Input
                          id="rajhi-email"
                          type="email"
                          value={rajhiForm.email}
                          onChange={(e) => setRajhiForm({...rajhiForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-phone">رقم الجوال</Label>
                        <Input
                          id="rajhi-phone"
                          value={rajhiForm.phone}
                          onChange={(e) => setRajhiForm({...rajhiForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="rajhi-amount"
                          type="number"
                          value={rajhiForm.amount}
                          onChange={(e) => setRajhiForm({...rajhiForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rajhi-receipt">إيصال التحويل</Label>
                        <Input
                          id="rajhi-receipt"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setRajhiForm({...rajhiForm, receipt: e.target.files?.[0] || null})}
                        />
                        <p className="text-xs text-slate-500 mt-1">يرجى إرفاق إيصال التحويل البنكي</p>
                      </div>
                      <Button 
                        onClick={handleSubmitRajhi} 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  )}

                  {method.id === 'tamara' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tamara-name">الاسم الكامل</Label>
                        <Input
                          id="tamara-name"
                          value={tamaraForm.name}
                          onChange={(e) => setTamaraForm({...tamaraForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-email">البريد الإلكتروني</Label>
                        <Input
                          id="tamara-email"
                          type="email"
                          value={tamaraForm.email}
                          onChange={(e) => setTamaraForm({...tamaraForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-phone">رقم الجوال</Label>
                        <Input
                          id="tamara-phone"
                          value={tamaraForm.phone}
                          onChange={(e) => setTamaraForm({...tamaraForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-whatsapp">رقم الواتساب</Label>
                        <Input
                          id="tamara-whatsapp"
                          value={tamaraForm.whatsapp}
                          onChange={(e) => setTamaraForm({...tamaraForm, whatsapp: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tamara-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="tamara-amount"
                          type="number"
                          value={tamaraForm.amount}
                          onChange={(e) => setTamaraForm({...tamaraForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitTamara} 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  )}

                  {method.id === 'stc' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stc-name">الاسم الكامل</Label>
                        <Input
                          id="stc-name"
                          value={stcForm.name}
                          onChange={(e) => setStcForm({...stcForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-email">البريد الإلكتروني</Label>
                        <Input
                          id="stc-email"
                          type="email"
                          value={stcForm.email}
                          onChange={(e) => setStcForm({...stcForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-phone">رقم الجوال</Label>
                        <Input
                          id="stc-phone"
                          value={stcForm.phone}
                          onChange={(e) => setStcForm({...stcForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="stc-amount"
                          type="number"
                          value={stcForm.amount}
                          onChange={(e) => setStcForm({...stcForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stc-transaction">رقم المعاملة</Label>
                        <Input
                          id="stc-transaction"
                          value={stcForm.transactionId}
                          onChange={(e) => setStcForm({...stcForm, transactionId: e.target.value})}
                          placeholder="رقم المعاملة من STC Pay"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitSTC} 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  )}

                  {method.id === 'visa' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="visa-name">الاسم الكامل</Label>
                        <Input
                          id="visa-name"
                          value={visaForm.name}
                          onChange={(e) => setVisaForm({...visaForm, name: e.target.value})}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-email">البريد الإلكتروني</Label>
                        <Input
                          id="visa-email"
                          type="email"
                          value={visaForm.email}
                          onChange={(e) => setVisaForm({...visaForm, email: e.target.value})}
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-phone">رقم الجوال</Label>
                        <Input
                          id="visa-phone"
                          value={visaForm.phone}
                          onChange={(e) => setVisaForm({...visaForm, phone: e.target.value})}
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visa-amount">المبلغ (ريال سعودي)</Label>
                        <Input
                          id="visa-amount"
                          type="number"
                          value={visaForm.amount}
                          onChange={(e) => setVisaForm({...visaForm, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <Button 
                        onClick={handleSubmitVisa} 
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethods;