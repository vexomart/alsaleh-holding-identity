/**
 * Application Details Page - صفحة تفاصيل طلب التمويل
 * Dedicated internal page with finance contract and signing flow
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building2,
  Landmark,
  DollarSign,
  Calendar,
  TrendingUp,
  Loader2,
  Download,
  PenTool,
  Shield,
  Sparkles,
  Receipt,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_CONFIG,
  FinanceApplicationStatus,
  EntityType,
  formatCurrencySAR,
  FinanceContractStatus,
  CONTRACT_STATUS_CONFIG,
} from "@/types/finance";
import { toast } from "sonner";
import { FinanceContractView } from "@/components/finance/customer/FinanceContractView";

interface ApplicationDetails {
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
    national_id?: string | null;
    cr_number?: string | null;
    phone?: string | null;
    email?: string | null;
    address_ar?: string | null;
  };
  offers?: Array<{
    id: string;
    apr_percent: number;
    fees_sar: number | null;
    monthly_payment_sar: number;
    total_payable_sar: number;
    offer_status: string;
    expires_at?: string | null;
  }>;
  contract?: {
    id: string;
    contract_number: string;
    status: FinanceContractStatus;
    signed_at?: string | null;
    signed_by_user_id?: string | null;
    pdf_url?: string | null;
    admin_approved_at?: string | null;
    offer_id: string;
  } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showContract, setShowContract] = useState(false);

  const { data: application, isLoading, error } = useQuery({
    queryKey: ["finance-application-details", id],
    queryFn: async () => {
      if (!id) throw new Error("No application ID");

      const { data, error } = await supabase
        .from("finance_applications")
        .select(`
          *,
          entity:entities(id, legal_name_ar, entity_type, national_id, cr_number, phone, email, address_ar),
          offers:finance_offers(id, apr_percent, fees_sar, monthly_payment_sar, total_payable_sar, offer_status, expires_at)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Check for existing contract
      const { data: contracts } = await supabase
        .from("finance_contracts")
        .select("*")
        .eq("application_id", id)
        .limit(1);

      return {
        ...data,
        contract: contracts?.[0] || null,
      } as ApplicationDetails;
    },
    enabled: !!id,
  });

  // Accept offer mutation - creates contract
  const acceptOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      if (!application || !user) throw new Error("Missing data");

      // Generate contract number
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(5, "0");
      const contractNumber = `FIN-${year}-${random}`;

      // Create finance contract
      const { data: contract, error: contractError } = await supabase
        .from("finance_contracts")
        .insert({
          application_id: application.id,
          offer_id: offerId,
          contract_number: contractNumber,
          status: "generated",
        })
        .select()
        .single();

      if (contractError) throw contractError;

      // Update offer status
      await supabase
        .from("finance_offers")
        .update({ offer_status: "selected" })
        .eq("id", offerId);

      return contract;
    },
    onSuccess: () => {
      toast.success("تم قبول العرض بنجاح");
      queryClient.invalidateQueries({ queryKey: ["finance-application-details", id] });
      setShowContract(true);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء قبول العرض");
    },
  });

  // Sign contract mutation
  const signContractMutation = useMutation({
    mutationFn: async () => {
      if (!application?.contract || !user) throw new Error("Missing data");

      const { error } = await supabase
        .from("finance_contracts")
        .update({
          status: "signed_by_customer",
          signed_by_user_id: user.id,
          signed_at: new Date().toISOString(),
        })
        .eq("id", application.contract.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم توقيع العقد بنجاح");
      queryClient.invalidateQueries({ queryKey: ["finance-application-details", id] });
    },
    onError: () => {
      toast.error("حدث خطأ أثناء توقيع العقد");
    },
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

  if (isLoading) {
    return (
      <div className="space-y-6 p-6" dir="rtl">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6" dir="rtl">
        <XCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">خطأ في تحميل البيانات</h3>
        <p className="text-muted-foreground mb-4">لم نتمكن من العثور على طلب التمويل</p>
        <Button onClick={() => navigate("/dashboard/finance")}>
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للتمويل
        </Button>
      </div>
    );
  }

  const statusConfig = APPLICATION_STATUS_CONFIG[application.status];
  const StatusIcon = getStatusIcon(application.status);
  const EntityIcon = getEntityIcon(application.entity?.entity_type);
  const activeOffer = application.offers?.find((o) => o.offer_status === "active" || o.offer_status === "selected");
  const hasContract = !!application.contract;
  const canSign = hasContract && application.contract?.status === "generated";
  const isSigned = hasContract && ["signed_by_customer", "approved_by_admin", "active", "closed"].includes(application.contract?.status || "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/finance")}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة
            </Button>
            <span className="font-mono text-sm text-muted-foreground">
              {application.application_number}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-4xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Status Banner */}
        <motion.div variants={itemVariants}>
          <Card
            className={cn(
              "border-2",
              application.status === "approved" && "border-green-200 bg-gradient-to-l from-green-50 to-transparent",
              application.status === "rejected" && "border-red-200 bg-gradient-to-l from-red-50 to-transparent",
              application.status === "needs_info" && "border-yellow-200 bg-gradient-to-l from-yellow-50 to-transparent",
              !["approved", "rejected", "needs_info"].includes(application.status) && "border-muted"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-4 rounded-2xl",
                    application.status === "approved" && "bg-green-100",
                    application.status === "rejected" && "bg-red-100",
                    application.status === "needs_info" && "bg-yellow-100",
                    !["approved", "rejected", "needs_info"].includes(application.status) && "bg-muted"
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "h-8 w-8",
                      application.status === "approved" && "text-green-600",
                      application.status === "rejected" && "text-red-600",
                      application.status === "needs_info" && "text-yellow-600",
                      !["approved", "rejected", "needs_info"].includes(application.status) && "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{statusConfig?.label}</h2>
                  {application.decision_reason_ar && (
                    <p className="text-muted-foreground">{application.decision_reason_ar}</p>
                  )}
                  {application.decided_at && (
                    <p className="text-sm text-muted-foreground mt-1">
                      تاريخ البت: {new Date(application.decided_at).toLocaleDateString("ar-SA")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Details */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                تفاصيل الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Entity Info */}
                <div className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <EntityIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">الكيان</p>
                    <p className="font-semibold">{application.entity?.legal_name_ar}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">مبلغ التمويل</p>
                    <p className="font-semibold text-lg">{formatCurrencySAR(application.amount_sar)}</p>
                  </div>
                </div>

                {/* Tenor */}
                <div className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">مدة السداد</p>
                    <p className="font-semibold">{application.tenor_months} شهر</p>
                  </div>
                </div>

                {/* Purpose */}
                {application.purpose_ar && (
                  <div className="flex items-start gap-4 p-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">الغرض من التمويل</p>
                      <p className="font-medium">{application.purpose_ar}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Offers */}
        {application.status === "approved" && application.offers && application.offers.length > 0 && !hasContract && (
          <motion.div variants={itemVariants}>
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  العروض المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.offers.map((offer) => (
                  <Card
                    key={offer.id}
                    className={cn(
                      "cursor-pointer transition-all border-2",
                      selectedOfferId === offer.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-muted-foreground/20"
                    )}
                    onClick={() => setSelectedOfferId(offer.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-200"
                        >
                          متاح
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {offer.apr_percent}% ربح سنوي
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">القسط الشهري</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrencySAR(offer.monthly_payment_sar)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">إجمالي السداد</p>
                          <p className="font-semibold">
                            {formatCurrencySAR(offer.total_payable_sar)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {selectedOfferId && (
                  <Button
                    onClick={() => acceptOfferMutation.mutate(selectedOfferId)}
                    disabled={acceptOfferMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {acceptOfferMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        جارٍ قبول العرض...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 ml-2" />
                        قبول العرض
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Finance Contract Section */}
        {hasContract && application.contract && activeOffer && (
          <motion.div variants={itemVariants}>
            <FinanceContractView
              contract={application.contract}
              offer={activeOffer}
              entity={application.entity!}
              application={application}
              canSign={canSign}
              onSign={() => signContractMutation.mutateAsync()}
              isLoading={signContractMutation.isPending}
            />
          </motion.div>
        )}

        {/* Timeline */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                سجل الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">تم التقديم: {new Date(application.created_at).toLocaleDateString("ar-SA")}</span>
                </div>
                {application.submitted_at && (
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">تم الإرسال: {new Date(application.submitted_at).toLocaleDateString("ar-SA")}</span>
                  </div>
                )}
                {application.decided_at && (
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      application.status === "approved" ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-sm">تم البت: {new Date(application.decided_at).toLocaleDateString("ar-SA")}</span>
                  </div>
                )}
                {application.contract?.signed_at && (
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">تم التوقيع: {new Date(application.contract.signed_at).toLocaleDateString("ar-SA")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
