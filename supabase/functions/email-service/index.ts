import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  action: 'send_template' | 'process_queue' | 'retry_failed';
  user_id?: string;
  template_key?: string;
  payload?: Record<string, any>;
  job_id?: string;
}

interface TemplateEngine {
  renderTemplate(template: string, data: Record<string, any>): string;
}

class SimpleTemplateEngine implements TemplateEngine {
  renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }
}

class EmailProvider {
  private resendApiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
    this.fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'no-reply@ash-holding.sa';
    this.fromName = Deno.env.get('RESEND_FROM_NAME') || 'ASH Holding';
  }

  async sendViaResend(to: string, subject: string, html: string): Promise<{
    status: 'sent' | 'failed';
    provider: string;
    provider_id?: string;
    error?: string;
  }> {
    try {
      console.log(`📧 Sending email via Resend to: ${to}`);
      
      if (!this.resendApiKey) {
        throw new Error('RESEND_API_KEY not configured');
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: [to],
          subject,
          html,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Resend API error:', result);
        return {
          status: 'failed',
          provider: 'resend',
          error: result.message || 'Unknown error',
        };
      }

      console.log('✅ Email sent successfully via Resend:', result.id);
      return {
        status: 'sent',
        provider: 'resend',
        provider_id: result.id,
      };

    } catch (error: any) {
      console.error('❌ Failed to send via Resend:', error.message);
      return {
        status: 'failed',
        provider: 'resend',
        error: error.message,
      };
    }
  }
}

class EmailNotificationService {
  private supabase: any;
  private emailProvider: EmailProvider;
  private templateEngine: TemplateEngine;
  private maxRetries: number;
  private retryBackoffSeconds: number;

  constructor(supabase: any) {
    this.supabase = supabase;
    this.emailProvider = new EmailProvider();
    this.templateEngine = new SimpleTemplateEngine();
    this.maxRetries = parseInt(Deno.env.get('EMAIL_MAX_RETRIES') || '3');
    this.retryBackoffSeconds = parseInt(Deno.env.get('EMAIL_RETRY_BACKOFF_SECONDS') || '30');
  }

  private generateIdempotencyKey(templateKey: string, userId: string, uniqueRef: string): string {
    const data = `${templateKey}_${userId}_${uniqueRef}`;
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(data);
    return btoa(String.fromCharCode(...dataArray)).replace(/[+/=]/g, '');
  }

  async sendTemplate(userId: string, templateKey: string, payload: Record<string, any>): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      console.log(`📤 Processing email template: ${templateKey} for user: ${userId}`);

      // 1. جلب بيانات المستخدم
      const { data: userProfile, error: userError } = await this.supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', userId)
        .single();

      if (userError || !userProfile?.email) {
        console.error('❌ User not found or no email:', userError);
        return { success: false, error: 'User not found or no email' };
      }

      // 2. جلب القالب
      const { data: template, error: templateError } = await this.supabase
        .from('email_templates')
        .select('*')
        .eq('template_key', templateKey)
        .eq('is_active', true)
        .single();

      if (templateError || !template) {
        console.error('❌ Template not found:', templateError);
        return { success: false, error: `Template ${templateKey} not found` };
      }

      // 3. إنشاء idempotency_key
      const uniqueRef = payload.unique_ref || payload.tx_id || payload.otp_id || Date.now().toString();
      const idempotencyKey = this.generateIdempotencyKey(templateKey, userId, uniqueRef);

      // 4. التحقق من عدم التكرار
      const { data: existingEmail } = await this.supabase
        .from('email_outbox')
        .select('status')
        .eq('idempotency_key', idempotencyKey)
        .single();

      if (existingEmail?.status === 'sent') {
        console.log('✅ Email already sent, skipping due to idempotency');
        return { success: true, message: 'Email already sent' };
      }

      // 5. بناء البيانات للقالب
      const templateData = {
        client_name: userProfile.full_name || 'عزيزي العميل',
        company_name: 'Ali Saleh Al Shehri Holding',
        year: new Date().getFullYear().toString(),
        portal_url: 'https://ash-holding.sa/client',
        date: new Date().toLocaleDateString('ar-SA'),
        ...payload,
      };

      const subject = this.templateEngine.renderTemplate(template.subject_template, templateData);
      const html = this.templateEngine.renderTemplate(template.html_template, templateData);

      // 6. إنشاء Job في الطابور
      const jobPayload = {
        to: userProfile.email,
        subject,
        html,
        idempotency_key: idempotencyKey,
        template_key: templateKey,
        user_id: userId,
      };

      const { error: jobError } = await this.supabase
        .from('email_jobs')
        .insert({
          job_type: 'email.send',
          payload: jobPayload,
          status: 'pending',
        });

      if (jobError) {
        console.error('❌ Failed to queue email job:', jobError);
        return { success: false, error: 'Failed to queue email' };
      }

      console.log('✅ Email job queued successfully');
      
