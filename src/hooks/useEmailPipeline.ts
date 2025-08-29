import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailOutboxRecord {
  id: string;
  to_email: string;
  subject: string;
  template_key: string;
  idempotency_key: string;
  provider: string;
  provider_msg_id?: string;
  status: 'pending' | 'sent' | 'failed';
  retries: number;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

interface EmailStats {
  sent_today: number;
  failed_today: number;
  pending: number;
  total_sent: number;
  total_failed: number;
}

export const useEmailPipeline = () => {
  const [emails, setEmails] = useState<EmailOutboxRecord[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    sent_today: 0,
    failed_today: 0,
    pending: 0,
    total_sent: 0,
    total_failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    template: 'all',
  });
  const { toast } = useToast();

  const fetchEmails = async () => {
    try {
      let query = supabase
        .from('email_outbox')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // تطبيق الفلاتر
      if (filters.search) {
        query = query.or(`to_email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
      }

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.template !== 'all') {
        query = query.eq('template_key', filters.template);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching emails:', error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "فشل في جلب بيانات الإيميلات",
          variant: "destructive",
        });
        return;
      }

      setEmails((data || []) as EmailOutboxRecord[]);
    } catch (error: any) {
      console.error('❌ Error in fetchEmails:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // إحصائيات اليوم
      const { data: todayStats, error: todayError } = await supabase
        .from('email_outbox')
        .select('status')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`);

      // إحصائيات إجمالية
      const { data: totalStats, error: totalError } = await supabase
        .from('email_outbox')
        .select('status');

      if (todayError || totalError) {
        console.error('❌ Error fetching stats:', todayError || totalError);
        return;
      }

      const todaySent = todayStats?.filter(s => s.status === 'sent').length || 0;
      const todayFailed = todayStats?.filter(s => s.status === 'failed').length || 0;
      const pending = totalStats?.filter(s => s.status === 'pending').length || 0;
      const totalSent = totalStats?.filter(s => s.status === 'sent').length || 0;
      const totalFailed = totalStats?.filter(s => s.status === 'failed').length || 0;

      setStats({
        sent_today: todaySent,
        failed_today: todayFailed,
        pending,
        total_sent: totalSent,
        total_failed: totalFailed,
      });

    } catch (error: any) {
      console.error('❌ Error in fetchStats:', error);
    }
  };

  const retryFailedEmail = async (emailId: string) => {
    try {
      console.log(`🔄 Retrying failed email: ${emailId}`);

      // الحصول على تفاصيل الإيميل
      const { data: email, error: emailError } = await supabase
        .from('email_outbox')
        .select('*')
        .eq('id', emailId)
        .single();

      if (emailError || !email) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الإيميل",
          variant: "destructive",
        });
        return;
      }

      // إنشاء job جديد في الطابور
      const { error: jobError } = await supabase
        .from('email_jobs')
        .insert({
          job_type: 'email.send',
          payload: {
            to: email.to_email,
            subject: email.subject,
            html: 'Re-sending from pipeline',
            idempotency_key: `retry_${email.idempotency_key}_${Date.now()}`,
            template_key: email.template_key,
            user_id: email.user_id,
          },
          status: 'pending',
        });

      if (jobError) {
        console.error('❌ Error creating retry job:', jobError);
        toast({
          title: "خطأ في إعادة المحاولة",
          description: "فشل في إعادة جدولة الإيميل",
          variant: "destructive",
        });
        return;
      }

      // تحديث حالة الإيميل الأصلي
      await supabase
        .from('email_outbox')
        .update({
          status: 'pending',
          retries: email.retries + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', emailId);

      toast({
        title: "تم إعادة الجدولة",
        description: "تم إعادة جدولة الإيميل للإرسال",
      });

      // تحديث البيانات
      await fetchEmails();
      await fetchStats();

    } catch (error: any) {
      console.error('❌ Error retrying email:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إعادة المحاولة",
        variant: "destructive",
      });
    }
  };

  const processQueue = async () => {
    try {
      console.log('🔄 Processing email queue...');

      const { data, error } = await supabase.functions.invoke('email-service', {
        body: { action: 'process_queue' },
      });

      if (error) {
        console.error('❌ Error processing queue:', error);
        toast({
          title: "خطأ في معالجة الطابور",
          description: "فشل في معالجة طابور الإيميلات",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم معالجة الطابور",
        description: "تم معالجة طابور الإيميلات بنجاح",
      });

      // تحديث البيانات
      await fetchEmails();
      await fetchStats();

    } catch (error: any) {
      console.error('❌ Error in processQueue:', error);
    }
  };

  const retryAllFailed = async () => {
    try {
      console.log('🔄 Retrying all failed emails...');

      const { data, error } = await supabase.functions.invoke('email-service', {
        body: { action: 'retry_failed' },
      });

      if (error) {
        console.error('❌ Error retrying failed emails:', error);
        toast({
          title: "خطأ في إعادة المحاولة",
          description: "فشل في إعادة محاولة الإيميلات الفاشلة",
          variant: "destructive",
        });
        return;
      }

      const retriedCount = data?.retried || 0;
      toast({
        title: "تم إعادة الجدولة",
        description: `تم إعادة جدولة ${retriedCount} إيميل`,
      });

      // تحديث البيانات
      await fetchEmails();
      await fetchStats();

    } catch (error: any) {
      console.error('❌ Error in retryAllFailed:', error);
    }
  };

  const sendTestEmail = async (templateKey: string, userEmail?: string) => {
    try {
      if (!userEmail) {
        toast({
          title: "خطأ",
          description: "يرجى تحديد بريد إلكتروني للاختبار",
          variant: "destructive",
        });
        return;
      }

      // البحث عن المستخدم
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', userEmail)
        .single();

      if (userError || !user) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المستخدم",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('email-service', {
        body: {
          action: 'send_template',
          user_id: user.user_id,
          template_key: templateKey,
          payload: {
            unique_ref: `test_${Date.now()}`,
            amount: '100',
            currency: 'SAR',
            balance_after: '500',
            tx_id: 'TEST001',
            otp_code: '123456',
            reason: 'اختبار النظام',
          },
        },
      });

      if (error || !data?.success) {
        toast({
          title: "خطأ في الاختبار",
          description: data?.error || "فشل في إرسال إيميل الاختبار",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم الإرسال",
        description: "تم إرسال إيميل الاختبار بنجاح",
      });

      // تحديث البيانات
      await fetchEmails();
      await fetchStats();

    } catch (error: any) {
      console.error('❌ Error sending test email:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmails(), fetchStats()]);
      setLoading(false);
    };

    loadData();
  }, [filters]);

  // إعداد Real-time subscriptions
  useEffect(() => {
    const emailSubscription = supabase
      .channel('email_outbox_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_outbox',
        },
        (payload) => {
          console.log('📧 Email outbox changed:', payload);
          fetchEmails();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      emailSubscription.unsubscribe();
    };
  }, []);

  return {
    emails,
    stats,
    loading,
    filters,
    setFilters,
    retryFailedEmail,
    processQueue,
    retryAllFailed,
    sendTestEmail,
    refreshData: async () => {
      await Promise.all([fetchEmails(), fetchStats()]);
    },
  };
};