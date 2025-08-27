import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Send,
  User,
  Calendar,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  requester_name?: string;
  requester_email?: string;
  requester_phone?: string;
  created_at: string;
  updated_at: string;
  resolution_notes?: string;
}

interface TicketReply {
  id: string;
  ticket_id: string;
  body: string;
  sender_type: string;
  sender_name?: string;
  created_at: string;
}

const AdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "خطأ في جلب التذاكر",
        description: "حدث خطأ أثناء جلب بيانات تذاكر الدعم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketReplies = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies((data || []).map((reply: any) => ({
        id: reply.id,
        ticket_id: reply.ticket_id,
        body: reply.body,
        sender_type: reply.sender_type,
        sender_name: reply.sender_name,
        created_at: reply.created_at
      })));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setSending(true);
    try {
      // إضافة الرد إلى قاعدة البيانات
      const { error: replyError } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: selectedTicket.id,
          body: replyMessage,
          sender_type: 'admin',
          sender_name: 'فريق الدعم'
        });

      if (replyError) throw replyError;

      // تحديث حالة التذكرة
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({
          status: 'in_progress',
          first_response_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTicket.id);

      if (updateError) throw updateError;

      // إرسال إيميل للعميل
      if (selectedTicket.requester_email) {
        await supabase.functions.invoke('customer-notifications', {
          body: {
            type: 'order_updated',
            customerEmail: selectedTicket.requester_email,
            customerName: selectedTicket.requester_name || 'العميل',
            data: {
              orderNumber: selectedTicket.ticket_number,
              newStatus: 'تم الرد على استفساركم',
              serviceType: 'دعم فني',
              notes: replyMessage
            }
          }
        });
      }

      toast({
        title: "تم إرسال الرد بنجاح",
        description: "تم إرسال الرد وإشعار العميل بالإيميل",
      });

      setReplyMessage('');
      setShowReplyDialog(false);
      fetchTicketReplies(selectedTicket.id);
      fetchTickets();
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast({
        title: "خطأ في إرسال الرد",
        description: error.message || "حدث خطأ أثناء إرسال الرد",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: 'open' | 'closed' | 'in_progress' | 'waiting_client' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: newStatus,
          resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "تم تحديث الحالة",
        description: `تم تحديث حالة التذكرة إلى ${getStatusText(newStatus)}`,
      });

      fetchTickets();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة التذكرة",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return priority;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.requester_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل تذاكر الدعم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إدارة الدعم الفني</h1>
        <p className="text-muted-foreground">إدارة والرد على تذاكر الدعم الفني</p>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md" className="mb-6">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">إجمالي التذاكر</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/10 dark:to-red-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">مفتوحة</p>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/10 dark:to-yellow-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">قيد المعالجة</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/10 dark:to-green-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">محلولة</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters and Search */}
      <ResponsiveCard>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في التذاكر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة التذكرة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="open">مفتوحة</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="resolved">محلولة</SelectItem>
                <SelectItem value="closed">مغلقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ResponsiveCard>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <ResponsiveCard className="text-center py-12">
          <div className="text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">لا توجد تذاكر دعم</p>
            <p className="text-sm">لا توجد تذاكر تطابق معايير البحث</p>
          </div>
        </ResponsiveCard>
      ) : (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredTickets.map((ticket) => (
            <ResponsiveCard key={ticket.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-right flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground">{ticket.ticket_number}</p>
                  <p className="text-xs text-muted-foreground truncate">{ticket.category}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusText(ticket.status)}
                  </Badge>
                  <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                    {getPriorityText(ticket.priority)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {ticket.requester_name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{ticket.requester_name}</span>
                  </div>
                )}
                {ticket.requester_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{ticket.requester_email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {new Date(ticket.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        fetchTicketReplies(ticket.id);
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>{ticket.subject}</DialogTitle>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusText(ticket.status)}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {getPriorityText(ticket.priority)}
                        </Badge>
                      </div>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">الوصف الأصلي:</h4>
                        <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                      </div>

                      {replies.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">الردود:</h4>
                          {replies.map((reply) => (
                            <div 
                              key={reply.id} 
                              className={`p-3 rounded-lg ${
                                reply.sender_type === 'admin' 
                                  ? 'bg-blue-50 border-blue-200 mr-4' 
                                  : 'bg-gray-50 border-gray-200 ml-4'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-sm">
                                  {reply.sender_type === 'admin' ? 'فريق الدعم' : 'العميل'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.created_at).toLocaleString('ar-SA')}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{reply.body}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Select value={ticket.status} onValueChange={(value: 'open' | 'closed' | 'in_progress' | 'waiting_client' | 'resolved') => updateTicketStatus(ticket.id, value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">مفتوحة</SelectItem>
                            <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                            <SelectItem value="waiting_client">انتظار العميل</SelectItem>
                            <SelectItem value="resolved">محلولة</SelectItem>
                            <SelectItem value="closed">مغلقة</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          onClick={() => {
                            setShowReplyDialog(true);
                          }}
                          disabled={ticket.status === 'closed'}
                        >
                          <Send className="w-4 h-4 ml-2" />
                          إضافة رد
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة رد على التذكرة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reply">الرد</Label>
              <Textarea
                id="reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="اكتب ردك هنا..."
                rows={6}
                dir="rtl"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSendReply} disabled={sending || !replyMessage.trim()}>
                {sending ? 'جارٍ الإرسال...' : 'إرسال الرد'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSupport;