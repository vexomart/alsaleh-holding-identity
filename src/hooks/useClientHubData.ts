/**
 * Client Hub Data Hook
 * Aggregates all client data from multiple sources
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  ClientHubData, 
  ClientIdentity, 
  TimelineEvent, 
  ActiveService,
  FinancialSnapshot,
  ContractSummary,
  ClientStatus,
  FinanceApplicationSummary
} from '@/components/client-hub/types';
import { generateClientId, determineClientStatus } from '@/components/client-hub/utils';

export function useClientHubData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['client-hub', user?.id],
    queryFn: async (): Promise<ClientHubData> => {
      if (!user?.id) throw new Error('Not authenticated');

      // Fetch all data in parallel
      const [
        profileResult,
        ordersResult,
        contractsResult,
        invoicesResult,
        walletResult,
        transactionsResult,
        entitiesResult,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
          .from('orders')
          .select(`
            *,
            service:services(id, name, name_ar)
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('contracts')
          .select(`
            *,
            service:services(id, name, name_ar)
          `)
          .eq('customer_user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('invoices')
          .select(`
            *,
            order:orders(id, order_number, title, title_ar)
          `)
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('customer_wallets')
          .select('*')
          .eq('customer_user_id', user.id)
          .single(),
        supabase
          .from('financial_transactions')
          .select('*')
          .eq('customer_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('entities')
          .select('id, legal_name_ar')
          .eq('owner_user_id', user.id),
      ]);

      const profile = profileResult.data;
      const orders = ordersResult.data || [];
      const contracts = contractsResult.data || [];
      const invoices = invoicesResult.data || [];
      const wallet = walletResult.data;
      const transactions = transactionsResult.data || [];
      const entities = entitiesResult.data || [];

      // Fetch finance applications if user has entities
      let financeApplications: any[] = [];
      if (entities.length > 0) {
        const entityIds = entities.map(e => e.id);
        const { data: apps } = await supabase
          .from('finance_applications')
          .select(`
            *,
            entity:entities(legal_name_ar)
          `)
          .in('entity_id', entityIds)
          .order('created_at', { ascending: false });
        financeApplications = apps || [];
      }

      // Build client identity
      const hasActiveContracts = contracts.some(c => c.status === 'signed');
      const clientStatus = determineClientStatus({
        hasActiveContracts,
        isVerified: profile?.is_kyc_verified || false,
        isSuspended: !profile?.is_active,
      });

      const identity: ClientIdentity = {
        id: user.id,
        clientId: profile?.customer_uid || generateClientId(),
        name: profile?.full_name || user.email?.split('@')[0] || 'Client',
        nameAr: profile?.full_name_ar,
        email: profile?.email || user.email || '',
        phone: profile?.phone,
        avatarUrl: profile?.avatar_url,
        status: clientStatus,
        createdAt: profile?.created_at || user.created_at || new Date().toISOString(),
        lastLoginAt: profile?.last_login_at,
        isKycVerified: profile?.is_kyc_verified || false,
        nationalId: profile?.national_id,
      };

      // Build timeline events
      const timeline: TimelineEvent[] = [];

      // Account creation
      timeline.push({
        id: `account-${user.id}`,
        type: 'account_created',
        title: 'Account Created',
        titleAr: 'تم إنشاء الحساب',
        timestamp: profile?.created_at || new Date().toISOString(),
        actor: 'system',
      });

      // Orders
      orders.forEach(order => {
        timeline.push({
          id: `order-${order.id}`,
          type: 'order_created',
          title: `Order ${order.order_number} created`,
          titleAr: `تم إنشاء الطلب ${order.order_number}`,
          description: order.title,
          descriptionAr: order.title_ar,
          timestamp: order.created_at,
          actor: 'client',
          relatedId: order.id,
          relatedType: 'order',
        });
      });

      // Contracts
      contracts.forEach(contract => {
        if (contract.status === 'signed' && contract.signed_at) {
          timeline.push({
            id: `contract-signed-${contract.id}`,
            type: 'contract_signed',
            title: `Contract ${contract.contract_number} signed`,
            titleAr: `تم توقيع العقد ${contract.contract_number}`,
            timestamp: contract.signed_at,
            actor: 'client',
            relatedId: contract.id,
            relatedType: 'contract',
          });
        } else {
          timeline.push({
            id: `contract-${contract.id}`,
            type: 'contract_created',
            title: `Contract ${contract.contract_number} created`,
            titleAr: `تم إنشاء العقد ${contract.contract_number}`,
            timestamp: contract.created_at,
            actor: 'system',
            relatedId: contract.id,
            relatedType: 'contract',
          });
        }
      });

      // Invoices
      invoices.forEach(invoice => {
        timeline.push({
          id: `invoice-${invoice.id}`,
          type: 'invoice_issued',
          title: `Invoice ${invoice.invoice_number} issued`,
          titleAr: `تم إصدار الفاتورة ${invoice.invoice_number}`,
          timestamp: invoice.created_at,
          actor: 'system',
          relatedId: invoice.id,
          relatedType: 'invoice',
        });

        if (invoice.status === 'paid' && invoice.paid_at) {
          timeline.push({
            id: `payment-${invoice.id}`,
            type: 'payment_received',
            title: `Payment received for invoice ${invoice.invoice_number}`,
            titleAr: `تم استلام الدفع للفاتورة ${invoice.invoice_number}`,
            timestamp: invoice.paid_at,
            actor: 'client',
            relatedId: invoice.id,
            relatedType: 'payment',
          });
        }
      });

      // Finance Applications
      financeApplications.forEach(app => {
        const eventType = app.status === 'approved' 
          ? 'finance_application_approved' 
          : app.status === 'rejected' 
          ? 'finance_application_rejected' 
          : 'finance_application_submitted';
        
        const statusLabel = app.status === 'approved' 
          ? 'Approved' 
          : app.status === 'rejected' 
          ? 'Rejected' 
          : 'Submitted';
        
        const statusLabelAr = app.status === 'approved' 
          ? 'موافق عليه' 
          : app.status === 'rejected' 
          ? 'مرفوض' 
          : 'مقدم';

        timeline.push({
          id: `finance-app-${app.id}`,
          type: eventType,
          title: `Finance Application ${app.application_number} - ${statusLabel}`,
          titleAr: `طلب تمويل ${app.application_number} - ${statusLabelAr}`,
          description: `Amount: ${app.amount_sar} SAR, ${app.tenor_months} months`,
          descriptionAr: `المبلغ: ${app.amount_sar} ر.س، ${app.tenor_months} شهر`,
          timestamp: app.decided_at || app.submitted_at || app.created_at,
          actor: app.status === 'submitted' ? 'client' : 'admin',
        });
      });

      // Sort timeline by date (newest first)
      timeline.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Build active services
      const activeServices: ActiveService[] = orders
        .filter(o => o.status !== 'cancelled' && o.status !== 'completed')
        .map(order => ({
          id: order.id,
          serviceId: order.service_id || '',
          serviceName: order.service?.name || order.title,
          serviceNameAr: order.service?.name_ar || order.title_ar,
          status: order.status === 'in_progress' ? 'active' : 
                  order.status === 'pending' ? 'pending' : 
                  order.status === 'completed' ? 'completed' : 'pending',
          startDate: order.created_at,
          contractId: order.contract_id,
          orderId: order.id,
          orderNumber: order.order_number,
        }));

      // Build financial snapshot
      const paidInvoices = invoices.filter(i => i.status === 'paid');
      const outstandingInvoices = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled');
      const lastPaidInvoice = paidInvoices.sort((a, b) => 
        new Date(b.paid_at || 0).getTime() - new Date(a.paid_at || 0).getTime()
      )[0];

      const financialSnapshot: FinancialSnapshot = {
        walletBalance: wallet?.balance || 0,
        reservedBalance: wallet?.reserved_balance || 0,
        outstandingInvoices: outstandingInvoices.length,
        outstandingAmount: outstandingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        lastPaymentDate: lastPaidInvoice?.paid_at,
        lastPaymentAmount: lastPaidInvoice?.total,
        totalPaid: paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        currency: 'SAR',
      };

      // Build contracts summary
      const contractsSummary: ContractSummary[] = contracts.map(contract => {
        // Check if contract has an expiration in pricing_json or terms_snapshot_json
        const pricingJson = contract.pricing_json as Record<string, any> | null;
        const expiresAt = pricingJson?.expires_at;
        const isExpiringSoon = expiresAt 
          ? new Date(expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
          : false;

        return {
          id: contract.id,
          contractNumber: contract.contract_number,
          status: contract.status,
          serviceName: contract.service?.name,
          serviceNameAr: contract.service?.name_ar,
          signedAt: contract.signed_at,
          expiresAt,
          isExpiringSoon,
        };
      });

      return {
        identity,
        timeline,
        activeServices,
        financialSnapshot,
        contracts: contractsSummary,
        financeApplications: financeApplications.map(app => ({
          id: app.id,
          applicationNumber: app.application_number,
          amountSar: app.amount_sar,
          tenorMonths: app.tenor_months,
          status: app.status,
          entityName: app.entity?.legal_name_ar,
          createdAt: app.created_at,
          decidedAt: app.decided_at,
        })),
      };
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });
}
