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
  Star,
  Users,
  Phone,
  Sparkles,
  Shield,
  Award,
  Building,
  Lightbulb,
  ChevronDown,
  Mic,
  Image,
  FileText,
  Video
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatButton {
  text: string;
  url: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  buttons?: ChatButton[];
  agent?: Agent;
  type?: 'text' | 'media' | 'system';
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
  color: string;
  experience: string;
}

interface ChatBotProps {
  className?: string;
}

const agents: Agent[] = [
  {
    id: 'noor',
    name: 'نور الهدى',
    title: 'مديرة العلاقات العامة',
    avatar: '✨',
    department: 'إدارة العملاء',
    status: 'online',
    specialties: ['استقبال العملاء', 'التوجيه العام', 'المساعدة الفورية'],
    responseTime: 'فوري',
    color: 'from-purple-500 to-pink-500',
    experience: '5+ سنوات'
  },
  {
    id: 'khalid',
    name: 'خالد الأحمد',
    title: 'خبير الحلول التقنية',
    avatar: '🚀',
    department: 'التطوير التقني',
    status: 'online',
    specialties: ['ذكاء اصطناعي', 'تطوير مخصص', 'حلول متقدمة'],
    responseTime: '< 3 دقائق',
    color: 'from-blue-500 to-cyan-500',
    experience: '8+ سنوات'
  },
  {
    id: 'layla',
    name: 'ليلى العتيبي',
    title: 'مصممة رقمية رئيسية',
    avatar: '🎨',
    department: 'الإبداع والتصميم',
    status: 'online',
    specialties: ['هوية بصرية', 'تصميم رقمي', 'تجربة مستخدم'],
    responseTime: 'فوري',
    color: 'from-orange-500 to-red-500',
    experience: '6+ سنوات'
  },
  {
    id: 'hassan',
    name: 'حسن المالكي',
    title: 'استشاري أعمال أول',
    avatar: '💼',
    department: 'الاستشارات التجارية',
    status: 'busy',
    specialties: ['استراتيجية', 'دراسات جدوى', 'تحليل مالي'],
    responseTime: '10 دقائق',
    color: 'from-green-500 to-emerald-500',
    experience: '10+ سنوات'
  },
  {
    id: 'maha',
    name: 'مها الزهراني',
    title: 'خبيرة التسويق الرقمي',
    avatar: '📱',
    department: 'التسويق والإعلان',
    status: 'online',
    specialties: ['حملات رقمية', 'سوشيال ميديا', 'إعلانات ممولة'],
    responseTime: '< 5 دقائق',
    color: 'from-indigo-500 to-purple-500',
    experience: '7+ سنوات'
  }
];

const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent>(agents[0]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const conversationId = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: `🌟 أهلاً وسهلاً بك في عالم **ASH HOLDING** \n\nأنا **${currentAgent.name}** ${currentAgent.avatar}\n${currentAgent.title} | ${currentAgent.experience} خبرة\n\n✨ **رحلتك نحو التميز تبدأ من هنا!**\n\n🎯 **ماذا نقدم لك اليوم؟**\n\n🏆 **خدمات متميزة وحلول إبداعية**\n• حلول ذكية مبتكرة\n• تصاميم عصرية جذابة  \n• استشارات تجارية احترافية\n• تسويق رقمي فعال\n• دعم تقني متواصل\n\n💡 **اختر ما يناسبك وسنرشدك للأفضل!**`,
      timestamp: new Date(),
      agent: currentAgent,
      type: 'text',
      buttons: [
        { text: '🚀 حلول تقنية متطورة', url: 'tech-info', icon: <Zap className="w-4 h-4" />, variant: 'primary' },
        { text: '🎨 تصميم إبداعي مميز', url: 'design-info', icon: <Sparkles className="w-4 h-4" />, variant: 'secondary' },
        { text: '💼 استشارات أعمال', url: 'business-info', icon: <Building className="w-4 h-4" />, variant: 'success' },
        { text: '📱 تسويق رقمي', url: 'marketing-info', icon: <Phone className="w-4 h-4" />, variant: 'warning' },
        { text: '🎯 استشارة مجانية', url: '/consultation', icon: <Award className="w-4 h-4" />, variant: 'primary' },
        { text: '💬 تحدث مع خبير', url: 'expert-chat', icon: <Users className="w-4 h-4" />, variant: 'secondary' }
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
      content: `🔄 **تم التحويل بنجاح**\n\nمرحباً! أنا **${agent.name}** ${agent.avatar}\n\n🏅 **تخصصي وخبرتي:**\n• ${agent.title}\n• ${agent.experience} في ${agent.department}\n• ${agent.specialties.join(' • ')}\n\n⚡ **وقت الاستجابة:** ${agent.responseTime}\n\n✨ **كيف يمكنني مساعدتك بخبرتي؟**`,
      timestamp: new Date(),
      agent: agent,
      type: 'system'
    };
    
    setMessages(prev => [...prev, transferMessage]);
    
    toast({
      title: "✅ تم التحويل",
      description: `الآن تتحدث مع ${agent.name}`,
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: inputMessage,
          conversationHistory,
          conversationId: conversationId.current,
          agent: currentAgent
        }
      });

      if (error) throw error;

      // Update conversation ID if provided
      if (data.conversationId) {
        conversationId.current = data.conversationId;
      }

      const responseText = data.response || 'أعتذر، دعني أتأكد من المعلومات وأعاود الإجابة...';
      const buttonRegex = /\[BUTTON:(.*?):(.*?)\]/g;
      const buttons: ChatButton[] = [];
      let cleanedContent = responseText;

      let match;
      while ((match = buttonRegex.exec(responseText)) !== null) {
        buttons.push({
          text: match[1],
          url: match[2],
          variant: 'primary'
        });
        cleanedContent = cleanedContent.replace(match[0], '');
      }

      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanedContent.trim(),
          timestamp: new Date(),
          agent: currentAgent,
          type: 'text',
          buttons: buttons.length > 0 ? buttons : undefined
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);

    } catch (error: any) {
      console.error('Chat error:', error);
      
      setTimeout(() => {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `😔 **عذراً، حدث خطأ مؤقت**\n\nلا تقلق! يمكننا مساعدتك بطرق أخرى:\n\n📱 **واتساب مباشر:** 0555812567\n📞 **مكالمة فورية**\n💌 **رسالة إلكترونية**\n\n🌟 نحن هنا دائماً لخدمتك!`,
          timestamp: new Date(),
          agent: currentAgent,
          type: 'system',
          buttons: [
            { text: '📱 واتساب', url: 'https://wa.me/966555812567', icon: <Phone className="w-4 h-4" />, variant: 'success' },
            { text: '📞 اتصال فوري', url: '/contact', icon: <Phone className="w-4 h-4" />, variant: 'warning' }
          ]
        };

        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 800);
      
      toast({
        title: "⚠️ خطأ مؤقت",
        description: "جارٍ إعادة المحاولة...",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async (button: ChatButton) => {
    if (button.url.endsWith('-info')) {
      const serviceRequests: { [key: string]: string } = {
        'design-info': `أريد معرفة تفاصيل شاملة عن خدمات التصميم الإبداعي والأسعار والباقات المتاحة`,
        'business-info': `أريد معرفة تفاصيل كاملة عن الاستشارات التجارية والخدمات المتخصصة والأسعار`,
        'tech-info': `أريد معرفة تفاصيل الحلول التقنية المتطورة والذكاء الاصطناعي والأسعار`,
        'dev-info': `أريد معرفة تفاصيل تطوير البرمجيات والمواقع والتطبيقات الذكية والأسعار`,
        'marketing-info': `أريد معرفة تفاصيل خدمات التسويق الرقمي المتقدمة والباقات والأسعار`,
        'expert-chat': `أريد التحدث مع خبير متخصص في مجالي`
      };

      const serviceRequest = serviceRequests[button.url];
      if (serviceRequest) {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: button.text,
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setIsTyping(true);

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

          const responseText = data.response || 'دعني أحولك لخبير متخصص للحصول على معلومات دقيقة...';
          
          setTimeout(() => {
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: responseText.trim(),
              timestamp: new Date(),
              agent: currentAgent,
              type: 'text'
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
          }, 1500);

        } catch (error: any) {
          console.error('Chat error:', error);
          
          setTimeout(() => {
            const errorMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: 'دعني أحولك لزميل مختص يمكنه مساعدتك بشكل أفضل.',
              timestamp: new Date(),
              agent: currentAgent,
              type: 'system'
            };

            setMessages(prev => [...prev, errorMessage]);
            setIsTyping(false);
          }, 800);
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
    
    // Enhanced formatting with more style
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">$1</span>');
    processedContent = processedContent.replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold text-gradient mt-4 mb-2 flex items-center gap-2"><span class="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded"></span>$1</h3>');
    processedContent = processedContent.replace(/^• (.*?)$/gm, '<div class="flex items-start gap-3 my-2"><span class="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></span><span class="text-gray-700">$1</span></div>');
    
    // Style emojis larger
    processedContent = processedContent.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, '<span class="text-xl inline-block animate-bounce">$1</span>');
    
    processedContent = processedContent.replace(/\n\n/g, '<div class="h-2"></div>');
    processedContent = processedContent.replace(/\n/g, '<br>');
    
    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400 shadow-green-400/50';
      case 'busy': return 'bg-yellow-400 shadow-yellow-400/50';
      case 'away': return 'bg-gray-400 shadow-gray-400/50';
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

  const getButtonVariantClass = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary': return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl';
      case 'secondary': return 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl';
      case 'success': return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl';
      case 'warning': return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl';
      default: return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl';
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative group">
          {/* Floating animation rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-spin-slow opacity-75 scale-110"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-ping opacity-40"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-110 border-2 border-white/20"
            size="icon"
          >
            <div className="absolute inset-2 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="h-7 w-7 text-white drop-shadow-lg animate-pulse" />
            </div>
            
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-1 h-3 w-3 text-blue-300 animate-bounce delay-150" />
          </Button>
          
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center animate-bounce shadow-lg">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:left-auto sm:inset-x-auto z-50 ${className}`}>
      <Card className={`w-full sm:w-[440px] sm:max-w-[440px] transition-all duration-700 shadow-2xl border-0 mobile-scroll backdrop-blur-xl bg-white/95 ${
        isMinimized ? 'h-20 sm:h-20' : 'h-[90vh] sm:h-[700px] max-h-[90vh] sm:max-h-[700px]'
      } sm:rounded-3xl rounded-t-3xl sm:rounded-t-3xl rounded-b-none sm:rounded-b-3xl overflow-hidden`}>
        
        {/* Revolutionary Header Design */}
        <CardHeader className="p-0 relative overflow-hidden">
          {/* Animated background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentAgent.color} opacity-90`}></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-shimmer"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-pulse"></div>
          
          <div className="relative p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/30 shadow-xl">
                    {currentAgent.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(currentAgent.status)} rounded-full border-2 border-white shadow-lg animate-pulse`}></div>
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white drop-shadow-lg">
                      {currentAgent.name}
                    </h3>
                    <Shield className="w-4 h-4 text-yellow-300" />
                  </div>
                  <p className="text-sm text-white/90 font-medium">
                    {currentAgent.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {getStatusText(currentAgent.status)}
                    </Badge>
                    <span className="text-xs text-white/80 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentAgent.responseTime}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAgentSelector(!showAgentSelector)}
                  className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
                  title="تغيير المستشار"
                >
                  <Users className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
                >
                  {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Agent stats */}
            <div className="mt-3 flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {currentAgent.experience}
              </span>
              <span className="flex items-center gap-1">
                {currentAgent.department}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-300" />
                4.9/5
              </span>
            </div>
          </div>
          
          {/* Enhanced Agent Selector */}
          {showAgentSelector && !isMinimized && (
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-b-2xl shadow-2xl z-20 max-h-80 overflow-y-auto">
              <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  اختر خبيرك المفضل
                </h4>
                <p className="text-sm text-gray-600 mt-1">فريق من المختصين في خدمتك</p>
              </div>
              
              {agents.map((agent, index) => (
                <div
                  key={agent.id}
                  onClick={() => switchAgent(agent)}
                  className="p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer border-b last:border-b-0 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 bg-gradient-to-br ${agent.color} rounded-2xl flex items-center justify-center text-lg shadow-lg`}>
                        {agent.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(agent.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{agent.name}</p>
                        {agent.status === 'online' && <UserCheck className="w-4 h-4 text-green-600" />}
                        <Badge className={`text-xs ${agent.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {getStatusText(agent.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{agent.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {agent.specialties.slice(0, 2).join(' • ')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        {agent.experience}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(90vh-9rem)] sm:h-[616px] bg-gradient-to-b from-gray-50/50 to-white">
            {/* Messages Area with enhanced design */}
            <ScrollArea className="flex-1 p-5 mobile-scroll">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                        : `bg-gradient-to-br ${message.agent?.color || 'from-gray-500 to-gray-600'} text-white`
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <span className="text-lg">{message.agent?.avatar || '🤖'}</span>
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[85%] sm:max-w-[340px] ${
                      message.role === 'user' ? 'text-right' : 'text-right'
                    }`}>
                      {/* Enhanced agent info */}
                      {message.role === 'assistant' && message.agent && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <span className="font-semibold">{message.agent.name}</span>
                          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-200">
                            {message.agent.title}
                          </Badge>
                        </div>
                      )}
                      
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-lg border backdrop-blur-sm relative overflow-hidden ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-indigo-200 shadow-indigo-200/50'
                          : message.type === 'system'
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-800 border-yellow-200 shadow-yellow-200/50'
                          : 'bg-gradient-to-br from-white to-gray-50 text-gray-800 border-gray-200 shadow-gray-200/50'
                      }`}>
                        {/* Message decoration */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-white/50 to-white/20' 
                            : message.type === 'system'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                            : 'bg-gradient-to-r from-purple-400 to-blue-400'
                        }`}></div>
                        
                        {message.role === 'assistant' ? formatMessage(message.content) : (
                          <div className="text-white font-medium">{message.content}</div>
                        )}
                      </div>
                      
                      {/* Enhanced Buttons with gradients */}
                      {message.buttons && message.buttons.length > 0 && (
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {message.buttons.map((button, index) => (
                            <Button
                              key={index}
                              onClick={() => handleButtonClick(button)}
                              className={`h-14 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${getButtonVariantClass(button.variant)} animate-slide-up`}
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex items-center gap-3">
                                {button.icon}
                                <span>{button.text}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Enhanced typing indicator */}
                {isTyping && (
                  <div className="flex items-start gap-4 animate-fade-in">
                    <div className={`flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br ${currentAgent.color} text-white flex items-center justify-center shadow-lg animate-pulse`}>
                      <span className="text-lg">{currentAgent.avatar}</span>
                    </div>
                    <div className="flex-1 max-w-[85%] sm:max-w-[340px]">
                      <div className="p-5 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                        <div className="flex gap-2 items-center">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{currentAgent.name} يكتب...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Revolutionary Input Area */}
            <div className="p-5 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl">
              <div className="flex gap-4 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك الإبداعية هنا..."
                    disabled={isLoading}
                    className="text-right text-base h-14 rounded-2xl border-2 border-gray-200 focus:border-purple-400 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-lg pr-5 pl-16"
                    dir="rtl"
                  />
                  
                  {/* Input decorations */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="h-6 w-6 text-white" />
                </Button>
              </div>
              
              {/* Enhanced Footer with company branding */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>مدعوم بالذكاء الاصطناعي</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>محادثة آمنة</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
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