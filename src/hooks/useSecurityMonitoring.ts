import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityAudit } from './useSecurityAudit';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  actionRequired: boolean;
}

interface SecurityMetrics {
  failedLogins: number;
  blockedAttempts: number;
  suspiciousActivity: number;
  riskScore: number;
}

export const useSecurityMonitoring = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLogins: 0,
    blockedAttempts: 0,
    suspiciousActivity: 0,
    riskScore: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { logSecurityEvent } = useSecurityAudit();

  // Enhanced rate limiting detection
  const detectAnomalousActivity = async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Check for suspicious patterns in last 24 hours
      const { data: recentLogs, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .gte('created_at', twentyFourHoursAgo)
        .in('risk_level', ['high', 'critical']);

      if (error) throw error;

      // Analyze patterns
      const failedLogins = recentLogs.filter(log => 
        log.event_type === 'login_failure'
      ).length;

      const blockedAttempts = recentLogs.filter(log => 
        log.event_type === 'rate_limit_exceeded' || 
        log.event_type === 'unauthorized_access_attempt'
      ).length;

      const suspiciousActivity = recentLogs.filter(log => 
        log.risk_level === 'critical'
      ).length;

      // Calculate risk score (0-100)
      const riskScore = Math.min(
        (failedLogins * 2) + (blockedAttempts * 5) + (suspiciousActivity * 10),
        100
      );

      setMetrics({
        failedLogins,
        blockedAttempts,
        suspiciousActivity,
        riskScore
      });

      // Generate alerts based on thresholds
      const newAlerts: SecurityAlert[] = [];

      if (riskScore >= 80) {
        newAlerts.push({
          id: Date.now().toString(),
          type: 'critical',
          message: 'مستوى مخاطر عالي جداً تم اكتشافه - يتطلب تدخل فوري',
          timestamp: new Date().toISOString(),
          actionRequired: true
        });
      } else if (riskScore >= 60) {
        newAlerts.push({
          id: Date.now().toString(),
          type: 'high',
          message: 'نشاط مشبوه مكثف - مراقبة مطلوبة',
          timestamp: new Date().toISOString(),
          actionRequired: true
        });
      }

      if (blockedAttempts >= 10) {
        newAlerts.push({
          id: Date.now().toString(),
          type: 'high',
          message: `تم حجب ${blockedAttempts} محاولة وصول مشبوهة في آخر 24 ساعة`,
          timestamp: new Date().toISOString(),
          actionRequired: false
        });
      }

      if (suspiciousActivity >= 5) {
        newAlerts.push({
          id: Date.now().toString(),
          type: 'critical',
          message: `${suspiciousActivity} حدث أمني حرج في آخر 24 ساعة`,
          timestamp: new Date().toISOString(),
          actionRequired: true
        });
      }

      setAlerts(newAlerts);

      // Log monitoring activity
      if (newAlerts.length > 0) {
        await logSecurityEvent({
          eventType: 'security_alert_generated',
          description: `تم إنشاء ${newAlerts.length} تنبيه أمني`,
          metadata: {
            alertCount: newAlerts.length,
            riskScore,
            metrics
          }
        });
      }

    } catch (error) {
      console.error('Error detecting anomalous activity:', error);
    }
  };

  // Monitor security events in real-time
  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Initial check
    detectAnomalousActivity();
    
    // Set up periodic monitoring every 5 minutes
    const interval = setInterval(detectAnomalousActivity, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  };

  // Enhanced login failure tracking
  const trackFailedLogin = async (email: string, reason: string) => {
    await logSecurityEvent({
      eventType: 'login_failure',
      description: `فشل في تسجيل الدخول: ${reason}`,
      metadata: {
        email: email.substring(0, 3) + '***', // Masked email
        reason,
        userAgent: navigator.userAgent.substring(0, 200),
        timestamp: new Date().toISOString()
      }
    });
  };

  // Suspicious activity detector
  const reportSuspiciousActivity = async (activityType: string, details: any) => {
    await logSecurityEvent({
      eventType: 'suspicious_activity',
      description: `نشاط مشبوه: ${activityType}`,
      metadata: {
        activityType,
        details,
        userAgent: navigator.userAgent.substring(0, 200),
        timestamp: new Date().toISOString()
      }
    });
  };

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, []);

  return {
    alerts,
    metrics,
    isMonitoring,
    trackFailedLogin,
    reportSuspiciousActivity,
    detectAnomalousActivity
  };
};