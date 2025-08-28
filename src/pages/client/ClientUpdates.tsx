import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Calendar, Search, Eye, CheckCircle, AlertCircle, Clock, Filter } from "lucide-react";

interface Update {
  id: string;
  title: string;
  content: string;
  update_type: string;
  priority: string;
  target_audience: string;
  is_published: boolean;
  publish_date: string;
  created_at: string;
  is_read?: boolean;
}

const ClientUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const { toast } = useToast();

  const fetchUpdates = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // Fetch published updates
      const { data: updatesData, error: updatesError } = await supabase
        .from("updates")
        .select("*")
        .eq("is_published", true)
        .or(`target_audience.eq.all,and(target_audience.eq.specific_client,target_client_id.eq.${user.data.user.id})`)
        .order("publish_date", { ascending: false });

      if (updatesError) throw updatesError;

      // Fetch read status for each update
      const { data: readData, error: readError } = await supabase
        .from("update_reads")
        .select("update_id")
        .eq("user_id", user.data.user.id);

      if (readError) throw readError;

      const readUpdateIds = new Set(readData?.map(r => r.update_id) || []);

      const updatesWithReadStatus = updatesData?.map(update => ({
        ...update,
        is_read: readUpdateIds.has(update.id)
      })) || [];

      setUpdates(updatesWithReadStatus);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديثات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();

    // Set up real-time subscription
    const channel = supabase
      .channel('updates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'updates'
        },
        () => {
          fetchUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (updateId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error } = await supabase
        .from("update_reads")
        .upsert({
          update_id: updateId,
          user_id: user.data.user.id,
        });

      if (error) throw error;

      // Update local state
      setUpdates(prev => prev.map(update => 
        update.id === updateId ? { ...update, is_read: true } : update
      ));
    } catch (error: any) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const unreadUpdates = updates.filter(u => !u.is_read);
      
      const insertData = unreadUpdates.map(update => ({
        update_id: update.id,
        user_id: user.data.user.id,
      }));

      if (insertData.length > 0) {
        const { error } = await supabase
          .from("update_reads")
          .upsert(insertData);

        if (error) throw error;

        setUpdates(prev => prev.map(update => ({ ...update, is_read: true })));

        toast({
          title: "نجح",
          description: "تم وضع علامة مقروءة على جميع التحديثات",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة القراءة",
        variant: "destructive",
      });
    }
  };

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || update.update_type === filterType;
    const matchesPriority = filterPriority === "all" || update.priority === filterPriority;
    const matchesRead = filterRead === "all" || 
                       (filterRead === "read" && update.is_read) ||
                       (filterRead === "unread" && !update.is_read);

    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  const unreadCount = updates.filter(u => !u.is_read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="h-4 w-4" />;
      case "maintenance": return <Clock className="h-4 w-4" />;
      case "feature": return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-blue-100 text-blue-800";
      case "feature": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
              التحديثات والإشعارات
            </h1>
            <p className="text-muted-foreground">
              آخر الأخبار والتحديثات من فريق تساهيل
              {unreadCount > 0 && (
                <Badge className="mr-2 bg-red-500 text-white">
                  {unreadCount} غير مقروء
                </Badge>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              وضع علامة مقروءة على الكل
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في التحديثات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">نوع التحديث</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع التحديث" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                    <SelectItem value="maintenance">صيانة</SelectItem>
                    <SelectItem value="feature">ميزة جديدة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">الأولوية</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">حالة القراءة</label>
                <Select value={filterRead} onValueChange={setFilterRead}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة القراءة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="unread">غير مقروء</SelectItem>
                    <SelectItem value="read">مقروء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates List */}
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <Card 
              key={update.id} 
              className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                !update.is_read ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => !update.is_read && markAsRead(update.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(update.update_type)}
                      {update.title}
                      {!update.is_read && (
                        <Badge className="bg-primary text-white">جديد</Badge>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getPriorityColor(update.priority)}>
                        {update.priority === "urgent" ? "عاجل" : 
                         update.priority === "high" ? "عالي" :
                         update.priority === "medium" ? "متوسط" : "منخفض"}
                      </Badge>
                      <Badge className={getTypeColor(update.update_type)}>
                        {update.update_type === "general" ? "عام" :
                         update.update_type === "urgent" ? "عاجل" :
                         update.update_type === "maintenance" ? "صيانة" : "ميزة جديدة"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(update.publish_date).toLocaleDateString("ar-SA")}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {update.content}
                  </p>
                  {!update.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(update.id);
                      }}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      وضع علامة مقروءة
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUpdates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد تحديثات</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" || filterPriority !== "all" || filterRead !== "all"
                  ? "لا توجد تحديثات تطابق معايير البحث"
                  : "لا توجد تحديثات متاحة حالياً"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientUpdates;