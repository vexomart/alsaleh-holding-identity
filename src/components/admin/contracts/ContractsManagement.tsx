/**
 * Admin Contracts Management - iOS-Style Premium Design
 * صفحة إدارة العقود بتصميم احترافي متوافق مع iOS وRTL صارم
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Banknote,
  FileSignature,
  Clock,
  CheckCircle,
  Filter,
  SlidersHorizontal,
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
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          *,
          service:services(id, name, name_ar)
        `)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

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
      toast.error('فشل في تحميل العقود');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        () => fetchContracts()
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
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        contract.contract_number.toLowerCase().includes(searchLower) ||
        contract.customer?.full_name?.toLowerCase().includes(searchLower) ||
        contract.customer?.full_name_ar?.toLowerCase().includes(searchLower) ||
        contract.customer?.email.toLowerCase().includes(searchLower) ||
        contract.customer?.customer_uid?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchQuery, statusFilter]);

  const pendingApprovalCount = contracts.filter(c => c.status === 'pre_approved_by_customer').length;

  // Handlers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ');
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

      toast.success('تمت الموافقة على العقد');
      
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
      toast.error('فشل في الموافقة');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedContract || !rejectionReason.trim()) {
      toast.error('يرجى إدخال سبب الرفض');
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

      toast.success('تم رفض العقد');
      
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
      toast.error('فشل في الرفض');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
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

  return (
    <div 
      className="min-h-screen bg-slate-950 overflow-x-hidden"
      dir="rtl"
      style={{ 
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
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
        <AnimatePresence>
          {pendingApprovalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-amber-700/50 bg-gradient-to-l from-amber-950/40 to-amber-900/20 shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-amber-200 text-sm sm:text-base">
                        {pendingApprovalCount} عقود بانتظار موافقتك
                      </p>
                      <p className="text-xs sm:text-sm text-amber-400/80 hidden sm:block">
                        العملاء قدموا موافقتهم المبدئية
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-600/50 text-amber-300 hover:bg-amber-900/50 rounded-xl h-9 px-3 shrink-0"
                      onClick={() => setStatusFilter('pre_approved_by_customer')}
                    >
                      عرض الكل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 sm:w-48 bg-slate-800/60 border-slate-700 text-white rounded-xl h-10">
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
              className="text-slate-400 hover:text-white rounded-xl h-9"
            >
              مسح الفلتر
            </Button>
          )}
          
          <div className="flex-1" />
          
          <Badge variant="outline" className="text-slate-300 border-slate-600 rounded-lg px-3 py-1">
            {filteredContracts.length} عقد
          </Badge>
        </div>

        {/* Contracts Table/Cards */}
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
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 rounded-2xl"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileSignature className="h-5 w-5 text-primary" />
              تفاصيل العقد
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedContract?.contract_number}
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-4">
              {/* Customer Info */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
                    <Users className="h-4 w-4 text-slate-400" />
                    بيانات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">الاسم:</span>
                    <span className="font-medium text-white">
                      {selectedContract.customer?.full_name_ar || selectedContract.customer?.full_name || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">البريد:</span>
                    <span className="text-slate-200">{selectedContract.customer?.email}</span>
                  </div>
                  {selectedContract.customer?.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">الهاتف:</span>
                      <span className="text-slate-200 ltr">{selectedContract.customer.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pricing */}
              {selectedContract.pricing_json && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
                      <Banknote className="h-4 w-4 text-slate-400" />
                      تفاصيل الأسعار
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">المجموع الفرعي:</span>
                      <span className="text-slate-200">{formatCurrency(selectedContract.pricing_json.subtotal, selectedContract.pricing_json.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">الضريبة:</span>
                      <span className="text-slate-200">{formatCurrency(selectedContract.pricing_json.vat_amount, selectedContract.pricing_json.currency)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700 font-semibold">
                      <span className="text-slate-200">الإجمالي:</span>
                      <span className="text-primary">{formatCurrency(selectedContract.pricing_json.total, selectedContract.pricing_json.currency)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
                    <Clock className="h-4 w-4 text-slate-400" />
                    التسلسل الزمني
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">تاريخ الإنشاء:</span>
                    <span className="text-slate-200">{formatDateTime(selectedContract.created_at)}</span>
                  </div>
                  {selectedContract.pre_approval_timestamp && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">الموافقة المبدئية:</span>
                      <span className="text-slate-200">{formatDateTime(selectedContract.pre_approval_timestamp)}</span>
                    </div>
                  )}
                  {selectedContract.admin_approved_at && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">موافقة الإدارة:</span>
                      <span className="text-emerald-400">{formatDateTime(selectedContract.admin_approved_at)}</span>
                    </div>
                  )}
                  {selectedContract.signed_at && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">تاريخ التوقيع:</span>
                      <span className="text-emerald-400">{formatDateTime(selectedContract.signed_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedContract.status === 'pre_approved_by_customer' && (
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setIsDetailOpen(false);
                      setTimeout(() => setIsApproveOpen(true), 150);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl"
                  >
                    <CheckCircle className="h-4 w-4 me-2" />
                    موافقة
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDetailOpen(false);
                      setTimeout(() => setIsRejectOpen(true), 150);
                    }}
                    className="flex-1 h-11 rounded-xl"
                  >
                    رفض
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              تأكيد الموافقة
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              سيتم إرسال إشعار للعميل لتوقيع العقد
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-200">
                ملاحظات (اختياري)
              </label>
              <Textarea
                placeholder="أضف ملاحظات..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsApproveOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl h-11"
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 min-w-[100px]"
            >
              {isProcessing ? 'جاري الموافقة...' : 'موافقة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              تأكيد الرفض
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              سيتم إشعار العميل بسبب الرفض
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-200">
                سبب الرفض <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="اكتب سبب الرفض..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsRejectOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl h-11"
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject} 
              disabled={isProcessing || !rejectionReason.trim()}
              className="rounded-xl h-11 min-w-[100px]"
            >
              {isProcessing ? 'جاري الرفض...' : 'رفض العقد'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
