/**
 * Services Management - Modern Unified Design
 * Premium services management with SaaS aesthetics
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { db } from '@/integrations/supabase/db';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

import { ServiceCard } from './ServiceCard';
import { ServicesPagination } from './ServicesPagination';
import { ServicesStats } from './ServicesStats';
import { ServicesFilters } from './ServicesFilters';
import { ServiceFormDialog } from './ServiceFormDialog';

// Types
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

const ITEMS_PER_PAGE = 10;

export function ServicesManagement() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  // State
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  // Fetch services
  const fetchServices = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const { data, error } = await db
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      if (!silent) {
        toast.error(isRTL ? 'خطأ في جلب الخدمات' : 'Error fetching services');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isRTL]);

  useEffect(() => {
    fetchServices();

    const channel = supabase
      .channel('services-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        () => {
          fetchServices(true);
          toast.info(isRTL ? '🔄 تم تحديث الخدمات' : '🔄 Services updated', { duration: 2000 });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchServices, isRTL]);

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.name_ar && service.name_ar.includes(searchQuery)) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && service.is_active) ||
        (statusFilter === 'inactive' && !service.is_active);
      
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
      
      const matchesVisibility = visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && service.is_visible_to_customers) ||
        (visibilityFilter === 'hidden' && !service.is_visible_to_customers);
      
      return matchesSearch && matchesStatus && matchesCategory && matchesVisibility;
    });
  }, [services, searchQuery, statusFilter, categoryFilter, visibilityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, visibilityFilter]);

  // CRUD Operations
  const handleSubmit = async () => {
    if (!formData.name || !formData.name_ar) {
      toast.error(isRTL ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields');
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
        toast.success(isRTL ? '✅ تم تحديث الخدمة بنجاح' : '✅ Service updated');
      } else {
        const { error } = await db
          .from('services')
          .insert(serviceData);

        if (error) throw error;
        toast.success(isRTL ? '✅ تم إضافة الخدمة بنجاح' : '✅ Service added');
      }

      setFormDialogOpen(false);
      setFormData(initialFormData);
      setIsEditing(false);
      setSelectedService(null);
    } catch (err) {
      console.error('Error saving service:', err);
      toast.error(isRTL ? 'خطأ في حفظ الخدمة' : 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await db
        .from('services')
        .delete()
        .eq('id', selectedService.id);

      if (error) throw error;
      
      toast.success(isRTL ? '✅ تم حذف الخدمة بنجاح' : '✅ Service deleted');
      setDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error(isRTL ? 'خطأ في حذف الخدمة' : 'Error deleting service');
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      const { error } = await db
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) throw error;
      
      toast.success(
        service.is_active 
          ? (isRTL ? 'تم إلغاء تفعيل الخدمة' : 'Service deactivated')
          : (isRTL ? 'تم تفعيل الخدمة' : 'Service activated')
      );
    } catch (err) {
      console.error('Error toggling status:', err);
      toast.error(isRTL ? 'خطأ في تغيير الحالة' : 'Error toggling status');
    }
  };

  const handleToggleVisibility = async (service: Service) => {
    try {
      const { error } = await db
        .from('services')
        .update({ is_visible_to_customers: !service.is_visible_to_customers })
        .eq('id', service.id);

      if (error) throw error;
      
      toast.success(
        service.is_visible_to_customers 
          ? (isRTL ? 'تم إخفاء الخدمة' : 'Service hidden')
          : (isRTL ? 'الخدمة مرئية الآن' : 'Service visible now')
      );
    } catch (err) {
      console.error('Error toggling visibility:', err);
      toast.error(isRTL ? 'خطأ في تغيير الظهور' : 'Error toggling visibility');
    }
  };

  const handleDuplicate = async (service: Service) => {
    try {
      const maxSortOrder = Math.max(...services.map(s => s.sort_order || 0), 0) + 1;
      
      const { error } = await db
        .from('services')
        .insert({
          name: `${service.name} (Copy)`,
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
      toast.success(isRTL ? '✅ تم نسخ الخدمة بنجاح' : '✅ Service duplicated');
    } catch (err) {
      console.error('Error duplicating service:', err);
      toast.error(isRTL ? 'خطأ في نسخ الخدمة' : 'Error duplicating service');
    }
  };

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

  const openAddDialog = () => {
    setSelectedService(null);
    setFormData(initialFormData);
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const getCategoryLabel = (category: string | null) => {
    const found = categories.find(c => c.value === category);
    if (found) {
      return isRTL ? found.label : found.labelEn;
    }
    return category || (isRTL ? 'غير محدد' : 'Unspecified');
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <Package className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {isRTL ? 'إدارة الخدمات' : 'Services Management'}
              </h1>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                {services.length}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isRTL ? 'إدارة وتنظيم الخدمات المتاحة للعملاء' : 'Manage services available to customers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Status */}
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1.5 px-3 py-1.5",
              isConnected 
                ? "bg-accent/10 text-accent border-accent/30" 
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}
          >
            {isConnected ? (
              <>
                <Zap className="h-3.5 w-3.5" />
                {isRTL ? 'متصل' : 'LIVE'}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {isRTL ? 'غير متصل' : 'Offline'}
              </>
            )}
          </Badge>

          <Button
            onClick={openAddDialog}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{isRTL ? 'إضافة خدمة' : 'Add Service'}</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <ServicesStats services={services} />

      {/* Filters */}
      <ServicesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        visibilityFilter={visibilityFilter}
        onVisibilityChange={setVisibilityFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categories={categories}
        onRefresh={() => fetchServices(true)}
        isRefreshing={isRefreshing}
        totalFiltered={filteredServices.length}
        totalServices={services.length}
      />

      {/* Services Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
              : "grid-cols-1"
          )}>
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="h-64 rounded-2xl bg-muted animate-pulse" 
              />
            ))}
          </div>
        ) : paginatedServices.length === 0 ? (
          <Card className="border-border/50 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Package className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {isRTL ? 'لا توجد خدمات' : 'No services found'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? (isRTL ? 'لم يتم العثور على خدمات تطابق معايير البحث' : 'No services match your filters')
                  : (isRTL ? 'ابدأ بإضافة خدمتك الأولى' : 'Start by adding your first service')}
              </p>
              <Button onClick={openAddDialog} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {isRTL ? 'إضافة خدمة جديدة' : 'Add new service'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" 
              : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {paginatedServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onView={(s) => {
                    setSelectedService(s);
                    setViewDialogOpen(true);
                  }}
                  onEdit={openEditDialog}
                  onDelete={(s) => {
                    setSelectedService(s);
                    setDeleteDialogOpen(true);
                  }}
                  onToggleStatus={handleToggleStatus}
                  onToggleVisibility={handleToggleVisibility}
                  onDuplicate={handleDuplicate}
                  getCategoryLabel={getCategoryLabel}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && filteredServices.length > ITEMS_PER_PAGE && (
        <ServicesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredServices.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تفاصيل الخدمة' : 'Service Details'}</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  {selectedService.image_url ? (
                    <img 
                      src={selectedService.image_url} 
                      alt={selectedService.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {isRTL ? (selectedService.name_ar || selectedService.name) : selectedService.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? selectedService.name : selectedService.name_ar}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{isRTL ? 'الحالة:' : 'Status:'}</span>
                  <Badge 
                    variant={selectedService.is_active ? 'default' : 'secondary'} 
                    className={cn(
                      "ms-2",
                      selectedService.is_active 
                        ? "bg-accent/10 text-accent" 
                        : ""
                    )}
                  >
                    {selectedService.is_active 
                      ? (isRTL ? 'نشط' : 'Active') 
                      : (isRTL ? 'متوقف' : 'Inactive')}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? 'التصنيف:' : 'Category:'}</span>
                  <span className="ms-2 text-foreground">{getCategoryLabel(selectedService.category)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? 'السعر:' : 'Price:'}</span>
                  <span className="ms-2 font-medium text-foreground">
                    {selectedService.price ? `${selectedService.price} ${selectedService.currency}` : (isRTL ? 'غير محدد' : 'Not set')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{isRTL ? 'الترتيب:' : 'Order:'}</span>
                  <span className="ms-2 text-foreground">{selectedService.sort_order}</span>
                </div>
              </div>

              {(selectedService.description || selectedService.description_ar) && (
                <div>
                  <span className="text-muted-foreground text-sm">{isRTL ? 'الوصف:' : 'Description:'}</span>
                  <p className="mt-1 text-sm text-foreground">
                    {isRTL ? (selectedService.description_ar || selectedService.description) : selectedService.description}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>{isRTL ? 'تاريخ الإنشاء:' : 'Created:'} {selectedService.created_at ? new Date(selectedService.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US') : '-'}</p>
                <p>{isRTL ? 'آخر تحديث:' : 'Updated:'} {selectedService.updated_at ? new Date(selectedService.updated_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US') : '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Form Dialog */}
      <ServiceFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        isSaving={saving}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}</DialogTitle>
            <DialogDescription>
              {isRTL 
                ? `هل أنت متأكد من حذف الخدمة "${selectedService?.name_ar || selectedService?.name}"؟`
                : `Are you sure you want to delete "${selectedService?.name}"?`}
              <br />
              {isRTL ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              {isRTL ? 'حذف' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
