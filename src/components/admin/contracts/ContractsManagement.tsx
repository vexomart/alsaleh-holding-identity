/**
 * Admin Contracts Management - Enterprise Grade
 * 
 * Allows admins to:
 * - View all contracts
 * - Approve pre-approved contracts
 * - Reject contracts
 * - View contract details
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { sendContractEmail } from '@/lib/api/email-notifications';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileSignature,
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  Copy,
  ExternalLink,
} from 'lucide-react';

// Contract status type
type ContractStatus = 
  | 'draft' 
  | 'pre_approved_by_customer' 
  | 'pending_admin_approval' 
  | 'pending_signature' 
  | 'signed' 
  | 'cancelled';

interface ContractService {
  id: string;
  name: string;
  name_ar: string | null;
}

interface ContractCustomer {
  id: string;
  full_name: string | null;
  full_name_ar: string | null;
  email: string;
  phone: string | null;
  customer_uid: string | null;
}

interface Contract {
  id: string;
  contract_number: string;
  customer_user_id: string;
  service_id: string | null;
  order_id: string | null;
  status: ContractStatus;
  locale: string | null;
  pricing_json: {
    subtotal: number;
    vat_rate: number;
    vat_amount: number;
    total: number;
    currency: string;
  } | null;
  terms_snapshot_json: Record<string, unknown> | null;
  scope_summary: string | null;
  scope_summary_ar: string | null;
  signed_at: string | null;
  signed_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
  customer_pre_approval: boolean | null;
  pre_approval_timestamp: string | null;
  admin_approval_notes: string | null;
  admin_rejection_reason: string | null;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
  service?: ContractService | null;
  customer?: ContractCustomer | null;
}

// Status configuration
const statusConfig: Record<ContractStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Clock;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-muted',
    icon: FileText,
  },
  pre_approved_by_customer: {
    labelAr: 'موافقة مبدئية',
    labelEn: 'Pre-approved',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
    icon: Clock,
  },
  pending_admin_approval: {
    labelAr: 'بانتظار موافقة الإدارة',
    labelEn: 'Pending Admin',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
    icon: AlertTriangle,
  },
  pending_signature: {
    labelAr: 'بانتظار التوقيع',
    labelEn: 'Pending Signature',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    icon: FileSignature,
  },
  signed: {
    labelAr: 'موقّع',
    labelEn: 'Signed',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    icon: CheckCircle,
  },
  cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    icon: XCircle,
  },
};

export function ContractsManagement() {
  const { language, isRTL } = useLanguage();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats
  const stats = {
    total: contracts.length,
    preApproved: contracts.filter(c => c.status === 'pre_approved_by_customer').length,
    pendingSignature: contracts.filter(c => c.status === 'pending_signature').length,
    signed: contracts.filter(c => c.status === 'signed').length,
    cancelled: contracts.filter(c => c.status === 'cancelled').length,
  };

  // Fetch contracts
  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          service:services(id, name, name_ar),
          customer:profiles!contracts_customer_user_id_fkey(id, full_name, full_name_ar, email, phone, customer_uid)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedContracts = (data || []).map((item: any) => ({
        ...item,
        status: item.status as ContractStatus,
        pricing_json: item.pricing_json as Contract['pricing_json'],
        terms_snapshot_json: item.terms_snapshot_json as Record<string, unknown> | null,
        service: item.service as ContractService | null,
        customer: item.customer as ContractCustomer | null,
      }));

      setContracts(transformedContracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error(isRTL ? 'فشل في تحميل العقود' : 'Failed to load contracts');
    } finally {
      setIsLoading(false);
    }
  }, [isRTL]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Format datetime
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  // Get status badge
  const getStatusBadge = (status: ContractStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.color,
        config.borderColor
      )}>
        <Icon className="h-3 w-3" />
        {isRTL ? config.labelAr : config.labelEn}
      </div>
    );
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isRTL ? 'تم النسخ' : 'Copied');
  };

  // Approve contract
  const handleApprove = async () => {
    if (!selectedContract) return;
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('admin_approve_contract', {
        p_contract_id: selectedContract.id,
        p_admin_id: user.id,
        p_notes: approvalNotes || null,
      });

      if (error) throw error;

      toast.success(isRTL ? 'تمت الموافقة على العقد بنجاح' : 'Contract approved successfully');
      
      // Send email + SMS notification to customer
      if (selectedContract.customer?.email) {
        sendContractEmail({
          contractId: selectedContract.id,
          contractNumber: selectedContract.contract_number,
          customerEmail: selectedContract.customer.email,
          customerName: selectedContract.customer.full_name || selectedContract.customer.full_name_ar || '',
          customerPhone: selectedContract.customer.phone || undefined,
          serviceName: selectedContract.service?.name || '',
          serviceNameAr: selectedContract.service?.name_ar || undefined,
          totalAmount: selectedContract.pricing_json?.total || 0,
          currency: selectedContract.pricing_json?.currency || 'SAR',
          eventType: 'admin_approved',
          signingUrl: `/dashboard/contracts/${selectedContract.id}/sign`,
        }).catch(err => console.error('Notification failed:', err));
      }
      
      setIsApproveOpen(false);
      setApprovalNotes('');
      fetchContracts();
    } catch (error) {
      console.error('Error approving contract:', error);
      toast.error(isRTL ? 'فشل في الموافقة على العقد' : 'Failed to approve contract');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject contract
  const handleReject = async () => {
    if (!selectedContract || !rejectionReason.trim()) {
      toast.error(isRTL ? 'يرجى إدخال سبب الرفض' : 'Please enter rejection reason');
      return;
    }
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('admin_reject_contract', {
        p_contract_id: selectedContract.id,
        p_admin_id: user.id,
        p_reason: rejectionReason,
      });

      if (error) throw error;

      toast.success(isRTL ? 'تم رفض العقد' : 'Contract rejected');
      
      // Send rejection email + SMS notification to customer
      if (selectedContract.customer?.email) {
        sendContractEmail({
          contractId: selectedContract.id,
          contractNumber: selectedContract.contract_number,
          customerEmail: selectedContract.customer.email,
          customerName: selectedContract.customer.full_name || selectedContract.customer.full_name_ar || '',
          customerPhone: selectedContract.customer.phone || undefined,
          serviceName: selectedContract.service?.name || '',
          serviceNameAr: selectedContract.service?.name_ar || undefined,
          totalAmount: selectedContract.pricing_json?.total || 0,
          currency: selectedContract.pricing_json?.currency || 'SAR',
          eventType: 'rejected',
          rejectionReason: rejectionReason,
        }).catch(err => console.error('Notification failed:', err));
      }
      
      setIsRejectOpen(false);
      setRejectionReason('');
      fetchContracts();
    } catch (error) {
      console.error('Error rejecting contract:', error);
      toast.error(isRTL ? 'فشل في رفض العقد' : 'Failed to reject contract');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.customer?.full_name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.customer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.customer?.customer_uid?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pending approval contracts (pre_approved_by_customer)
  const pendingApproval = contracts.filter(c => c.status === 'pre_approved_by_customer');

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6 p-6">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 text-white"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <FileSignature className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {isRTL ? 'إدارة العقود' : 'Contracts Management'}
                  </h1>
                  <p className="text-white/80 mt-1">
                    {isRTL ? 'الموافقة ومراجعة عقود العملاء' : 'Approve and review customer contracts'}
                  </p>
                </div>
              </div>
              <Button
                onClick={fetchContracts}
                variant="secondary"
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-muted/50 to-background">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'إجمالي العقود' : 'Total'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-secondary/10 to-background border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-secondary/10">
                  <Clock className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">{stats.preApproved}</p>
                  <p className="text-xs text-secondary/70">{isRTL ? 'بانتظار الموافقة' : 'Pending Approval'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/10 to-background">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100">
                  <FileSignature className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{stats.pendingSignature}</p>
                  <p className="text-xs text-blue-600">{isRTL ? 'بانتظار التوقيع' : 'Pending Signature'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{stats.signed}</p>
                  <p className="text-xs text-emerald-600">{isRTL ? 'موقّعة' : 'Signed'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
                  <p className="text-xs text-red-600">{isRTL ? 'ملغاة' : 'Cancelled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approval Alert */}
        {pendingApproval.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">
                      {isRTL 
                        ? `يوجد ${pendingApproval.length} عقود بانتظار موافقتك`
                        : `${pendingApproval.length} contracts awaiting your approval`
                      }
                    </p>
                    <p className="text-sm text-amber-600">
                      {isRTL 
                        ? 'العملاء قدموا موافقتهم المبدئية'
                        : 'Customers have submitted their pre-approval'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input
                  placeholder={isRTL ? 'بحث برقم العقد أو اسم العميل...' : 'Search by contract number or customer...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn("h-10", isRTL ? "pr-10" : "pl-10")}
                />
              </div>

              {/* Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 me-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="pre_approved_by_customer">{isRTL ? 'موافقة مبدئية' : 'Pre-approved'}</SelectItem>
                  <SelectItem value="pending_signature">{isRTL ? 'بانتظار التوقيع' : 'Pending Signature'}</SelectItem>
                  <SelectItem value="signed">{isRTL ? 'موقّع' : 'Signed'}</SelectItem>
                  <SelectItem value="cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg">
                  {isRTL ? 'لا توجد عقود' : 'No contracts found'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'لم يتم العثور على أي عقود مطابقة' : 'No matching contracts found'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>{isRTL ? 'رقم العقد' : 'Contract #'}</TableHead>
                      <TableHead>{isRTL ? 'العميل' : 'Customer'}</TableHead>
                      <TableHead>{isRTL ? 'الخدمة' : 'Service'}</TableHead>
                      <TableHead>{isRTL ? 'القيمة' : 'Value'}</TableHead>
                      <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{isRTL ? 'التاريخ' : 'Date'}</TableHead>
                      <TableHead className="text-center">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow key={contract.id} className="group hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {contract.contract_number}
                            </code>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                    onClick={() => copyToClipboard(contract.contract_number)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isRTL ? 'نسخ' : 'Copy'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {isRTL 
                                ? contract.customer?.full_name_ar || contract.customer?.full_name || '-'
                                : contract.customer?.full_name || '-'
                              }
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {contract.customer?.email}
                            </span>
                            {contract.customer?.customer_uid && (
                              <Badge variant="outline" className="text-[10px] w-fit mt-1">
                                {contract.customer.customer_uid}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {isRTL 
                              ? contract.service?.name_ar || contract.service?.name || '-'
                              : contract.service?.name || '-'
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          {contract.pricing_json ? (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {formatCurrency(contract.pricing_json.total, contract.pricing_json.currency)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {isRTL ? 'شامل الضريبة' : 'incl. VAT'}
                              </span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contract.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(contract.created_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            {/* View Details */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setSelectedContract(contract);
                                      setIsDetailOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Approve (only for pre_approved_by_customer) */}
                            {contract.status === 'pre_approved_by_customer' && (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        onClick={() => {
                                          setSelectedContract(contract);
                                          setIsApproveOpen(true);
                                        }}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {isRTL ? 'موافقة' : 'Approve'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                          setSelectedContract(contract);
                                          setIsRejectOpen(true);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {isRTL ? 'رفض' : 'Reject'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              {isRTL ? 'تفاصيل العقد' : 'Contract Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedContract?.contract_number}
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex justify-center">
                {getStatusBadge(selectedContract.status)}
              </div>

              {/* Customer Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {isRTL ? 'بيانات العميل' : 'Customer Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-medium">
                      {isRTL 
                        ? selectedContract.customer?.full_name_ar || selectedContract.customer?.full_name
                        : selectedContract.customer?.full_name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? 'البريد:' : 'Email:'}</span>
                    <span>{selectedContract.customer?.email}</span>
                  </div>
                  {selectedContract.customer?.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الهاتف:' : 'Phone:'}</span>
                      <span>{selectedContract.customer.phone}</span>
                    </div>
                  )}
                  {selectedContract.customer?.customer_uid && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'رقم العميل:' : 'Customer ID:'}</span>
                      <Badge variant="outline">{selectedContract.customer.customer_uid}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pricing */}
              {selectedContract.pricing_json && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {isRTL ? 'تفاصيل الأسعار' : 'Pricing Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span>{formatCurrency(selectedContract.pricing_json.subtotal, selectedContract.pricing_json.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? `الضريبة (${selectedContract.pricing_json.vat_rate}%):` : `VAT (${selectedContract.pricing_json.vat_rate}%):`}</span>
                      <span>{formatCurrency(selectedContract.pricing_json.vat_amount, selectedContract.pricing_json.currency)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                      <span className="text-primary">{formatCurrency(selectedContract.pricing_json.total, selectedContract.pricing_json.currency)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {isRTL ? 'الجدول الزمني' : 'Timeline'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRTL ? 'تاريخ الإنشاء:' : 'Created:'}</span>
                    <span>{formatDateTime(selectedContract.created_at)}</span>
                  </div>
                  {selectedContract.pre_approval_timestamp && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'الموافقة المبدئية:' : 'Pre-approved:'}</span>
                      <span>{formatDateTime(selectedContract.pre_approval_timestamp)}</span>
                    </div>
                  )}
                  {selectedContract.admin_approved_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'موافقة الإدارة:' : 'Admin approved:'}</span>
                      <span>{formatDateTime(selectedContract.admin_approved_at)}</span>
                    </div>
                  )}
                  {selectedContract.signed_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isRTL ? 'تاريخ التوقيع:' : 'Signed:'}</span>
                      <span>{formatDateTime(selectedContract.signed_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              {(selectedContract.admin_approval_notes || selectedContract.admin_rejection_reason) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{isRTL ? 'ملاحظات' : 'Notes'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedContract.admin_approval_notes && (
                      <p className="text-sm text-muted-foreground">
                        {selectedContract.admin_approval_notes}
                      </p>
                    )}
                    {selectedContract.admin_rejection_reason && (
                      <p className="text-sm text-red-600">
                        <strong>{isRTL ? 'سبب الرفض: ' : 'Rejection reason: '}</strong>
                        {selectedContract.admin_rejection_reason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
            {selectedContract?.status === 'pre_approved_by_customer' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsRejectOpen(true);
                  }}
                >
                  <X className="h-4 w-4 me-2" />
                  {isRTL ? 'رفض' : 'Reject'}
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsApproveOpen(true);
                  }}
                >
                  <Check className="h-4 w-4 me-2" />
                  {isRTL ? 'موافقة' : 'Approve'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              {isRTL ? 'الموافقة على العقد' : 'Approve Contract'}
            </DialogTitle>
            <DialogDescription>
              {selectedContract?.contract_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'عند الموافقة، سيتم إرسال إشعار للعميل لتوقيع العقد نهائياً.'
                : 'Upon approval, the customer will be notified to sign the contract.'
              }
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
              </label>
              <Textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={isRTL ? 'أضف ملاحظات للعميل...' : 'Add notes for the customer...'}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={isProcessing}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 me-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 me-2" />
              )}
              {isRTL ? 'تأكيد الموافقة' : 'Confirm Approval'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              {isRTL ? 'رفض العقد' : 'Reject Contract'}
            </DialogTitle>
            <DialogDescription>
              {selectedContract?.contract_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'سيتم إشعار العميل بسبب الرفض.'
                : 'The customer will be notified of the rejection reason.'
              }
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'سبب الرفض *' : 'Rejection reason *'}
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={isRTL ? 'أدخل سبب الرفض...' : 'Enter rejection reason...'}
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={isProcessing}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing || !rejectionReason.trim()}>
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 me-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 me-2" />
              )}
              {isRTL ? 'تأكيد الرفض' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
