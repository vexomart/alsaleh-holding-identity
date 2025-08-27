import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
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

const mockConversations = [
  {
    id: '1',
    subject: 'استفسار حول مشروع تطوير الموقع',
    participant: 'أحمد محمد - مدير المشروع',
    last_message: 'سنقوم بإرسال التحديث الأسبوعي غداً صباحاً',
    last_message_date: '2024-01-20T14:30:00',
    status: 'active',
    unread_count: 2,
    project_id: 'PRJ-001'
  },
  {
    id: '2',
    subject: 'مراجعة التصاميم المبدئية',
    participant: 'سارة أحمد - مصممة',
    last_message: 'تم رفع النسخة المحدثة من التصاميم',
    last_message_date: '2024-01-19T16:45:00',
    status: 'waiting',
    unread_count: 0,
    project_id: 'PRJ-002'
  },
  {
    id: '3',
    subject: 'دعم فني للتطبيق',
    participant: 'فريق الدعم الفني',
    last_message: 'شكراً لك، تم حل المشكلة بنجاح',
    last_message_date: '2024-01-18T10:20:00',
    status: 'resolved',
    unread_count: 0,
    project_id: null
  }
];

const mockMessages = [
  {
    id: '1',
    conversation_id: '1',
    sender: 'أحمد محمد',
    sender_role: 'مدير المشروع',
    message: 'مرحباً، أردت أن أطلعك على آخر التطورات في مشروع تطوير الموقع الإلكتروني. لقد أنجزنا 75% من المهام المطلوبة.',
    timestamp: '2024-01-20T14:30:00',
    is_client: false
  },
  {
    id: '2',
    conversation_id: '1',
    sender: 'أنت',
    sender_role: 'العميل',
    message: 'ممتاز! متى من المتوقع أن يكتمل المشروع؟',
    timestamp: '2024-01-20T14:45:00',
    is_client: true
  },
  {
    id: '3',
    conversation_id: '1',
    sender: 'أحمد محمد',
    sender_role: 'مدير المشروع',
    message: 'وفقاً للجدول الزمني، سنقوم بتسليم النسخة النهائية خلال أسبوعين من الآن.',
    timestamp: '2024-01-20T15:00:00',
    is_client: false
  }
];

export default function ClientMessages() {
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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