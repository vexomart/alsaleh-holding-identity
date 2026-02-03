/**
 * Signing Success - Confirmation after successful signing
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  CheckCircle2, 
  Download, 
  FileText,
  Calendar,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface SigningSuccessProps {
  contractNumber: string;
  signerName: string;
  signedAt: string;
  onDownload: () => void;
  onViewContracts: () => void;
  isDownloading?: boolean;
}

export function SigningSuccess({
  contractNumber,
  signerName,
  signedAt,
  onDownload,
  onViewContracts,
  isDownloading = false,
}: SigningSuccessProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp', { locale: language === 'ar' ? ar : enUS });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Success Hero */}
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 mb-6"
        >
          <CheckCircle2 className="h-12 w-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            {isRTL ? 'تم توقيع العقد بنجاح!' : 'Contract Signed Successfully!'}
            <Sparkles className="h-6 w-6 text-amber-500" />
          </h2>
          <p className="text-muted-foreground">
            {isRTL 
              ? 'تهانينا! تم توقيع العقد وتوثيقه إلكترونياً'
              : 'Congratulations! Your contract has been electronically signed and documented'}
          </p>
        </motion.div>
      </div>

      {/* Contract Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-green-200 dark:border-green-800/50 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/10 dark:to-emerald-900/10">
          <CardContent className="pt-6 space-y-4">
            {/* Contract Number */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{isRTL ? 'رقم العقد' : 'Contract Number'}</span>
              </div>
              <span className="font-mono font-bold" dir="ltr">{contractNumber}</span>
            </div>

            <Separator />

            {/* Signer Name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>{isRTL ? 'الموقع' : 'Signed By'}</span>
              </div>
              <span className="font-semibold">{signerName}</span>
            </div>

            <Separator />

            {/* Signed Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{isRTL ? 'تاريخ التوقيع' : 'Signed At'}</span>
              </div>
              <span className="text-sm">{formatDate(signedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Digital Stamp */}
      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-green-600 border-dashed flex items-center justify-center bg-green-50/50 dark:bg-green-900/20">
            <div className="text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-green-700 dark:text-green-400">
                {isRTL ? 'موقّع إلكترونياً' : 'Electronically Signed'}
              </p>
              <p className="text-[10px] text-green-600/80 mt-1">
                {format(new Date(signedAt), 'yyyy/MM/dd')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <Button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 h-12 text-base"
        >
          {isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              {isRTL ? 'جاري التحميل...' : 'Downloading...'}
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              {isRTL ? 'تحميل نسخة PDF من العقد' : 'Download PDF Contract'}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onViewContracts}
          className="w-full h-11"
        >
          <ArrowRight className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2 rotate-180'}`} />
          {isRTL ? 'العودة لقائمة العقود' : 'Back to Contracts List'}
        </Button>
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-muted-foreground"
      >
        {isRTL 
          ? 'سيتم إرسال نسخة من العقد إلى بريدك الإلكتروني المسجل'
          : 'A copy of the contract will be sent to your registered email'}
      </motion.p>
    </motion.div>
  );
}
