import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useEnhancedSecurity } from "./useEnhancedSecurity";
import { toast } from "sonner";

export interface SecureContract {
  id: string;
  contract_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  service_price: number;
  status: string;
  created_at: string;
  masked_data: boolean;
}

export const useSecureContracts = () => {
  const [contracts, setContracts] = useState<SecureContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logEnhancedSecurityEvent, checkEnhancedRateLimit } = useEnhancedSecurity();

  const fetchContracts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check rate limits before accessing contracts with enhanced security
      const canAccess = await checkEnhancedRateLimit('contract_access', undefined, 10, 60);
      if (!canAccess) {
        setError('تم تجاوز حد الوصول للعقود. حاول مرة أخرى لاحقاً.');
        toast.error('تم تجاوز حد الوصول للعقود');
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('يجب تسجيل الدخول لعرض العقود');
        return;
      }

      // Log security event
      await logEnhancedSecurityEvent({
        eventType: 'sensitive_data_access',
        description: 'User accessing contracts list',
        riskLevel: 'medium',
        resourceType: 'contracts'
      });

      // Use the secure function to get contracts with masked data
      const { data, error: rpcError } = await supabase.rpc('get_user_contracts', {
        requesting_user_id: user.id
      });

      if (rpcError) {
        if (rpcError.message.includes('Rate limit exceeded')) {
          setError('تم تجاوز حد الوصول للعقود. حاول مرة أخرى لاحقاً.');
          toast.error('تم تجاوز حد الوصول للعقود');
          return;
        }
        throw rpcError;
      }

      const secureContracts: SecureContract[] = data?.map((contract: any) => ({
        id: contract.id,
        contract_number: contract.contract_number,
        client_name: contract.client_name,
        client_email: contract.client_email,
        client_phone: contract.client_phone,
        service_type: contract.service_type,
        service_price: contract.service_price,
        status: contract.status,
        created_at: contract.created_at,
        masked_data: contract.masked_data
      })) || [];

      setContracts(secureContracts);
      
    } catch (err: any) {
      console.error('Error fetching secure contracts:', err);
      setError('حدث خطأ في تحميل العقود');
      
      // Log security event for error
      await logEnhancedSecurityEvent({
        eventType: 'suspicious_query_pattern',
        description: `Error accessing contracts: ${err.message}`,
        riskLevel: 'high',
        resourceType: 'contracts'
      });
    } finally {
      setLoading(false);
    }
  };

  const createSecureContract = async (contractData: any) => {
    try {
      // Check rate limits with enhanced security
      const canCreate = await checkEnhancedRateLimit('contract_creation', undefined, 3, 60);
      if (!canCreate) {
        toast.error('تم تجاوز حد إنشاء العقود');
        return { success: false, error: 'Rate limit exceeded' };
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Authentication required' };
      }

      // Log security event
      await logEnhancedSecurityEvent({
        eventType: 'sensitive_data_access',
        description: 'User creating new contract',
        riskLevel: 'high',
        resourceType: 'contracts'
      });

      // Create contract with user_id
      const { data, error } = await supabase
        .from('contracts')
        .insert({ ...contractData, user_id: user.id })
        .select()
        .single();

      if (error) {
        if (error.message.includes('Rate limit exceeded')) {
          toast.error('تم تجاوز حد إنشاء العقود');
          return { success: false, error: 'Rate limit exceeded' };
        }
        throw error;
      }

      toast.success('تم إنشاء العقد بنجاح');
      
      // Refresh contracts list
      await fetchContracts();
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Error creating secure contract:', err);
      
      // Log security event for error
      await logEnhancedSecurityEvent({
        eventType: 'suspicious_query_pattern',
        description: `Error creating contract: ${err.message}`,
        riskLevel: 'high',
        resourceType: 'contracts'
      });
      
      return { success: false, error: err.message };
    }
  };

  const updateSecureContract = async (contractId: string, updateData: any) => {
    try {
      // Check rate limits with enhanced security
      const canUpdate = await checkEnhancedRateLimit('contract_update', undefined, 5, 60);
      if (!canUpdate) {
        toast.error('تم تجاوز حد تحديث العقود');
        return { success: false, error: 'Rate limit exceeded' };
      }

      // Log security event
      await logEnhancedSecurityEvent({
        eventType: 'sensitive_data_access',
        description: 'User updating contract',
        riskLevel: 'high',
        resourceType: 'contracts',
        resourceId: contractId
      });

      const { data, error } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', contractId)
        .select()
        .single();

      if (error) {
        if (error.message.includes('Rate limit exceeded')) {
          toast.error('تم تجاوز حد تحديث العقود');
          return { success: false, error: 'Rate limit exceeded' };
        }
        throw error;
      }

      toast.success('تم تحديث العقد بنجاح');
      
      // Refresh contracts list
      await fetchContracts();
      
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating secure contract:', err);
      return { success: false, error: err.message };
    }
  };

  // Auto-fetch contracts on hook initialization
  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    createSecureContract,
    updateSecureContract
  };
};