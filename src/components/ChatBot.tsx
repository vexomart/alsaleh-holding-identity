import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatButton {
  text: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  buttons?: ChatButton[];
}

interface ChatBotProps {
  className?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'حياك الله وأهلاً وسهلاً فيك! 😊\n\n🏢 **ASH HOLDING**\n*رائدة في الحلول التقنية والتجارية المتكاملة*\n\nأنا من فريق خدمة العملاء وأنا هنا لمساعدتك في:\n• استكشاف خدماتنا المتميزة مع التفاصيل والأسعار\n• الحصول على استشارة مجانية متخصصة\n• التوجيه للحلول المناسبة لاحتياجاتك\n• الإجابة على جميع استفساراتك\n\n**اختر الخدمة اللي تهمك واكتشف التفاصيل كاملة:**',
      timestamp: new Date(),
      buttons: [
        { text: 'الحلول التصميمية 🎨', url: 'design-info' },
        { text: 'الخدمات التجارية 💼', url: 'business-info' },
        { text: 'التقنيات المتقدمة 🚀', url: 'tech-info' },
        { text: 'تطوير البرمجيات 💻', url: 'dev-info' },
        { text: 'التسويق الرقمي 📱', url: 'marketing-info' },
        { text: 'احجز استشارة مجانية 📞', url: '/book-consultation' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: inputMessage,
          conversationHistory
        }
      });

      if (error) throw error;

      // Parse response for buttons
      const responseText = data.response || 'عذراً، لم أتمكن من فهم سؤالك. يرجى إعادة صياغته أو التواصل معنا مباشرة.';
      const buttonRegex = /\[BUTTON:(.*?):(.*?)\]/g;
      const buttons: ChatButton[] = [];
      let cleanedContent = responseText;

      let match;
      while ((match = buttonRegex.exec(responseText)) !== null) {
        buttons.push({
          text: match[1],
          url: match[2]
        });
        cleanedContent = cleanedContent.replace(match[0], '');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanedContent.trim(),
        timestamp: new Date(),
        buttons: buttons.length > 0 ? buttons : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'أعتذر، حدث خطأ تقني. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة عبر صفحة الاتصال.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "خطأ في الاتصال",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async (button: ChatButton) => {
    // Check if it's a service info request (internal action)
    if (button.url.endsWith('-info')) {
      const serviceRequests: { [key: string]: string } = {
        'design-info': 'أريد معرفة تفاصيل خدمات التصميم والأسعار والباقات المتاحة',
        'business-info': 'أريد معرفة تفاصيل الخدمات التجارية والاستشارات والأسعار',
        'tech-info': 'أريد معرفة تفاصيل التقنيات المتقدمة والذكاء الاصطناعي والأسعار',
        'dev-info': 'أريد معرفة تفاصيل تطوير البرمجيات والمواقع والتطبيقات والأسعار',
        'marketing-info': 'أريد معرفة تفاصيل خدمات التسويق الرقمي والباقات والأسعار'
      };

      const serviceRequest = serviceRequests[button.url];
      if (serviceRequest) {
        // Simulate user asking about the service
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: button.text,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
          const { data, error } = await supabase.functions.invoke('chatbot', {
            body: {
              message: serviceRequest,
              conversationHistory: messages.map(msg => ({
                role: msg.role,
                content: msg.content
              }))
            }
          });

          if (error) throw error;

          // Parse response for buttons
          const responseText = data.response || 'عذراً، لم أتمكن من جلب المعلومات. يرجى المحاولة مرة أخرى.';
          const buttonRegex = /\[BUTTON:(.*?):(.*?)\]/g;
          const buttons: ChatButton[] = [];
          let cleanedContent = responseText;

          let match;
          while ((match = buttonRegex.exec(responseText)) !== null) {
            buttons.push({
              text: match[1],
              url: match[2]
            });
            cleanedContent = cleanedContent.replace(match[0], '');
          }

          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cleanedContent.trim(),
            timestamp: new Date(),
            buttons: buttons.length > 0 ? buttons : undefined
          };

          setMessages(prev => [...prev, assistantMessage]);

        } catch (error: any) {
          console.error('Chat error:', error);
          
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'أعتذر، حدث خطأ في جلب المعلومات. يرجى المحاولة مرة أخرى.',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // External link - open in new tab
      window.open(button.url, '_blank');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Process the content to handle markdown-like formatting
    let processedContent = content;
    
    // Convert **text** to bold spans
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
    
    // Convert ✅ checkmarks to styled elements
    processedContent = processedContent.replace(/✅/g, '<span class="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs mr-2">✓</span>');
    
    // Convert ### headers to styled headers
    processedContent = processedContent.replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold text-primary mt-4 mb-2 border-r-4 border-primary pr-3">$1</h3>');
    
    // Convert ** standalone headers to styled headers
    processedContent = processedContent.replace(/^\*\*(.*?)\*\*$/gm, '<h4 class="font-bold text-secondary-foreground mt-3 mb-1 bg-secondary/20 px-2 py-1 rounded">$1</h4>');
    
    // Convert - bullet points to styled list items
    processedContent = processedContent.replace(/^- (.*?)$/gm, '<div class="flex items-start gap-2 my-1"><span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>$1</span></div>');
    
    // Convert links to clickable elements
    const linkRegex = /(\/[\w-]+(?:\/[\w-]+)*)/g;
    processedContent = processedContent.replace(linkRegex, '<a href="$1" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert line breaks to proper spacing
    processedContent = processedContent.replace(/\n\n/g, '<br><br>');
    processedContent = processedContent.replace(/\n/g, '<br>');
    
    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse mobile-tap"
          size="icon"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-x-0 bottom-0 sm:bottom-4 sm:right-4 sm:left-auto sm:inset-x-auto z-50 ${className}`}>
      <Card className={`w-full sm:w-96 sm:max-w-[400px] transition-all duration-300 shadow-2xl border-primary/20 mobile-scroll bg-card/95 backdrop-blur-sm ${
        isMinimized ? 'h-16 sm:h-16' : 'h-[80vh] sm:h-[600px] max-h-[80vh] sm:max-h-[600px]'
      } sm:rounded-lg rounded-t-lg sm:rounded-t-lg rounded-b-none sm:rounded-b-lg`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-6 w-6 sm:h-6 sm:w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-sm">خدمة العملاء</h3>
              <p className="text-xs opacity-90">متاح الآن للمساعدة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-white/20 mobile-tap touch-target"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20 mobile-tap touch-target"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(80vh-4rem)] sm:h-[536px]">
            <ScrollArea className="flex-1 p-4 mobile-scroll">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-secondary' 
                        : 'bg-primary text-white'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[85%] sm:max-w-[280px] ${
                      message.role === 'user' ? 'text-right' : 'text-right'
                    }`}>
                      <div className={`p-3 rounded-lg text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.role === 'assistant' ? formatMessage(message.content) : message.content}
                      </div>
                      
                      {/* Display buttons if they exist */}
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                          {message.buttons.map((button, index) => (
                            <Button
                              key={index}
                              onClick={() => handleButtonClick(button)}
                              variant="outline"
                              size="sm"
                              className="text-sm h-10 bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary hover:text-primary/90 transition-all duration-200 mobile-tap touch-target justify-center"
                            >
                              {button.text}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 max-w-[85%] sm:max-w-[280px]">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background safe-bottom">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  disabled={isLoading}
                  className="flex-1 text-right text-base h-12 mobile-tap touch-target"
                  dir="rtl"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="flex-shrink-0 h-12 w-12 mobile-tap touch-target"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3 text-center">
                مدعوم بالذكاء الاصطناعي • ASH HOLDING
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;