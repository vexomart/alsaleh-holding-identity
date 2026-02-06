/**
 * Applications Tab - إدارة طلبات التمويل
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sendFinanceEmail } from "@/lib/api/email-notifications";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  User,
  Landmark,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_CONFIG,
  formatCurrencySAR,
  FinanceApplicationStatus,
  ENTITY_TYPE_CONFIG,
} from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { OfferGenerator } from "../OfferGenerator";

interface Application {
  id: string;
  application_number: string;
  amount_sar: number;
  tenor_months: number;
  status: FinanceApplicationStatus;
  created_at: string;
  purpose_ar?: string;
  entity?: {
    legal_name_ar: string;
    entity_type: string;
  };
  service?: {
    name_ar: string;
  };
}

export function ApplicationsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showOfferGenerator, setShowOfferGenerator] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-finance-applications", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("finance_applications")
        .select(`
          *,
          entity:entities(legal_name_ar, entity_type),
          service:services(name_ar)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as FinanceApplicationStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Application[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (appId: string) => {
      const { error } = await supabase
        .from("finance_applications")
        .update({ status: "under_review" as FinanceApplicationStatus })
        .eq("id", appId);
      if (error) throw error;
      return appId;
    },
    onSuccess: async (appId) => {
      toast.success("تم قبول الطلب للمراجعة");
      queryClient.invalidateQueries({ queryKey: ["admin-finance-applications"] });
      
      // Send email notification
      if (selectedApp) {
        try {
          // Get entity owner info
          const { data: entityData } = await supabase
            .from("entities")
            .select("owner_user_id, legal_name_ar")
            .eq("id", selectedApp.id)
            .single();
          
          if (entityData?.owner_user_id) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("email, full_name, phone")
              .eq("id", entityData.owner_user_id)
              .single();
            
            if (profileData?.email) {
              sendFinanceEmail({
                applicationId: selectedApp.id,
                applicationNumber: selectedApp.application_number,
                customerEmail: profileData.email,
                customerName: profileData.full_name || '',
                customerPhone: profileData.phone || undefined,
                entityName: selectedApp.entity?.legal_name_ar || '',
                amountSar: selectedApp.amount_sar,
                tenorMonths: selectedApp.tenor_months,
                eventType: 'under_review',
              }).catch(err => console.error('Notification failed:', err));
            }
          }
        } catch (err) {
          console.error('Failed to send email:', err);
        }
      }
      
      setShowApproveDialog(false);
      setSelectedApp(null);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء قبول الطلب");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ appId, reason }: { appId: string; reason: string }) => {
      const { error } = await supabase
        .from("finance_applications")
        .update({ 
          status: "rejected" as FinanceApplicationStatus,
          decision_reason_ar: reason
        })
        .eq("id", appId);
      if (error) throw error;
      return { appId, reason };
    },
    onSuccess: async ({ appId, reason }) => {
      toast.success("تم رفض الطلب");
      queryClient.invalidateQueries({ queryKey: ["admin-finance-applications"] });
      
      // Send rejection email notification
      if (selectedApp) {
        try {
          // Get entity owner info
          const { data: app } = await supabase
            .from("finance_applications")
            .select("entity:entities(owner_user_id, legal_name_ar)")
            .eq("id", appId)
            .single();
          
          const entityOwner = (app?.entity as any)?.owner_user_id;
          if (entityOwner) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("email, full_name, phone")
              .eq("id", entityOwner)
              .single();
            
            if (profileData?.email) {
              sendFinanceEmail({
                applicationId: selectedApp.id,
                applicationNumber: selectedApp.application_number,
                customerEmail: profileData.email,
                customerName: profileData.full_name || '',
                customerPhone: profileData.phone || undefined,
                entityName: selectedApp.entity?.legal_name_ar || '',
                amountSar: selectedApp.amount_sar,
                tenorMonths: selectedApp.tenor_months,
                eventType: 'rejected',
                rejectionReason: reason,
              }).catch(err => console.error('Notification failed:', err));
            }
          }
        } catch (err) {
          console.error('Failed to send email:', err);
        }
      }
      
      setShowRejectDialog(false);
      setSelectedApp(null);
      setRejectReason("");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء رفض الطلب");
    },
  });

  const filteredApplications = applications?.filter((app) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      app.application_number?.toLowerCase().includes(searchLower) ||
      app.entity?.legal_name_ar?.toLowerCase().includes(searchLower)
    );
  });

  const handleView = (app: Application) => {
    setSelectedApp(app);
    setShowDetails(true);
  };

  const handleApprove = (app: Application) => {
    setSelectedApp(app);
    setShowApproveDialog(true);
  };

  const handleReject = (app: Application) => {
    setSelectedApp(app);
    setShowRejectDialog(true);
  };

  const getEntityIcon = (type?: string) => {
    switch (type) {
      case "individual": return User;
      case "company": return Building2;
      case "institution": return Landmark;
      default: return User;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>طلبات التمويل</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10 w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="submitted">مقدمة</SelectItem>
                  <SelectItem value="under_review">قيد المراجعة</SelectItem>
                  <SelectItem value="approved">موافق عليها</SelectItem>
                  <SelectItem value="rejected">مرفوضة</SelectItem>
                  <SelectItem value="needs_info">تحتاج معلومات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد طلبات تمويل
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir="rtl" className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right whitespace-nowrap">رقم الطلب</TableHead>
                    <TableHead className="text-right whitespace-nowrap">الكيان</TableHead>
                    <TableHead className="text-right whitespace-nowrap">النوع</TableHead>
                    <TableHead className="text-right whitespace-nowrap">المبلغ</TableHead>
                    <TableHead className="text-right whitespace-nowrap">المدة</TableHead>
                    <TableHead className="text-right whitespace-nowrap">الحالة</TableHead>
                    <TableHead className="text-right whitespace-nowrap">التاريخ</TableHead>
                    <TableHead className="text-right whitespace-nowrap">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {filteredApplications?.map((app) => {
                    const statusConfig = APPLICATION_STATUS_CONFIG[app.status as FinanceApplicationStatus];
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-sm">
                          {app.application_number}
                        </TableCell>
                        <TableCell>{app.entity?.legal_name_ar || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {app.entity?.entity_type === "individual"
                              ? "فرد"
                              : app.entity?.entity_type === "company"
                              ? "شركة"
                              : "مؤسسة"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrencySAR(app.amount_sar)}
                        </TableCell>
                        <TableCell>{app.tenor_months} شهر</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs",
                              statusConfig?.variant === "success" &&
                                "bg-green-500/10 text-green-600 border-green-200",
                              statusConfig?.variant === "warning" &&
                                "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                              statusConfig?.variant === "destructive" &&
                                "bg-red-500/10 text-red-600 border-red-200",
                              statusConfig?.variant === "secondary" &&
                                "bg-muted text-muted-foreground"
                            )}
                          >
                            {statusConfig?.label || app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(app.created_at).toLocaleDateString("ar-SA")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleView(app)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {app.status === "submitted" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApprove(app)}
                                  title="قبول للمراجعة"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleReject(app)}
                                  title="رفض"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {app.status === "under_review" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setShowOfferGenerator(true);
                                }}
                                title="إنشاء عرض"
                              >
                                <TrendingUp className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="left" className="w-full sm:max-w-lg" dir="rtl">
          <SheetHeader>
            <SheetTitle>تفاصيل طلب التمويل</SheetTitle>
            <SheetDescription>
              {selectedApp?.application_number}
            </SheetDescription>
          </SheetHeader>
          {selectedApp && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  {(() => {
                    const Icon = getEntityIcon(selectedApp.entity?.entity_type);
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  <div>
                    <p className="text-sm text-muted-foreground">الكيان</p>
                    <p className="font-semibold">{selectedApp.entity?.legal_name_ar}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">مبلغ التمويل</p>
                    <p className="font-semibold">{formatCurrencySAR(selectedApp.amount_sar)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">مدة السداد</p>
                    <p className="font-semibold">{selectedApp.tenor_months} شهر</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ التقديم</p>
                    <p className="font-semibold">
                      {new Date(selectedApp.created_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>

                {selectedApp.purpose_ar && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">الغرض من التمويل</p>
                      <p className="font-medium">{selectedApp.purpose_ar}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedApp.status === "submitted" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      setShowDetails(false);
                      handleApprove(selectedApp);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 ml-2" />
                    قبول للمراجعة
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      setShowDetails(false);
                      handleReject(selectedApp);
                    }}
                  >
                    <XCircle className="h-4 w-4 ml-2" />
                    رفض
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>قبول الطلب للمراجعة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من قبول طلب التمويل رقم {selectedApp?.application_number} للمراجعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={() => selectedApp && approveMutation.mutate(selectedApp.id)}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <CheckCircle className="h-4 w-4 ml-2" />
              )}
              تأكيد القبول
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>رفض الطلب</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم رفض طلب التمويل رقم {selectedApp?.application_number}. يرجى إدخال سبب الرفض.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="سبب الرفض..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={() => selectedApp && rejectMutation.mutate({ 
                appId: selectedApp.id, 
                reason: rejectReason 
              })}
              disabled={rejectMutation.isPending || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <XCircle className="h-4 w-4 ml-2" />
              )}
              تأكيد الرفض
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Offer Generator */}
      <OfferGenerator
        open={showOfferGenerator}
        onOpenChange={setShowOfferGenerator}
        application={selectedApp}
      />
    </>
  );
}
