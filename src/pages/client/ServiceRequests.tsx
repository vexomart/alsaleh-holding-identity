import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Briefcase,
  Globe,
  Palette,
  Code,
  DollarSign,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequest {
  id: string;
  request_number: string;
  service_type: string;
  title: string;
  description: string;
  requirements?: string;
  budget: string;
  priority: string;
  deadline: string | null;
  status: string;
  created_at: string;
  additional_services: string[] | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  user_id: string;
  attachments?: any;
  notes?: string;
  estimated_cost?: number;
  estimated_duration_days?: number;
  assigned_to?: string;
  updated_at: string;
}

const serviceTypes = [
  { id: 'web-development', label: 'تطوير المواقع الإلكترونية', icon: Code, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'mobile-app', label: 'تطبيقات الجوال', icon: Globe, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'design', label: 'التصميم والهوية البصرية', icon: Palette, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 'business', label: 'الخدمات التجارية', icon: Briefcase, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { id: 'marketing', label: 'التسويق الرقمي', icon: MessageSquare, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  { id: 'other', label: 'خدمات أخرى', icon: Briefcase, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
];

export default function ServiceRequests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "خطأ في المصادقة",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match our interface - cast to any first to avoid TypeScript issues
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        request_number: item.request_number || `REQ-${item.id.slice(0, 8)}`,
        service_type: item.service_type,
        title: item.title,
        description: item.description,
        requirements: item.requirements,
        budget: item.budget || '',
        priority: item.priority,
        deadline: item.deadline,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        additional_services: item.additional_services || [],
        customer_name: item.customer_name || '',
        customer_email: item.customer_email || '',
        customer_phone: item.customer_phone,
        customer_company: item.customer_company,
        user_id: item.user_id,
        attachments: item.attachments,
        notes: item.notes,
        estimated_cost: item.estimated_cost,
        estimated_duration_days: item.estimated_duration_days,
        assigned_to: item.assigned_to
      } as ServiceRequest));

      setRequests(transformedData);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب طلبات الخدمة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'قيد المراجعة',
      'in_review': 'قيد الدراسة',
      'approved': 'تمت الموافقة',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'in_review': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'in_progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'urgent': 'text-red-600',
      'high': 'text-orange-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colorMap[priority] || 'text-gray-600';
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'urgent': 'عاجلة',
      'high': 'عالية',
      'medium': 'متوسطة',
      'low': 'منخفضة'
    };
    return priorityMap[priority] || priority;
  };

  const getBudgetText = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      '5k-10k': '5,000 - 10,000 ريال',
      '10k-25k': '10,000 - 25,000 ريال',
      '25k-50k': '25,000 - 50,000 ريال',
      '50k-100k': '50,000 - 100,000 ريال',
      '100k+': 'أكثر من 100,000 ريال',
      'custom': 'ميزانية مخصصة'
    };
    return budgetMap[budget] || budget;
  };

  const getServiceType = (serviceId: string) => {
    return serviceTypes.find(s => s.id === serviceId) || serviceTypes[0];
  };

  const filteredRequests = requests.filter((request: ServiceRequest) => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesService = serviceFilter === 'all' || request.service_type === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => ['in_review', 'approved', 'in_progress'].includes(r.status)).length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-5 bg-muted rounded w-64"></div>
          </div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        <ResponsiveGrid cols="1-2-4" gap="md">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
          ))}
        </ResponsiveGrid>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلبات الخدمة</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع طلبات الخدمة</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={fetchServiceRequests}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => navigate('/client/new-service-request')}
          >
            <Plus className="w-4 h-4 mr-2" />
            طلب خدمة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">إجمالي الطلبات</div>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">في الانتظار</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.inProgress}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">قيد العمل</div>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
              <div className="text-sm text-green-700 dark:text-green-300">مكتملة</div>
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
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="in_review">قيد الدراسة</SelectItem>
                <SelectItem value="approved">تمت الموافقة</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="نوع الخدمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الخدمات</SelectItem>
                {serviceTypes.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Grid */}
      {filteredRequests.length > 0 ? (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredRequests.map((request) => {
            const serviceType = getServiceType(request.service_type);
            const ServiceIcon = serviceType.icon;
            
            return (
              <ResponsiveCard key={request.id} size="md" className="hover-scale">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {request.request_number}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                        {request.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={serviceType.color}>
                      <ServiceIcon className="w-3 h-3 mr-1" />
                      {serviceType.label}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(request.priority)}>
                      أولوية {getPriorityText(request.priority)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ الإرسال: {new Date(request.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    
                    {request.deadline && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>الموعد النهائي: {new Date(request.deadline).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>الميزانية: {getBudgetText(request.budget)}</span>
                    </div>
                    
                    {request.additional_services && request.additional_services.length > 0 && (
                      <div className="text-xs">
                        خدمات إضافية: {request.additional_services.length} عنصر
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض التفاصيل
                    </Button>
                    
                    {['approved', 'in_progress'].includes(request.status) && (
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        تواصل
                      </Button>
                    )}
                  </div>
                </div>
              </ResponsiveCard>
            );
          })}
        </ResponsiveGrid>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد طلبات خدمة</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' 
                ? 'لا توجد طلبات مطابقة لمعايير البحث'
                : 'لم يتم إنشاء أي طلبات خدمة حتى الآن'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && serviceFilter === 'all' && (
              <Button onClick={() => navigate('/client/new-service-request')}>
                <Plus className="w-4 h-4 mr-2" />
                طلب خدمة جديدة
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}