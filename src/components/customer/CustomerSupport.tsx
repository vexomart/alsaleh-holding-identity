/**
 * Customer Support Page
 * Premium support center for customer portal
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  FileQuestion,
  Send,
  CheckCircle,
  BookOpen,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface FAQ {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const faqs: FAQ[] = [
  {
    questionAr: 'كيف يمكنني تتبع طلباتي؟',
    questionEn: 'How can I track my orders?',
    answerAr: 'يمكنك تتبع طلباتك من خلال صفحة "طلباتي" في لوحة التحكم. ستجد حالة كل طلب والتحديثات المتعلقة به.',
    answerEn: 'You can track your orders through the "My Orders" page in the dashboard. You will find the status of each order and related updates.',
  },
  {
    questionAr: 'كيف أشحن محفظتي؟',
    questionEn: 'How do I top up my wallet?',
    answerAr: 'يمكنك شحن محفظتك من صفحة المحفظة بالضغط على زر "شحن" واختيار المبلغ وطريقة الدفع المناسبة.',
    answerEn: 'You can top up your wallet from the Wallet page by clicking the "Top Up" button and selecting the amount and preferred payment method.',
  },
  {
    questionAr: 'كيف أوقع على العقود رقمياً؟',
    questionEn: 'How do I sign contracts digitally?',
    answerAr: 'بعد مراجعة العقد، اضغط على زر "توقيع العقد" واتبع الخطوات. يمكنك استخدام التوقيع الإلكتروني أو رسم توقيعك.',
    answerEn: 'After reviewing the contract, click the "Sign Contract" button and follow the steps. You can use electronic signature or draw your signature.',
  },
  {
    questionAr: 'ما هي طرق الدفع المتاحة؟',
    questionEn: 'What payment methods are available?',
    answerAr: 'نقبل الدفع عبر البطاقات الائتمانية (فيزا، ماستركارد)، مدى، Apple Pay، والتحويل البنكي.',
    answerEn: 'We accept payment via credit cards (Visa, Mastercard), Mada, Apple Pay, and bank transfer.',
  },
];

export function CustomerSupport() {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const isRTL = language === 'ar';
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate ticket submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(
      isRTL 
        ? 'تم إرسال طلب الدعم بنجاح. سنتواصل معك قريباً.' 
        : 'Support request submitted successfully. We will contact you soon.'
    );
    
    setTicketSubject('');
    setTicketMessage('');
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      titleAr: 'اتصل بنا',
      titleEn: 'Call Us',
      valueAr: '920033553',
      valueEn: '920033553',
      descAr: 'متاح من 9 ص - 6 م',
      descEn: 'Available 9 AM - 6 PM',
    },
    {
      icon: Mail,
      titleAr: 'البريد الإلكتروني',
      titleEn: 'Email',
      valueAr: 'support@ash-holding.sa',
      valueEn: 'support@ash-holding.sa',
      descAr: 'الرد خلال 24 ساعة',
      descEn: 'Response within 24 hours',
    },
    {
      icon: MessageSquare,
      titleAr: 'واتساب',
      titleEn: 'WhatsApp',
      valueAr: '+966 50 000 0000',
      valueEn: '+966 50 000 0000',
      descAr: 'دعم فوري',
      descEn: 'Instant Support',
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-2xl bg-primary/10">
          <Headphones className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isRTL ? 'مركز الدعم' : 'Support Center'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
          </p>
        </div>
      </motion.div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.titleEn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {isRTL ? method.titleAr : method.titleEn}
                    </h3>
                    <p className="text-primary font-medium mt-1" dir="ltr">
                      {isRTL ? method.valueAr : method.valueEn}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isRTL ? method.descAr : method.descEn}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Ticket */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                {isRTL ? 'إرسال طلب دعم' : 'Submit Support Request'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'أرسل لنا استفسارك وسنرد عليك في أقرب وقت'
                  : 'Send us your inquiry and we will respond as soon as possible'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">
                  {isRTL ? 'الموضوع' : 'Subject'}
                </Label>
                <Input
                  id="subject"
                  placeholder={isRTL ? 'أدخل موضوع الاستفسار' : 'Enter the subject'}
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">
                  {isRTL ? 'الرسالة' : 'Message'}
                </Label>
                <Textarea
                  id="message"
                  placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  rows={5}
                />
              </div>
              <Button 
                onClick={handleSubmitTicket}
                disabled={isSubmitting}
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {isRTL ? 'إرسال' : 'Send'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إجابات سريعة للأسئلة الأكثر شيوعاً'
                  : 'Quick answers to the most common questions'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={cn(
                    "border rounded-xl overflow-hidden transition-all",
                    expandedFaq === index ? "bg-muted/50" : "hover:bg-muted/30"
                  )}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-start"
                  >
                    <span className="font-medium text-foreground">
                      {isRTL ? faq.questionAr : faq.questionEn}
                    </span>
                    <FileQuestion className={cn(
                      "h-5 w-5 text-muted-foreground shrink-0 transition-transform",
                      expandedFaq === index && "rotate-180"
                    )} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground text-sm">
                        {isRTL ? faq.answerAr : faq.answerEn}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Working Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {isRTL ? 'ساعات العمل' : 'Working Hours'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'الأحد - الخميس: 9:00 ص - 6:00 م | الجمعة - السبت: مغلق'
                    : 'Sunday - Thursday: 9:00 AM - 6:00 PM | Friday - Saturday: Closed'
                  }
                </p>
              </div>
              <Badge variant="outline" className="ms-auto">
                <CheckCircle className="h-3 w-3 me-1 text-emerald-500" />
                {isRTL ? 'متاح الآن' : 'Available Now'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
