import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, DollarSign, User, Clock, Target, Star, TrendingUp } from 'lucide-react';
import { ResponsiveCard } from '@/components/ResponsiveCard';

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

interface ProjectCardProps {
  project: Project;
  clients: UserProfile[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const getProjectTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    'web_development': '🌐',
    'mobile_app': '📱',
    'desktop_app': '💻',
    'ecommerce': '🛒',
    'branding': '🎨',
    'marketing': '📈',
    'consulting': '💡',
    'other': '📋'
  };
  return icons[type] || '📋';
};

const getPriorityIcon = (progress: number) => {
  if (progress === 100) return '🏆';
  if (progress >= 75) return '🚀';
  if (progress >= 50) return '⚡';
  if (progress >= 25) return '📈';
  return '🎯';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  clients,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusText
}) => {
  const clientInfo = clients.find(c => c.user_id === project.user_id);
  const isOverdue = project.due_date && new Date(project.due_date) < new Date() && project.status !== 'completed';
  const progress = project.progress_percentage || 0;
  
  const daysUntilDue = project.due_date 
    ? Math.ceil((new Date(project.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <ResponsiveCard className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
      isOverdue ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getProjectTypeIcon(project.project_type || '')}</span>
              <Badge variant="outline" className="text-xs">
                {project.project_number || 'N/A'}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  متأخر
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description || 'لا يوجد وصف'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(project)}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(project)}
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getPriorityIcon(progress)}</span>
              <span className="text-sm font-medium">نسبة الإنجاز</span>
            </div>
            <Badge variant="secondary" className="font-mono">
              {progress}%
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status and Client */}
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(project.status || '')}>
            {getStatusText(project.status || '')}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate max-w-24">
              {clientInfo?.full_name || 'غير محدد'}
            </span>
          </div>
        </div>

        {/* Budget and Timeline */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {project.budget && project.budget > 0 && (
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">{project.budget.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{project.currency}</div>
              </div>
            </div>
          )}
          
          {project.due_date && (
            <div className={`flex items-center gap-2 rounded-lg p-2 ${
              isOverdue 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
                : daysUntilDue && daysUntilDue <= 7 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                  : 'bg-muted/50'
            }`}>
              <Calendar className="h-4 w-4" />
              <div>
                <div className="font-medium">
                  {daysUntilDue !== null && daysUntilDue >= 0 
                    ? `${daysUntilDue} يوم`
                    : isOverdue 
                      ? 'متأخر'
                      : 'منتهي'
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(project.due_date).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Timeline */}
        {project.start_date && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
            <Clock className="h-3 w-3" />
            <span>
              بدء: {new Date(project.start_date).toLocaleDateString('ar-SA')}
            </span>
            {project.due_date && (
              <>
                <span>•</span>
                <span>
                  انتهاء: {new Date(project.due_date).toLocaleDateString('ar-SA')}
                </span>
              </>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>
              {project.created_at 
                ? `منذ ${Math.ceil((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24))} يوم`
                : 'تاريخ غير محدد'
              }
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-7 px-2 text-xs hover-scale"
            >
              تحديث
            </Button>
          </div>
        </div>
      </CardContent>
    </ResponsiveCard>
  );
};