      // 7. معالجة الطابور فوراً إذا كان فعّالاً
      if (Deno.env.get('QUEUE_EMAILS') !== 'false') {
        await this.processQueue();
      }

      return { success: true, message: 'Email queued successfully' };

    } catch (error: any) {
      console.error('❌ Error in sendTemplate:', error);
      return { success: false, error: error.message };
    }
  }

  async processQueue(): Promise<void> {
    try {
      console.log('🔄 Processing email queue...');

      // جلب الوظائف المعلقة
      const { data: jobs, error: jobsError } = await this.supabase
        .from('email_jobs')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString())
        .order('created_at', { ascending: true })
        .limit(10);

      if (jobsError || !jobs?.length) {
        console.log('📭 No pending email jobs found');
        return;
      }

      console.log(`📧 Processing ${jobs.length} email jobs`);

      for (const job of jobs) {
        await this.processEmailJob(job);
      }

    } catch (error: any) {
      console.error('❌ Error processing queue:', error);
    }
  }

  private async processEmailJob(job: any): Promise<void> {
    try {
      console.log(`📤 Processing email job: ${job.id}`);

      // تحديث حالة الوظيفة إلى "processing"
      await this.supabase
        .from('email_jobs')
        .update({ status: 'processing' })
        .eq('id', job.id);

      const { to, subject, html, idempotency_key, template_key, user_id } = job.payload;

      // إرسال الإيميل
      const result = await this.emailProvider.sendViaResend(to, subject, html);

      // تحديث أو إنشاء سجل email_outbox
      const outboxData = {
        user_id,
        to_email: to,
        subject,
        template_key,
        idempotency_key,
        provider: result.provider,
        provider_msg_id: result.provider_id,
        status: result.status,
        retries: job.retries || 0,
        last_error: result.error || null,
      };

      await this.supabase
        .from('email_outbox')
        .upsert(outboxData, { onConflict: 'idempotency_key' });

      if (result.status === 'sent') {
        // تحديث الوظيفة كمكتملة
        await this.supabase
          .from('email_jobs')
          .update({
            status: 'completed',
            processed_at: new Date().toISOString(),
          })
          .eq('id', job.id);

        console.log(`✅ Email job ${job.id} completed successfully`);

      } else {
        // معالجة الفشل وإعادة المحاولة
        const newRetries = (job.retries || 0) + 1;
        
        if (newRetries < this.maxRetries) {
          // إعادة جدولة المحاولة
          const nextAttempt = new Date();
          nextAttempt.setSeconds(nextAttempt.getSeconds() + (this.retryBackoffSeconds * newRetries));

          await this.supabase
            .from('email_jobs')
            .update({
              status: 'pending',
              retries: newRetries,
              scheduled_at: nextAttempt.toISOString(),
            })
            .eq('id', job.id);

          console.log(`🔄 Email job ${job.id} rescheduled for retry ${newRetries}/${this.maxRetries}`);

        } else {
          // فشل نهائي
          await this.supabase
            .from('email_jobs')
            .update({
              status: 'failed',
              processed_at: new Date().toISOString(),
            })
            .eq('id', job.id);

          console.error(`❌ Email job ${job.id} failed permanently after ${this.maxRetries} retries`);
        }
      }

    } catch (error: any) {
      console.error(`❌ Error processing email job ${job.id}:`, error);
      
      // تحديث الوظيفة كفاشلة
      await this.supabase
        .from('email_jobs')
        .update({
          status: 'failed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', job.id);
    }
  }

  async retryFailedEmails(): Promise<{ retried: number }> {
    try {
      console.log('🔄 Retrying failed emails...');

      const { data: failedJobs, error } = await this.supabase
        .from('email_jobs')
        .select('*')
        .eq('status', 'failed')
        .lt('retries', this.maxRetries);

      if (error || !failedJobs?.length) {
        console.log('📭 No failed jobs to retry');
        return { retried: 0 };
      }

      for (const job of failedJobs) {
        await this.supabase
          .from('email_jobs')
          .update({
            status: 'pending',
            scheduled_at: new Date().toISOString(),
          })
          .eq('id', job.id);
      }

      console.log(`🔄 Rescheduled ${failedJobs.length} failed email jobs`);
      return { retried: failedJobs.length };

    } catch (error: any) {
      console.error('❌ Error retrying failed emails:', error);
      return { retried: 0 };
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const emailService = new EmailNotificationService(supabase);
    const request: EmailRequest = await req.json();

    console.log(`📧 Email service request: ${request.action}`);

    let result: any;

    switch (request.action) {
      case 'send_template':
        if (!request.user_id || !request.template_key || !request.payload) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await emailService.sendTemplate(request.user_id, request.template_key, request.payload);
        break;

      case 'process_queue':
        await emailService.processQueue();
        result = { success: true, message: 'Queue processed' };
        break;

      case 'retry_failed':
        result = await emailService.retryFailedEmails();
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error in email service:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);