/**
 * Contracts Hook - Customer Contracts Management
 * Handles fetching and managing customer contracts with full RTL support
 * Updated for pre-approval flow
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Updated status type to include new states
export type ContractStatus = 
  | 'draft' 
  | 'pre_approved_by_customer' 
  | 'pending_admin_approval' 
  | 'pending_signature' 
  | 'signed' 
  | 'cancelled';

export interface ContractPricing {
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  currency: string;
}

export interface ContractService {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
}

export interface Contract {
  id: string;
  contract_number: string;
  customer_user_id: string;
  service_id: string | null;
  order_id: string | null;
  status: ContractStatus;
  locale: string | null;
  pricing_json: ContractPricing | null;
  terms_snapshot_json: Record<string, unknown> | null;
  scope_summary: string | null;
  scope_summary_ar: string | null;
  signed_at: string | null;
  signed_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string | null;
  service?: ContractService | null;
  // Pre-approval fields
  customer_pre_approval?: boolean;
  pre_approval_timestamp?: string | null;
  admin_approval_notes?: string | null;
  admin_rejection_reason?: string | null;
  admin_approved_at?: string | null;
}

export interface ContractSignature {
  id: string;
  contract_id: string;
  signer_user_id: string;
  signer_name: string;
  signer_national_id: string | null;
  signer_phone: string | null;
  signature_method: 'checkbox' | 'drawn' | 'nafath_verified';
  signature_data_json: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ContractFile {
  id: string;
  contract_id: string;
  tenant_id: string | null;
  pdf_url: string;
  pdf_hash_sha256: string;
  generated_at: string | null;
  created_at: string;
}

export interface ContractTemplate {
  id: string;
  title_ar: string;
  title_en: string | null;
  body_ar: string;
  body_en: string | null;
  service_id: string | null;
  tenant_id: string | null;
  version: number;
  is_active: boolean;
  metadata: Record<string, unknown> | null;
}

/**
 * Hook to fetch all contracts for the current customer
 */
export function useContracts() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!user?.id) {
      setContracts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('contracts')
        .select(`
          *,
          service:services(id, name, name_ar, description, description_ar)
        `)
        .eq('customer_user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform the data to match our Contract interface
      const transformedContracts: Contract[] = (data || []).map((item) => ({
        ...item,
        status: item.status as ContractStatus,
        pricing_json: item.pricing_json as unknown as ContractPricing | null,
        terms_snapshot_json: item.terms_snapshot_json as unknown as Record<string, unknown> | null,
        service: item.service as unknown as ContractService | null,
      }));

      setContracts(transformedContracts);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError(err instanceof Error ? err.message : 'فشل في تحميل العقود');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    isLoading,
    error,
    refetch: fetchContracts,
  };
}

/**
 * Hook to fetch a single contract with its signature and file
 */
