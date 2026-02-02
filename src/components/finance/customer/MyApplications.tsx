/**
 * My Applications - طلباتي
 * Shows customer's finance applications with status tracking
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Building2,
  User,
  Landmark,
  DollarSign,
  Calendar,
  ArrowLeft,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_CONFIG,
  FinanceApplicationStatus,
  ENTITY_TYPE_CONFIG,
  formatCurrencySAR,
  EntityType,
} from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

interface ApplicationWithRelations {
  id: string;
  application_number: string;
  amount_sar: number;
  tenor_months: number;
  status: FinanceApplicationStatus;
  purpose_ar?: string | null;
  created_at: string;
  submitted_at?: string | null;
  decided_at?: string | null;
  decision_reason_ar?: string | null;
  entity?: {
    id: string;
    legal_name_ar: string;
    entity_type: EntityType;
  };
  offers?: Array<{
    id: string;
    apr_percent: number;
    monthly_payment_sar: number;
    total_payable_sar: number;
    offer_status: string;
    expires_at?: string | null;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function MyApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState<ApplicationWithRelations | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-finance-applications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // First get user's entities
      const { data: entities, error: entitiesError } = await supabase
        .from("entities")
        .select("id")
        .eq("owner_user_id", user.id);

      if (entitiesError) throw entitiesError;
      if (!entities?.length) return [];

      const entityIds = entities.map((e) => e.id);

      // Get applications for these entities
      const { data, error } = await supabase
        .from("finance_applications")
        .select(`
          *,
          entity:entities(id, legal_name_ar, entity_type),
          offers:finance_offers(id, apr_percent, monthly_payment_sar, total_payable_sar, offer_status, expires_at)
        `)
        .in("entity_id", entityIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ApplicationWithRelations[];
    },
    enabled: !!user?.id,
  });

  const getEntityIcon = (type?: EntityType) => {
    switch (type) {
      case "individual":
        return User;
      case "company":
        return Building2;
      case "institution":
        return Landmark;
      default:
        return User;
    }
  };

  const getStatusIcon = (status: FinanceApplicationStatus) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "needs_info":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const handleViewDetails = (app: ApplicationWithRelations) => {
    setSelectedApp(app);
    setShowDetails(true);
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!applications?.length) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">لا توجد طلبات تمويل</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            لم تقدم أي طلب تمويل بعد. ابدأ بتقديم طلبك الأول.
          </p>
          <Button onClick={() => navigate("/app/finance/apply")} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            تقديم طلب تمويل
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                طلباتي
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/app/finance/apply")}
                className="gap-1"
              >
                <Sparkles className="h-4 w-4" />
                طلب جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app, index) => {
                const statusConfig = APPLICATION_STATUS_CONFIG[app.status];
                const EntityIcon = getEntityIcon(app.entity?.entity_type);
                const StatusIcon = getStatusIcon(app.status);
                const hasOffers = app.offers && app.offers.length > 0;
                const activeOffer = app.offers?.find((o) => o.offer_status === "active");

                return (
                  <motion.div key={app.id} variants={itemVariants}>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md border",
                        app.status === "approved" && "border-green-200 bg-green-50/30",
                        app.status === "rejected" && "border-red-200 bg-red-50/30",
                        app.status === "needs_info" && "border-yellow-200 bg-yellow-50/30"
                      )}
                      onClick={() => handleViewDetails(app)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "p-3 rounded-xl",
                                app.status === "approved" && "bg-green-100",
                                app.status === "rejected" && "bg-red-100",
                                app.status === "needs_info" && "bg-yellow-100",
                                !["approved", "rejected", "needs_info"].includes(app.status) &&
                                  "bg-muted"
                              )}
                            >
                              <StatusIcon
                                className={cn(
                                  "h-5 w-5",
                                  app.status === "approved" && "text-green-600",
                                  app.status === "rejected" && "text-red-600",
                                  app.status === "needs_info" && "text-yellow-600",
                                  !["approved", "rejected", "needs_info"].includes(app.status) &&
                                    "text-muted-foreground"
                                )}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm text-muted-foreground">
                                  {app.application_number}
                                </span>
                                <Badge
                                  variant="outline"
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
                              </div>
                              <p className="font-medium">{app.entity?.legal_name_ar}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrencySAR(app.amount_sar)} - {app.tenor_months} شهر
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {activeOffer && (
                              <div className="text-left">
                                <p className="text-xs text-muted-foreground">القسط الشهري</p>
                                <p className="font-semibold text-green-600" dir="ltr">
                                  {formatCurrencySAR(activeOffer.monthly_payment_sar)}
                                </p>
                              </div>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(app.created_at).toLocaleDateString("ar-SA")}
                            </div>
                            {hasOffers && (
                              <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="h-3 w-3" />
                                {app.offers?.length} عرض متاح
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle>تفاصيل الطلب</SheetTitle>
            <SheetDescription>{selectedApp?.application_number}</SheetDescription>
          </SheetHeader>

          {selectedApp && (
            <div className="mt-6 space-y-6">
              {/* Status Banner */}
              {(() => {
                const statusConfig = APPLICATION_STATUS_CONFIG[selectedApp.status];
                return (
                  <div
                    className={cn(
                      "p-4 rounded-xl",
                      statusConfig?.variant === "success" && "bg-green-500/10",
                      statusConfig?.variant === "warning" && "bg-yellow-500/10",
                      statusConfig?.variant === "destructive" && "bg-red-500/10",
                      statusConfig?.variant === "secondary" && "bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = getStatusIcon(selectedApp.status);
                        return (
                          <Icon
                            className={cn(
                              "h-6 w-6",
                              statusConfig?.variant === "success" && "text-green-600",
                              statusConfig?.variant === "warning" && "text-yellow-600",
                              statusConfig?.variant === "destructive" && "text-red-600"
                            )}
                          />
                        );
                      })()}
                      <div>
                        <p className="font-semibold">{statusConfig?.label}</p>
                        {selectedApp.decision_reason_ar && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedApp.decision_reason_ar}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Details Grid */}
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

              {/* Offers Section */}
              {selectedApp.offers && selectedApp.offers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    العروض المتاحة
                  </h4>
                  {selectedApp.offers.map((offer) => (
                    <Card
                      key={offer.id}
                      className={cn(
                        "border",
                        offer.offer_status === "active" && "border-green-200 bg-green-50/50"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              offer.offer_status === "active" &&
                                "bg-green-500/10 text-green-600 border-green-200"
                            )}
                          >
                            {offer.offer_status === "active" ? "متاح" : offer.offer_status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {offer.apr_percent}% ربح سنوي
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">القسط الشهري</p>
                            <p className="font-bold text-lg text-green-600" dir="ltr">
                              {formatCurrencySAR(offer.monthly_payment_sar)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">إجمالي السداد</p>
                            <p className="font-semibold" dir="ltr">
                              {formatCurrencySAR(offer.total_payable_sar)}
                            </p>
                          </div>
                        </div>
                        {offer.offer_status === "active" && (
                          <Button className="w-full mt-4" size="sm">
                            قبول العرض
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="font-semibold">سجل الطلب</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    تم التقديم: {new Date(selectedApp.created_at).toLocaleDateString("ar-SA")}
                  </div>
                  {selectedApp.decided_at && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      تم البت: {new Date(selectedApp.decided_at).toLocaleDateString("ar-SA")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
