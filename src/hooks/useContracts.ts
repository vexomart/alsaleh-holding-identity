/**
 * Contracts Hook - Customer Contracts Management
 * Handles fetching and managing customer contracts with full RTL support
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ContractStatus = 'draft' | 'pending_signature' | 'signed' | 'cancelled';

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
