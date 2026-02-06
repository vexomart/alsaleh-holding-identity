/**
 * Entry Point - Smart Routing Based on Auth State
 * Redirects users to appropriate dashboard or login
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Entry() {
  const { user, roles, isLoading, isAdmin } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Not authenticated - go to login
      navigate('/auth/login', { replace: true });
      return;
    }

    // Authenticated - redirect based on role
    if (isAdmin) {
      navigate('/admin', { replace: true });
    } else {
      navigate('/app', { replace: true });
    }
  }, [user, roles, isLoading, isAdmin, navigate]);

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5"
    >
      <motion.div 
        className="flex flex-col items-center gap-6 text-center p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Animation */}
        <motion.div 
          className="relative"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-primary to-primary/80",
            "shadow-xl shadow-primary/25"
          )}>
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <motion.div 
            className="absolute -top-1 -right-1"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
        
        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            {isRTL ? "مرحباً بك" : "Welcome"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "جاري توجيهك..." : "Redirecting you..."}
          </p>
        </div>
        
        {/* Loader */}
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">
            {isRTL ? "يرجى الانتظار" : "Please wait"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
