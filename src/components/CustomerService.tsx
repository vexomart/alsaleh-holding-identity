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
  FileText
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
  const [step, setStep] = useState<'info' | 'chat'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [isEndingChat, setIsEndingChat] = useState(false);
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
    
    if (input.includes('مرحبا') || input.includes('السلام')) {
      return 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟';
    }
    
    if (input.includes('خدمات') || input.includes('خدمة')) {
      return `نحن نقدم خدمات متنوعة:
• تصميم المواقع الإلكترونية
• تطوير التطبيقات
• التسويق الرقمي
• الاستشارات التقنية

أي خدمة تهتم بها تحديداً؟`;
    }
    
    if (input.includes('سعر') || input.includes('تكلفة') || input.includes('أسعار')) {
      return `أسعارنا تختلف حسب نوع المشروع:
• المواقع البسيطة: 5,000 - 15,000 ريال
• التطبيقات: 20,000 - 50,000 ريال
• التسويق الرقمي: 3,000 - 10,000 ريال شهرياً

يمكنني تحديد عرض سعر مخصص لمشروعك؟`;
    }
    
    if (input.includes('وقت') || input.includes('مدة') || input.includes('متى')) {
      return `مدة التنفيذ تعتمد على نوع المشروع:
• المواقع البسيطة: 2-4 أسابيع
• التطبيقات: 6-12 أسبوع
• الحملات التسويقية: تبدأ خلال 48 ساعة

هل لديك مشروع محدد في الذهن؟`;
    }
    
    if (input.includes('تواصل') || input.includes('اتصال') || input.includes('رقم')) {
      return `يمكنك التواصل معنا:
📞 الهاتف: 0555812567
📧 الإيميل: info@company.com
📍 العنوان: الرياض، السعودية
🕐 أوقات العمل: الأحد - الخميس 9ص - 6م`;
    }
    
    return `شكراً لك على استفسارك. فريقنا المتخصص سيقوم بالرد عليك بالتفصيل. 

هل تود معرفة المزيد عن خدماتنا أم لديك استفسار آخر؟

يمكنك أيضاً إنهاء المحادثة وسنرسل لك ملخص كامل عبر الإيميل.`;
  };

  const endChat = async () => {
    setIsEndingChat(true);
    
    try {
      // Generate chat transcript
      const chatTranscript = messages.map(msg => 
        `[${msg.timestamp.toLocaleString('ar-SA')}] ${msg.role === 'user' ? customerInfo.name : 'خدمة العملاء'}: ${msg.content}`
      ).join('\n\n');

      // Send chat transcript via email
      const { error } = await supabase.functions.invoke('contact-form', {
        body: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          message: `تقرير محادثة خدمة العملاء:

=== معلومات العميل ===
الاسم: ${customerInfo.name}
الإيميل: ${customerInfo.email}
الهاتف: ${customerInfo.phone}
تاريخ المحادثة: ${new Date().toLocaleString('ar-SA')}

=== نص المحادثة ===
${chatTranscript}

=== انتهاء التقرير ===`,
          subject: `تقرير محادثة خدمة العملاء - ${customerInfo.name}`,
          type: 'chat_transcript'
        }
      });

      if (error) throw error;

      // Add final message
      const finalMessage: CustomerMessage = {
        id: Date.now().toString(),
        role: 'support',
        content: `✅ تم إنهاء المحادثة بنجاح

📧 **تم إرسال تقرير كامل للمحادثة إلى:**
• إيميلك: ${customerInfo.email}
• إدارة الشركة

📋 **رقم المرجع:** #${Date.now().toString().slice(-6)}

شكراً لك على التواصل معنا! 🙏`,
        timestamp: new Date(),
        type: 'system'
      };

      setMessages(prev => [...prev, finalMessage]);
      setIsChatEnded(true);

      toast({
        title: "✅ تم إنهاء المحادثة",
        description: "تم إرسال تقرير كامل للمحادثة عبر الإيميل",
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