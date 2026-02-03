/**
 * Signature Pad - Electronic signature collection
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { 
  PenTool, 
  RotateCcw, 
  CheckCircle2,
  Shield,
  Fingerprint,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { SignerData } from './SignerInfoForm';

interface SignaturePadProps {
  signerData: SignerData;
  onSign: (signatureData: string) => void;
  onBack: () => void;
  isSigning?: boolean;
}

export function SignaturePad({
  signerData,
  onSign,
  onBack,
  isSigning = false,
}: SignaturePadProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const signatureRef = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleClear = () => {
    signatureRef.current?.clear();
    setHasSignature(false);
  };

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  const handleSign = () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      return;
    }
    
    const signatureData = signatureRef.current.toDataURL('image/png');
    onSign(signatureData);
  };

  const canSign = hasSignature && agreedToTerms;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Signer Summary */}
      <Card className="border-indigo-200 dark:border-indigo-800/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <Fingerprint className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{signerData.name}</p>
              <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                <span dir="ltr">{isRTL ? 'الهوية:' : 'ID:'} {signerData.nationalId}</span>
                <span dir="ltr">{isRTL ? 'الجوال:' : 'Phone:'} {signerData.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Canvas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            {isRTL ? 'التوقيع الإلكتروني' : 'Electronic Signature'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'ارسم توقيعك في المربع أدناه باستخدام الماوس أو إصبعك'
              : 'Draw your signature in the box below using your mouse or finger'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Canvas Container */}
          <div className="relative">
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl bg-white dark:bg-slate-950 overflow-hidden transition-colors",
                hasSignature ? "border-green-500" : "border-muted-foreground/30"
              )}
            >
              <SignatureCanvas
                ref={signatureRef}
                penColor="#1e3a5f"
                canvasProps={{
                  className: 'w-full h-[200px] cursor-crosshair',
                  style: { touchAction: 'none' },
                }}
                onEnd={handleEnd}
              />
              
              {/* Placeholder */}
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-muted-foreground/40 text-lg">
                    {isRTL ? 'وقّع هنا' : 'Sign here'}
                  </p>
                </div>
              )}
            </div>

            {/* Clear Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute top-2 left-2 gap-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              {isRTL ? 'مسح' : 'Clear'}
            </Button>
          </div>

          {/* Signature Status */}
          {hasSignature && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-600 text-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isRTL ? 'تم رسم التوقيع' : 'Signature drawn'}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Legal Agreement */}
      <Card className={cn(
        "border-2 transition-colors",
        agreedToTerms ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : "border-amber-500"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree-terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <label 
                htmlFor="agree-terms" 
                className="text-sm font-medium cursor-pointer"
              >
                {isRTL 
                  ? 'أقر أنني قرأت العقد وأوافق على جميع الشروط والأحكام الواردة فيه، وأن التوقيع أعلاه يمثل توقيعي الإلكتروني الرسمي وله الحجية القانونية الكاملة.'
                  : 'I confirm that I have read the contract and agree to all terms and conditions. The signature above represents my official electronic signature with full legal validity.'}
              </label>
            </div>
            {agreedToTerms ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
        <Shield className="h-4 w-4" />
        <span>
          {isRTL 
            ? 'سيتم تسجيل وقت التوقيع وعنوان IP الخاص بك لأغراض التوثيق'
            : 'Your signing time and IP address will be recorded for verification'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSigning}
          className="sm:flex-1"
        >
          {isRTL ? 'السابق' : 'Back'}
        </Button>
        <Button
          onClick={handleSign}
          disabled={!canSign || isSigning}
          className="sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {isSigning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              {isRTL ? 'جاري التوقيع...' : 'Signing...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isRTL ? 'توقيع العقد' : 'Sign Contract'}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
