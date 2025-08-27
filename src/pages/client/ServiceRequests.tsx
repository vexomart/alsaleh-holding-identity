import React, { useState } from 'react';
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
  Code
} from 'lucide-react';
import { Link } from 'react-router-dom';

const serviceTypes = [
  { id: 'web-development', label: 'تطوير المواقع', icon: Code, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'mobile-app', label: 'تطبيقات الجوال', icon: Globe, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'design', label: 'التصميم', icon: Palette, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 'business', label: 'الخدمات التجارية', icon: Briefcase, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
];

const mockRequests = [
  {
    id: '1',
    title: 'تطوير موقع إلكتروني للشركة',
    service_type: 'web-development',
    status: 'pending',
    priority: 'high',
    created_at: '2024-01-15',
    description: 'نحتاج إلى تطوير موقع إلكتروني حديث للشركة مع إدارة المحتوى',
    budget_range: '10000-20000'
  },
  {
    id: '2',
    title: 'تصميم هوية بصرية',
    service_type: 'design',
    status: 'in_progress',
    priority: 'medium',
    created_at: '2024-01-10',
    description: 'تصميم شعار وهوية بصرية كاملة للعلامة التجارية',
    budget_range: '5000-10000'
  },
  {
    id: '3',
    title: 'تطبيق جوال للتسوق',
    service_type: 'mobile-app',
    status: 'completed',
    priority: 'high',
    created_at: '2024-01-05',
    description: 'تطوير تطبيق جوال للتسوق الإلكتروني',
    budget_range: '20000-30000'
  }
];

export default function ServiceRequests() {
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'in_progress': 'قيد المراجعة',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colorMap[priority] || 'text-gray-600';
  };

  const getServiceType = (serviceId: string) => {
    return serviceTypes.find(s => s.id === serviceId) || serviceTypes[0];
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesService = serviceFilter === 'all' || request.service_type === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلبات الخدمة</h1>
          <p className="text-muted-foreground">إدارة ومتابعة جميع طلبات الخدمة</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          طلب خدمة جديدة
        </Button>
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
              <div className="text-sm text-orange-700 dark:text-orange-300">قيد المراجعة</div>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
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
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="in_progress">قيد المراجعة</SelectItem>
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
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                        {request.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                    <Badge className={serviceType.color}>
                      <ServiceIcon className="w-3 h-3 mr-1" />
                      {serviceType.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(request.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                        أولوية {request.priority === 'high' ? 'عالية' : request.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                    </div>
                  </div>

                  {request.budget_range && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">الميزانية المتوقعة: </span>
                      {request.budget_range} ريال
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      عرض التفاصيل
                    </Button>
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
              <Button>
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