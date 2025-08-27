import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { 
  MessageCircle, 
  Send, 
  X, 
  User, 
  Minimize2, 
  Maximize2,
  HeadphonesIcon,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  StopCircle,
  FileText,
  Star,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerMessage {
  id: string;
  role: 'user' | 'support';
  content: string;
  timestamp: Date;
  type?: 'text' | 'system';
}

interface CustomerServiceProps {
  className?: string;
}

const CustomerService: React.FC<CustomerServiceProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [serviceRating, setServiceRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState<'info' | 'chat'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [isEndingChat, setIsEndingChat] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize welcome message when chat starts
  useEffect(() => {
    if (step === 'chat' && messages.length === 0) {
      const welcomeMessage: CustomerMessage = {
        id: '1',
        role: 'support',
        content: `مرحباً ${customerInfo.name} 👋

شكراً لتواصلك معنا! 

🕐 **أوقات العمل:** 
الأحد - الخميس: 9:00 ص - 6:00 م

👥 **فريق خدمة العملاء متاح لمساعدتك في:**
• الاستفسارات العامة
• طلبات الخدمات
• الدعم التقني
• المتابعات

📞 **للحالات العاجلة:** 0555812567

كيف يمكنني مساعدتك اليوم؟`,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages([welcomeMessage]);
    }
  }, [step, customerInfo.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, step]);

  const handleInfoSubmit = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "⚠️ معلومات مطلوبة",
        description: "يرجى إدخال جميع المعلومات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      toast({
        title: "⚠️ بريد إلكتروني غير صحيح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    // Phone validation (Saudi phone numbers)
    const phoneRegex = /^(05|9665)[0-9]{8}$/;
    if (!phoneRegex.test(customerInfo.phone.replace(/\s/g, ''))) {
      toast({
        title: "⚠️ رقم جوال غير صحيح",
        description: "يرجى إدخال رقم جوال سعودي صحيح",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send customer info to management
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          message: `طلب جديد لخدمة العملاء من: ${customerInfo.name}`,
          subject: 'طلب خدمة عملاء جديد',
          type: 'customer_service_request'
        }
      });

      if (error) throw error;

      toast({
        title: "✅ تم التسجيل بنجاح",
        description: "تم إرسال معلوماتك للإدارة. يمكنك الآن بدء المحادثة",
      });

      setStep('chat');
    } catch (error: any) {
      console.error('Error submitting customer info:', error);
      toast({
        title: "❌ خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال المعلومات. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isChatEnded) return;

    const userMessage: CustomerMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Check if user wants contact form
    if (inputMessage.toLowerCase().includes('فورم') || inputMessage.toLowerCase().includes('تواصل مباشر')) {
      setTimeout(() => {
        const botResponse: CustomerMessage = {
          id: (Date.now() + 1).toString(),
          role: 'support',
          content: generateBotResponse(inputMessage),
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botResponse]);
        setShowContactForm(true);
      }, 1500);
      return;
    }

    // Simulate bot response
    setTimeout(() => {
      const botResponse: CustomerMessage = {
        id: (Date.now() + 1).toString(),
        role: 'support',
        content: generateBotResponse(inputMessage),
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (input.includes('مرحبا') || input.includes('السلام') || input.includes('هلا') || input.includes('أهلا')) {
      return `أهلاً وسهلاً بك! 🙏
      
كيف يمكنني مساعدتك اليوم؟ يمكنك السؤال عن:
• **خدماتنا المتاحة**
• **الأسعار والعروض**  
• **مدة التنفيذ**
• **أمثلة على أعمالنا**
• **طرق التواصل**`;
    }
    
    // Services inquiry
    if (input.includes('خدمات') || input.includes('خدمة') || input.includes('تقدم') || input.includes('تعمل')) {
      return `نحن شركة آش القابضة ونقدم خدمات شاملة: 🚀

**🖥️ التقنية والتطوير:**
• تصميم وتطوير المواقع الإلكترونية
• تطوير تطبيقات الجوال (iOS & Android)
• أنظمة إدارة المحتوى
• التجارة الإلكترونية
• تطوير الأنظمة المخصصة

**📱 التسويق الرقمي:**
• إدارة وسائل التواصل الاجتماعي
• الحملات الإعلانية المدفوعة
• تحسين محركات البحث (SEO)
• التسويق بالمحتوى

**🎨 التصميم الإبداعي:**
• تصميم الهوية البصرية
• تصميم المطبوعات
• تصميم واجهات المستخدم (UI/UX)

**💼 الاستشارات:**
• الاستشارات التقنية
• استراتيجيات التحول الرقمي
• دراسة الجدوى التقنية

أي من هذه الخدمات تهمك؟ 🤔`;
    }
    
    // Pricing inquiry
    if (input.includes('سعر') || input.includes('تكلفة') || input.includes('أسعار') || input.includes('كم') || input.includes('كلف')) {
      return `أسعارنا تنافسية ومدروسة بعناية: 💰

**🌐 تطوير المواقع:**
• موقع تعريفي: 8,000 - 15,000 ريال
• موقع تجاري: 15,000 - 35,000 ريال
• متجر إلكتروني: 25,000 - 50,000 ريال
• أنظمة مخصصة: 50,000+ ريال

**📱 تطبيقات الجوال:**
• تطبيق بسيط: 25,000 - 40,000 ريال
• تطبيق متوسط: 40,000 - 80,000 ريال
• تطبيق معقد: 80,000+ ريال

**📊 التسويق الرقمي:**
• إدارة السوشيال ميديا: 3,500 - 8,000 ريال/شهر
• الحملات الإعلانية: 5,000+ ريال/شهر
• استراتيجية تسويقية شاملة: 10,000+ ريال/شهر

**🎨 التصميم:**
• هوية بصرية كاملة: 8,000 - 20,000 ريال
• تصميم واجهات: 5,000 - 15,000 ريال

💡 **نقدم عروض خاصة للمشاريع الكبيرة وخصومات للعملاء الجدد!**

هل تريد عرض سعر مخصص لمشروعك؟`;
    }
    
    // Timeline inquiry
    if (input.includes('وقت') || input.includes('مدة') || input.includes('متى') || input.includes('كم يوم') || input.includes('أسبوع')) {
      return `مدة التنفيذ تعتمد على حجم وتعقيد المشروع: ⏰

**⚡ المشاريع السريعة:**
• تصميم لوجو: 3-7 أيام
• موقع تعريفي بسيط: 1-2 أسبوع
• صفحة هبوط: 5-10 أيام

**🚀 المشاريع المتوسطة:**
• موقع شركة كامل: 3-6 أسابيع
• متجر إلكتروني: 4-8 أسابيع
• هوية بصرية كاملة: 2-4 أسابيع

**🎯 المشاريع الكبيرة:**
• تطبيق جوال: 8-16 أسبوع
• نظام إدارة مخصص: 12-24 أسبوع
• منصة متقدمة: 6+ شهور

**📱 التسويق الرقمي:**
• إعداد الحملات: 2-5 أيام
• استراتيجية شاملة: 1-2 أسبوع
• النتائج الأولية: خلال شهر

نعمل بجودة عالية ونلتزم بالمواعيد المحددة! ⭐

هل لديك مشروع محدد وتريد معرفة مدة تنفيذه؟`;
    }
    
    // Contact information
    if (input.includes('تواصل') || input.includes('اتصال') || input.includes('رقم') || input.includes('إيميل') || input.includes('عنوان')) {
      return `يسعدنا التواصل معك بأكثر من طريقة: 📞

**📱 الاتصال المباشر:**
• الواتساب: 0555812567
• الهاتف: 0555812567

**💌 البريد الإلكتروني:**
• الإيميل الرئيسي: info@alialshehriholding.com
• المبيعات: sales@alialshehriholding.com
• الدعم التقني: support@alialshehriholding.com

**🏢 العنوان:**
• المقر الرئيسي: المملكة العربية السعودية
• فرع جدة الرقمي: جدة، المملكة العربية السعودية

**🕐 أوقات العمل:**
• الأحد - الخميس: 9:00 ص - 6:00 م
• نتوفر خارج أوقات العمل للحالات العاجلة

**🌐 تابعنا على:**
• الموقع الإلكتروني: https://alialshehriholding.com
• تويتر: @AshHolding

هل تريد تعبئة فورم للتواصل المباشر؟ 📝
لأي استفسار عاجل، لا تتردد في الاتصال! 📞`;
    }
    
    // Portfolio and examples
    if (input.includes('أعمال') || input.includes('مشاريع') || input.includes('أمثلة') || input.includes('بورتفولي') || input.includes('نماذج')) {
      return `نفتخر بإنجازاتنا ومشاريعنا المتميزة: 🏆

**🌟 مشاريع مميزة:**
• أكثر من 200+ موقع إلكتروني
• 50+ تطبيق جوال
• 100+ هوية بصرية
• 150+ حملة تسويقية ناجحة

**🏢 عملاء مميزون:**
• شركات حكومية وخاصة
• مؤسسات تعليمية
• مستشفيات ومراكز طبية
• متاجر إلكترونية كبرى
• مطاعم وكافيهات

**🥇 إنجازات:**
• أسرع نمو في السوق السعودي 2023
• أفضل شركة تقنية ناشئة
• معدل رضا العملاء: 98%
• وقت استجابة: أقل من 24 ساعة

**📊 احصائياتنا:**
• 8+ سنوات خبرة
• 50+ موظف متخصص
• 500+ عميل راضي
• 24/7 دعم فني

يمكنني إرسال أمثلة محددة حسب اهتمامك؟ 📋`;
    }
    
    // Technical support
    if (input.includes('دعم') || input.includes('مشكلة') || input.includes('خطأ') || input.includes('لا يعمل') || input.includes('عطل')) {
      return `نحن هنا لمساعدتك فوراً! 🛠️

**⚡ الدعم الفني السريع:**
• استجابة فورية خلال دقائق
• حل المشاكل عن بُعد
• تحديث وصيانة دورية
• نسخ احتياطية آمنة

**📞 طرق الحصول على الدعم:**
• اتصال مباشر: 0555812567
• واتساب: رد فوري
• تذكرة دعم: عبر الموقع
• ريموت اكسس: حل سريع

**🔧 أنواع الدعم:**
• دعم تقني مجاني (سنة كاملة)
• صيانة دورية
• تحديثات أمنية
• تدريب على النظام
• استشارات تقنية

**⏰ أوقات الدعم:**
• الطوارئ: 24/7
• الدعم العادي: 9ص - 9م
• نهاية الأسبوع: حالات مختارة

أخبرني عن المشكلة بالتفصيل وسأساعدك فوراً! 🤝`;
    }
    
    // Team and about company
    if (input.includes('فريق') || input.includes('عنكم') || input.includes('الشركة') || input.includes('من أنتم')) {
      return `نحن شركة آش القابضة - رواد التقنية في المملكة! 👑

**🏢 عن الشركة:**
• تأسست عام 2016
• مقرها الرياض مع فروع في جدة
• أكثر من 50 خبير متخصص
• شركة مسجلة رسمياً في وزارة التجارة

**👥 فريق العمل:**
• مطورين خبراء (Front & Backend)
• مصممين محترفين (UI/UX)
• مختصين تسويق رقمي
• مديري مشاريع معتمدين
• فريق دعم فني مخصص

**🎯 رؤيتنا:**
تمكين الشركات السعودية رقمياً لتحقيق رؤية 2030

**💡 مهمتنا:**
تقديم حلول تقنية مبتكرة بجودة عالمية وأسعار محلية

**🏆 قيمنا:**
• الجودة أولاً
• الالتزام بالمواعيد  
• خدمة عملاء متميزة
• الابتكار المستمر
• الشفافية الكاملة

**🌟 لماذا نحن مختلفون؟**
• فهم عميق للسوق السعودي
• حلول مخصصة لكل عميل
• أسعار تنافسية
• دعم مستمر بعد التسليم
• فريق سعودي 100%

نفتخر بكوننا شريكك التقني الموثوق! 🤝`;
    }
    
    // Payment and financial
    if (input.includes('دفع') || input.includes('طريقة الدفع') || input.includes('تقسيط') || input.includes('فاتورة')) {
      return `نوفر طرق دفع مرنة ومناسبة للجميع: 💳

**💰 طرق الدفع المتاحة:**
• حوالة بنكية
• شيكات مصرفية
• كاش عند التسليم
• فيزا وماستركارد
• STC Pay و Apple Pay
• تحويل فوري

**📊 أنظمة السداد:**
• دفعة واحدة (خصم 5%)
• دفعتين (50% مقدم + 50% تسليم)
• ثلاث دفعات (40% + 30% + 30%)
• تقسيط شهري (للمشاريع الكبيرة)

**🧾 الفواتير:**
• فاتورة ضريبية معتمدة
• تفاصيل واضحة لكل خدمة
• ضمان الجودة مكتوب
• شروط واضحة

**🔒 الأمان:**
• تشفير عالي للمدفوعات
• عقود موثقة قانونياً
• ضمان استرداد المبلغ
• تأمين شامل على العمل

**🎁 عروض خاصة:**
• خصم 10% للعملاء الجدد
• خصم 15% للمشاريع الكبيرة
• عروض موسمية مميزة
• برنامج ولاء للعملاء الدائمين

أي طريقة دفع تفضل؟ 🤔`;
    }
    
    // Contact form request
    if (input.includes('فورم') || input.includes('طلب تواصل') || input.includes('اتصال مباشر') || input.includes('تعبئة')) {
      return `سأقوم بعرض طلب التواصل لك الآن! 📝

⏰ **سيتم التواصل معك خلال 24 ساعة من فريق المبيعات المختص**

يمكنك تعبئة البيانات وسنقوم بالرد عليك في أسرع وقت ممكن.

**📋 البيانات المطلوبة:**
• الاسم الكامل
• البريد الإلكتروني  
• رقم الواتساب

انقر على "عرض فورم التواصل" لتعبئة البيانات 👇`;
    }
    
    // General response for unclear queries
    return `شكراً لك على تواصلك معنا! 🙏

**يمكنني مساعدتك في:**
• معرفة خدماتنا بالتفصيل 🛠️
• الحصول على عرض سعر مخصص 💰
• معرفة مدة تنفيذ مشروعك ⏰
• رؤية أمثلة من أعمالنا 🎨
• معلومات التواصل والدعم 📞
• طرق الدفع والتقسيط 💳

**📝 يمكنك أيضاً:**
• طلب استشارة مجانية
• حجز موعد مع خبرائنا
• الحصول على دراسة مشروعك
• تعبئة فورم للتواصل المباشر

لتوضيح استفسارك أكثر، أو اكتب "فورم" لطلب التواصل المباشر، أو "إنهاء المحادثة" لإرسال تقرير كامل عبر الإيميل 📧

كيف يمكنني خدمتك بشكل أفضل؟ 😊`;
  };

  const endChat = async () => {
    setIsEndingChat(true);
    
    try {
      // Generate detailed chat transcript with better formatting
      const chatTranscript = messages.map(msg => {
        const sender = msg.role === 'user' ? customerInfo.name : 'خدمة العملاء - آش القابضة';
        const time = msg.timestamp.toLocaleString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `📅 ${time}\n👤 ${sender}:\n💬 ${msg.content}\n${'━'.repeat(50)}`;
      }).join('\n\n');

      // Create detailed report
      const detailedReport = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #22c55e); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .company-logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .section { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 8px; border-right: 4px solid #3b82f6; }
        .customer-info { background: #e0f2fe; border-right-color: #0284c7; }
        .chat-section { background: #f0fdf4; border-right-color: #22c55e; }
        .rating-section { background: #fef3c7; border-right-color: #f59e0b; }
        .footer { background: #374151; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px; }
        .rating-stars { color: #fbbf24; font-size: 20px; }
        .timestamp { color: #6b7280; font-size: 12px; }
        .message { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; border-right: 3px solid #e5e7eb; }
        .user-message { border-right-color: #3b82f6; }
        .support-message { border-right-color: #22c55e; }
        .summary-box { background: #ede9fe; border: 2px solid #8b5cf6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-logo">🏢 شركة آش القابضة</div>
        <h1>📋 تقرير محادثة خدمة العملاء</h1>
        <p>تقرير مفصل وموثق لجلسة خدمة العملاء</p>
    </div>

    <div class="section customer-info">
        <h2>👤 معلومات العميل</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>الاسم الكامل:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${customerInfo.name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>البريد الإلكتروني:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${customerInfo.email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>رقم الواتساب:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${customerInfo.phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>تاريخ المحادثة:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString('ar-SA')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>رقم المرجع:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">#CS-${Date.now().toString().slice(-8)}</td></tr>
        </table>
    </div>

    <div class="section chat-section">
        <h2>💬 تفاصيل المحادثة</h2>
        <p><strong>عدد الرسائل:</strong> ${messages.length} رسالة</p>
        <p><strong>مدة المحادثة:</strong> ${Math.ceil((Date.now() - messages[0]?.timestamp.getTime()) / 60000)} دقيقة</p>
        
        <div style="margin-top: 20px;">
            ${messages.map(msg => `
                <div class="message ${msg.role === 'user' ? 'user-message' : 'support-message'}">
                    <div class="timestamp">${msg.timestamp.toLocaleString('ar-SA')}</div>
                    <strong>${msg.role === 'user' ? '🧑‍💼 ' + customerInfo.name : '🎧 خدمة العملاء'}:</strong>
                    <div style="margin-top: 5px; white-space: pre-wrap;">${msg.content}</div>
                </div>
            `).join('')}
        </div>
    </div>

    ${serviceRating > 0 ? `
    <div class="section rating-section">
        <h2>⭐ تقييم الخدمة</h2>
        <div class="rating-stars">${'★'.repeat(serviceRating)}${'☆'.repeat(5-serviceRating)}</div>
        <p><strong>التقييم:</strong> ${serviceRating} من 5 نجوم</p>
        ${feedback ? `<p><strong>تعليقات العميل:</strong> ${feedback}</p>` : ''}
    </div>
    ` : ''}

    <div class="summary-box">
        <h3>📊 ملخص الجلسة</h3>
        <ul>
            <li><strong>حالة المحادثة:</strong> مكتملة ✅</li>
            <li><strong>مستوى الخدمة:</strong> ${serviceRating >= 4 ? 'ممتاز' : serviceRating >= 3 ? 'جيد' : 'يحتاج تحسين'}</li>
            <li><strong>نوع الاستفسار:</strong> استفسار عام عن الخدمات</li>
            <li><strong>الإجراء المطلوب:</strong> متابعة مع العميل خلال 24 ساعة</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>شركة آش القابضة</strong> | خدمة عملاء متميزة</p>
        <p>📞 0555812567 | 📧 info@ashholding.com | 🌐 ashholding.com</p>
        <p><small>هذا التقرير تم إنشاؤه تلقائياً بواسطة نظام إدارة خدمة العملاء</small></p>
    </div>
</body>
</html>`;

      // Send detailed report via email
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          message: detailedReport,
          subject: `📋 تقرير محادثة خدمة العملاء - ${customerInfo.name} | رقم المرجع: #CS-${Date.now().toString().slice(-8)}`,
          type: 'detailed_chat_transcript'
        }
      });

      if (error) throw error;

      // Add final message with service rating request
      const finalMessage: CustomerMessage = {
        id: Date.now().toString(),
        role: 'support',
        content: `🎉 **تم إنهاء المحادثة بنجاح!**

📧 **تم إرسال تقرير مفصل ومنسق إلى:**
• إيميلك: ${customerInfo.email}
• فريق الإدارة في آش القابضة

📋 **رقم المرجع:** #CS-${Date.now().toString().slice(-8)}

⭐ **نقدر تقييمك للخدمة أدناه**

📞 **للمتابعة:** 0555812567
💌 **شكراً لثقتك بشركة آش القابضة!**`,
        timestamp: new Date(),
        type: 'system'
      };

      setMessages(prev => [...prev, finalMessage]);
      setIsChatEnded(true);

      toast({
        title: "✅ تم إنهاء المحادثة بنجاح",
        description: "تم إرسال تقرير مفصل ومنسق عبر الإيميل",
      });

    } catch (error: any) {
      console.error('Error ending chat:', error);
      toast({
        title: "❌ خطأ في إنهاء المحادثة",
        description: "حدث خطأ أثناء إرسال التقرير. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsEndingChat(false);
    }
  };

  const handleContactFormSubmit = async () => {
    if (!contactFormData.name || !contactFormData.email || !contactFormData.whatsapp) {
      toast({
        title: "⚠️ معلومات مطلوبة",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: contactFormData.name,
          email: contactFormData.email,
          phone: contactFormData.whatsapp,
          message: `طلب تواصل مباشر من العميل: ${contactFormData.name}\nالبريد الإلكتروني: ${contactFormData.email}\nرقم الواتساب: ${contactFormData.whatsapp}`,
          subject: `طلب تواصل مباشر - ${contactFormData.name}`,
          type: 'direct_contact_request'
        }
      });

      if (error) throw error;

      toast({
        title: "✅ تم الإرسال بنجاح",
        description: "⏰ سيتم التواصل معك خلال 24 ساعة",
      });

      setShowContactForm(false);
      
      // Add confirmation message to chat
      const confirmationMessage: CustomerMessage = {
        id: Date.now().toString(),
        role: 'support',
        content: `✅ تم استلام طلب التواصل المباشر بنجاح!

سيقوم فريق المبيعات بالتواصل معك خلال 30 دقيقة على رقم الواتساب: ${contactFormData.whatsapp}

شكراً لثقتك بنا! 🙏`,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, confirmationMessage]);

    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "❌ خطأ في الإرسال",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const submitRating = async () => {
    if (serviceRating === 0) {
      toast({
        title: "⭐ تقييم مطلوب",
        description: "يرجى إضافة تقييمك للخدمة",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send rating to management
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          message: `تقييم خدمة العملاء:

⭐ التقييم: ${serviceRating} من 5 نجوم
💬 التعليقات: ${feedback || 'لا توجد تعليقات'}
📅 التاريخ: ${new Date().toLocaleString('ar-SA')}

--- معلومات العميل ---
الاسم: ${customerInfo.name}
الإيميل: ${customerInfo.email}
الهاتف: ${customerInfo.phone}`,
          subject: `⭐ تقييم خدمة العملاء - ${serviceRating} نجوم - ${customerInfo.name}`,
          type: 'service_rating'
        }
      });

      if (error) throw error;

      toast({
        title: "🙏 شكراً لتقييمك",
        description: "تم إرسال تقييمك بنجاح وسيساعدنا في تحسين خدماتنا",
      });

    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast({
        title: "❌ خطأ في إرسال التقييم",
        description: "حدث خطأ أثناء إرسال التقييم",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (step === 'info') {
        handleInfoSubmit();
      } else {
        sendMessage();
      }
    }
  };

  const formatMessage = (content: string) => {
    let processedContent = content;
    
    // RTL formatting
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-primary">$1</span>');
    processedContent = processedContent.replace(/^• (.*?)$/gm, '<div class="flex items-start gap-2 my-1 text-right"><span class="text-primary mt-1">•</span><span>$1</span></div>');
    processedContent = processedContent.replace(/^\d+\. (.*?)$/gm, '<div class="flex items-start gap-2 my-1 text-right"><span class="text-primary font-bold">$1.</span><span>$2</span></div>');
    
    // Style emojis
    processedContent = processedContent.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '<span class="text-lg">$1</span>');
    
    processedContent = processedContent.replace(/\n\n/g, '<div class="h-2"></div>');
    processedContent = processedContent.replace(/\n/g, '<br>');
    
    return <div className="text-right" dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-green-500 animate-pulse opacity-75 scale-110"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-110 border-2 border-white/20"
            size="icon"
          >
            <div className="absolute inset-2 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <HeadphonesIcon className="h-7 w-7 text-white drop-shadow-lg" />
            </div>
          </Button>
          
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            خدمة العملاء
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
      <Card className={`w-96 transition-all duration-300 shadow-2xl border-0 ${
        isMinimized ? 'h-16' : 'h-[600px]'
      } bg-white/95 backdrop-blur-lg`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="h-5 w-5" />
                <div className="text-right">
                  <h3 className="font-bold text-sm">خدمة العملاء</h3>
                  <p className="text-xs opacity-90">فريق الدعم المباشر</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">متاح الآن</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setStep('info');
                  setMessages([]);
                  setCustomerInfo({ name: '', email: '', phone: '' });
                  setIsChatEnded(false);
                  setIsEndingChat(false);
                  setShowContactForm(false);
                  setContactFormData({ name: '', email: '', whatsapp: '' });
                }}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px]">
            {step === 'info' ? (
              <div className="p-6 space-y-4 text-right" dir="rtl">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-800">مرحباً بك في خدمة العملاء</h3>
                  <p className="text-sm text-gray-600">يرجى إدخال معلوماتك للبدء</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-right block mb-2">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-right block mb-2">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-right block mb-2">رقم الواتساب *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="text-left"
                      dir="ltr"
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleInfoSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جارٍ الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      بدء المحادثة
                    </div>
                  )}
                </Button>

                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    معلوماتك آمنة ومحمية
                  </p>
                </div>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-4" dir="rtl">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.role === 'user' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {message.role === 'support' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                              <HeadphonesIcon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-gray-100 text-gray-900' 
                            : message.type === 'system'
                              ? 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200'
                              : 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                        } rounded-lg p-3 shadow-sm`}>
                          <div className="text-sm">
                            {formatMessage(message.content)}
                          </div>
                          <div className={`text-xs mt-2 opacity-70 ${
                            message.role === 'user' ? 'text-left' : 'text-right'
                          }`}>
                            {message.timestamp.toLocaleTimeString('ar-SA', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <div className="p-4 border-t bg-gray-50">
                  {showContactForm && !isChatEnded && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        فورم التواصل المباشر
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="contact-name">الاسم الكامل *</Label>
                          <Input
                            id="contact-name"
                            value={contactFormData.name}
                            onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="أدخل اسمك الكامل"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-email">البريد الإلكتروني *</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={contactFormData.email}
                            onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="example@email.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-whatsapp">رقم الواتساب *</Label>
                          <Input
                            id="contact-whatsapp"
                            value={contactFormData.whatsapp}
                            onChange={(e) => setContactFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                            placeholder="05xxxxxxxx"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleContactFormSubmit}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            إرسال الطلب
                          </Button>
                          <Button
                            onClick={() => setShowContactForm(false)}
                            variant="outline"
                            size="sm"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isChatEnded ? (
                    <>
                      <div className="flex gap-2" dir="rtl">
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isChatEnded}
                          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder={isChatEnded ? "المحادثة منتهية" : "اكتب رسالتك هنا..."}
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 text-right"
                          dir="rtl"
                          disabled={isChatEnded}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>متوسط الرد: فوري</span>
                        </div>
                        <div className="flex gap-2">
                          {!showContactForm && (
                          <Button
                            onClick={() => setShowContactForm(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 h-6"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            طلب تواصل
                          </Button>
                          )}
                          <Button
                            onClick={endChat}
                            disabled={isEndingChat || messages.length <= 1}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 h-6"
                          >
                            {isEndingChat ? (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                إنهاء...
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <StopCircle className="h-3 w-3" />
                                إنهاء المحادثة
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                        <FileText className="h-4 w-4" />
                        <span>تم إنهاء المحادثة وإرسال التقرير</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        شكراً لك على استخدام خدمة العملاء
                      </p>
                    </div>
                  )}
                  {isChatEnded && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg" dir="rtl">
                      <h3 className="text-sm font-bold text-gray-800 mb-3 text-center">⭐ قيّم خدمة العملاء</h3>
                      
                      <div className="flex justify-center gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            onClick={() => setServiceRating(star)}
                            className={`p-1 ${serviceRating >= star ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
                          >
                            <Star className="h-6 w-6" fill={serviceRating >= star ? 'currentColor' : 'none'} />
                          </Button>
                        ))}
                      </div>
                      
                      <div className="text-center text-xs text-gray-600 mb-3">
                        {serviceRating === 0 && 'اختر تقييمك'}
                        {serviceRating === 1 && 'ضعيف 😞'}
                        {serviceRating === 2 && 'مقبول 😐'}
                        {serviceRating === 3 && 'جيد 🙂'}
                        {serviceRating === 4 && 'ممتاز 😊'}
                        {serviceRating === 5 && 'رائع جداً 🤩'}
                      </div>

                      <textarea
                        placeholder="أضف تعليقك (اختياري)"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 text-xs border border-gray-300 rounded text-right resize-none"
                        rows={2}
                        dir="rtl"
                      />

                      <Button
                        onClick={submitRating}
                        disabled={serviceRating === 0}
                        className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs py-2"
                      >
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          إرسال التقييم
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CustomerService;