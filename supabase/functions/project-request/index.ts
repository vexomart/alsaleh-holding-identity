// Using Deno.serve directly for Supabase Edge runtime
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface ProjectRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description?: string;
  additionalServices?: string[];
}

const getProjectTypeArabic = (projectType: string): string => {
  const types: { [key: string]: string } = {
    'website': 'تطوير موقع ويب',
    'mobile-app': 'تطبيق جوال',
    'web-app': 'تطبيق ويب',
    'design': 'تصميم هوية بصرية',
    'ai-solution': 'حلول الذكاء الاصطناعي',
    'business-system': 'نظام إدارة أعمال',
    'other': 'أخرى'
  };
  return types[projectType] || projectType;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const projectRequest: ProjectRequest = await req.json();
    
    // Validate required fields
    if (!projectRequest.name || !projectRequest.email || !projectRequest.projectType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Generate project reference number
    const projectRef = `PRJ-${Date.now().toString().slice(-6)}`;
    
    // Save to database first as backup
    const { data: dbResult, error: dbError } = await supabase
      .from('project_requests')
      .insert({
        name: projectRequest.name,
        email: projectRequest.email,
        phone: projectRequest.phone || null,
        company: projectRequest.company || null,
        project_type: projectRequest.projectType,
        budget: projectRequest.budget || null,
        timeline: projectRequest.timeline || null,
        description: projectRequest.description || null,
        additional_services: projectRequest.additionalServices || [],
        project_ref: projectRef,
        email_sent: false
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database save error:', dbError);
      // Continue with email sending even if DB save fails
    } else {
      console.log('Project request saved to database:', dbResult);
    }
    
    // Prepare data for email templates
    const emailData = {
      ...projectRequest,
      projectRef,
      projectTypeArabic: getProjectTypeArabic(projectRequest.projectType),
      submissionDate: new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Build customer confirmation email HTML (inline)
    const customerEmailHtml = `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif;">
        <h2>تم استلام طلب مشروعك (${emailData.projectRef})</h2>
        <p>شكرًا لك ${emailData.name}. سنراجع التفاصيل ونتواصل معك قريبًا.</p>
        <hr />
        <p><strong>نوع المشروع:</strong> ${emailData.projectTypeArabic}</p>
        ${emailData.budget ? `<p><strong>الميزانية المتوقعة:</strong> ${emailData.budget}</p>` : ''}
        ${emailData.timeline ? `<p><strong>الجدول الزمني:</strong> ${emailData.timeline}</p>` : ''}
        ${emailData.description ? `<p><strong>الوصف:</strong> ${emailData.description}</p>` : ''}
        ${Array.isArray(emailData.additionalServices) && emailData.additionalServices.length ? `<p><strong>خدمات إضافية:</strong> ${emailData.additionalServices.join(', ')}</p>` : ''}
        <p style="color:#6b7280">تاريخ الإرسال: ${emailData.submissionDate}</p>
      </div>
    `;

    // Build admin notification email HTML (inline)
    const adminEmailHtml = `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif;">
        <h2>طلب مشروع جديد - ${emailData.projectTypeArabic} (${emailData.projectRef})</h2>
        <p><strong>الاسم:</strong> ${emailData.name}</p>
        <p><strong>البريد:</strong> ${emailData.email}</p>
        ${emailData.phone ? `<p><strong>الهاتف:</strong> ${emailData.phone}</p>` : ''}
        ${emailData.company ? `<p><strong>الشركة:</strong> ${emailData.company}</p>` : ''}
        ${emailData.budget ? `<p><strong>الميزانية:</strong> ${emailData.budget}</p>` : ''}
        ${emailData.timeline ? `<p><strong>المدة:</strong> ${emailData.timeline}</p>` : ''}
        ${emailData.description ? `<p><strong>الوصف:</strong> ${emailData.description}</p>` : ''}
        ${Array.isArray(emailData.additionalServices) && emailData.additionalServices.length ? `<p><strong>الخدمات الإضافية:</strong> ${emailData.additionalServices.join(', ')}</p>` : ''}
        <p style="color:#6b7280">تاريخ الإرسال: ${emailData.submissionDate}</p>
      </div>
    `;

    // Try to send emails using fetch API directly to Resend
    let customerEmailResult: any = null;
    let adminEmailResult: any = null;
    let emailErrors: string[] = [];

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      // Send customer confirmation email
      try {
        const customerResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'مشاريع آل الشهري <projects@alialshehriholding.com>',
            to: [projectRequest.email],
            subject: `تأكيد استلام طلب المشروع - ${projectRef}`,
            html: customerEmailHtml,
          }),
        });

        if (customerResponse.ok) {
          customerEmailResult = await customerResponse.json();
          console.log('Customer email sent successfully:', customerEmailResult);
        } else {
          const errorText = await customerResponse.text();
          console.error('Customer email failed:', errorText);
          emailErrors.push('فشل إرسال رسالة التأكيد');
        }
      } catch (error) {
        console.error('Customer email error:', error);
        emailErrors.push('خطأ في إرسال رسالة التأكيد');
      }

      // Send admin notification email
      try {
        const adminResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'طلبات المشاريع <projects@alialshehriholding.com>',
            to: ['info@alialshehriholding.com'],
            subject: `طلب مشروع جديد - ${emailData.projectTypeArabic} - ${projectRef}`,
            html: adminEmailHtml,
          }),
        });

        if (adminResponse.ok) {
          adminEmailResult = await adminResponse.json();
          console.log('Admin email sent successfully:', adminEmailResult);
          
          // Update database to mark email as sent
          if (dbResult?.id) {
            await supabase
              .from('project_requests')
              .update({ email_sent: true })
              .eq('id', dbResult.id);
          }
        } else {
          const errorText = await adminResponse.text();
          console.error('Admin email failed:', errorText);
          emailErrors.push('فشل إرسال إشعار الإدارة');
        }
      } catch (error) {
        console.error('Admin email error:', error);
        emailErrors.push('خطأ في إرسال إشعار الإدارة');
      }
    } else {
      emailErrors.push('لم يتم تكوين مفتاح البريد الإلكتروني');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        projectRef,
        customerEmailId: customerEmailResult?.id || null,
        adminEmailId: adminEmailResult?.id || null,
        emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
        message: emailErrors.length > 0 
          ? 'تم حفظ طلبك بنجاح. سنتواصل معك قريباً.'
          : 'تم إرسال طلبك بنجاح!'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in project-request function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

Deno.serve(handler);