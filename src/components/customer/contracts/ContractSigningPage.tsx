/**
 * Contract Signing Page - Full signing workflow
 * Premium RTL-first design with step-by-step process
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useContract } from '@/hooks/useContracts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence } from 'framer-motion';
import { type ContractData, downloadContractPdf } from '@/lib/invoices';
import { sendContractEmail } from '@/lib/api/email-notifications';

import {
  SigningPageHeader,
  ContractPreview,
  SignerInfoForm,
  SignaturePad,
  SigningSuccess,
  type SignerData,
} from './signing';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SigningStep = 1 | 2 | 3 | 4;

export function ContractSigningPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile, user } = useAuth();
  const { contract, signature, isLoading, error, refetch } = useContract(id);
  
  const isRTL = language === 'ar';

  // Signing workflow state
  const [currentStep, setCurrentStep] = useState<SigningStep>(1);
  const [signerData, setSignerData] = useState<SignerData | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  // Pre-fill signer data from profile
  useEffect(() => {
    if (profile) {
      setSignerData({
        name: profile.full_name || '',
        nationalId: '',
        phone: profile.phone || '',
        email: profile.email || user?.email,
      });
    }
  }, [profile, user]);

  // Redirect if contract is not pending signature
  useEffect(() => {
    if (!isLoading && contract) {
      if (contract.status === 'signed') {
        setCurrentStep(4);
        setSignedAt(contract.signed_at || new Date().toISOString());
        if (signature) {
          setSignerData({
            name: signature.signer_name,
            nationalId: signature.signer_national_id || '',
            phone: signature.signer_phone || '',
          });
        }
      } else if (contract.status !== 'pending_signature') {
        toast.error(isRTL ? 'العقد غير متاح للتوقيع' : 'Contract not available for signing');
        navigate('/app/contracts');
      }
    }
  }, [isLoading, contract, navigate, isRTL, signature]);

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handleStep2Continue = (data: SignerData) => {
    setSignerData(data);
    setCurrentStep(3);
  };

  const handleSign = async (signatureImageData: string) => {
    if (!contract || !user?.id || !signerData) {
      toast.error(isRTL ? 'بيانات غير مكتملة' : 'Incomplete data');
      return;
    }

    setIsSigning(true);

    try {
      // Create signature record with drawn signature
      const signatureRecord = {
        contract_id: contract.id,
        signer_user_id: user.id,
        signer_name: signerData.name,
        signer_national_id: signerData.nationalId || null,
        signer_phone: signerData.phone || null,
        signature_method: 'drawn' as const,
        signature_data_json: {
          agreed_at: new Date().toISOString(),
          agreement_text: 'أقر أنني قرأت العقد وأوافق على جميع الشروط والأحكام',
          signature_image: signatureImageData,
        },
        user_agent: navigator.userAgent,
      };

      const { error: signatureError } = await supabase
        .from('contract_signatures')
        .insert(signatureRecord);

      if (signatureError) throw signatureError;

      // Update contract status
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('contracts')
        .update({
          status: 'signed',
          signed_at: now,
          signed_by_user_id: user.id,
        })
        .eq('id', contract.id);

      if (updateError) throw updateError;

      setSignedAt(now);
      toast.success(isRTL ? 'تم توقيع العقد بنجاح!' : 'Contract signed successfully!');
      
      // Send contract signed email + SMS notification
      if (signerData.email || profile?.email) {
        sendContractEmail({
          contractId: contract.id,
          contractNumber: contract.contract_number,
          customerEmail: signerData.email || profile?.email || '',
          customerName: signerData.name,
          customerPhone: signerData.phone || profile?.phone || undefined,
          serviceName: contract.service?.name || '',
          serviceNameAr: contract.service?.name_ar || undefined,
          totalAmount: contract.pricing_json?.total || 0,
          currency: contract.pricing_json?.currency || 'SAR',
          eventType: 'signed',
        }).catch(err => console.error('Notification failed:', err));
      }
      
      // Move to success step
      setCurrentStep(4);
      
      // Refresh contract data
      await refetch();
    } catch (err) {
      console.error('Error signing contract:', err);
      toast.error(isRTL ? 'فشل في توقيع العقد' : 'Failed to sign contract');
    } finally {
      setIsSigning(false);
    }
  };

  const handleDownload = async () => {
    if (!contract || !signerData) return;

    setIsDownloading(true);

    try {
      const contractData: ContractData = {
        contractNumber: contract.contract_number,
        date: contract.created_at,
        serviceName: contract.service?.name_ar || contract.service?.name || 'خدمة',
        serviceNameAr: contract.service?.name_ar || undefined,
        scopeSummaryAr: contract.scope_summary_ar || undefined,
        provider: {
          name: 'شركة علي صالح الشهري القابضة',
          address: 'المملكة العربية السعودية - الرياض',
          role: 'provider' as const,
        },
        customer: {
          name: signerData.name,
          nationalId: signerData.nationalId || undefined,
          phone: signerData.phone || undefined,
          role: 'customer' as const,
        },
        pricing: {
          subtotal: contract.pricing_json?.subtotal || 0,
          vatRate: (contract.pricing_json?.vat_rate || 15) / 100,
          vatAmount: contract.pricing_json?.vat_amount || 0,
          total: contract.pricing_json?.total || 0,
        },
        currency: contract.pricing_json?.currency || 'SAR',
        adminApprovedAt: contract.admin_approved_at || null,
        customerSignedAt: signedAt || contract.signed_at || null,
        customerSignatureName: signerData.name,
      };

      const success = await downloadContractPdf(contractData);
      if (!success) throw new Error('Download failed');
      toast.success(isRTL ? 'تم تنزيل العقد' : 'Contract downloaded');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error(isRTL ? 'فشل تنزيل العقد' : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-800 px-4 py-8">
          <Skeleton className="h-8 w-32 bg-white/20 mb-4" />
          <Skeleton className="h-10 w-64 bg-white/20" />
        </div>
        <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contract) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card className="max-w-md w-full border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  {isRTL ? 'خطأ في تحميل العقد' : 'Error loading contract'}
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/app/contracts')}>
                <ArrowRight className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2 rotate-180")} />
                {isRTL ? 'العودة للعقود' : 'Back to Contracts'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Progress */}
      <SigningPageHeader
        contractNumber={contract.contract_number}
        serviceName={contract.service?.name_ar || contract.service?.name || ''}
        currentStep={currentStep}
        totalSteps={4}
      />

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Contract Preview */}
          {currentStep === 1 && (
            <ContractPreview
              key="step1"
              contract={contract}
              customerName={signerData?.name || profile?.full_name || ''}
              onContinue={handleStep1Continue}
              onCancel={() => navigate('/app/contracts')}
            />
          )}

          {/* Step 2: Signer Information */}
          {currentStep === 2 && (
            <SignerInfoForm
              key="step2"
              initialName={signerData?.name}
              initialPhone={signerData?.phone}
              initialEmail={signerData?.email}
              onContinue={handleStep2Continue}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Signature */}
          {currentStep === 3 && signerData && (
            <SignaturePad
              key="step3"
              signerData={signerData}
              onSign={handleSign}
              onBack={() => setCurrentStep(2)}
              isSigning={isSigning}
            />
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && signerData && (
            <SigningSuccess
              key="step4"
              contractNumber={contract.contract_number}
              signerName={signerData.name}
              signedAt={signedAt || contract.signed_at || new Date().toISOString()}
              onDownload={handleDownload}
              onViewContracts={() => navigate('/app/contracts')}
              isDownloading={isDownloading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
