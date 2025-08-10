import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Textarea } from './textarea';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Plus, MessageCircle, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  user_id: string;
  assigned_to?: string;
}

interface TicketMessage {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  is_internal: boolean;
}

export function TicketsSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'general' as const
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('خطأ في تحميل التذاكر');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }

      // الحصول على بيانات المستخدم
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('tickets')
        .insert({
          title: newTicket.title,
          description: newTicket.description,
          priority: newTicket.priority,
          category: newTicket.category,
          user_id: user.id
        } as any)
        .select('*')
        .single();

      if (error) throw error;
      
      // إرسال إشعار للإدارة
      console.log('بدء إرسال الإشعار للإدارة...');
      try {
        console.log('بيانات التذكرة:', data);
        console.log('معلومات المستخدم:', { email: user.email, fullName: profile?.full_name });
        
        const notificationPayload = {
          type: 'ticket_created',
          ticketId: data.id,
          data: {
            ticketNumber: data.ticket_number,
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            customerName: profile?.full_name || user.email || 'غير محدد',
            customerEmail: user.email
          }
        };
        
        console.log('محتوى الطلب:', notificationPayload);
        
        const notificationResult = await supabase.functions.invoke('service-notifications', {
          body: notificationPayload
        });
        
        console.log('نتيجة استدعاء الدالة:', notificationResult);
        
        if (notificationResult.error) {
          console.error('خطأ في استدعاء دالة الإشعارات:', notificationResult.error);
        } else {
          console.log('تم إرسال الإشعار بنجاح');
        }
      } catch (notificationError) {
        console.error('خطأ في إرسال الإشعار:', notificationError);
      }
      
      setTickets([data, ...tickets]);
      setNewTicket({ title: '', description: '', priority: 'medium', category: 'general' });
      setIsDialogOpen(false);
      toast.success('تم إنشاء التذكرة بنجاح');
      
      // Log activity
      await supabase.from('user_activity_logs').insert([{
        user_id: user.id,
        activity_type: 'ticket_created',
        description: `تم إنشاء تذكرة جديدة: ${data.ticket_number}`,
        metadata: { ticket_id: data.id, title: newTicket.title }
      }]);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('خطأ في إنشاء التذكرة');
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('خطأ في تحميل الرسائل');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([{
          ticket_id: selectedTicket,
          user_id: user.id,
          message: newMessage,
          is_internal: false
        }])
        .select()
        .single();

      if (error) throw error;
      
      // إرسال رد للإدارة إذا كان من العميل
      try {
        const selectedTicketData = tickets.find(t => t.id === selectedTicket);
        if (selectedTicketData) {
          console.log('إرسال إشعار رد على تذكرة...', selectedTicketData);
          const replyResult = await supabase.functions.invoke('service-notifications', {
            body: {
              type: 'ticket_reply',
              ticketId: selectedTicket,
              data: {
                ticketNumber: selectedTicketData.ticket_number,
                message: newMessage,
                customerEmail: user.email
              }
            }
          });
          console.log('نتيجة إرسال رد التذكرة:', replyResult);
        }
      } catch (notificationError) {
        console.error('خطأ في إرسال إشعار الرد:', notificationError);
      }
      
      setMessages([...messages, data]);
      setNewMessage('');
      toast.success('تم إرسال الرسالة');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-600';
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-600';
      case 'resolved': return 'bg-green-500/10 text-green-600';
      case 'closed': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-500/10 text-gray-600';
      case 'medium': return 'bg-blue-500/10 text-blue-600';
      case 'high': return 'bg-orange-500/10 text-orange-600';
      case 'urgent': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوحة';
      case 'in_progress': return 'قيد المعالجة';
      case 'resolved': return 'محلولة';
      case 'closed': return 'مغلقة';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفضة';
      case 'medium': return 'متوسطة';
      case 'high': return 'عالية';
      case 'urgent': return 'عاجلة';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            تذاكر الدعم
          </CardTitle>
          <CardDescription>
            إدارة طلبات الدعم والاستفسارات
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 hover-scale">
              <Plus className="h-4 w-4" />
              تذكرة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء تذكرة دعم جديدة</DialogTitle>
              <DialogDescription>
                اكتب استفسارك أو مشكلتك وسنرد عليك في أقرب وقت ممكن
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">العنوان</label>
                <Input
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="عنوان مختصر للمشكلة"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">الوصف</label>
                <Textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="اشرح المشكلة بالتفصيل..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الأولوية</label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                      <SelectItem value="urgent">عاجلة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">الفئة</label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="technical">تقني</SelectItem>
                      <SelectItem value="billing">الفواتير</SelectItem>
                      <SelectItem value="feature_request">طلب ميزة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={createTicket} className="w-full">
                إنشاء التذكرة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد تذاكر دعم بعد</p>
            <p className="text-sm">انقر على "تذكرة جديدة" لإنشاء أول تذكرة لك</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover-scale"
                onClick={() => {
                  setSelectedTicket(ticket.id);
                  fetchTicketMessages(ticket.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {ticket.ticket_number}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(ticket.status)}
                          {getStatusText(ticket.status)}
                        </span>
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{ticket.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(ticket.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Ticket Messages Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden" dir="rtl">
            <DialogHeader>
              <DialogTitle>محادثة التذكرة</DialogTitle>
              <DialogDescription>
                تفاصيل التذكرة والمحادثة مع فريق الدعم
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded">
                {messages.map((message) => (
                  <div key={message.id} className="bg-muted p-3 rounded">
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(message.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  إرسال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}