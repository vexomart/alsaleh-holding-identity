/**
 * Notifications Settings - View recent notifications
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  BellRing, 
  CheckCircle2, 
  AlertCircle,
  Info,
  ExternalLink,
  Inbox
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface NotificationsSettingsProps {
  userId: string;
}

export function NotificationsSettings({ userId }: NotificationsSettingsProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["profile-notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const getNotificationIcon = (type?: string | null, severity?: string | null) => {
    if (severity === "critical") return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (severity === "warning") return <AlertCircle className="h-4 w-4 text-amber-500" />;
    if (type === "success") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: isRTL ? ar : enUS,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 relative">
                <Bell className="h-5 w-5 text-rose-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -end-1 h-5 w-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isRTL ? "الإشعارات الأخيرة" : "Recent Notifications"}
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? `${unreadCount} إشعارات غير مقروءة`
                    : `${unreadCount} unread notifications`
                  }
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/app/notifications")}
            >
              {isRTL ? "عرض الكل" : "View All"}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl transition-colors",
                    notification.is_read 
                      ? "bg-muted/30" 
                      : "bg-primary/5 border border-primary/10"
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type, notification.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        "text-sm line-clamp-2",
                        !notification.is_read && "font-medium"
                      )}>
                        {isRTL 
                          ? (notification.title_ar || notification.title)
                          : (notification.title_en || notification.title)
                        }
                      </p>
                      {!notification.is_read && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] px-1.5">
                          {isRTL ? "جديد" : "New"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.created_at || "")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "لا توجد إشعارات" : "No notifications"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
