/**
 * Enterprise Error Boundary
 * Graceful error handling with friendly Arabic/English messages
 * iOS-style design with recovery options
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home, ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const messages = {
  ar: {
    title: 'حدث خطأ غير متوقع',
    subtitle: 'نعتذر عن هذا الخطأ. فريقنا التقني تم إبلاغه تلقائياً.',
    description: 'يمكنك تجربة أحد الخيارات التالية لحل المشكلة:',
    refresh: 'تحديث الصفحة',
    home: 'العودة للرئيسية',
    support: 'تواصل مع الدعم',
    technicalDetails: 'التفاصيل التقنية',
    errorCode: 'رمز الخطأ',
  },
  en: {
    title: 'Something went wrong',
    subtitle: 'We apologize for this error. Our technical team has been notified.',
    description: 'You can try one of the following options to resolve the issue:',
    refresh: 'Refresh Page',
    home: 'Go to Home',
    support: 'Contact Support',
    technicalDetails: 'Technical Details',
    errorCode: 'Error Code',
  },
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you could send this to an error tracking service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallbackUI error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackUIProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallbackUI: React.FC<ErrorFallbackUIProps> = ({ error, onReset }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = language === 'ar';
  const t = messages[language] || messages.ar;
  const [showDetails, setShowDetails] = React.useState(false);

  const generateErrorCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ERR-${timestamp}-${random}`;
  };

  const errorCode = React.useMemo(() => generateErrorCode(), []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-lg w-full bg-card rounded-2xl shadow-xl border border-border p-8 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6"
        >
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </motion.div>

        {/* Title */}
        <h1 className="text-xl font-bold text-foreground mb-2">
          {t.title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-muted-foreground text-sm mb-4">
          {t.subtitle}
        </p>

        {/* Error Code Badge */}
        <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2 mb-6">
          <span className="text-xs text-muted-foreground">{t.errorCode}:</span>
          <code className="text-xs font-mono font-semibold text-foreground">{errorCode}</code>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6">
          {t.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onReset}
            className="w-full h-12 text-base font-semibold gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            {t.refresh}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="h-11 gap-2"
            >
              <Home className="w-4 h-4" />
              {t.home}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/support')}
              className="h-11 gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t.support}
            </Button>
          </div>
        </div>

        {/* Technical Details (Collapsible) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-6 pt-6 border-t border-border">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
            >
              {t.technicalDetails}
              <ArrowRight 
                className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-90' : ''}`}
              />
            </button>
            
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 text-left bg-muted rounded-lg p-4 overflow-auto max-h-40"
              >
                <code className="text-xs text-destructive whitespace-pre-wrap break-all">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\n'}
                      {error.stack}
                    </>
                  )}
                </code>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorBoundary;
