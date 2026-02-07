/**
 * Admin Contracts Management - Redesigned Enterprise Grade
 * Command Center style with real-time updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { sendContractEmail } from '@/lib/api/email-notifications';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  FileSignature,
  Clock,
  CheckCircle,
  Filter,
} from 'lucide-react';

// Local components
import { AdminContractsHeader } from './AdminContractsHeader';
import { AdminContractsKPIStrip, AdminContractsKPIData } from './AdminContractsKPIStrip';
import { AdminContractsTable, AdminContract, ContractStatus } from './AdminContractsTable';

export function ContractsManagement() {
  const { isRTL } = useLanguage();
  
  // State
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<AdminContract | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch contracts
  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    try {
      // First fetch contracts with services
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          *,
          service:services(id, name, name_ar)
        `)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      // Fetch customer profiles separately
      const customerIds = [...new Set((contractsData || []).map((c: any) => c.customer_user_id))];
      
      let profilesMap: Record<string, any> = {};
      if (customerIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, full_name_ar, email, phone, customer_uid')
          .in('id', customerIds);
        
        if (profilesData) {
          profilesMap = profilesData.reduce((acc: Record<string, any>, profile: any) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      }

      const transformedContracts = (contractsData || []).map((item: any) => ({
        ...item,
        status: item.status as ContractStatus,
        pricing_json: item.pricing_json as AdminContract['pricing_json'],
        service: item.service as AdminContract['service'],
        customer: profilesMap[item.customer_user_id] || null,
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

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-contracts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contracts' },
        (payload) => {
          console.log('[Contracts Realtime]', payload.eventType);
          fetchContracts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContracts]);

  // KPI Data
  const kpiData: AdminContractsKPIData = useMemo(() => {
    const totalValue = contracts.reduce((sum, c) => sum + (c.pricing_json?.total || 0), 0);
    return {
      total: contracts.length,
      pre_approved: contracts.filter(c => c.status === 'pre_approved_by_customer').length,
      pending_signature: contracts.filter(c => c.status === 'pending_signature').length,
      signed: contracts.filter(c => c.status === 'signed').length,
      cancelled: contracts.filter(c => c.status === 'cancelled').length,
      total_value: totalValue,
    };
  }, [contracts]);

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.customer?.full_name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.customer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.customer?.customer_uid?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchQuery, statusFilter]);

  // Pending approval count for alert
  const pendingApprovalCount = contracts.filter(c => c.status === 'pre_approved_by_customer').length;

  // Handlers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isRTL ? 'تم النسخ' : 'Copied');
  };

  const handleApprove = async () => {
    if (!selectedContract) return;
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_approve_contract', {
        p_contract_id: selectedContract.id,
        p_admin_id: user.id,
        p_notes: approvalNotes || null,
      });

      if (error) throw error;

      toast.success(isRTL ? 'تمت الموافقة على العقد' : 'Contract approved');
      
      // Send notification
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
          signingUrl: `/portal/contracts/${selectedContract.id}/sign`,
        }).catch(err => console.error('Notification failed:', err));
      }
      
      setIsApproveOpen(false);
      setApprovalNotes('');
      fetchContracts();
    } catch (error) {
      console.error('Error approving contract:', error);
      toast.error(isRTL ? 'فشل في الموافقة' : 'Failed to approve');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedContract || !rejectionReason.trim()) {
      toast.error(isRTL ? 'يرجى إدخال سبب الرفض' : 'Please enter rejection reason');
      return;
    }
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('admin_reject_contract', {
        p_contract_id: selectedContract.id,
        p_admin_id: user.id,
        p_reason: rejectionReason,
      });

      if (error) throw error;

      toast.success(isRTL ? 'تم رفض العقد' : 'Contract rejected');
      
      // Send notification
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
      toast.error(isRTL ? 'فشل في الرفض' : 'Failed to reject');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency,
    }).format(amount);
  };

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

  return (
    <div className="min-h-screen bg-slate-950" dir="rtl">
      <div className="space-y-6 p-6">
        {/* Header */}
        <AdminContractsHeader
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={fetchContracts}
          isRefreshing={isLoading}
          totalContracts={contracts.length}
        />

        {/* KPI Strip */}
        <AdminContractsKPIStrip 
          data={kpiData}
          isLoading={isLoading && contracts.length === 0}
          onFilterByStatus={handleFilterByStatus}
          activeFilter={statusFilter}
        />

        {/* Pending Approval Alert */}
        {pendingApprovalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-amber-700/50 bg-amber-950/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-amber-200">
                      {pendingApprovalCount} عقود بانتظار موافقتك
                    </p>
                    <p className="text-sm text-amber-400/80">
                      العملاء قدموا موافقتهم المبدئية
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-600/50 text-amber-300 hover:bg-amber-900/50"
                    onClick={() => setStatusFilter('pre_approved_by_customer')}
                  >
                    عرض الكل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filter Row */}
        <div className="flex items-center gap-4 flex-row-reverse">
          <div className="flex items-center gap-2 flex-row-reverse">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pre_approved_by_customer">بانتظار الموافقة</SelectItem>
                <SelectItem value="pending_signature">بانتظار التوقيع</SelectItem>
                <SelectItem value="signed">موقّع</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {statusFilter !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter('all')}
              className="text-slate-400 hover:text-white"
            >
              مسح الفلتر
            </Button>
          )}
          <div className="flex-1" />
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            {filteredContracts.length} عقد
          </Badge>
        </div>

        {/* Contracts Table */}
        <AdminContractsTable
          contracts={filteredContracts}
          isLoading={isLoading}
          onViewDetails={(contract) => {
            setSelectedContract(contract);
            setIsDetailOpen(true);
          }}
          onApprove={(contract) => {
            setSelectedContract(contract);
            setIsApproveOpen(true);
          }}
          onReject={(contract) => {
            setSelectedContract(contract);
            setIsRejectOpen(true);
          }}
          onCopyNumber={copyToClipboard}
        />
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <FileSignature className="h-5 w-5 text-primary" />
              {isRTL ? 'تفاصيل العقد' : 'Contract Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedContract?.contract_number}
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className={cn("text-sm flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <Users className="h-4 w-4" />
                    {isRTL ? 'بيانات العميل' : 'Customer Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-muted-foreground">{isRTL ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-medium">
                      {isRTL 
                        ? selectedContract.customer?.full_name_ar || selectedContract.customer?.full_name
                        : selectedContract.customer?.full_name
                      }
                    </span>
                  </div>
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-muted-foreground">{isRTL ? 'البريد:' : 'Email:'}</span>
                    <span>{selectedContract.customer?.email}</span>
                  </div>
                  {selectedContract.customer?.phone && (
                    <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                      <span className="text-muted-foreground">{isRTL ? 'الهاتف:' : 'Phone:'}</span>
                      <span>{selectedContract.customer.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pricing */}
              {selectedContract.pricing_json && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className={cn("text-sm flex items-center gap-2", isRTL && "flex-row-reverse")}>
                      <DollarSign className="h-4 w-4" />
                      {isRTL ? 'تفاصيل الأسعار' : 'Pricing Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                      <span className="text-muted-foreground">{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span>{formatCurrency(selectedContract.pricing_json.subtotal, selectedContract.pricing_json.currency)}</span>
                    </div>
                    <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                      <span className="text-muted-foreground">{isRTL ? 'الضريبة:' : 'VAT:'}</span>
                      <span>{formatCurrency(selectedContract.pricing_json.vat_amount, selectedContract.pricing_json.currency)}</span>
                    </div>
                    <div className={cn("flex justify-between pt-2 border-t font-semibold", isRTL && "flex-row-reverse")}>
                      <span>{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                      <span className="text-primary">{formatCurrency(selectedContract.pricing_json.total, selectedContract.pricing_json.currency)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className={cn("text-sm flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <Clock className="h-4 w-4" />
                    {isRTL ? 'التسلسل الزمني' : 'Timeline'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-muted-foreground">{isRTL ? 'تاريخ الإنشاء:' : 'Created:'}</span>
                    <span>{formatDateTime(selectedContract.created_at)}</span>
                  </div>
                  {selectedContract.pre_approval_timestamp && (
                    <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                      <span className="text-muted-foreground">{isRTL ? 'الموافقة المبدئية:' : 'Pre-approved:'}</span>
                      <span>{formatDateTime(selectedContract.pre_approval_timestamp)}</span>
                    </div>
                  )}
                  {selectedContract.admin_approved_at && (
                    <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                      <span className="text-muted-foreground">{isRTL ? 'موافقة الإدارة:' : 'Admin Approved:'}</span>
                      <span className="text-accent">{formatDateTime(selectedContract.admin_approved_at)}</span>
                    </div>
                  )}
                  {selectedContract.signed_at && (
                    <div className={cn("flex justify-between", isRTL && "flex-row-reverse")}>
                      <span className="text-muted-foreground">{isRTL ? 'تاريخ التوقيع:' : 'Signed:'}</span>
                      <span className="text-accent">{formatDateTime(selectedContract.signed_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedContract.status === 'pre_approved_by_customer' && (
                <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
                  <Button
                    onClick={() => {
                      setIsDetailOpen(false);
                      setTimeout(() => setIsApproveOpen(true), 100);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 me-2" />
                    {isRTL ? 'موافقة' : 'Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDetailOpen(false);
                      setTimeout(() => setIsRejectOpen(true), 100);
                    }}
                    className="flex-1"
                  >
                    {isRTL ? 'رفض' : 'Reject'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              {isRTL ? 'تأكيد الموافقة' : 'Confirm Approval'}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? 'سيتم إرسال إشعار للعميل لتوقيع العقد'
                : 'Customer will be notified to sign the contract'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {isRTL ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
              </label>
              <Textarea
                placeholder={isRTL ? 'أضف ملاحظات...' : 'Add notes...'}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className={cn(isRTL && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing 
                ? (isRTL ? 'جاري الموافقة...' : 'Approving...') 
                : (isRTL ? 'موافقة' : 'Approve')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2 text-destructive", isRTL && "flex-row-reverse")}>
              <AlertTriangle className="h-5 w-5" />
              {isRTL ? 'تأكيد الرفض' : 'Confirm Rejection'}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? 'سيتم إشعار العميل بسبب الرفض'
                : 'Customer will be notified with the rejection reason'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {isRTL ? 'سبب الرفض *' : 'Rejection reason *'}
              </label>
              <Textarea
                placeholder={isRTL ? 'اكتب سبب الرفض...' : 'Enter rejection reason...'}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter className={cn(isRTL && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject} 
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing 
                ? (isRTL ? 'جاري الرفض...' : 'Rejecting...') 
                : (isRTL ? 'رفض العقد' : 'Reject Contract')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
