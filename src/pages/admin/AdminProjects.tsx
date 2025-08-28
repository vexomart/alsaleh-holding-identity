import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Calendar, Clock, TrendingUp, BarChart3, Filter, SortAsc, Edit2, Trash2, Eye, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { ResponsiveCard } from '@/components/ResponsiveCard';
import { useCustomerNotifications } from '@/hooks/useCustomerNotifications';
import { ProjectForm } from '@/components/admin/ProjectForm';

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
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { sendProjectUpdate } = useCustomerNotifications();

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

  const handleCreateProject = async (formData: any) => {
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
      
      toast.success('تم إنشاء المشروع بنجاح');
      await fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('حدث خطأ في إنشاء المشروع');
    }
  };

  const handleUpdateProject = async (formData: any) => {
    if (!selectedProject) return;

    try {
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

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', selectedProject.id);

      if (error) throw error;
      
      toast.success('تم تحديث المشروع بنجاح');
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

  const sortedAndFilteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.project_number?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Project];
      let bValue = b[sortBy as keyof Project];
      
      if (sortBy === 'created_at' || sortBy === 'start_date' || sortBy === 'due_date') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0;
        bValue = bValue ? new Date(bValue as string).getTime() : 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedProject(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    planning: projects.filter(p => p.status === 'planning').length,
    overdue: projects.filter(p => 
      p.due_date && 
      new Date(p.due_date) < new Date() && 
      p.status !== 'completed'
    ).length
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
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              إدارة المشاريع
              <Badge variant="secondary" className="animate-pulse">
                {stats.total} مشروع
              </Badge>
            </h1>
            <p className="text-muted-foreground">لوحة إدارة جميع مشاريع العملاء مع تتبع التقدم</p>
          </div>
          <Button onClick={openCreateDialog} className="hover-scale">
            <Plus className="w-4 h-4 ml-2" />
            مشروع جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid cols="1-2-5" gap="md" className="mb-6">
        <ResponsiveCard size="sm" className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover-scale">
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

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/10 dark:to-blue-900/20 hover-scale">
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

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/10 dark:to-emerald-900/20 hover-scale">
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

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/10 dark:to-amber-900/20 hover-scale">
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

        <ResponsiveCard size="sm" className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-900/10 dark:to-red-900/20 hover-scale">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">متأخرة</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg dark:bg-red-900/20">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Filters */}
      <ResponsiveCard className="mb-6">
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
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 ml-2" />
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SortAsc className="w-4 h-4 ml-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">تاريخ الإنشاء</SelectItem>
                  <SelectItem value="name">الاسم</SelectItem>
                  <SelectItem value="due_date">تاريخ التسليم</SelectItem>
                  <SelectItem value="progress_percentage">نسبة الإنجاز</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="hover-scale"
              >
                <SortAsc className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveCard>

      {/* Projects Grid */}
      {sortedAndFilteredProjects.length === 0 ? (
        <ResponsiveCard className="text-center py-12 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <BarChart3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد مشاريع</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'لم يتم العثور على مشاريع تطابق المعايير المحددة'
                  : 'ابدأ بإنشاء مشروعك الأول'
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button onClick={openCreateDialog} className="hover-scale">
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء مشروع جديد
                </Button>
              )}
            </div>
          </div>
        </ResponsiveCard>
      ) : (
        <ResponsiveGrid cols="1-2-3" gap="lg" className="animate-fade-in">
          {sortedAndFilteredProjects.map((project) => (
            <ResponsiveCard key={project.id} className="hover-scale">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {project.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {project.project_number}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status || '')}>
                    {getStatusText(project.status || '')}
                  </Badge>
                  {project.project_type && (
                    <Badge variant="outline">
                      {project.project_type}
                    </Badge>
                  )}
                </div>

                {project.progress_percentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>التقدم</span>
                      <span>{project.progress_percentage}%</span>
                    </div>
                    <Progress value={project.progress_percentage} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {project.start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.start_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{project.budget.toLocaleString()} {project.currency || 'ريال'}</span>
                    </div>
                  )}
                </div>

                {project.user_id && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>العميل: {clients.find(c => c.user_id === project.user_id)?.full_name || 'غير محدد'}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(project)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    تعديل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {}}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openDeleteDialog(project)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      )}

      {/* Project Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'إنشاء مشروع جديد' : 'تعديل المشروع'}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            mode={formMode}
            initialData={selectedProject}
            clients={clients}
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedProject(null);
            }}
            onSubmit={formMode === 'create' ? handleCreateProject : handleUpdateProject}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد حذف المشروع</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف المشروع "{selectedProject?.name}"؟ 
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProjects;