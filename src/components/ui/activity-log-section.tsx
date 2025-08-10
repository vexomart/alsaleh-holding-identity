import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Activity, LogIn, LogOut, User, CreditCard, MessageCircle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ActivityLog {
  id: string;
  activity_type: string;
  description?: string;
  ip_address?: any;
  user_agent?: string;
  metadata: any;
  created_at: string;
  user_id: string;
}

export function ActivityLogSection() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('خطأ في تحميل سجل النشاط');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="h-4 w-4 text-green-600" />;
      case 'logout': return <LogOut className="h-4 w-4 text-orange-600" />;
      case 'profile_update': return <User className="h-4 w-4 text-blue-600" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'ticket_created': return <MessageCircle className="h-4 w-4 text-indigo-600" />;
      case 'service_request': return <FileText className="h-4 w-4 text-teal-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'logout': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'profile_update': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'payment': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'ticket_created': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      case 'service_request': return 'bg-teal-500/10 text-teal-600 border-teal-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'login': return 'تسجيل دخول';
      case 'logout': return 'تسجيل خروج';
      case 'profile_update': return 'تحديث الملف الشخصي';
      case 'payment': return 'عملية دفع';
      case 'ticket_created': return 'إنشاء تذكرة';
      case 'service_request': return 'طلب خدمة';
      case 'password_change': return 'تغيير كلمة المرور';
      default: return type;
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          سجل النشاط
        </CardTitle>
        <CardDescription>
          تتبع جميع العمليات والأنشطة في حسابك
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد أنشطة بعد</p>
            <p className="text-sm">ستظهر هنا جميع العمليات التي تقوم بها</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200 hover-scale"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fade-in 0.4s ease-out forwards'
                }}
              >
                <div className="p-1.5 bg-background rounded-full border">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${getActivityColor(activity.activity_type)}`}>
                      {getActivityText(activity.activity_type)}
                    </Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-foreground mb-1">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {new Date(activity.created_at).toLocaleDateString('ar-SA')}
                    </span>
                    <span>
                      {new Date(activity.created_at).toLocaleTimeString('ar-SA')}
                    </span>
                    {activity.ip_address && (
                      <span className="text-xs text-muted-foreground/70">
                        IP: {activity.ip_address}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}