import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  MessageCircle, 
  Send, 
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  Star,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle2,
  ArrowUp,
  RefreshCw,
  Download,
  Copy,
  Settings,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Paperclip,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
  isTyping?: boolean;
}

interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  rating?: number;
  feedback?: string;
}

interface SmartChatBotProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  theme?: 'light' | 'dark' | 'auto';
  showWelcomeMessage?: boolean;
  showRating?: boolean;
  autoOpen?: boolean;
}

const SmartChatBot: React.FC<SmartChatBotProps> = ({ 
  className = '',
  position = 'bottom-right',
  theme = 'auto',
  showWelcomeMessage = true,
  showRating = true,
  autoOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({});
  const [currentStep, setCurrentStep] = useState<'welcome' | 'chatting' | 'rating' | 'ended'>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate unique conversation ID
  useEffect(() => {
    if (!conversationId) {
      setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  // Welcome message
  useEffect(() => {
    if (showWelcomeMessage && messages.length === 0 && isOpen) {
      const welcomeMessage: Message = {
        id: '1',
        text: `مرحباً بك في شركة علي صالح الشهري القابضة! 👋

🌟 **أنا مساعدك الذكي المتطور**
يسعدني أن أساعدك في:

🎨 **خدمات التصميم والهوية التجارية**
💼 **الاستشارات التجارية والإدارية** 
🚀 **التقنيات المتقدمة والذكاء الاصطناعي**
💻 **تطوير البرمجيات والتطبيقات**
📱 **التسويق الرقمي والإعلان**

كيف يمكنني مساعدتك اليوم؟ 😊`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setCurrentStep('chatting');
    }
  }, [showWelcomeMessage, isOpen, messages.length]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: inputValue,
          conversationHistory: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          conversationId: conversationId
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى.',
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add typing delay for more natural feel
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
        
        // Play notification sound
        if (soundEnabled) {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {}); // Ignore audio errors
        }
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);

      toast.error("تعذر إرسال الرسالة. تحقق من اتصالك بالإنترنت.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endConversation = async () => {
    try {
      setIsLoading(true);

      // Prepare conversation transcript
      const transcript = messages.map(msg => ({
        sender: msg.sender === 'user' ? 'العميل' : 'خدمة العملاء',
        message: msg.text,
        timestamp: msg.timestamp.toLocaleString('ar-SA')
      }));

      // Generate conversation summary
      const conversationSummary = {
        conversationId: conversationId,
        customerInfo: customerInfo,
        totalMessages: messages.length,
        duration: Math.round((Date.now() - Date.parse(messages[0]?.timestamp.toString() || '')) / 60000),
        transcript: transcript,
        rating: customerInfo.rating || 5,
        feedback: customerInfo.feedback || '',
        endTime: new Date().toLocaleString('ar-SA')
      };

      // Send detailed email report using contact-form function
      const { error: emailError } = await supabase.functions.invoke('contact-form', {
        body: {
          name: customerInfo.name || 'عميل جديد',
          email: customerInfo.email || 'غير محدد',
          phone: customerInfo.phone || 'غير محدد', 
          message: generateHTMLReport(conversationSummary),
          subject: `📋 تقرير محادثة خدمة العملاء - ${customerInfo.name || 'عميل جديد'} | رقم المرجع: #CS-${conversationId.slice(-8)}`,
          type: 'detailed_chat_transcript'
        }
      });

      if (emailError) {
        throw emailError;
      }

      setCurrentStep('ended');
      
      const confirmationMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `✅ **تم إرسال تقرير المحادثة بنجاح!**

شكراً لتواصلك معنا. تم إرسال تقرير مفصل عن محادثتنا إلى الإدارة.

📧 **سيتم التواصل معك خلال 24 ساعة**
📞 **للاستفسارات العاجلة: 0502463346**

نتطلع لخدمتك مرة أخرى! 🌟`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, confirmationMessage]);

      toast.success("تم إرسال تقرير المحادثة إلى الإدارة.");

    } catch (error) {
      console.error('Error ending conversation:', error);
      toast.error("تعذر إرسال التقرير. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateHTMLReport = (summary: any) => {
    return `
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
        <div class="company-logo">🏢 شركة علي صالح الشهري القابضة</div>
        <h1>📋 تقرير محادثة خدمة العملاء</h1>
        <p>تقرير مفصل وموثق لجلسة خدمة العملاء</p>
    </div>

    <div class="section customer-info">
        <h2>👤 معلومات العميل</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>الاسم الكامل:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${summary.customerInfo.name || 'غير محدد'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>البريد الإلكتروني:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${summary.customerInfo.email || 'غير محدد'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>رقم الواتساب:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${summary.customerInfo.phone || 'غير محدد'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>تاريخ المحادثة:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${summary.endTime}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>رقم المرجع:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">#CS-${summary.conversationId.slice(-8)}</td></tr>
        </table>
    </div>

    <div class="section chat-section">
        <h2>💬 تفاصيل المحادثة</h2>
        <p><strong>عدد الرسائل:</strong> ${summary.totalMessages} رسالة</p>
        <p><strong>مدة المحادثة:</strong> ${summary.duration} دقيقة</p>
        
        <div style="margin-top: 20px;">
            ${summary.transcript.map((msg: any) => `
                <div class="message ${msg.sender === 'العميل' ? 'user-message' : 'support-message'}">
                    <div class="timestamp">${msg.timestamp}</div>
                    <strong>${msg.sender === 'العميل' ? '🧑‍💼' : '🎧'} ${msg.sender}:</strong>
                    <div style="margin-top: 5px; white-space: pre-wrap;">${msg.message}</div>
                </div>
            `).join('')}
        </div>
    </div>

    ${summary.rating ? `
    <div class="section rating-section">
        <h2>⭐ تقييم الخدمة</h2>
        <div class="rating-stars">${'★'.repeat(summary.rating)}${'☆'.repeat(5 - summary.rating)}</div>
        <p><strong>التقييم:</strong> ${summary.rating} من 5 نجوم</p>
        ${summary.feedback ? `<p><strong>التعليقات:</strong> ${summary.feedback}</p>` : ''}
    </div>
    ` : ''}

    <div class="summary-box">
        <h3>📊 ملخص الجلسة</h3>
        <ul>
            <li><strong>حالة المحادثة:</strong> مكتملة ✅</li>
            <li><strong>مستوى الخدمة:</strong> ممتاز</li>
            <li><strong>نوع الاستفسار:</strong> ${summary.customerInfo.topic || 'استفسار عام عن الخدمات'}</li>
            <li><strong>الإجراء المطلوب:</strong> متابعة مع العميل خلال 24 ساعة</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>شركة علي صالح الشهري القابضة</strong> | خدمة عملاء متميزة</p>
        <p>📞 0502463346 | 📧 info@alialshehriholding.com | 🌐 alialshehriholding.com</p>
        <p><small>هذا التقرير تم إنشاؤه تلقائياً بواسطة نظام إدارة خدمة العملاء</small></p>
    </div>
</body>
</html>`;
  };

  const startNewConversation = () => {
    setMessages([]);
    setCustomerInfo({});
    setCurrentStep('welcome');
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    setInputValue('');
  };

  const rateConversation = (rating: number) => {
    setCustomerInfo(prev => ({ ...prev, rating }));
    endConversation();
  };

  const toggleBot = () => {
    console.log('toggleBot clicked, current isOpen:', isOpen);
    setIsOpen(!isOpen);
    if (!isOpen && notifications > 0) {
      setNotifications(0);
    }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'
  };

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} 
              bg-background border border-border rounded-2xl shadow-2xl 
              backdrop-blur-sm transition-all duration-300 ease-in-out
              max-w-[95vw] max-h-[90vh]`}
          >
            <Card className="h-full border-0 rounded-2xl overflow-hidden">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                          <Bot className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className={isMinimized ? 'hidden' : ''}>
                      <CardTitle className="text-lg font-bold">مساعد ذكي</CardTitle>
                      <p className="text-sm text-primary-foreground/80">
                        {isTyping ? 'يكتب...' : 'متاح الآن'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="flex flex-col h-full p-0">
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4 space-y-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'bot' && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[75%] p-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground ml-4'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.text}
                            </p>
                            <p className={`text-xs mt-2 opacity-70 ${
                              message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                            }`}>
                              {message.timestamp.toLocaleTimeString('ar-SA', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          {message.sender === 'user' && (
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 justify-start"
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted p-3 rounded-2xl">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Rating Section */}
                  {currentStep === 'rating' && (
                    <div className="p-4 border-t bg-muted/20">
                      <div className="text-center space-y-4">
                        <h3 className="font-semibold text-lg">⭐ قيم خدمة العملاء</h3>
                        <p className="text-sm text-muted-foreground">كيف كانت تجربتك معنا؟</p>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                              key={rating}
                              variant="ghost"
                              size="sm"
                              onClick={() => rateConversation(rating)}
                              className="p-2 hover:bg-yellow-100"
                            >
                              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                            </Button>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => endConversation()}
                          className="w-full"
                        >
                          إنهاء المحادثة بدون تقييم
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  {currentStep === 'chatting' && (
                    <div className="p-4 border-t bg-background">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="اكتب رسالتك هنا..."
                            className="min-h-[44px] max-h-32 resize-none border-0 focus-visible:ring-1"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            size="sm"
                            className="h-[44px] w-[44px] p-0"
                          >
                            {isLoading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center mt-2 pt-2">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep('rating')}
                            className="text-xs"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            إنهاء المحادثة
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={startNewConversation}
                            className="text-xs"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            محادثة جديدة
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            onClick={(e) => {
              console.log('Button clicked!', e);
              toggleBot();
            }}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl 
              bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70
              transition-all duration-300 group"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </Button>
          
          {notifications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white 
                text-xs rounded-full flex items-center justify-center font-bold"
            >
              {notifications}
            </motion.div>
          )}
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
        </motion.div>
      )}
    </div>
  );
};

export default SmartChatBot;