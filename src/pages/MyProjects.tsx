import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CheckCircle, AlertCircle, Users, Calendar, DollarSign, LogOut, Home } from 'lucide-react';
import { db, supabase } from "@/integrations/supabase/db";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  project_number: string;
  project_type: string;
  status: string;
  progress_percentage: number;
  budget: number;
  currency: string;
  start_date: string;
  due_date: string;
  created_at: string;
}

interface ProjectPhase {
  id: string;
  project_id: string;
  phase_number: number;
  phase_name: string;
  description: string;
  status: string;
  progress_percentage: number;
  estimated_duration_days: number;
  start_date: string;
  end_date: string;
}

interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  update_type: string;
  created_at: string;
  old_status: string;
  new_status: string;
}

const MyProjects = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [timeline, setTimeline] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  // تحقق من المصادقة وجلب البيانات
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      await fetchUserProfile(session.user.id);
      await fetchProjects();
    };

    checkAuth();

    // استمع لتغييرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await db
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await db
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      
      // اختيار أول مشروع تلقائياً
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('حدث خطأ في جلب المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetails = async (projectId: string) => {
    try {
      // جلب مراحل المشروع
      const { data: phasesData, error: phasesError } = await db
        .from('project_phases')
        .select('*')
        .eq('project_id', projectId)
        .order('phase_number');

      if (phasesError) throw phasesError;
      setPhases(phasesData || []);

      // جلب تحديثات المشروع
      const { data: timelineData, error: timelineError } = await db
        .from('project_timeline')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (timelineError) throw timelineError;
      setTimeline(timelineData || []);

    } catch (error) {
      console.error('Error fetching project details:', error);
      toast.error('حدث خطأ في جلب تفاصيل المشروع');
    }
  };

  useEffect(() => {
    if (selectedProject) {
      fetchProjectDetails(selectedProject.id);
    }
  }, [selectedProject]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    } else {
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'in_progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'review': return 'قيد المراجعة';
      case 'on_hold': return 'متوقف مؤقتاً';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'milestone':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'progress':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل مشاريعك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              مشاريعي
            </h1>
            <p className="text-muted-foreground text-lg">
              أهلاً بك {userProfile?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                الرئيسية
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-96">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد مشاريع بعد</h3>
              <p className="text-muted-foreground text-center">
                لم يتم إنشاء أي مشاريع لحسابك حتى الآن.<br />
                تواصل مع فريق المبيعات لبدء مشروعك الأول.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* قائمة المشاريع */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    مشاريعي ({projects.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedProject?.id === project.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)} variant="secondary">
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-2">
                        {project.project_number}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>التقدم</span>
                          <span>{project.progress_percentage}%</span>
                        </div>
                        <Progress value={project.progress_percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* تفاصيل المشروع */}
            <div className="lg:col-span-3">
              {selectedProject ? (
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                    <TabsTrigger value="phases">المراحل</TabsTrigger>
                    <TabsTrigger value="timeline">التايم لاين</TabsTrigger>
                  </TabsList>

                  {/* نظرة عامة */}
                  <TabsContent value="overview" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl">{selectedProject.name}</CardTitle>
                            <CardDescription>{selectedProject.description}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(selectedProject.status)} variant="secondary">
                            {getStatusText(selectedProject.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              تاريخ البداية
                            </div>
                            <p className="font-semibold">
                              {selectedProject.start_date 
                                ? new Date(selectedProject.start_date).toLocaleDateString('ar-SA')
                                : 'غير محدد'
                              }
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              تاريخ الاستحقاق
                            </div>
                            <p className="font-semibold">
                              {selectedProject.due_date 
                                ? new Date(selectedProject.due_date).toLocaleDateString('ar-SA')
                                : 'غير محدد'
                              }
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <DollarSign className="w-4 h-4" />
                              الميزانية
                            </div>
                            <p className="font-semibold">
                              {selectedProject.budget 
                                ? `${selectedProject.budget.toLocaleString()} ${selectedProject.currency || 'SAR'}`
                                : 'غير محدد'
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">إجمالي التقدم</span>
                            <span className="text-sm text-muted-foreground">
                              {selectedProject.progress_percentage}%
                            </span>
                          </div>
                          <Progress value={selectedProject.progress_percentage} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* المراحل */}
                  <TabsContent value="phases" className="space-y-4">
                    {phases.map((phase) => (
                      <Card key={phase.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                المرحلة {phase.phase_number}: {phase.phase_name}
                              </h3>
                              <p className="text-muted-foreground">{phase.description}</p>
                            </div>
                            <Badge className={getStatusColor(phase.status)} variant="secondary">
                              {getStatusText(phase.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">المدة المقدرة</span>
                              <p className="font-medium">{phase.estimated_duration_days} يوم</p>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">تاريخ البداية</span>
                              <p className="font-medium">
                                {phase.start_date 
                                  ? new Date(phase.start_date).toLocaleDateString('ar-SA')
                                  : 'لم يبدأ بعد'
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>تقدم المرحلة</span>
                              <span>{phase.progress_percentage}%</span>
                            </div>
                            <Progress value={phase.progress_percentage} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* التايم لاين */}
                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>تحديثات المشروع</CardTitle>
                        <CardDescription>تتبع جميع التحديثات والتغييرات في المشروع</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {timeline.map((update) => (
                            <div key={update.id} className="flex gap-4 p-4 border rounded-lg">
                              <div className="flex-shrink-0 mt-1">
                                {getUpdateTypeIcon(update.update_type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{update.title}</h4>
                                <p className="text-muted-foreground text-sm mt-1">
                                  {update.description}
                                </p>
                                {update.old_status && update.new_status && (
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      من: {getStatusText(update.old_status)}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      إلى: {getStatusText(update.new_status)}
                                    </Badge>
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(update.created_at).toLocaleString('ar-SA')}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                          {timeline.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              لا توجد تحديثات بعد
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>اختر مشروعاً من القائمة لعرض التفاصيل</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;