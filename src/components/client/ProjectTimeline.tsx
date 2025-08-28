import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectPhase {
  id: string;
  phase_name: string;
  description?: string;
  phase_number: number;
  status: string;
  progress_percentage: number;
  start_date?: string;
  end_date?: string;
  estimated_duration_days?: number;
  notes?: string;
}

interface ProjectUpdate {
  id: string;
  update_type: string;
  title: string;
  description?: string;
  created_at: string;
  metadata?: any;
}

interface ProjectTimelineProps {
  projectId: string;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId }) => {
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      // Fetch project phases
      const { data: phasesData, error: phasesError } = await supabase
        .from('project_phases')
        .select('*')
        .eq('project_id', projectId)
        .order('phase_number');

      if (phasesError) throw phasesError;

      // Fetch project updates (timeline)
      const { data: updatesData, error: updatesError } = await supabase
        .from('project_timeline')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (updatesError) {
        console.warn('Project timeline table not found, using sample data');
        setUpdates([]);
      } else {
        setUpdates(updatesData || []);
      }

      setPhases(phasesData || []);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPhaseStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'in_progress': return 'قيد التنفيذ';
      case 'pending': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'update': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'issue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'note': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Phases */}
      {phases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>مراحل المشروع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPhaseIcon(phase.status)}
                    <div>
                      <h4 className="font-medium">{phase.phase_name}</h4>
                      <p className="text-sm text-muted-foreground">المرحلة {phase.phase_number}</p>
                    </div>
                  </div>
                  <Badge className={getPhaseStatusColor(phase.status)}>
                    {getPhaseStatusText(phase.status)}
                  </Badge>
                </div>

                {phase.description && (
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                )}

                {phase.progress_percentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>التقدم</span>
                      <span>{phase.progress_percentage}%</span>
                    </div>
                    <Progress value={phase.progress_percentage} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {phase.start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>البداية: {new Date(phase.start_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                  {phase.end_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>النهاية: {new Date(phase.end_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>

                {phase.notes && (
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <strong>ملاحظات:</strong> {phase.notes}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Project Timeline Updates */}
      <Card>
        <CardHeader>
          <CardTitle>تحديثات المشروع</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border-l-2 border-muted pl-4 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getUpdateTypeColor(update.update_type)}>
                      {update.update_type === 'milestone' ? 'معلم هام' :
                       update.update_type === 'update' ? 'تحديث' :
                       update.update_type === 'issue' ? 'مشكلة' : 'ملاحظة'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(update.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <h4 className="font-medium mb-1">{update.title}</h4>
                  {update.description && (
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <p>لا توجد تحديثات للمشروع حتى الآن</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};