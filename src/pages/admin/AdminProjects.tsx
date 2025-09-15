import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Calendar, Clock, TrendingUp, BarChart3, Filter, SortAsc, Edit2, Trash2, Eye, User, DollarSign, Target, Activity } from 'lucide-react';
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
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  company?: string;
  role: string;
  site_id: string;
  created_at: string;
  updated_at: string;
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
        .eq('role', 'customer');

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
      case 'planning': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'review': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-foreground mb-2">جارٍ تحميل المشاريع</h3>
          <p className="text-muted-foreground">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">إدارة المشاريع</h1>
                  <p className="text-blue-100 text-lg">لوحة تحكم شاملة لإدارة جميع مشاريع العملاء</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{stats.total} مشروع إجمالي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>{stats.active} نشط</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{stats.completed} مكتمل</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={openCreateDialog} 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5 ml-2" />
              مشروع جديد
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <ResponsiveGrid cols="1-2-5" gap="lg">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">إجمالي المشاريع</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <BarChart3 className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">قيد التنفيذ</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">مكتملة</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">تخطيط</p>
                  <p className="text-3xl font-bold">{stats.planning}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">متأخرة</p>
                  <p className="text-3xl font-bold">{stats.overdue}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Enhanced Filters */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="البحث في المشاريع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 h-12 border-2 focus:border-blue-400 transition-colors"
                    dir="rtl"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 h-12 border-2">
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

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="border-2 hover:bg-blue-50"
                  >
                    <SortAsc className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Projects Grid */}
        {sortedAndFilteredProjects.length === 0 ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-blue-100 rounded-full">
                  <BarChart3 className="h-16 w-16 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">لا توجد مشاريع</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'لم يتم العثور على مشاريع تطابق المعايير المحددة'
                      : 'ابدأ بإنشاء مشروعك الأول'
                    }
                  </p>
                  {(!searchTerm && statusFilter === 'all') && (
                    <Button onClick={openCreateDialog} size="lg" className="shadow-lg hover:shadow-xl">
                      <Plus className="w-5 h-5 ml-2" />
                      إنشاء مشروع جديد
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ResponsiveGrid cols="1-2-3" gap="lg">
            {sortedAndFilteredProjects.map((project, index) => (
              <Card 
                key={project.id} 
                className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            {project.name}
                          </h3>
                          {project.project_number && (
                            <Badge variant="outline" className="text-xs">
                              {project.project_number}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(project.status || '')}>
                      {getStatusText(project.status || '')}
                    </Badge>
                    {project.project_type && (
                      <Badge variant="secondary">
                        {project.project_type}
                      </Badge>
                    )}
                  </div>

                  {project.progress_percentage !== undefined && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">التقدم</span>
                        <span className="font-bold text-blue-600">{project.progress_percentage}%</span>
                      </div>
                      <Progress value={project.progress_percentage} className="h-3" />
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
                        <DollarSign className="w-4 h-4" />
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover:bg-blue-50" 
                      onClick={() => openEditDialog(project)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-green-50">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="hover:bg-red-50"
                      onClick={() => openDeleteDialog(project)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ResponsiveGrid>
        )}

        {/* Project Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
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
              <AlertDialogTitle>تأكيد حذف المشروع</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteProject}
                className="bg-red-600 hover:bg-red-700"
              >
                حذف المشروع
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminProjects;