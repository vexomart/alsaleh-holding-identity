/**
 * Enhanced Account Activity Log Component
 * With real-time updates and filtering
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccountActivity, getActivityLabel, getActivityIcon, ActivityLog } from '@/hooks/useAccountActivity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  RefreshCw,
  Shield,
  CheckCircle2,
  XCircle,
  Smartphone,
  Key,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const riskConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low: { 
    bg: 'bg-green-500/10', 
    text: 'text-green-600', 
    border: 'border-green-500/20',
    label: 'منخفض'
  },
  medium: { 
    bg: 'bg-yellow-500/10', 
    text: 'text-yellow-600', 
    border: 'border-yellow-500/20',
    label: 'متوسط'
  },
  high: { 
    bg: 'bg-red-500/10', 
    text: 'text-red-600', 
    border: 'border-red-500/20',
    label: 'عالي'
  }
};

const activityIcons: Record<string, typeof Activity> = {
  login: LogIn,
  logout: LogOut,
  password_change: Key,
  device_added: Smartphone,
  device_removed: XCircle,
  '2fa_enabled': Shield,
  '2fa_disabled': Shield,
  profile_updated: User,
  failed_login: XCircle,
  verification_code_sent: Key,
  verification_success: CheckCircle2
};

interface ActivityItemProps {
  activity: ActivityLog;
  index: number;
}

const ActivityItem = ({ activity, index }: ActivityItemProps) => {
  const risk = riskConfig[activity.risk_level] || riskConfig.low;
  const ActivityIcon = activityIcons[activity.activity_type] || Activity;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className="relative flex gap-4"
    >
      {/* Timeline dot */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-all",
            risk.bg
          )}
          whileHover={{ scale: 1.1 }}
        >
          <ActivityIcon className={cn("h-5 w-5", risk.text)} />
        </motion.div>
        {/* Timeline line */}
        <div className="w-px flex-1 bg-border mt-2" />
      </div>

      {/* Content */}
      <motion.div 
        className={cn(
          "flex-1 pb-6 cursor-pointer"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          "p-4 rounded-xl border transition-all duration-200",
          "bg-card hover:bg-muted/50",
          isExpanded && "bg-muted/50 border-primary/20"
        )}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">
                {getActivityLabel(activity.activity_type)}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {formatDistanceToNow(new Date(activity.created_at), { 
                    addSuffix: true, 
                    locale: ar 
                  })}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs">
                  {format(new Date(activity.created_at), 'yyyy/MM/dd - HH:mm')}
                </span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn(risk.bg, risk.text, risk.border, "font-medium")}
            >
              {activity.risk_level === 'high' && (
                <AlertTriangle className="h-3 w-3 ml-1" />
              )}
              {risk.label}
            </Badge>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border/50"
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {activity.device_fingerprint && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">بصمة الجهاز</p>
                      <p className="font-mono text-xs bg-muted px-2 py-1 rounded truncate">
                        {activity.device_fingerprint}
                      </p>
                    </div>
                  )}
                  {activity.ip_address && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">عنوان IP</p>
                      <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {String(activity.ip_address)}
                      </p>
                    </div>
                  )}
                  {activity.user_agent && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">المتصفح</p>
                      <p className="text-xs bg-muted px-2 py-1 rounded truncate">
                        {activity.user_agent}
                      </p>
                    </div>
                  )}
                  {activity.metadata && typeof activity.metadata === 'object' && Object.keys(activity.metadata as object).length > 0 && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">بيانات إضافية</p>
                      <div className="bg-muted px-2 py-1 rounded text-xs space-y-1">
                        {Object.entries(activity.metadata as Record<string, unknown>).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AccountActivityLog = () => {
  const { activities, isLoading, fetchActivities } = useAccountActivity(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        getActivityLabel(activity.activity_type).includes(searchQuery) ||
        activity.activity_type.includes(searchQuery);
      
      // Risk filter
      const matchesRisk = riskFilter === 'all' || activity.risk_level === riskFilter;
      
      return matchesSearch && matchesRisk;
    });
  }, [activities, searchQuery, riskFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities();
    setIsRefreshing(false);
  };

  // Stats
  const stats = useMemo(() => ({
    total: activities.length,
    high: activities.filter(a => a.risk_level === 'high').length,
    medium: activities.filter(a => a.risk_level === 'medium').length,
    low: activities.filter(a => a.risk_level === 'low').length
  }), [activities]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>سجل النشاط</CardTitle>
              <CardDescription>
                جميع الأنشطة المتعلقة بحسابك ({activities.length} نشاط)
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 ml-1", isRefreshing && "animate-spin")} />
            تحديث
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">الإجمالي</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            <p className="text-xs text-red-600/70">عالي الخطورة</p>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
            <p className="text-xs text-yellow-600/70">متوسط</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.low}</p>
            <p className="text-xs text-green-600/70">منخفض</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في النشاطات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="مستوى الخطورة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="high">عالي</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="low">منخفض</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">جاري تحميل السجل...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <Activity className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">
              {searchQuery || riskFilter !== 'all' 
                ? 'لا توجد نتائج مطابقة للبحث' 
                : 'لا يوجد نشاط مسجل'}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pl-2">
            <div className="pr-2">
              <AnimatePresence mode="popLayout">
                {filteredActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
