/**
 * Admin Contract Details Page - Premium Dark Theme
 * صفحة تفاصيل العقد - تصميم داكن احترافي RTL صارم
 * 
 * Features:
 * - Full RTL support
 * - Customer info summary
 * - Timeline tracking
 * - PDF files & verification
 * - Audit log
 * - All admin actions (approve/reject/terminate/delete)
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { sendContractEmail } from '@/lib/api/email-notifications';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Icons
import {
  ArrowRight,
  ArrowLeft,
  FileSignature,
  User,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  FileText,
  Download,
  Eye,
  Copy,
  Phone,
  Mail,
  Building2,
  CreditCard,
  Banknote,
  Hash,
  ExternalLink,
  Printer,
  History,
  Activity,
  Edit3,
  Save,
  X,
  Trash2,
  Ban,
  RefreshCw,
  ShoppingCart,
  Fingerprint,
  Globe,
  MapPin,
  CircleDot,
  CheckCheck,
  FileCheck,
  Loader2,
} from 'lucide-react';

// Types
interface ContractDetails {
  id: string;
  contract_number: string;
  status: string;
  customer_user_id: string;
  service_id: string | null;
  order_id: string | null;
  template_id: string | null;
  scope_summary: string | null;
  scope_summary_ar: string | null;
  pricing_json: {
    subtotal: number;
    vat: number;
    total: number;
    currency: string;
  } | null;
  locale: string | null;
  customer_pre_approval: boolean | null;
  pre_approval_timestamp: string | null;
  pre_approval_ip: string | null;
  pre_approval_metadata: any;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
  admin_approval_notes: string | null;
  admin_rejection_reason: string | null;
  signed_at: string | null;
  signed_by_user_id: string | null;
  terms_snapshot_json: any;
  created_at: string | null;
  updated_at: string | null;
  customer?: {
    id: string;
    full_name: string | null;
    full_name_ar: string | null;
    email: string;
    phone: string | null;
    customer_uid: string | null;
    national_id: string | null;
    city: string | null;
  } | null;
  service?: {
    id: string;
    name: string | null;
    name_ar: string | null;
  } | null;
  order?: {
    id: string;
    order_number: string;
    title: string | null;
    title_ar: string | null;
    status: string | null;
  } | null;
}

interface ContractFile {
  id: string;
  contract_id: string;
  pdf_url: string;
  pdf_hash_sha256: string;
  generated_at: string | null;
  created_at: string | null;
}

interface ContractSignature {
  id: string;
  contract_id: string;
  signer_user_id: string;
  signer_name: string;
  signer_national_id: string | null;
  signer_phone: string | null;
  signature_method: string;
  signature_data_json: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string | null;
}

interface AuditLogEntry {
  id: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: any;
  new_data: any;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
  created_at: string | null;
}

// Status configuration
const statusConfig: Record<string, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  gradient: string;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    icon: FileText,
    gradient: 'from-slate-500 to-slate-600',
  },
  pre_approved_by_customer: {
    labelAr: 'بانتظار الموافقة',
    labelEn: 'Pending Approval',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: Clock,
    gradient: 'from-amber-500 to-orange-500',
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Pending Signature',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: FileSignature,
    gradient: 'from-blue-500 to-indigo-500',
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-teal-500',
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: XCircle,
    gradient: 'from-red-500 to-rose-500',
  },
  terminated: {
    labelAr: 'منتهي',
    labelEn: 'Terminated',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
    icon: Ban,
    gradient: 'from-gray-500 to-gray-600',
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function ContractDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditScopeOpen, setIsEditScopeOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [terminationReason, setTerminationReason] = useState('');
  const [editedScope, setEditedScope] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Fetch contract details
  const { data: contract, isLoading, refetch } = useQuery({
    queryKey: ['admin-contract-details', id],
    queryFn: async () => {
      if (!id) throw new Error('No contract ID');

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          service:services(id, name, name_ar)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch customer profile
      let customer = null;
      if (data.customer_user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, full_name_ar, email, phone, customer_uid, national_id, city')
          .eq('id', data.customer_user_id)
          .single();
        customer = profileData;
      }

      // Fetch linked order if exists
      let order = null;
      if (data.order_id) {
        const { data: orderData } = await supabase
          .from('orders')
          .select('id, order_number, title, title_ar, status')
          .eq('id', data.order_id)
          .single();
        order = orderData;
      }

      return {
        ...data,
        pricing_json: data.pricing_json as ContractDetails['pricing_json'],
        customer,
        order,
      } as ContractDetails;
    },
    enabled: !!id,
  });

  // Fetch contract files
  const { data: files = [] } = useQuery({
    queryKey: ['contract-files', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_files')
        .select('*')
        .eq('contract_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContractFile[];
    },
    enabled: !!id,
  });

  // Fetch signatures
  const { data: signatures = [] } = useQuery({
    queryKey: ['contract-signatures', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contract_signatures')
        .select('*')
        .eq('contract_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContractSignature[];
    },
    enabled: !!id,
  });

  // Fetch audit logs
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['contract-audit-logs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('record_id', id)
        .eq('table_name', 'contracts')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!id,
  });

  // Real-time subscription
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`contract-details-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contracts', filter: `id=eq.${id}` },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, refetch]);

  // Handlers
  const handleApprove = async () => {
    if (!contract) return;
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_approve_contract', {
        p_contract_id: contract.id,
        p_admin_id: user.id,
        p_notes: approvalNotes || null,
      });

      if (error) throw error;

      toast.success('تمت الموافقة على العقد بنجاح');

      // Send notification
      if (contract.customer?.email) {
        sendContractEmail({
          contractId: contract.id,
          contractNumber: contract.contract_number,
          customerEmail: contract.customer.email,
          customerName: contract.customer.full_name || contract.customer.full_name_ar || '',
          customerPhone: contract.customer.phone || undefined,
          serviceName: contract.service?.name || '',
          serviceNameAr: contract.service?.name_ar || undefined,
          totalAmount: contract.pricing_json?.total || 0,
          currency: contract.pricing_json?.currency || 'SAR',
          eventType: 'admin_approved',
          signingUrl: `/portal/contracts/${contract.id}/sign`,
        }).catch(err => console.error('Notification failed:', err));
      }

      setIsApproveOpen(false);
      setApprovalNotes('');
      
      // CRITICAL: Immediate refetch for instant UI update
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ['admin-contract-details', id] });
      await queryClient.invalidateQueries({ queryKey: ['admin-contracts'] });
    } catch (error) {
      console.error('Error approving contract:', error);
      toast.error('فشل في الموافقة على العقد');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!contract || !rejectionReason.trim()) {
      toast.error('يرجى إدخال سبب الرفض');
      return;
    }
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_reject_contract', {
        p_contract_id: contract.id,
        p_admin_id: user.id,
        p_reason: rejectionReason,
      });

      if (error) throw error;

      toast.success('تم رفض العقد');

      if (contract.customer?.email) {
        sendContractEmail({
          contractId: contract.id,
          contractNumber: contract.contract_number,
          customerEmail: contract.customer.email,
          customerName: contract.customer.full_name || contract.customer.full_name_ar || '',
          customerPhone: contract.customer.phone || undefined,
          serviceName: contract.service?.name || '',
          serviceNameAr: contract.service?.name_ar || undefined,
          totalAmount: contract.pricing_json?.total || 0,
          currency: contract.pricing_json?.currency || 'SAR',
          eventType: 'rejected',
          rejectionReason: rejectionReason,
        }).catch(err => console.error('Notification failed:', err));
      }

      setIsRejectOpen(false);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['admin-contract-details', id] });
    } catch (error) {
      console.error('Error rejecting contract:', error);
      toast.error('فشل في رفض العقد');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTerminate = async () => {
    if (!contract) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('contracts')
        .update({ 
          status: 'terminated',
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', contract.id);

      if (error) throw error;

      toast.success('تم إنهاء العقد');
      setIsTerminateOpen(false);
      setTerminationReason('');
      queryClient.invalidateQueries({ queryKey: ['admin-contract-details', id] });
    } catch (error) {
      console.error('Error terminating contract:', error);
      toast.error('فشل في إنهاء العقد');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!contract) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contract.id);

      if (error) throw error;

      toast.success('تم حذف العقد');
      navigate('/adminash/contracts');
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('فشل في حذف العقد');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveScope = async () => {
    if (!contract) return;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('contracts')
        .update({ 
          scope_summary_ar: editedScope,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', contract.id);

      if (error) throw error;

      toast.success('تم حفظ التغييرات');
      setIsEditScopeOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-contract-details', id] });
    } catch (error) {
      console.error('Error saving scope:', error);
      toast.error('فشل في الحفظ');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ');
  };

  // Formatters
  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Timeline events
  const timelineEvents = useMemo(() => {
    if (!contract) return [];

    const events = [
      {
        id: 'created',
        type: 'created',
        labelAr: 'إنشاء العقد',
        labelEn: 'Contract Created',
        timestamp: contract.created_at,
        icon: FileText,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
      },
    ];

    if (contract.customer_pre_approval && contract.pre_approval_timestamp) {
      events.push({
        id: 'pre_approved',
        type: 'pre_approved',
        labelAr: 'الموافقة المبدئية من العميل',
        labelEn: 'Customer Pre-Approval',
        timestamp: contract.pre_approval_timestamp,
        icon: CheckCheck,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/20',
      });
    }

    if (contract.admin_approved_at) {
      events.push({
        id: 'admin_approved',
        type: 'admin_approved',
        labelAr: 'موافقة الإدارة',
        labelEn: 'Admin Approval',
        timestamp: contract.admin_approved_at,
        icon: Shield,
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/20',
      });
    }

    if (contract.admin_rejection_reason) {
      events.push({
        id: 'rejected',
        type: 'rejected',
        labelAr: 'رفض الإدارة',
        labelEn: 'Admin Rejection',
        timestamp: contract.updated_at,
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
      });
    }

    if (contract.signed_at) {
      events.push({
        id: 'signed',
        type: 'signed',
        labelAr: 'توقيع العقد',
        labelEn: 'Contract Signed',
        timestamp: contract.signed_at,
        icon: FileSignature,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
      });
    }

    if (contract.status === 'cancelled') {
      events.push({
        id: 'cancelled',
        type: 'cancelled',
        labelAr: 'إلغاء العقد',
        labelEn: 'Contract Cancelled',
        timestamp: contract.updated_at,
        icon: Ban,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
      });
    }

    if (contract.status === 'terminated') {
      events.push({
        id: 'terminated',
        type: 'terminated',
        labelAr: 'إنهاء العقد',
        labelEn: 'Contract Terminated',
        timestamp: contract.updated_at,
        icon: Ban,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
      });
    }

    return events.sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }, [contract]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6" dir="rtl">
        <div className="space-y-6 max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 bg-slate-800" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-72 lg:col-span-2 bg-slate-800" />
            <Skeleton className="h-72 bg-slate-800" />
          </div>
          <Skeleton className="h-96 bg-slate-800" />
        </div>
      </div>
    );
  }

  // Not found
  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 p-4" dir="rtl">
        <XCircle className="h-16 w-16 text-red-500/50" />
        <h2 className="text-xl font-semibold text-white">العقد غير موجود</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/adminash/contracts')}
          className="rounded-xl border-slate-700 text-slate-300"
        >
          <BackIcon className="h-4 w-4 ms-2" />
          العودة للعقود
        </Button>
      </div>
    );
  }

  const currentStatus = statusConfig[contract.status] || statusConfig.draft;
  const StatusIcon = currentStatus.icon;
  const displayName = contract.customer?.full_name_ar || contract.customer?.full_name || 'عميل';

  return (
    <div 
      className="min-h-screen bg-slate-950 overflow-x-hidden"
      dir="rtl"
      style={{ maxWidth: '100%' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-6 p-3 sm:p-6 max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 h-10 w-10 sm:h-11 sm:w-11 shrink-0"
              onClick={() => navigate('/adminash/contracts')}
            >
              <BackIcon className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {contract.contract_number}
                </h1>
                <button
                  onClick={() => copyToClipboard(contract.contract_number)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {contract.service?.name_ar || contract.service?.name || 'عقد تقديم خدمات'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-medium shrink-0',
              currentStatus.bgColor,
              currentStatus.color,
              currentStatus.borderColor,
              'border'
            )}
          >
            <StatusIcon className="h-4 w-4 me-2" />
            {currentStatus.labelAr}
          </Badge>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Approve Button - Only for pre_approved_by_customer */}
                {contract.status === 'pre_approved_by_customer' && (
                  <>
                    <Button
                      onClick={() => setIsApproveOpen(true)}
                      className="bg-gradient-to-l from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl h-10 px-4 flex-1 sm:flex-none min-w-[100px]"
                    >
                      <CheckCircle2 className="h-4 w-4 me-2" />
                      موافقة
                    </Button>
                    <Button
                      onClick={() => setIsRejectOpen(true)}
                      variant="destructive"
                      className="rounded-xl h-10 px-4 flex-1 sm:flex-none min-w-[100px]"
                    >
                      <XCircle className="h-4 w-4 me-2" />
                      رفض
                    </Button>
                  </>
                )}

                {/* Terminate - Only for signed contracts */}
                {contract.status === 'signed' && (
                  <Button
                    onClick={() => setIsTerminateOpen(true)}
                    variant="outline"
                    className="border-orange-600/50 text-orange-400 hover:bg-orange-900/30 rounded-xl h-10 px-4 flex-1 sm:flex-none"
                  >
                    <Ban className="h-4 w-4 me-2" />
                    إنهاء العقد
                  </Button>
                )}

                {/* Edit Scope */}
                <Button
                  onClick={() => {
                    setEditedScope(contract.scope_summary_ar || contract.scope_summary || '');
                    setIsEditScopeOpen(true);
                  }}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl h-10 px-4 flex-1 sm:flex-none"
                >
                  <Edit3 className="h-4 w-4 me-2" />
                  تعديل
                </Button>

                <div className="flex-1 hidden sm:block" />

                {/* Print / Download */}
                {files.length > 0 && (
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl h-10 px-4"
                    onClick={() => window.open(files[0].pdf_url, '_blank')}
                  >
                    <Download className="h-4 w-4 me-2" />
                    تحميل PDF
                  </Button>
                )}

                {/* Delete - Only for draft/cancelled */}
                {['draft', 'cancelled'].includes(contract.status) && (
                  <Button
                    onClick={() => setIsDeleteOpen(true)}
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-xl h-10 px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Customer Card */}
            <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-white">
                  <div className="p-2 rounded-xl bg-blue-500/20">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  بيانات العميل
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-slate-700 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-500 text-white text-lg font-bold">
                      {displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg truncate">{displayName}</h3>
                      {contract.customer?.customer_uid && (
                        <Badge variant="outline" className="text-xs font-mono mt-1 border-slate-700 text-slate-400">
                          {contract.customer.customer_uid}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid gap-2 sm:gap-3 text-sm">
                      {contract.customer?.email && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                          <span className="truncate" dir="ltr">{contract.customer.email}</span>
                        </div>
                      )}
                      {contract.customer?.phone && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                          <span dir="ltr">{contract.customer.phone}</span>
                        </div>
                      )}
                      {contract.customer?.national_id && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Fingerprint className="h-4 w-4 text-slate-500 shrink-0" />
                          <span dir="ltr">{contract.customer.national_id}</span>
                        </div>
                      )}
                      {contract.customer?.city && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                          <span>{contract.customer.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/adminash/clients/${contract.customer_user_id}`}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            {contract.pricing_json && (
              <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-800">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-white">
                    <div className="p-2 rounded-xl bg-emerald-500/20">
                      <Banknote className="h-4 w-4 text-emerald-400" />
                    </div>
                    تفاصيل الأسعار
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">المجموع الفرعي:</span>
                    <span className="text-slate-200 font-medium" dir="ltr">
                      {formatCurrency(contract.pricing_json.subtotal, contract.pricing_json.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">ضريبة القيمة المضافة (15%):</span>
                    <span className="text-slate-200 font-medium" dir="ltr">
                      {formatCurrency(contract.pricing_json.vat, contract.pricing_json.currency)}
                    </span>
                  </div>
                  <Separator className="bg-slate-700" />
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">الإجمالي:</span>
                    <span className="text-xl font-bold text-emerald-400" dir="ltr">
                      {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked Order */}
            {contract.order && (
              <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-800">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-white">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                      <ShoppingCart className="h-4 w-4 text-purple-400" />
                    </div>
                    الطلب المرتبط
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5">
                  <Link
                    to={`/adminash/orders/${contract.order.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-white">{contract.order.order_number}</p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {contract.order.title_ar || contract.order.title}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Tabs Section */}
            <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-slate-800/50 p-1 rounded-none border-b border-slate-800 flex justify-start gap-1 overflow-x-auto">
                  <TabsTrigger
                    value="overview"
                    className="rounded-lg data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 px-4 py-2 text-sm whitespace-nowrap"
                  >
                    <FileText className="h-4 w-4 me-2" />
                    نظرة عامة
                  </TabsTrigger>
                  <TabsTrigger
                    value="files"
                    className="rounded-lg data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 px-4 py-2 text-sm whitespace-nowrap"
                  >
                    <FileCheck className="h-4 w-4 me-2" />
                    الملفات ({files.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="audit"
                    className="rounded-lg data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 px-4 py-2 text-sm whitespace-nowrap"
                  >
                    <History className="h-4 w-4 me-2" />
                    سجل التدقيق
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-4 sm:p-5 space-y-4">
                  {/* Scope Summary */}
                  {(contract.scope_summary_ar || contract.scope_summary) && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">ملخص النطاق</h4>
                      <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-xl">
                        {contract.scope_summary_ar || contract.scope_summary}
                      </p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {contract.admin_rejection_reason && (
                    <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        سبب الرفض
                      </h4>
                      <p className="text-red-300 text-sm">{contract.admin_rejection_reason}</p>
                    </div>
                  )}

                  {/* Approval Notes */}
                  {contract.admin_approval_notes && (
                    <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        ملاحظات الموافقة
                      </h4>
                      <p className="text-emerald-300 text-sm">{contract.admin_approval_notes}</p>
                    </div>
                  )}

                  {/* Signature Details */}
                  {signatures.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">بيانات التوقيع</h4>
                      {signatures.map((sig) => (
                        <div key={sig.id} className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">الموقّع:</span>
                            <span className="text-white">{sig.signer_name}</span>
                          </div>
                          {sig.signer_national_id && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">رقم الهوية:</span>
                              <span className="text-slate-200" dir="ltr">{sig.signer_national_id}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">طريقة التوقيع:</span>
                            <span className="text-slate-200">{sig.signature_method}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">التاريخ:</span>
                            <span className="text-slate-200">{formatDateTime(sig.created_at)}</span>
                          </div>
                          {sig.ip_address && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">عنوان IP:</span>
                              <span className="text-slate-200 font-mono text-xs" dir="ltr">{sig.ip_address}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="files" className="p-4 sm:p-5">
                  {files.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                      <p className="text-slate-400">لا توجد ملفات مرفقة</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20">
                              <FileText className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">عقد PDF</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {formatDateTime(file.generated_at || file.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white rounded-lg h-8 px-3"
                              onClick={() => window.open(file.pdf_url, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white rounded-lg h-8 px-3"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = file.pdf_url;
                                link.download = `${contract.contract_number}.pdf`;
                                link.click();
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Hash Verification */}
                      {files[0]?.pdf_hash_sha256 && (
                        <div className="mt-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-teal-400" />
                            <span className="text-xs font-medium text-slate-300">SHA-256 Hash</span>
                          </div>
                          <code className="text-xs text-slate-500 font-mono break-all" dir="ltr">
                            {files[0].pdf_hash_sha256}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="audit" className="p-4 sm:p-5">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                      <p className="text-slate-400">لا يوجد سجل تدقيق</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {auditLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-3 bg-slate-800/50 rounded-xl text-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">
                                {log.action}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {formatDateTime(log.created_at)}
                              </span>
                            </div>
                            {log.ip_address && (
                              <p className="text-xs text-slate-500 font-mono" dir="ltr">
                                IP: {log.ip_address}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Right Column - Timeline & Meta */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            {/* Timeline Card */}
            <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-white">
                  <div className="p-2 rounded-xl bg-amber-500/20">
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                  التسلسل الزمني
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute top-0 bottom-0 start-5 w-0.5 bg-slate-700" />

                  {/* Events */}
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => {
                      const Icon = event.icon;
                      return (
                        <div key={event.id} className="relative flex gap-4 ps-2">
                          <div className={cn(
                            'relative z-10 p-2 rounded-full shrink-0',
                            event.bgColor
                          )}>
                            <Icon className={cn('h-4 w-4', event.color)} />
                          </div>
                          <div className="flex-1 min-w-0 pb-4">
                            <p className="font-medium text-white text-sm">{event.labelAr}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {formatDateTime(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Info Card */}
            <Card className="bg-slate-900/50 border-slate-800 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-white">
                  <div className="p-2 rounded-xl bg-slate-500/20">
                    <Activity className="h-4 w-4 text-slate-400" />
                  </div>
                  معلومات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">تاريخ الإنشاء:</span>
                  <span className="text-slate-200">{formatDate(contract.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">آخر تحديث:</span>
                  <span className="text-slate-200">{formatDate(contract.updated_at)}</span>
                </div>
                {contract.locale && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">اللغة:</span>
                    <span className="text-slate-200">{contract.locale === 'ar' ? 'العربية' : 'English'}</span>
                  </div>
                )}
                {contract.pre_approval_ip && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP الموافقة:</span>
                    <span className="text-slate-200 font-mono text-xs" dir="ltr">{String(contract.pre_approval_ip)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 rounded-2xl max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              الموافقة على العقد
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              سيتم إرسال رابط التوقيع للعميل
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">ملاحظات (اختياري)</label>
              <Textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="أضف ملاحظات للسجل..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsApproveOpen(false)}
              className="border-slate-700 text-slate-300 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 me-2" />
              )}
              تأكيد الموافقة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 rounded-2xl max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              رفض العقد
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              يرجى إدخال سبب الرفض (إلزامي)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">سبب الرفض *</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="أدخل سبب الرفض..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl resize-none"
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              className="border-slate-700 text-slate-300 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
              variant="destructive"
              className="rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <XCircle className="h-4 w-4 me-2" />
              )}
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Dialog */}
      <AlertDialog open={isTerminateOpen} onOpenChange={setIsTerminateOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 rounded-2xl" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Ban className="h-5 w-5 text-orange-400" />
              إنهاء العقد
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              هل أنت متأكد من إنهاء هذا العقد؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-slate-700 text-slate-300 rounded-xl">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTerminate}
              disabled={isProcessing}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <Ban className="h-4 w-4 me-2" />
              )}
              إنهاء العقد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 rounded-2xl" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              حذف العقد
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              هل أنت متأكد من حذف هذا العقد نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-slate-700 text-slate-300 rounded-xl">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <Trash2 className="h-4 w-4 me-2" />
              )}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Scope Dialog */}
      <Dialog open={isEditScopeOpen} onOpenChange={setIsEditScopeOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 rounded-2xl max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-blue-400" />
              تعديل ملخص النطاق
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={editedScope}
              onChange={(e) => setEditedScope(e.target.value)}
              placeholder="أدخل ملخص نطاق العمل..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl resize-none min-h-[150px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditScopeOpen(false)}
              className="border-slate-700 text-slate-300 rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveScope}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <Save className="h-4 w-4 me-2" />
              )}
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
