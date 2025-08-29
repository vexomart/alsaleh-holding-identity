import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Filter, 
  Users, 
  FileText,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  Settings,
  Download,
  Upload,
  MessageSquare,
  Bell,
  Flag,
  Eye,
  Edit2,
  Trash2,
  Kanban,
  List,
  MoreHorizontal,
  Zap,
  GitBranch,
  Timer,
  DollarSign,
  PieChart,
  LineChart,
  Folder,
  Link2,
  Share2,
  Star,
  Archive,
  RefreshCw
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

// Enhanced Project Interface
interface EnhancedProject {
  id: string;
  name: string;
  description?: string;
  project_number?: string;
  project_type?: string;
  status?: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled' | 'review';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  progress_percentage?: number;
  budget?: number;
  currency?: string;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  user_id?: string;
  team_members?: any[];
  tasks_count?: number;
  completed_tasks?: number;
  files_count?: number;
  comments_count?: number;
  health_score?: number;
  category?: string;
  tags?: string[];
  client_name?: string;
  project_manager?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage?: number;
  last_activity?: string;
  risk_level?: 'low' | 'medium' | 'high';
  milestone_count?: number;
  active_milestone?: string;
}

// Project Task Interface
interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at?: string;
  completion_percentage?: number;
  dependencies?: string[];
  tags?: string[];
}

// Project Analytics Interface
interface ProjectAnalytics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
  budget_utilization: number;
  team_productivity: number;
  client_satisfaction: number;
  average_completion_time: number;
  revenue_this_month: number;
  tasks_completed_today: number;
}

