import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Phone,
  Mail,
  Plus
} from 'lucide-react';

type Conversation = {
  id: string;
  subject: string;
  participant: string;
  last_message: string;
  last_message_date: string;
  status: 'active' | 'waiting' | 'resolved';
  unread_count: number;
  project_id: string | null;
};

type MessageItem = {
  id: string;
  conversation_id: string;
  sender: string;
  sender_role: string;
  message: string;
  timestamp: string;
  is_client: boolean;
};

export default function ClientMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setError('لم يتم العثور على جلسة'); return; }
        const { data, error: qErr } = await supabase
          .from('user_notifications')
          .select('id, title, message, created_at, read_at, category, type, user_email')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });
        if (qErr) throw qErr;
        const convs: Conversation[] = (data || []).map((n: any) => ({
          id: n.id,
          subject: n.title,
          participant: 'النظام',
          last_message: n.message,
          last_message_date: n.created_at,
          status: n.read_at ? 'resolved' : 'active',
          unread_count: n.read_at ? 0 : 1,
          project_id: null,
        }));
        setConversations(convs);
        const msgs: MessageItem[] = (data || []).map((n: any) => ({
          id: n.id,
          conversation_id: n.id,
          sender: 'النظام',
          sender_role: 'إشعار',
          message: n.message,
          timestamp: n.created_at,
          is_client: false,
        }));
        setMessages(msgs);
        setSelectedConversation(convs[0]?.id ?? null);
      } catch (e) {
        console.error('Error loading messages:', e);
        setError('تعذر تحميل الرسائل');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'waiting': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'resolved': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'نشط',
      'waiting': 'في الانتظار',
      'resolved': 'مُحلّة'
    };
    return statusMap[status] || status;
  };

  const filteredConversations = conversations.filter(conv => 
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = messages.filter(msg => msg.conversation_id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: (messages.length + 1).toString(),
      conversation_id: selectedConversation,
      sender: 'أنت',
      sender_role: 'العميل',
      message: newMessage,
      timestamp: new Date().toISOString(),
      is_client: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    unread: conversations.reduce((sum, c) => sum + c.unread_count, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-muted-foreground">جارٍ تحميل الرسائل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الرسائل</h1>
          <p className="text-muted-foreground">تواصل مع فريق العمل ومديري المشاريع</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          محادثة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-3" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي المحادثات</div>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
              <div className="text-sm text-green-700 dark:text-green-300">محادثات نشطة</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.unread}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">رسائل غير مقروءة</div>
            </div>
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">المحادثات</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث في المحادثات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">{conversation.subject}</h4>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{conversation.participant}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {conversation.last_message}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(conversation.status)} variant="outline">
                        {getStatusText(conversation.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conversation.last_message_date).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {conversations.find(c => c.id === selectedConversation)?.subject}
                      </CardTitle>
                      <CardDescription>
                        {conversations.find(c => c.id === selectedConversation)?.participant}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.is_client ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.is_client
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3" />
                            <span className="text-xs font-medium">{message.sender}</span>
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      placeholder="اكتب رسالتك هنا..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[120px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">اختر محادثة</h3>
                  <p className="text-muted-foreground">اختر محادثة من القائمة لبدء المراسلة</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}