/**
 * Services Management - Admin Dashboard
 * Full CRUD with animations, RTL support, and advanced features
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Layers,
  Image,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Copy,
  EyeOff,
  Receipt,
  GripVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { updateServicesSortOrder } from '@/lib/api/services';

interface Service {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  short_description: string | null;
  short_description_ar: string | null;
  price: number | null;
  currency: string | null;
  include_vat: boolean | null;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean | null;
  is_visible_to_customers: boolean | null;
  sort_order: number | null;
  tenant_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ServiceFormData {
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  short_description: string;
  short_description_ar: string;
  price: string;
  currency: string;
  include_vat: boolean;
  category: string;
  icon: string;
  image_url: string;
  is_active: boolean;
  is_visible_to_customers: boolean;
  sort_order: string;
}

const initialFormData: ServiceFormData = {
  name: '',
  name_ar: '',
  description: '',
  description_ar: '',
  short_description: '',
  short_description_ar: '',
  price: '',
  currency: 'SAR',
  include_vat: false,
  category: '',
  icon: '',
  image_url: '',
  is_active: true,
  is_visible_to_customers: true,
  sort_order: '0',
};

const categories = [
  { value: 'legal', label: 'قانوني', labelEn: 'Legal' },
  { value: 'consulting', label: 'استشارات', labelEn: 'Consulting' },
  { value: 'technical', label: 'تقني', labelEn: 'Technical' },
  { value: 'financial', label: 'مالي', labelEn: 'Financial' },
  { value: 'marketing', label: 'تسويق', labelEn: 'Marketing' },
  { value: 'development', label: 'تطوير', labelEn: 'Development' },
  { value: 'design', label: 'تصميم', labelEn: 'Design' },
  { value: 'support', label: 'دعم فني', labelEn: 'Support' },
  { value: 'training', label: 'تدريب', labelEn: 'Training' },
  { value: 'other', label: 'أخرى', labelEn: 'Other' },
];

export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await db
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast({
        title: 'خطأ في جلب الخدمات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    // Real-time subscription
    const channel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        () => {
          fetchServices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Stats
  const stats = {
    total: services.length,
    active: services.filter(s => s.is_active).length,
    inactive: services.filter(s => !s.is_active).length,
    categories: [...new Set(services.map(s => s.category).filter(Boolean))].length,
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.name_ar && service.name_ar.includes(searchQuery)) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && service.is_active) ||
      (statusFilter === 'inactive' && !service.is_active);
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.name_ar) {
      toast({
        title: 'يرجى ملء الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const serviceData = {
        name: formData.name,
        name_ar: formData.name_ar || null,
        description: formData.description || null,
        description_ar: formData.description_ar || null,
        short_description: formData.short_description || null,
        short_description_ar: formData.short_description_ar || null,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency || 'SAR',
        include_vat: formData.include_vat,
        category: formData.category || null,
        icon: formData.icon || null,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        is_visible_to_customers: formData.is_visible_to_customers,
        sort_order: parseInt(formData.sort_order) || 0,
      };

      if (isEditing && selectedService) {
        const { error } = await db
          .from('services')
          .update(serviceData)
          .eq('id', selectedService.id);

        if (error) throw error;
        toast({ title: 'تم تحديث الخدمة بنجاح' });
      } else {
        const { error } = await db
          .from('services')
          .insert(serviceData);

        if (error) throw error;
        toast({ title: 'تم إضافة الخدمة بنجاح' });
      }

      setFormDialogOpen(false);
      setFormData(initialFormData);
      setIsEditing(false);
      setSelectedService(null);
    } catch (err) {
      console.error('Error saving service:', err);
      toast({
        title: isEditing ? 'خطأ في تحديث الخدمة' : 'خطأ في إضافة الخدمة',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await db
        .from('services')
        .delete()
        .eq('id', selectedService.id);

      if (error) throw error;
      
      toast({ title: 'تم حذف الخدمة بنجاح' });
      setDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      toast({
        title: 'خطأ في حذف الخدمة',
        variant: 'destructive',
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (service: Service) => {
    try {
      const { error } = await db
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) throw error;
      
      toast({ 
        title: service.is_active ? 'تم إلغاء تفعيل الخدمة' : 'تم تفعيل الخدمة' 
      });
    } catch (err) {
      console.error('Error toggling service status:', err);
      toast({
        title: 'خطأ في تغيير حالة الخدمة',
        variant: 'destructive',
      });
    }
  };

  // Handle toggle visibility
  const handleToggleVisibility = async (service: Service) => {
    try {
      const { error } = await db
        .from('services')
        .update({ is_visible_to_customers: !service.is_visible_to_customers })
        .eq('id', service.id);

      if (error) throw error;
      
      toast({ 
        title: service.is_visible_to_customers ? 'تم إخفاء الخدمة عن العملاء' : 'الخدمة مرئية للعملاء الآن' 
      });
    } catch (err) {
      console.error('Error toggling visibility:', err);
      toast({
        title: 'خطأ في تغيير الظهور',
        variant: 'destructive',
      });
    }
  };

  // Handle move up
  const handleMoveUp = async (service: Service) => {
    const currentIndex = filteredServices.findIndex(s => s.id === service.id);
    if (currentIndex <= 0) return;

    const newServices = [...filteredServices];
    [newServices[currentIndex - 1], newServices[currentIndex]] = 
      [newServices[currentIndex], newServices[currentIndex - 1]];
    
    const orders = newServices.map((s, index) => ({
      id: s.id,
      sort_order: index,
    }));

    try {
      await updateServicesSortOrder(orders);
      toast({ title: 'تم تحديث الترتيب' });
    } catch (err) {
      console.error('Error updating sort order:', err);
      toast({ title: 'خطأ في تحديث الترتيب', variant: 'destructive' });
    }
  };

  // Handle move down
  const handleMoveDown = async (service: Service) => {
    const currentIndex = filteredServices.findIndex(s => s.id === service.id);
    if (currentIndex < 0 || currentIndex >= filteredServices.length - 1) return;

    const newServices = [...filteredServices];
    [newServices[currentIndex], newServices[currentIndex + 1]] = 
      [newServices[currentIndex + 1], newServices[currentIndex]];
    
    const orders = newServices.map((s, index) => ({
      id: s.id,
      sort_order: index,
    }));

    try {
      await updateServicesSortOrder(orders);
      toast({ title: 'تم تحديث الترتيب' });
    } catch (err) {
      console.error('Error updating sort order:', err);
      toast({ title: 'خطأ في تحديث الترتيب', variant: 'destructive' });
    }
  };

  // Handle duplicate service
  const handleDuplicate = async (service: Service) => {
    try {
      const maxSortOrder = Math.max(...services.map(s => s.sort_order || 0), 0) + 1;
      
      const { error } = await db
        .from('services')
        .insert({
          name: `${service.name} (نسخة)`,
          name_ar: service.name_ar ? `${service.name_ar} (نسخة)` : null,
          description: service.description,
          description_ar: service.description_ar,
          price: service.price,
          currency: service.currency,
          include_vat: service.include_vat,
          category: service.category,
          icon: service.icon,
          image_url: service.image_url,
          is_active: false,
          is_visible_to_customers: service.is_visible_to_customers,
          sort_order: maxSortOrder,
        });

      if (error) throw error;
      toast({ title: 'تم نسخ الخدمة بنجاح' });
    } catch (err) {
      console.error('Error duplicating service:', err);
      toast({ title: 'خطأ في نسخ الخدمة', variant: 'destructive' });
    }
  };

  // Open edit dialog
  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      name_ar: service.name_ar || '',
      description: service.description || '',
      description_ar: service.description_ar || '',
      short_description: service.short_description || '',
      short_description_ar: service.short_description_ar || '',
      price: service.price?.toString() || '',
      currency: service.currency || 'SAR',
      include_vat: service.include_vat ?? false,
      category: service.category || '',
      icon: service.icon || '',
      image_url: service.image_url || '',
      is_active: service.is_active ?? true,
      is_visible_to_customers: service.is_visible_to_customers ?? true,
      sort_order: service.sort_order?.toString() || '0',
    });
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  // Open add dialog
  const openAddDialog = () => {
    setSelectedService(null);
    setFormData(initialFormData);
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const getCategoryLabel = (category: string | null) => {
    const found = categories.find(c => c.value === category);
    return found?.label || category || 'غير محدد';
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">إدارة الخدمات</h1>
          <p className="text-muted-foreground text-sm mt-1">
            إدارة وتنظيم الخدمات المتاحة
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة خدمة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">إجمالي الخدمات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">خدمات نشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{stats.inactive}</p>
                  <p className="text-xs text-muted-foreground">خدمات متوقفة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Layers className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-500">{stats.categories}</p>
                  <p className="text-xs text-muted-foreground">التصنيفات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن خدمة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">متوقف</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            قائمة الخدمات ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد خدمات</p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Image/Icon */}
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {service.image_url ? (
                          <img 
                            src={service.image_url} 
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-primary" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-foreground truncate">
                            {service.name_ar || service.name}
                          </h3>
                          <Badge variant={service.is_active ? 'default' : 'secondary'} className="text-xs">
                            {service.is_active ? 'نشط' : 'متوقف'}
                          </Badge>
                          {service.category && (
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(service.category)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {service.description_ar || service.description || 'لا يوجد وصف'}
                        </p>
                        {service.price && (
                          <p className="text-sm font-medium text-primary mt-1">
                            {service.price} {service.currency || 'SAR'}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedService(service);
                            setViewDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(service)}>
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(service)}>
                            {service.is_active ? (
                              <>
                                <XCircle className="h-4 w-4 ml-2" />
                                إلغاء التفعيل
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 ml-2" />
                                تفعيل
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedService(service);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الخدمة</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                  {selectedService.image_url ? (
                    <img 
                      src={selectedService.image_url} 
                      alt={selectedService.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedService.name_ar || selectedService.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedService.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">الحالة:</span>
                  <Badge variant={selectedService.is_active ? 'default' : 'secondary'} className="mr-2">
                    {selectedService.is_active ? 'نشط' : 'متوقف'}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">التصنيف:</span>
                  <span className="mr-2">{getCategoryLabel(selectedService.category)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">السعر:</span>
                  <span className="mr-2 font-medium">
                    {selectedService.price ? `${selectedService.price} ${selectedService.currency}` : 'غير محدد'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">الترتيب:</span>
                  <span className="mr-2">{selectedService.sort_order}</span>
                </div>
              </div>

              {(selectedService.description || selectedService.description_ar) && (
                <div>
                  <span className="text-muted-foreground text-sm">الوصف:</span>
                  <p className="mt-1 text-sm">
                    {selectedService.description_ar || selectedService.description}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>تاريخ الإنشاء: {selectedService.created_at ? new Date(selectedService.created_at).toLocaleDateString('ar-SA') : '-'}</p>
                <p>آخر تحديث: {selectedService.updated_at ? new Date(selectedService.updated_at).toLocaleDateString('ar-SA') : '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'قم بتعديل بيانات الخدمة' : 'أدخل بيانات الخدمة الجديدة'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم (English) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Service Name"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ar">الاسم (عربي) *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="اسم الخدمة"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">الوصف (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Service description"
                  dir="ltr"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">الوصف (عربي)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف الخدمة"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال سعودي</SelectItem>
                    <SelectItem value="USD">دولار أمريكي</SelectItem>
                    <SelectItem value="EUR">يورو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">رابط الصورة</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">ترتيب العرض</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  placeholder="0"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                الخدمة نشطة ومتاحة للعملاء
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إضافة الخدمة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الخدمة "{selectedService?.name_ar || selectedService?.name}"؟
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
