import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, Eye, Edit2, Trash2, Calendar, Users, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Update {
  id: string;
  title: string;
  content: string;
  update_type: string;
  priority: string;
  target_audience: string;
  target_client_id?: string;
  is_published: boolean;
  publish_date?: string;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
}

interface Profile {
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

const AdminUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    update_type: "general",
    priority: "medium",
    target_audience: "all",
    target_client_id: "",
    is_published: false,
  });
  const { toast } = useToast();

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("updates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديثات",
        variant: "destructive",
      });
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, phone, company, role, site_id, created_at, updated_at")
        .not("email", "is", null);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchUpdates(), fetchProfiles()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from("updates")
        .insert([{
          ...formData,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          publish_date: formData.is_published ? new Date().toISOString() : null,
        }])
        .select()
        .single();

      if (error) throw error;

      // Send email notifications if published
      if (formData.is_published) {
        const { error: emailError } = await supabase.functions.invoke("send-update-notifications", {
          body: {
            updateId: data.id,
            targetAudience: formData.target_audience,
            targetClientId: formData.target_client_id || null,
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
            updateType: formData.update_type,
          },
        });

        if (emailError) {
          console.error("Email error:", emailError);
          toast({
            title: "تحذير",
            description: "تم إنشاء التحديث ولكن فشل في إرسال الإيميلات",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "نجح",
        description: formData.is_published 
          ? "تم إنشاء ونشر التحديث بنجاح" 
          : "تم حفظ التحديث كمسودة",
      });

      setFormData({
        title: "",
        content: "",
        update_type: "general",
        priority: "medium",
        target_audience: "all",
        target_client_id: "",
        is_published: false,
      });
      setShowCreateDialog(false);
      fetchUpdates();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (updateId: string, update: Update) => {
    try {
      const { error } = await supabase
        .from("updates")
        .update({ 
          is_published: true, 
          publish_date: new Date().toISOString() 
        })
        .eq("id", updateId);

      if (error) throw error;

      // Send email notifications
      const { error: emailError } = await supabase.functions.invoke("send-update-notifications", {
        body: {
          updateId: update.id,
          targetAudience: update.target_audience,
          targetClientId: update.target_client_id || null,
          title: update.title,
          content: update.content,
          priority: update.priority,
          updateType: update.update_type,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }

      toast({
        title: "نجح",
        description: "تم نشر التحديث وإرسال الإشعارات",
      });

      fetchUpdates();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (updateId: string) => {
    try {
      const { error } = await supabase
        .from("updates")
        .delete()
        .eq("id", updateId);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم حذف التحديث",
      });

      fetchUpdates();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
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
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة التحديثات والإشعارات</h1>
            <p className="text-muted-foreground">إنشاء وإدارة التحديثات وإرسالها للعملاء</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                تحديث جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء تحديث جديد</DialogTitle>
                <DialogDescription>
                  أنشئ تحديث جديد لإرساله للعملاء
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">العنوان</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">المحتوى</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نوع التحديث</Label>
                    <Select value={formData.update_type} onValueChange={(value) => setFormData({...formData, update_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع التحديث" />
                    </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">عام</SelectItem>
                        <SelectItem value="urgent">عاجل</SelectItem>
                        <SelectItem value="maintenance">صيانة</SelectItem>
                        <SelectItem value="feature">ميزة جديدة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>الأولوية</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">منخفض</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">عالي</SelectItem>
                        <SelectItem value="urgent">عاجل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الجمهور المستهدف</Label>
                  <Select value={formData.target_audience} onValueChange={(value) => setFormData({...formData, target_audience: value, target_client_id: ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجمهور المستهدف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العملاء</SelectItem>
                      <SelectItem value="specific_client">عميل محدد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.target_audience === "specific_client" && (
                  <div className="space-y-2">
                    <Label>اختر العميل</Label>
                    <Select value={formData.target_client_id} onValueChange={(value) => setFormData({...formData, target_client_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر عميل" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.user_id} value={profile.user_id}>
                            {profile.full_name || profile.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="publish"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                  />
                  <Label htmlFor="publish">نشر فوراً وإرسال إشعارات</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    <Send className="h-4 w-4" />
                    {formData.is_published ? "نشر وإرسال" : "حفظ كمسودة"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {update.title}
                      {!update.is_published && (
                        <Badge variant="secondary">مسودة</Badge>
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
                      <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        {update.target_audience === "all" ? "جميع العملاء" : "عميل محدد"}
                      </Badge>
                      {update.email_sent && (
                        <Badge variant="outline" className="gap-1 bg-green-50 text-green-700">
                          <Send className="h-3 w-3" />
                          تم الإرسال
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!update.is_published && (
                      <Button
                        size="sm"
                        onClick={() => handlePublish(update.id, update)}
                        className="gap-1"
                      >
                        <Send className="h-3 w-3" />
                        نشر
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(update.id)}
                      className="gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {update.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(update.created_at).toLocaleDateString("ar-SA")}
                    </span>
                    {update.publish_date && (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        نُشر: {new Date(update.publish_date).toLocaleDateString("ar-SA")}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {updates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد تحديثات</h3>
              <p className="text-muted-foreground mb-4">
                أنشئ أول تحديث لإرساله للعملاء
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                إنشاء تحديث جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
  );
};

export default AdminUpdates;