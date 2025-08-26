import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Settings,
  HeadphonesIcon,
  UserCheck,
  Zap,
  Clock,
  Heart,
  Star,
  Users,
  Phone
} from 'lucide-react';
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
  agent?: Agent;
}

interface Agent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  department: string;
  status: 'online' | 'busy' | 'away';
  specialties: string[];
  responseTime: string;
}

interface ChatBotProps {
  className?: string;
}

const agents: Agent[] = [
  {
    id: 'sarah',
    name: 'سارة أحمد',
    title: 'مستشارة التصميم',
    avatar: '👩‍💼',
    department: 'التصميم والإبداع',
    status: 'online',
    specialties: ['التصميم الجرافيكي', 'هوية العلامة التجارية', 'التصميم الرقمي'],
    responseTime: 'فوري'
  },
  {
    id: 'mohammed',
    name: 'محمد عبدالله',
    title: 'مختص تطوير البرمجيات',
    avatar: '👨‍💻',
    department: 'التطوير التقني',
    status: 'online',
    specialties: ['تطوير المواقع', 'تطبيقات الجوال', 'الأنظمة المخصصة'],
    responseTime: '< 2 دقيقة'
  },
  {
    id: 'fatima',
    name: 'فاطمة العلي',
    title: 'استشارية الأعمال',
    avatar: '👩‍🎓',
    department: 'الاستشارات التجارية',
    status: 'online',
    specialties: ['التخطيط الاستراتيجي', 'دراسة الجدوى', 'التطوير التنظيمي'],
    responseTime: 'فوري'
  },
  {
    id: 'omar',
    name: 'عمر خالد',
    title: 'خبير التسويق الرقمي',
    avatar: '👨‍🚀',
    department: 'التسويق الرقمي',
    status: 'busy',
    specialties: ['حملات الإعلان', 'السوشيال ميديا', 'تحليل البيانات'],
    responseTime: '5 دقائق'
  },
  {
    id: 'aisha',
    name: 'عائشة محمد',
    title: 'مديرة خدمة العملاء',
    avatar: '👩‍💼',
    department: 'خدمة العملاء',
    status: 'online',
    specialties: ['الدعم الفني', 'حلول المشاكل', 'المتابعة'],
    responseTime: 'فوري'
  }
];

const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent>(agents[4]); // Default to customer service manager
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: `أهلاً وسهلاً بك في **ASH HOLDING** 🌟\n\nأنا **${currentAgent.name}** - ${currentAgent.title}\n\n✨ **ماذا يمكنني أن أقدم لك اليوم؟**\n\n🎯 **خدماتنا المتميزة:**\n• **حلول التصميم الاحترافية** - هوية بصرية مميزة\n• **تطوير البرمجيات المتقدمة** - مواقع وتطبيقات ذكية\n• **الاستشارات التجارية** - استراتيجيات نمو مضمونة\n• **التسويق الرقمي** - وصول أوسع ونتائج أفضل\n• **الدعم التقني** - مساعدة فورية ومتخصصة\n\n💡 **اختر ما يناسبك أو اسألني عن أي شيء!**`,
      timestamp: new Date(),
      agent: currentAgent,
      buttons: [
        { text: '🎨 حلول التصميم', url: 'design-info' },
        { text: '💻 تطوير البرمجيات', url: 'dev-info' },
        { text: '💼 استشارات الأعمال', url: 'business-info' },
        { text: '📱 التسويق الرقمي', url: 'marketing-info' },
        { text: '🚀 خدمات متقدمة', url: 'tech-info' },
        { text: '📞 استشارة مجانية', url: '/consultation' }
      ]
    };
    setMessages([welcomeMessage]);
  }, [currentAgent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  const switchAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setShowAgentSelector(false);
    
    const transferMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `تم تحويلك إلى **${agent.name}** 🔄\n\n${agent.title} في قسم ${agent.department}\n\n**تخصصاتي:**\n${agent.specialties.map(s => `• ${s}`).join('\n')}\n\n✨ **كيف يمكنني مساعدتك؟**`,
      timestamp: new Date(),
      agent: agent
    };
    
    setMessages(prev => [...prev, transferMessage]);
    
    toast({
      title: "تم التحويل بنجاح",
      description: `الآن تتحدث مع ${agent.name}`,
    });
  };

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
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: inputMessage,
          conversationHistory,
          agent: currentAgent
        }
      });

      if (error) throw error;

      const responseText = data.response || 'أعتذر، دعني أحولك لزميل آخر قد يساعدك بشكل أفضل.';
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
        agent: currentAgent,
        buttons: buttons.length > 0 ? buttons : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `أعتذر ${currentAgent.name}، حدث خطأ تقني مؤقت 😔\n\n**البدائل المتاحة:**\n• إعادة المحاولة\n• التواصل عبر الواتساب: 0555812567\n• طلب معاودة الاتصال\n\nنحن هنا لخدمتك دائماً! 💪`,
        timestamp: new Date(),
        agent: currentAgent,
        buttons: [
          { text: '📱 واتساب مباشر', url: 'https://wa.me/966555812567' },
          { text: '📞 طلب اتصال', url: '/contact' }
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "خطأ مؤقت",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async (button: ChatButton) => {
    if (button.url.endsWith('-info')) {
      const serviceRequests: { [key: string]: string } = {
        'design-info': `أريد معرفة تفاصيل كاملة عن خدمات التصميم والأسعار والباقات`,
        'business-info': `أريد معرفة تفاصيل الاستشارات التجارية والخدمات والأسعار`,
        'tech-info': `أريد معرفة تفاصيل التقنيات المتقدمة والذكاء الاصطناعي والأسعار`,
        'dev-info': `أريد معرفة تفاصيل تطوير البرمجيات والمواقع والتطبيقات والأسعار`,
        'marketing-info': `أريد معرفة تفاصيل خدمات التسويق الرقمي والباقات والأسعار`
      };

      const serviceRequest = serviceRequests[button.url];
      if (serviceRequest) {
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
              })),
              agent: currentAgent
            }
          });

          if (error) throw error;

          const responseText = data.response || 'عذراً، لم أتمكن من جلب المعلومات. دعني أحولك لمختص.';
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
            agent: currentAgent,
            buttons: buttons.length > 0 ? buttons : undefined
          };

          setMessages(prev => [...prev, assistantMessage]);

        } catch (error: any) {
          console.error('Chat error:', error);
          
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'أعتذر، حدث خطأ في جلب المعلومات. دعني أحولك لزميل مختص.',
            timestamp: new Date(),
            agent: currentAgent
          };

          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    } else if (button.url.startsWith('http')) {
      window.open(button.url, '_blank');
    } else {
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
    let processedContent = content;
    
    // Enhanced formatting
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
    processedContent = processedContent.replace(/✅/g, '<span class="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs mr-2">✓</span>');
    processedContent = processedContent.replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold text-primary mt-4 mb-2 border-r-4 border-primary pr-3">$1</h3>');
    processedContent = processedContent.replace(/^\*\*(.*?)\*\*$/gm, '<h4 class="font-bold text-secondary-foreground mt-3 mb-1 bg-secondary/20 px-2 py-1 rounded">$1</h4>');
    processedContent = processedContent.replace(/^• (.*?)$/gm, '<div class="flex items-start gap-2 my-1"><span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span><span>$1</span></div>');
    
    // Convert emojis to styled spans
    processedContent = processedContent.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '<span class="text-lg">$1</span>');
    
    processedContent = processedContent.replace(/\n\n/g, '<br><br>');
    processedContent = processedContent.replace(/\n/g, '<br>');
    
    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'away': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متاح الآن';
      case 'busy': return 'مشغول';
      case 'away': return 'بعيد مؤقتاً';
      default: return 'غير متاح';
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-500 animate-pulse group"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          </Button>
          
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-bounce">
              {unreadCount}
            </Badge>
          )}
          
          {/* Floating indicators */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-x-0 bottom-0 sm:bottom-4 sm:right-4 sm:left-auto sm:inset-x-auto z-50 ${className}`}>
      <Card className={`w-full sm:w-[420px] sm:max-w-[420px] transition-all duration-500 shadow-2xl border-0 mobile-scroll bg-card/98 backdrop-blur-lg ${
        isMinimized ? 'h-16 sm:h-16' : 'h-[85vh] sm:h-[650px] max-h-[85vh] sm:max-h-[650px]'
      } sm:rounded-xl rounded-t-xl sm:rounded-t-xl rounded-b-none sm:rounded-b-xl overflow-hidden`}>
        
        {/* Enhanced Header */}
        <CardHeader className="p-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg backdrop-blur-sm">
                  {currentAgent.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(currentAgent.status)} rounded-full border-2 border-white animate-pulse`}></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  {currentAgent.name}
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                    {getStatusText(currentAgent.status)}
                  </Badge>
                </h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <HeadphonesIcon className="w-3 h-3" />
                  {currentAgent.title} • {currentAgent.department}
                </p>
                <p className="text-xs opacity-75 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  يرد خلال {currentAgent.responseTime}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAgentSelector(!showAgentSelector)}
                className="h-8 w-8 text-white hover:bg-white/20 mobile-tap"
                title="تغيير المستشار"
              >
                <Users className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-white hover:bg-white/20 mobile-tap"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20 mobile-tap"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Agent Selector */}
          {showAgentSelector && !isMinimized && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-10 max-h-64 overflow-y-auto">
              <div className="p-3 border-b bg-gray-50">
                <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  اختر المستشار المناسب
                </h4>
              </div>
              
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => switchAgent(agent)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                        {agent.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border border-white`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 flex items-center gap-2">
                        {agent.name}
                        {agent.status === 'online' && <UserCheck className="w-3 h-3 text-green-600" />}
                      </p>
                      <p className="text-xs text-gray-600">{agent.title}</p>
                      <p className="text-xs text-gray-500">{agent.specialties.slice(0, 2).join(' • ')}</p>
                    </div>
                    
                    <Badge variant={agent.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                      {getStatusText(agent.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(85vh-5rem)] sm:h-[586px] bg-gradient-to-b from-background to-background/95">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 mobile-scroll">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-secondary to-secondary/80' 
                        : 'bg-gradient-to-r from-primary to-primary/80 text-white'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <span className="text-sm">{message.agent?.avatar || '🤖'}</span>
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[85%] sm:max-w-[320px] ${
                      message.role === 'user' ? 'text-right' : 'text-right'
                    }`}>
                      {/* Agent info for assistant messages */}
                      {message.role === 'assistant' && message.agent && (
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                          <span>{message.agent.name}</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {message.agent.title}
                          </Badge>
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground border-secondary/20'
                          : 'bg-gradient-to-r from-white to-gray-50 text-gray-900 border-gray-100'
                      }`}>
                        {message.role === 'assistant' ? formatMessage(message.content) : message.content}
                      </div>
                      
                      {/* Enhanced Buttons */}
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-2">
                          {message.buttons.map((button, index) => (
                            <Button
                              key={index}
                              onClick={() => handleButtonClick(button)}
                              variant="outline"
                              size="sm"
                              className="text-sm h-12 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/30 text-primary hover:text-primary/90 transition-all duration-300 mobile-tap shadow-sm hover:shadow-md rounded-xl justify-center font-medium"
                            >
                              {button.text}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Enhanced Loading Animation */}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-center shadow-md">
                      <span className="text-sm">{currentAgent.avatar}</span>
                    </div>
                    <div className="flex-1 max-w-[85%] sm:max-w-[320px]">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50 border border-gray-100 shadow-sm">
                        <div className="flex gap-2 items-center">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{currentAgent.name} يكتب...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Enhanced Input Area */}
            <div className="p-4 border-t bg-white/80 backdrop-blur-sm safe-bottom">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    disabled={isLoading}
                    className="text-right text-base h-12 mobile-tap rounded-xl border-gray-200 focus:border-primary transition-colors bg-white shadow-sm"
                    dir="rtl"
                  />
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="flex-shrink-0 h-12 w-12 mobile-tap rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Enhanced Footer */}
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>مدعوم بالذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>0555812567</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;