const EnhancedProjectManagement = () => {
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<EnhancedProject | null>(null);
  const [currentView, setCurrentView] = useState<'kanban' | 'list' | 'calendar' | 'gantt'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, []);

  const fetchProjects = async () => {
    try {
      // Mock data for demonstration - replace with actual Supabase query
      const mockProjects: EnhancedProject[] = [
        {
          id: '1',
          name: 'تطوير موقع شركة التقنية',
          description: 'تطوير موقع إلكتروني متطور للشركة مع لوحة إدارة شاملة',
          project_number: 'PR240001',
          project_type: 'web_development',
          status: 'in_progress',
          priority: 'high',
          progress_percentage: 65,
          budget: 45000,
          currency: 'SAR',
          start_date: '2024-01-15',
          due_date: '2024-04-15',
          created_at: '2024-01-10',
          user_id: 'user1',
          team_members: [
            { id: '1', name: 'أحمد محمد', role: 'مطور أمامي', avatar: '' },
            { id: '2', name: 'فاطمة علي', role: 'مصممة UI/UX', avatar: '' },
            { id: '3', name: 'محمد خالد', role: 'مطور خلفي', avatar: '' }
          ],
          tasks_count: 24,
          completed_tasks: 16,
          files_count: 18,
          comments_count: 45,
          health_score: 85,
          category: 'تطوير مواقع',
          tags: ['React', 'TypeScript', 'Supabase'],
          client_name: 'شركة التقنية المتقدمة',
          project_manager: 'أحمد محمد',
          estimated_hours: 480,
          actual_hours: 312,
          completion_percentage: 65,
          last_activity: '2024-01-20',
          risk_level: 'low',
          milestone_count: 5,
          active_milestone: 'تطوير واجهة المستخدم'
        },
        {
          id: '2',
          name: 'تطبيق إدارة المخزون',
          description: 'تطبيق متكامل لإدارة المخزون مع تتبع المبيعات والمشتريات',
          project_number: 'PR240002',
          project_type: 'mobile_app',
          status: 'planning',
          priority: 'medium',
          progress_percentage: 15,
          budget: 65000,
          currency: 'SAR',
          start_date: '2024-02-01',
          due_date: '2024-06-01',
          created_at: '2024-01-25',
          user_id: 'user2',
          team_members: [
            { id: '4', name: 'سارة أحمد', role: 'مطور تطبيقات', avatar: '' },
            { id: '5', name: 'عبدالله محمد', role: 'محلل أنظمة', avatar: '' }
          ],
          tasks_count: 18,
          completed_tasks: 3,
          files_count: 8,
          comments_count: 12,
          health_score: 75,
          category: 'تطبيقات الجوال',
          tags: ['React Native', 'Firebase', 'Analytics'],
          client_name: 'مؤسسة التجارة الذكية',
          project_manager: 'سارة أحمد',
          estimated_hours: 720,
          actual_hours: 108,
          completion_percentage: 15,
          last_activity: '2024-01-28',
          risk_level: 'medium',
          milestone_count: 6,
          active_milestone: 'تحليل المتطلبات'
        },
        {
          id: '3',
          name: 'نظام إدارة الموارد البشرية',
          description: 'نظام شامل لإدارة الموارد البشرية والرواتب والحضور',
          project_number: 'PR240003',
          project_type: 'enterprise_system',
          status: 'completed',
          priority: 'high',
          progress_percentage: 100,
          budget: 120000,
          currency: 'SAR',
          start_date: '2023-10-01',
          due_date: '2024-01-31',
          created_at: '2023-09-15',
          user_id: 'user3',
          team_members: [
            { id: '6', name: 'خالد عبدالله', role: 'مطور أول', avatar: '' },
            { id: '7', name: 'نورا محمد', role: 'محللة أنظمة', avatar: '' },
            { id: '8', name: 'عمر أحمد', role: 'مختبر أنظمة', avatar: '' }
          ],
          tasks_count: 45,
          completed_tasks: 45,
          files_count: 32,
          comments_count: 89,
          health_score: 95,
          category: 'أنظمة المؤسسات',
          tags: ['Laravel', 'Vue.js', 'MySQL'],
          client_name: 'شركة الخدمات المتكاملة',
          project_manager: 'خالد عبدالله',
          estimated_hours: 960,
          actual_hours: 945,
          completion_percentage: 100,
          last_activity: '2024-01-31',
          risk_level: 'low',
          milestone_count: 8,
          active_milestone: 'مكتمل'
        }
      ];

      setProjects(mockProjects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('حدث خطأ في جلب المشاريع');
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data
      const mockAnalytics: ProjectAnalytics = {
        total_projects: 15,
        active_projects: 8,
        completed_projects: 5,
        overdue_projects: 2,
        budget_utilization: 78.5,
        team_productivity: 92.3,
        client_satisfaction: 96.8,
        average_completion_time: 120,
        revenue_this_month: 285000,
        tasks_completed_today: 12
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'on_hold': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'review': return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-foreground mb-2">جارٍ تحميل نظام إدارة المشاريع</h3>
          <p className="text-muted-foreground">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header with Real-time Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Kanban className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">إدارة المشاريع المتطورة</h1>
                  <p className="text-blue-100 text-lg">نظام شامل ومتطور لإدارة المشاريع بأحدث التقنيات</p>
                </div>
              </div>
              {analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                    <Target className="h-4 w-4" />
                    <div>
                      <div className="font-semibold">{analytics.total_projects}</div>
                      <div className="text-blue-100">إجمالي المشاريع</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                    <Activity className="h-4 w-4" />
                    <div>
                      <div className="font-semibold">{analytics.team_productivity}%</div>
                      <div className="text-blue-100">إنتاجية الفريق</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                    <DollarSign className="h-4 w-4" />
                    <div>
                      <div className="font-semibold">{analytics.revenue_this_month.toLocaleString()}</div>
                      <div className="text-blue-100">إيرادات الشهر</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    <div>
                      <div className="font-semibold">{analytics.tasks_completed_today}</div>
                      <div className="text-blue-100">مهام اليوم</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowProjectDialog(true)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5 ml-2" />
                مشروع جديد
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-5 h-5 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Dashboard */}
        {analytics && (
          <ResponsiveGrid cols="1-2-4" gap="lg">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">المشاريع النشطة</p>
                    <p className="text-3xl font-bold">{analytics.active_projects}</p>
                    <p className="text-emerald-200 text-xs">من {analytics.total_projects} إجمالي</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <PlayCircle className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">معدل رضا العملاء</p>
                    <p className="text-3xl font-bold">{analytics.client_satisfaction}%</p>
                    <p className="text-blue-200 text-xs">تقييم ممتاز</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Star className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">استخدام الميزانية</p>
                    <p className="text-3xl font-bold">{analytics.budget_utilization}%</p>
                    <p className="text-purple-200 text-xs">ضمن المخطط</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <PieChart className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">متوسط الإنجاز</p>
                    <p className="text-3xl font-bold">{analytics.average_completion_time}</p>
                    <p className="text-amber-200 text-xs">يوم</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Timer className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResponsiveGrid>
        )}

        {/* Enhanced Navigation and Filters */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <Button
                  variant={currentView === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('kanban')}
                  className="gap-2"
                >
                  <Kanban className="h-4 w-4" />
                  كانبان
                </Button>
                <Button
                  variant={currentView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('list')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  قائمة
                </Button>
                <Button
                  variant={currentView === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('calendar')}
                  className="gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  تقويم
                </Button>
                <Button
                  variant={currentView === 'gantt' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('gantt')}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  جانت
                </Button>
              </div>

              {/* Search and Filters */}
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
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-12 px-4 border-2 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="planning">تخطيط</option>
                    <option value="in_progress">قيد التنفيذ</option>
                    <option value="completed">مكتمل</option>
                    <option value="on_hold">متوقف</option>
                    <option value="review">مراجعة</option>
                    <option value="cancelled">ملغي</option>
                  </select>

                  <select 
                    value={priorityFilter} 
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="h-12 px-4 border-2 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <option value="all">جميع الأولويات</option>
                    <option value="critical">حرجة</option>
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>

                  <Button variant="outline" size="lg" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    تحديث
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Display based on selected view */}
        {currentView === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Kanban columns */}
            {['planning', 'in_progress', 'review', 'completed'].map(status => (
              <Card key={status} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{status === 'planning' ? 'تخطيط' : 
                           status === 'in_progress' ? 'قيد التنفيذ' : 
                           status === 'review' ? 'مراجعة' : 'مكتمل'}</span>
                    <Badge variant="secondary" className="text-xs">
                      {filteredProjects.filter(p => p.status === status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredProjects
                    .filter(project => project.status === status)
                    .map(project => (
                      <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Project Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm line-clamp-2">{project.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{project.project_number}</p>
                              </div>
                              <Badge className={`text-xs ${getPriorityColor(project.priority || 'medium')}`}>
                                {project.priority === 'critical' ? 'حرجة' : 
                                 project.priority === 'high' ? 'عالية' : 
                                 project.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                              </Badge>
                            </div>

                            {/* Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>التقدم</span>
                                <span>{project.progress_percentage}%</span>
                              </div>
                              <Progress value={project.progress_percentage} className="h-2" />
                            </div>

                            {/* Team Members */}
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {project.team_members?.slice(0, 3).map((member, idx) => (
                                  <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                                    <AvatarFallback className="text-xs">
                                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {(project.team_members?.length || 0) > 3 && (
                                  <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs">+{(project.team_members?.length || 0) - 3}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <FileText className="w-3 h-3" />
                                <span>{project.files_count}</span>
                                <MessageSquare className="w-3 h-3 mr-2" />
                                <span>{project.comments_count}</span>
                              </div>
                            </div>

                            {/* Health Score */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">صحة المشروع</span>
                              <span className={`font-semibold ${getHealthScoreColor(project.health_score || 0)}`}>
                                {project.health_score}%
                              </span>
                            </div>

                            {/* Budget */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">الميزانية</span>
                              <span className="font-semibold">
                                {project.budget?.toLocaleString()} {project.currency}
                              </span>
                            </div>

                            {/* Due Date */}
                            {project.due_date && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CalendarIcon className="w-3 h-3" />
                                <span>الموعد النهائي: {new Date(project.due_date).toLocaleDateString('ar-SA')}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentView === 'list' && (
          <Card className="shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-right p-4 font-semibold">المشروع</th>
                      <th className="text-right p-4 font-semibold">العميل</th>
                      <th className="text-right p-4 font-semibold">الحالة</th>
                      <th className="text-right p-4 font-semibold">الأولوية</th>
                      <th className="text-right p-4 font-semibold">التقدم</th>
                      <th className="text-right p-4 font-semibold">الفريق</th>
                      <th className="text-right p-4 font-semibold">الموعد النهائي</th>
                      <th className="text-right p-4 font-semibold">الميزانية</th>
                      <th className="text-right p-4 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project, index) => (
                      <tr key={project.id} className={`border-b ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.project_number}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">{project.client_name}</div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(project.status || '')}>
                            {project.status === 'planning' ? 'تخطيط' : 
                             project.status === 'in_progress' ? 'قيد التنفيذ' : 
                             project.status === 'completed' ? 'مكتمل' : 
                             project.status === 'review' ? 'مراجعة' : 'أخرى'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getPriorityColor(project.priority || 'medium')}>
                            {project.priority === 'critical' ? 'حرجة' : 
                             project.priority === 'high' ? 'عالية' : 
                             project.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{project.progress_percentage}%</span>
                            </div>
                            <Progress value={project.progress_percentage} className="h-2" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex -space-x-2">
                            {project.team_members?.slice(0, 3).map((member, idx) => (
                              <Avatar key={idx} className="w-8 h-8 border-2 border-white">
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {(project.team_members?.length || 0) > 3 && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs">+{(project.team_members?.length || 0) - 3}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {project.due_date ? new Date(project.due_date).toLocaleDateString('ar-SA') : 'غير محدد'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-semibold">
                            {project.budget?.toLocaleString()} {project.currency}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'calendar' && (
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="text-center py-20">
                <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">عرض التقويم</h3>
                <p className="text-muted-foreground">سيتم تطوير عرض التقويم التفاعلي قريباً</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'gantt' && (
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="text-center py-20">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">مخطط جانت</h3>
                <p className="text-muted-foreground">سيتم تطوير مخطط جانت التفاعلي قريباً</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedProjectManagement;