import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Search, Calendar, DollarSign, User, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { useCustomerNotifications } from '@/hooks/useCustomerNotifications';

interface Project {
  id: string;
  name: string;
  description?: string;
  project_number?: string;
  project_type?: string;
  status?: string;
  progress_percentage?: number;
  budget?: number;
  currency?: string;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  user_id?: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  user_role: string;
}

const AdminProjects = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: '',
    status: 'planning' as 'planning' | 'completed' | 'cancelled' | 'in_progress' | 'review',
    progress_percentage: 0,
    budget: 0,
    currency: 'SAR',
    start_date: '',
    due_date: '',
    user_id: ''
  });
  const navigate = useNavigate();
  const { sendProjectUpdate } = useCustomerNotifications();

  // تحقق من المصادقة والصلاحيات
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }
      
      setUser(session.user);
      await fetchProjects();
      await fetchClients();
    };

    checkAuth();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('حدث خطأ في جلب المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_role', 'client');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const insertData = {
        name: formData.name,
        description: formData.description,
        project_type: formData.project_type,
        status: formData.status,
        progress_percentage: formData.progress_percentage,
        budget: formData.budget,
        currency: formData.currency,
        start_date: formData.start_date || null,
        due_date: formData.due_date || null,
        user_id: formData.user_id
      };

      const { data: insertedData, error } = await supabase
        .from('projects')
        .insert([insertData])
        .select('*')
        .single();

      if (error) throw error;
      
      // إرسال إشعار بإنشاء المشروع الجديد
      if (insertedData && formData.user_id) {
        const clientInfo = clients.find(c => c.user_id === formData.user_id);
        if (clientInfo?.full_name) {
          try {
            // الحصول على بيانات العميل المفصلة
            const { data: clientProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', formData.user_id)
              .single();

            if (clientProfile) {
              await sendProjectUpdate(
                clientProfile.user_id + '@example.com', // يجب استبدال هذا بالإيميل الحقيقي
                clientProfile.full_name || 'عميل كريم',
                {
                  projectName: insertedData.name,
                  projectNumber: insertedData.project_number,
                  projectType: insertedData.project_type,
                  status: getStatusText(insertedData.status || ''),
                  progressPercentage: insertedData.progress_percentage || 0,
                  description: insertedData.description,
                  startDate: insertedData.start_date,
                  dueDate: insertedData.due_date,
                  budget: insertedData.budget,
                  currency: insertedData.currency,
                  updateType: 'created',
                  nextSteps: ['تم إنشاء المشروع', 'سيتم البدء في التنفيذ قريباً'],
                  completedTasks: []
                }
              );
              console.log('تم إرسال إشعار إنشاء المشروع بنجاح');
            }
          } catch (notificationError) {
            console.error('خطأ في إرسال إشعار إنشاء المشروع:', notificationError);
          }
        }
      }
      
      toast.success('تم إنشاء المشروع بنجاح وإرسال الإشعار للعميل');
      setCreateDialogOpen(false);
      resetForm();
      await fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('حدث خطأ في إنشاء المشروع');
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;

    try {
      const oldStatus = selectedProject.status;
      const oldProgress = selectedProject.progress_percentage || 0;
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        project_type: formData.project_type,
        status: formData.status,
        progress_percentage: formData.progress_percentage,
        budget: formData.budget,
        currency: formData.currency,
        start_date: formData.start_date || null,
        due_date: formData.due_date || null,
        user_id: formData.user_id
      };

      const { data: updatedData, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', selectedProject.id)
        .select('*')
        .single();

      if (error) throw error;
      
      // إرسال إشعار تحديث المشروع
      if (updatedData && formData.user_id) {
        const clientInfo = clients.find(c => c.user_id === formData.user_id);
        if (clientInfo?.full_name) {
          try {
            // الحصول على بيانات العميل المفصلة
            const { data: clientProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', formData.user_id)
              .single();

            if (clientProfile) {
              // تحديد نوع التحديث
              const statusChanged = oldStatus !== formData.status;
              const progressChanged = oldProgress !== formData.progress_percentage;
              
              let completedTasks = [];
              let nextSteps = [];
              
              // تحديد المهام المكتملة والخطوات القادمة حسب الحالة والتقدم
              if (statusChanged || progressChanged) {
                if (formData.status === 'in_progress') {
                  completedTasks = ['تم البدء في المشروع', 'تم تجهيز الخطة الأولية'];
                  nextSteps = ['تطوير النماذج الأولية', 'مراجعة مع العميل'];
                } else if (formData.status === 'review') {
                  completedTasks = ['تم الانتهاء من التطوير', 'تم اختبار الوظائف الأساسية'];
                  nextSteps = ['مراجعة العميل', 'تطبيق التعديلات المطلوبة'];
                } else if (formData.status === 'completed') {
                  completedTasks = ['تم إنجاز جميع المتطلبات', 'تم التسليم النهائي', 'تم تدريب العميل'];
                  nextSteps = ['الدعم الفني', 'المتابعة الدورية'];
                }
                
                if (progressChanged && formData.progress_percentage > oldProgress) {
                  completedTasks.push(`تم رفع نسبة الإنجاز إلى ${formData.progress_percentage}%`);
                }
              }

              await sendProjectUpdate(
                clientProfile.user_id + '@example.com', // يجب استبدال هذا بالإيميل الحقيقي
                clientProfile.full_name || 'عميل كريم',
                {
                  projectName: updatedData.name,
                  projectNumber: updatedData.project_number,
                  projectType: updatedData.project_type,
                  status: getStatusText(updatedData.status || ''),
                  progressPercentage: updatedData.progress_percentage || 0,
                  description: updatedData.description,
                  startDate: updatedData.start_date,
                  dueDate: updatedData.due_date,
                  budget: updatedData.budget,
                  currency: updatedData.currency,
                  updateType: 'updated',
                  oldStatus: getStatusText(oldStatus || ''),
                  newStatus: getStatusText(formData.status || ''),
                  progressIncrease: formData.progress_percentage - oldProgress,
                  completedTasks,
                  nextSteps
                }
              );
              console.log('تم إرسال إشعار تحديث المشروع بنجاح');
            }
          } catch (notificationError) {
            console.error('خطأ في إرسال إشعار تحديث المشروع:', notificationError);
          }
        }
      }
      
      toast.success('تم تحديث المشروع بنجاح وإرسال الإشعار للعميل');
      setEditDialogOpen(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('حدث خطأ في تحديث المشروع');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', selectedProject.id);

      if (error) throw error;
      
      toast.success('تم حذف المشروع بنجاح');
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('حدث خطأ في حذف المشروع');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      project_type: '',
      status: 'planning',
      progress_percentage: 0,
      budget: 0,
      currency: 'SAR',
      start_date: '',
      due_date: '',
      user_id: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-muted text-muted-foreground';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'review': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'تخطيط';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'review': return 'مراجعة';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      project_type: project.project_type || '',
      status: (project.status as any) || 'planning',
      progress_percentage: project.progress_percentage || 0,
      budget: project.budget || 0,
      currency: project.currency || 'SAR',
      start_date: project.start_date || '',
      due_date: project.due_date || '',
      user_id: project.user_id || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  // Statistics
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل المشاريع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">إدارة المشاريع</h1>
        <p className="text-muted-foreground">لوحة إدارة جميع مشاريع العملاء</p>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-4" gap="md" className="mb-6">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/10 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/10 dark:to-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">مكتملة</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg dark:bg-emerald-900/20">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </ResponsiveCard>

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/10 dark:to-amber-900/20">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">تخطيط</p>
              <p className="text-2xl font-bold text-amber-600">{stats.planning}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg dark:bg-amber-900/20">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters and Actions */}
      <ResponsiveCard>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث في المشاريع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="planning">تخطيط</SelectItem>
                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="review">مراجعة</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full lg:w-auto">
                <Plus className="w-4 h-4 ml-2" />
                إنشاء مشروع جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-right">إنشاء مشروع جديد</DialogTitle>
                <DialogDescription className="text-right">
                  أدخل تفاصيل المشروع الجديد
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right">اسم المشروع</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم المشروع"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_type" className="text-right">نوع المشروع</Label>
                  <Input
                    id="project_type"
                    value={formData.project_type}
                    onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                    placeholder="تطوير ويب، تطبيق موبايل، إلخ"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-right">وصف المشروع</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="وصف المشروع"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-right">العميل</Label>
                  <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.user_id}>
                          {client.full_name || client.user_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-right">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">تخطيط</SelectItem>
                      <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="review">مراجعة</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="w-full sm:w-auto">
                  إلغاء
                </Button>
                <Button onClick={handleCreateProject} className="w-full sm:w-auto">
                  إنشاء المشروع
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ResponsiveCard>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <ResponsiveCard className="text-center py-12">
          <div className="text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">لا توجد مشاريع</p>
            <p className="text-sm">قم بإنشاء مشروع جديد للبدء</p>
          </div>
        </ResponsiveCard>
      ) : (
        <ResponsiveGrid cols="1-2-3" gap="md">
          {filteredProjects.map((project) => (
            <ResponsiveCard key={project.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-right flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                </div>
                <Badge className={getStatusColor(project.status || '')}>{getStatusText(project.status || '')}</Badge>
              </div>

              {project.progress_percentage !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">التقدم</span>
                    <span className="font-medium">{project.progress_percentage}%</span>
                  </div>
                  <Progress value={project.progress_percentage} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.budget} {project.currency}</span>
                  </div>
                )}
                {project.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">{new Date(project.start_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(project)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(project)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription className="text-right">
                        هل أنت متأكد من حذف المشروع "{selectedProject?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل المشروع</DialogTitle>
            <DialogDescription className="text-right">
              تحديث تفاصيل المشروع
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-right">اسم المشروع</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="اسم المشروع"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project_type" className="text-right">نوع المشروع</Label>
              <Input
                id="edit-project_type"
                value={formData.project_type}
                onChange={(e) => setFormData({...formData, project_type: e.target.value})}
                placeholder="تطوير ويب، تطبيق موبايل، إلخ"
                dir="rtl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-description" className="text-right">وصف المشروع</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="وصف المشروع"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-right">الحالة</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">تخطيط</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="review">مراجعة</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-progress" className="text-right">نسبة التقدم (%)</Label>
              <Input
                id="edit-progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress_percentage}
                onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button onClick={handleUpdateProject} className="w-full sm:w-auto">
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;