export function useContract(contractId: string | undefined) {
  const { user } = useAuth();
  const [contract, setContract] = useState<Contract | null>(null);
  const [signature, setSignature] = useState<ContractSignature | null>(null);
  const [contractFile, setContractFile] = useState<ContractFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const fetchContract = useCallback(async () => {
    if (!contractId || !user?.id) {
      setContract(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch contract
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select(`
          *,
          service:services(id, name, name_ar, description, description_ar)
        `)
        .eq('id', contractId)
        .eq('customer_user_id', user.id)
        .single();

      if (contractError) throw contractError;

      const transformedContract: Contract = {
        ...contractData,
        status: contractData.status as ContractStatus,
        pricing_json: contractData.pricing_json as unknown as ContractPricing | null,
        terms_snapshot_json: contractData.terms_snapshot_json as unknown as Record<string, unknown> | null,
        service: contractData.service as unknown as ContractService | null,
      };

      setContract(transformedContract);

      // Fetch signature if exists
      const { data: signatureData } = await supabase
        .from('contract_signatures')
        .select('*')
        .eq('contract_id', contractId)
        .maybeSingle();

      if (signatureData) {
        setSignature({
          ...signatureData,
          signature_method: signatureData.signature_method as 'checkbox' | 'drawn' | 'nafath_verified',
          signature_data_json: signatureData.signature_data_json as Record<string, unknown> | null,
          ip_address: signatureData.ip_address as string | null,
        });
      }

      // Fetch contract file if signed
      if (transformedContract.status === 'signed') {
        const { data: fileData } = await supabase
          .from('contract_files')
          .select('*')
          .eq('contract_id', contractId)
          .maybeSingle();

        if (fileData) {
          setContractFile(fileData);
        }
      }
    } catch (err) {
      console.error('Error fetching contract:', err);
      setError(err instanceof Error ? err.message : 'فشل في تحميل العقد');
    } finally {
      setIsLoading(false);
    }
  }, [contractId, user?.id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  /**
   * Sign the contract
   */
  const signContract = async (
    signerName: string,
    nationalId?: string,
    phone?: string
  ): Promise<boolean> => {
    if (!contract || !user?.id) {
      toast.error('لا يمكن توقيع العقد');
      return false;
    }

    if (contract.status !== 'pending_signature') {
      toast.error('العقد غير متاح للتوقيع');
      return false;
    }

    setIsSigning(true);

    try {
      // Create signature record
      const signatureData = {
        contract_id: contract.id,
        signer_user_id: user.id,
        signer_name: signerName,
        signer_national_id: nationalId || null,
        signer_phone: phone || null,
        signature_method: 'checkbox' as const,
        signature_data_json: {
          agreed_at: new Date().toISOString(),
          agreement_text: 'أقر أنني قرأت العقد وأوافق على جميع الشروط والأحكام',
        },
        user_agent: navigator.userAgent,
      };

      const { error: signatureError } = await supabase
        .from('contract_signatures')
        .insert(signatureData);

      if (signatureError) throw signatureError;

      // Update contract status
      const { error: updateError } = await supabase
        .from('contracts')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString(),
          signed_by_user_id: user.id,
        })
        .eq('id', contract.id);

      if (updateError) throw updateError;

      toast.success('تم توقيع العقد بنجاح');
      
      // Refresh contract data
      await fetchContract();
      
      return true;
    } catch (err) {
      console.error('Error signing contract:', err);
      toast.error('فشل في توقيع العقد');
      return false;
    } finally {
      setIsSigning(false);
    }
  };

  return {
    contract,
    signature,
    contractFile,
    isLoading,
    error,
    isSigning,
    signContract,
    refetch: fetchContract,
  };
}

/**
 * Hook to check if a service requires contract pre-approval
 */
export function useServiceContract(serviceId: string | undefined) {
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [requiresContract, setRequiresContract] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkServiceContract = async () => {
      if (!serviceId) {
        setRequiresContract(false);
        setTemplate(null);
        setIsLoading(false);
        return;
      }

      try {
        // Check if service has a default contract template
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('default_contract_template_id')
          .eq('id', serviceId)
          .single();

        if (serviceError || !serviceData?.default_contract_template_id) {
          setRequiresContract(false);
          setTemplate(null);
          setIsLoading(false);
          return;
        }

        // Fetch the template
        const { data: templateData, error: templateError } = await supabase
          .from('contract_templates')
          .select('*')
          .eq('id', serviceData.default_contract_template_id)
          .eq('is_active', true)
          .single();

        if (templateError || !templateData) {
          setRequiresContract(false);
          setTemplate(null);
        } else {
          setRequiresContract(true);
          setTemplate({
            ...templateData,
            metadata: templateData.metadata as Record<string, unknown> | null,
          });
        }
      } catch (err) {
        console.error('Error checking service contract:', err);
        setRequiresContract(false);
        setTemplate(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkServiceContract();
  }, [serviceId]);

  return {
    requiresContract,
    template,
    isLoading,
  };
}

/**
 * Create pre-approved contract during service request
 */
export async function createPreApprovedContract(
  customerId: string,
  serviceId: string,
  orderId?: string
): Promise<{ contractId: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('create_pre_approved_contract', {
      p_customer_id: customerId,
      p_service_id: serviceId,
      p_order_id: orderId || null,
      p_user_agent: navigator.userAgent,
    });

    if (error) throw error;

    return { contractId: data as string, error: null };
  } catch (err) {
    console.error('Error creating pre-approved contract:', err);
    return { 
      contractId: null, 
      error: err instanceof Error ? err.message : 'فشل في إنشاء العقد' 
    };
  }
}
