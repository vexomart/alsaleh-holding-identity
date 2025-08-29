import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  Flag,
  CheckCircle,
  Circle,
  PlayCircle,
  PauseCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  MoreHorizontal,
  Tag,
  Link2,
  MessageSquare,
  Paperclip,
  Zap,
  Timer,
  Target,
  GitBranch
} from 'lucide-react';
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  assignee_name?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at?: string;
  completion_percentage?: number;
  dependencies?: string[];
  tags?: string[];
  comments_count?: number;
  attachments_count?: number;
  subtasks_count?: number;
  parent_task_id?: string;
  project_id: string;
}

interface ProjectTaskManagerProps {
  projectId: string;
  projectName: string;
}

const ProjectTaskManager: React.FC<ProjectTaskManagerProps> = ({ projectId, projectName }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline'>('kanban');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      // Mock tasks data - replace with actual Supabase query
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'تصميم واجهة المستخدم الرئيسية',
          description: 'تصميم الصفحة الرئيسية للموقع مع التركيز على تجربة المستخدم',
          status: 'in_progress',
          priority: 'high',
          assigned_to: 'user1',
          assignee_name: 'فاطمة علي',
          due_date: '2024-02-15',
          estimated_hours: 40,
          actual_hours: 25,
          created_at: '2024-01-15',
          completion_percentage: 65,
          dependencies: [],
          tags: ['UI/UX', 'تصميم', 'واجهة'],
          comments_count: 8,
          attachments_count: 5,
          subtasks_count: 4,
          project_id: projectId
        },
        {
          id: '2',
          title: 'تطوير API للمصادقة',
          description: 'إنشاء نظام مصادقة شامل مع JWT والتحكم في الصلاحيات',
          status: 'todo',
          priority: 'critical',
          assigned_to: 'user2',
          assignee_name: 'محمد خالد',
          due_date: '2024-02-10',
          estimated_hours: 30,
          actual_hours: 0,
          created_at: '2024-01-18',
          completion_percentage: 0,
          dependencies: ['1'],
          tags: ['Backend', 'API', 'أمان'],
          comments_count: 3,
          attachments_count: 2,
          subtasks_count: 6,
          project_id: projectId
        },
        {
          id: '3',
          title: 'اختبار التطبيق الشامل',
          description: 'إجراء اختبارات شاملة للتطبيق والتأكد من عمل جميع المزايا',
          status: 'completed',
          priority: 'medium',
          assigned_to: 'user3',
          assignee_name: 'أحمد محمد',
          due_date: '2024-01-30',
          estimated_hours: 50,
          actual_hours: 48,
          created_at: '2024-01-10',
          completion_percentage: 100,
          dependencies: ['1', '2'],
          tags: ['اختبار', 'QA', 'جودة'],
          comments_count: 12,
          attachments_count: 8,
          subtasks_count: 10,
          project_id: projectId
        },
        {
          id: '4',
          title: 'تحسين الأداء والسرعة',
          description: 'تحسين أداء التطبيق وتقليل زمن التحميل',
          status: 'blocked',
          priority: 'medium',
          assigned_to: 'user1',
          assignee_name: 'فاطمة علي',
          due_date: '2024-02-20',
          estimated_hours: 25,
          actual_hours: 10,
          created_at: '2024-01-20',
          completion_percentage: 30,
          dependencies: ['2'],
          tags: ['أداء', 'تحسين', 'سرعة'],
          comments_count: 6,
          attachments_count: 3,
          subtasks_count: 5,
          project_id: projectId
        }
      ];

      setTasks(mockTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('حدث خطأ في جلب المهام');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Circle className="h-4 w-4" />;
      case 'in_progress': return <PlayCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigned_to === assigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل المهام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">مهام المشروع</h2>
          <p className="text-muted-foreground">{projectName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowTaskDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            مهمة جديدة
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي المهام</p>
                <p className="text-2xl font-bold">{taskStats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-500 to-slate-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-100 text-sm">قائمة الانتظار</p>
                <p className="text-2xl font-bold">{taskStats.todo}</p>
              </div>
              <Circle className="h-8 w-8 text-slate-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">قيد التنفيذ</p>
                <p className="text-2xl font-bold">{taskStats.in_progress}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">مكتملة</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">محجوبة</p>
                <p className="text-2xl font-bold">{taskStats.blocked}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">متأخرة</p>
                <p className="text-2xl font-bold">{taskStats.overdue}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <GitBranch className="h-4 w-4" />
                كانبان
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                قائمة
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="gap-2"
              >
                <Timer className="h-4 w-4" />
                الجدول الزمني
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="البحث في المهام..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12"
                  dir="rtl"
                />
              </div>
              
              <div className="flex gap-3">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="todo">قائمة الانتظار</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتملة</option>
                  <option value="blocked">محجوبة</option>
                </select>

                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">جميع الأولويات</option>
                  <option value="critical">حرجة</option>
                  <option value="high">عالية</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">منخفضة</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Display */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['todo', 'in_progress', 'completed', 'blocked'].map(status => (
            <Card key={status} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span>
                      {status === 'todo' ? 'قائمة الانتظار' : 
                       status === 'in_progress' ? 'قيد التنفيذ' : 
                       status === 'completed' ? 'مكتملة' : 'محجوبة'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {filteredTasks.filter(t => t.status === status).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Task Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                            </div>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority === 'critical' ? 'حرجة' : 
                               task.priority === 'high' ? 'عالية' : 
                               task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                            </Badge>
                          </div>

                          {/* Assignee */}
                          {task.assignee_name && (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {task.assignee_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{task.assignee_name}</span>
                            </div>
                          )}

                          {/* Progress */}
                          {task.status === 'in_progress' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>التقدم</span>
                                <span>{task.completion_percentage}%</span>
                              </div>
                              <Progress value={task.completion_percentage} className="h-2" />
                            </div>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{task.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{task.comments_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                <span>{task.attachments_count}</span>
                              </div>
                              {task.subtasks_count && task.subtasks_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <GitBranch className="w-3 h-3" />
                                  <span>{task.subtasks_count}</span>
                                </div>
                              )}
                            </div>
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(task.due_date).toLocaleDateString('ar-SA')}</span>
                              </div>
                            )}
                          </div>

                          {/* Time Tracking */}
                          {task.estimated_hours && (
                            <div className="text-xs">
                              <div className="flex justify-between">
                                <span>الوقت المتوقع: {task.estimated_hours}س</span>
                                <span>الوقت الفعلي: {task.actual_hours}س</span>
                              </div>
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

      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-right p-4 font-semibold">المهمة</th>
                    <th className="text-right p-4 font-semibold">الحالة</th>
                    <th className="text-right p-4 font-semibold">الأولوية</th>
                    <th className="text-right p-4 font-semibold">المكلف</th>
                    <th className="text-right p-4 font-semibold">التقدم</th>
                    <th className="text-right p-4 font-semibold">الموعد النهائي</th>
                    <th className="text-right p-4 font-semibold">الوقت</th>
                    <th className="text-right p-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <tr key={task.id} className={`border-b ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}>
                      <td className="p-4">
                        <div>
                          <div className="font-semibold">{task.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(task.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            <span>
                              {task.status === 'todo' ? 'قائمة الانتظار' : 
                               task.status === 'in_progress' ? 'قيد التنفيذ' : 
                               task.status === 'completed' ? 'مكتملة' : 'محجوبة'}
                            </span>
                          </div>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'critical' ? 'حرجة' : 
                           task.priority === 'high' ? 'عالية' : 
                           task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {task.assignee_name && (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {task.assignee_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee_name}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{task.completion_percentage}%</span>
                          </div>
                          <Progress value={task.completion_percentage} className="h-2" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{task.actual_hours || 0}س / {task.estimated_hours || 0}س</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
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

      {viewMode === 'timeline' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-20">
              <Timer className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">عرض الجدول الزمني</h3>
              <p className="text-muted-foreground">سيتم تطوير عرض الجدول الزمني التفاعلي قريباً</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء مهمة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="عنوان المهمة" />
            <Textarea placeholder="وصف المهمة" rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">قائمة الانتظار</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتملة</SelectItem>
                  <SelectItem value="blocked">محجوبة</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">حرجة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="low">منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" placeholder="الموعد النهائي" />
              <Input type="number" placeholder="الساعات المتوقعة" />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                toast.success('تم إنشاء المهمة بنجاح');
                setShowTaskDialog(false);
              }}>
                إنشاء المهمة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTaskManager;