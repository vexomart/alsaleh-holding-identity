/**
 * Referral Link Card with QR Code
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Copy, 
  Check, 
  Share2, 
  QrCode,
  Link2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Referral } from '@/types/referrals';

interface ReferralLinkCardProps {
  referral?: Referral | null;
  onGenerateLink: () => Promise<void>;
  isGenerating?: boolean;
}

export function ReferralLinkCard({ 
  referral, 
  onGenerateLink,
  isGenerating 
}: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const handleCopy = async () => {
    if (!referral?.referral_link) return;
    
    try {
      await navigator.clipboard.writeText(referral.referral_link);
      setCopied(true);
      toast({
        title: 'تم النسخ!',
        description: 'تم نسخ رابط الإحالة إلى الحافظة',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'خطأ',
        description: 'تعذر نسخ الرابط',
        variant: 'destructive',
      });
    }
  };
  
  const handleShare = async () => {
    if (!referral?.referral_link) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'انضم إلينا!',
          text: 'سجّل عبر هذا الرابط واحصل على مزايا حصرية',
          url: referral.referral_link,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          رابط الإحالة الخاص بك
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {referral ? (
          <>
            {/* Referral Code */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <span className="text-sm text-muted-foreground">كود الإحالة:</span>
              <span className="font-mono font-bold text-primary text-lg">
                {referral.referral_code}
              </span>
            </div>
            
            {/* Link Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input 
                  value={referral.referral_link}
                  readOnly
                  className="pr-4 font-mono text-sm bg-background/50"
                  dir="ltr"
                />
              </div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-4 w-4 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleShare}
                className="flex-1 gap-2"
              >
                <Share2 className="h-4 w-4" />
                مشاركة الرابط
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowQR(!showQR)}
                className="gap-2"
              >
                <QrCode className="h-4 w-4" />
                {showQR ? 'إخفاء' : 'QR'}
              </Button>
            </div>
            
            {/* QR Code */}
            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    {/* Simple QR placeholder - in production use a QR library */}
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                          رمز QR للرابط
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          {referral.referral_code}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Generate Link State */
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              ابدأ برنامج الإحالات
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              أنشئ رابط الإحالة الخاص بك وابدأ بمشاركته للحصول على مكافآت
            </p>
            <Button 
              onClick={onGenerateLink}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جارٍ الإنشاء...
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  إنشاء رابط الإحالة
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
