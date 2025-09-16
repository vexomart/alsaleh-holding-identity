import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Eye,
  User,
  Tag
} from 'lucide-react';

type Ticket = {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  category: string;
  created_at: string;
  assigned_to: string | null;
  responses_count?: number;
};

export default function ClientSupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium' as const,
    description: ''
  });

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) {
          setError('لم يتم العثور على جلسة صالحة');
          return;
        }
        const { data, error: qErr } = await supabase
          .from('tickets')
          .select('id, ticket_number, title, description, priority, status, category, created_at, assigned_to')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (qErr) throw qErr;
        const mapped: Ticket[] = (data || []).map((t: any) => ({
          id: t.id,
          ticket_number: t.ticket_number,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          category: t.category,
          created_at: t.created_at,
          assigned_to: t.assigned_to,
          responses_count: 0,
        }));
        setTickets(mapped);
      } catch (e: any) {
        console.error('Error loading tickets:', e);
        setError('تعذر تحميل تذاكر الدعم');
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const handleCreateTicket = async () => {
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على جلسة صالحة",
          variant: "destructive"
        });
        return;
      }

      // Generate a simple ticket number
      const ticketNumber = `TK${Date.now().toString().slice(-8)}`;

      // Create ticket
      const { data: ticketData, error: ticketErr } = await supabase
        .from('tickets')
        .insert([{
          user_id: user.id,
          ticket_number: ticketNumber,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: 'open'
        }])
        .select()
        .single();

      if (ticketErr) throw ticketErr;

      // Send email notification
      try {
        await supabase.functions.invoke('ticket-notification', {
          body: {
            ticketNumber: ticketData.ticket_number,
            customerEmail: user.email,
            customerName: user.user_metadata?.full_name || user.email,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            category: formData.category
          }
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't block ticket creation if email fails
      }

      toast({
        title: "تم بنجاح",
        description: "تم إنشاء التذكرة بنجاح وسيتم الرد عليك قريباً"
      });

      // Reset form and close
      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        description: ''
      });
      setShowNewTicketForm(false);
      
      // Reload tickets
      const newTicket: Ticket = {
        id: ticketData.id,
        ticket_number: ticketData.ticket_number,
        title: ticketData.title,
        description: ticketData.description,
        status: ticketData.status as 'open' | 'in_progress' | 'resolved' | 'closed',
        priority: ticketData.priority as 'high' | 'medium' | 'low',
        category: ticketData.category,
        created_at: ticketData.created_at,
        assigned_to: ticketData.assigned_to,
        responses_count: 0
      };
      setTickets([newTicket, ...tickets]);

    } catch (e: any) {
      console.error('Error creating ticket:', e);
      toast({
        title: "خطأ",
        description: "تعذر إنشاء التذكرة، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleStartChat = (ticket: Ticket) => {
    // You can implement chat functionality here or navigate to a chat page
    toast({
      title: "المحادثة",
      description: `بدء محادثة للتذكرة ${ticket.ticket_number}`
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'open': 'مفتوح',
      'in_progress': 'قيد المعالجة',
      'resolved': 'محلول',
      'closed': 'مغلق'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'open': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colorMap[priority] || 'text-gray-600';
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'high': 'عالية',
      'medium': 'متوسطة',
      'low': 'منخفضة'
    };
    return priorityMap[priority] || priority;
  };

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'technical': 'مشكلة تقنية',
      'billing': 'مسائل مالية',
      'project': 'مشاريع',
      'general': 'عام'
    };
    return categoryMap[category] || category;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
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
          <span className="text-muted-foreground">جارٍ تحميل التذاكر...</span>
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
          <h1 className="text-2xl font-bold text-foreground">تذاكر الدعم</h1>
          <p className="text-muted-foreground">إدارة طلبات الدعم والمساعدة الفنية</p>
        </div>
        <Button onClick={() => setShowNewTicketForm(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          تذكرة دعم جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي التذاكر</div>
            </div>
            <HelpCircle className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.open}</div>
              <div className="text-sm text-red-700 dark:text-red-300">مفتوحة</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">قيد المعالجة</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</div>
              <div className="text-sm text-green-700 dark:text-green-300">محلولة</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في التذاكر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="open">مفتوح</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="resolved">محلول</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="high">عالية</SelectItem>
                <SelectItem value="medium">متوسطة</SelectItem>
                <SelectItem value="low">منخفضة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="technical">تقنية</SelectItem>
                <SelectItem value="billing">مالية</SelectItem>
                <SelectItem value="project">مشاريع</SelectItem>
                <SelectItem value="general">عام</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <Card>
          <CardHeader>
            <CardTitle>تذكرة دعم جديدة</CardTitle>
            <CardDescription>أنشئ تذكرة دعم جديدة للحصول على المساعدة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الموضوع</label>
                <Input 
                  placeholder="موضوع التذكرة" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الفئة</label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">مشكلة تقنية</SelectItem>
                    <SelectItem value="billing">مسائل مالية</SelectItem>
                    <SelectItem value="project">مشاريع</SelectItem>
                    <SelectItem value="general">عام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الأولوية</label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="low">منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف</label>
              <Textarea 
                placeholder="اشرح المشكلة أو الاستفسار بالتفصيل" 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleCreateTicket}
                disabled={submitting}
              >
                {submitting ? 'جارٍ الإنشاء...' : 'إنشاء التذكرة'}
              </Button>
              <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets Grid */}
      {filteredTickets.length > 0 ? (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredTickets.map((ticket) => (
            <ResponsiveCard key={ticket.id} size="md" className="hover-scale">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {ticket.ticket_number}
                    </h3>
                    <h4 className="font-medium text-base text-foreground mb-2">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusIcon(ticket.status)}
                    <span className="mr-1">{getStatusText(ticket.status)}</span>
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                    {getPriorityText(ticket.priority)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>الفئة:</span>
                    <Badge variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      {getCategoryText(ticket.category)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تاريخ الإنشاء:</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>مُكلف إلى:</span>
                    <span className="font-medium">{ticket.assigned_to || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>عدد الردود:</span>
                    <span className="font-medium">{ticket.responses_count ?? 0}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(ticket)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStartChat(ticket)}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد تذاكر دعم</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                ? 'لا توجد تذاكر مطابقة لمعايير البحث'
                : 'لم يتم إنشاء أي تذاكر دعم حتى الآن'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && categoryFilter === 'all' && (
              <Button onClick={() => setShowNewTicketForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                إنشاء تذكرة دعم
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedTicket.ticket_number}</CardTitle>
                  <CardDescription>{selectedTicket.title}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTicketDetails(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {getStatusIcon(selectedTicket.status)}
                  <span className="mr-1">{getStatusText(selectedTicket.status)}</span>
                </Badge>
                <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                  {getPriorityText(selectedTicket.priority)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium">الفئة:</label>
                  <p className="text-muted-foreground">{getCategoryText(selectedTicket.category)}</p>
                </div>
                <div>
                  <label className="font-medium">تاريخ الإنشاء:</label>
                  <p className="text-muted-foreground">{new Date(selectedTicket.created_at).toLocaleString('ar-SA')}</p>
                </div>
                <div>
                  <label className="font-medium">مُكلف إلى:</label>
                  <p className="text-muted-foreground">{selectedTicket.assigned_to || 'غير مُكلف'}</p>
                </div>
                <div>
                  <label className="font-medium">عدد الردود:</label>
                  <p className="text-muted-foreground">{selectedTicket.responses_count ?? 0}</p>
                </div>
              </div>

              <div>
                <label className="font-medium">الوصف:</label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleStartChat(selectedTicket)}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  بدء محادثة
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTicketDetails(false)}
                >
                  إغلاق
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}