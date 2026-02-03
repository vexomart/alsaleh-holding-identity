/**
 * Signing Page Header - Premium RTL design
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { 
  FileSignature, 
  Shield, 
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SigningPageHeaderProps {
  contractNumber: string;
  serviceName: string;
  currentStep: number;
  totalSteps: number;
}

export function SigningPageHeader({
  contractNumber,
  serviceName,
  currentStep,
  totalSteps,
}: SigningPageHeaderProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  const steps = [
    { id: 1, labelAr: 'مراجعة العقد', labelEn: 'Review Contract' },
    { id: 2, labelAr: 'بيانات الموقع', labelEn: 'Signer Info' },
    { id: 3, labelAr: 'التوقيع', labelEn: 'Sign' },
    { id: 4, labelAr: 'التأكيد', labelEn: 'Confirm' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="relative px-4 py-6 sm:px-6 sm:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/contracts')}
            className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
          >
            <ArrowRight className={cn("h-4 w-4", !isRTL && "rotate-180")} />
            {isRTL ? 'العودة' : 'Back'}
          </Button>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <FileSignature className="h-7 w-7 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-bold">
              {isRTL ? 'توقيع العقد الإلكتروني' : 'Electronic Contract Signing'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-white/70 text-sm">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded" dir="ltr">
                {contractNumber}
              </span>
              <span>•</span>
              <span>{serviceName}</span>
            </div>
          </div>
        </motion.div>

        {/* Steps Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between max-w-2xl mx-auto"
        >
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted 
                        ? 'rgb(34 197 94)' 
                        : isActive 
                          ? 'rgb(255 255 255)' 
                          : 'rgba(255 255 255 / 0.2)',
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                      isCompleted && "text-white",
                      isActive && "text-indigo-700 shadow-lg",
                      !isCompleted && !isActive && "text-white/60"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  <span className={cn(
                    "text-xs mt-2 text-center hidden sm:block",
                    isActive ? "text-white font-semibold" : "text-white/60"
                  )}>
                    {isRTL ? step.labelAr : step.labelEn}
                  </span>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div className={cn(
                      "h-1 rounded-full transition-all",
                      isCompleted ? "bg-green-500" : "bg-white/20"
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-6 text-white/60 text-xs"
        >
          <Shield className="h-4 w-4" />
          <span>
            {isRTL 
              ? 'توقيع إلكتروني آمن ومعتمد قانونياً'
              : 'Secure & Legally Binding Electronic Signature'}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
