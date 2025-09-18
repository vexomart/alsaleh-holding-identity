import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

Deno.serve(async (req: Request) => {
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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

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
      // Return success even if DB save fails for now
      return new Response(
        JSON.stringify({ 
          success: true, 
          projectRef,
          message: 'تم استلام طلبك وسنتواصل معك قريباً.'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Project request saved to database:', dbResult);
    
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

    // Build customer confirmation email HTML
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

    // Build admin notification email HTML
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
    let emailErrors: string[] = [];
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      try {
        // Send customer confirmation email
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

        if (!customerResponse.ok) {
          console.error('Customer email failed');
          emailErrors.push('فشل إرسال رسالة التأكيد');
        }

        // Send admin notification email
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

        if (!adminResponse.ok) {
          console.error('Admin email failed');
          emailErrors.push('فشل إرسال إشعار الإدارة');
        } else {
          // Update database to mark email as sent
          await supabase
            .from('project_requests')
            .update({ email_sent: true })
            .eq('id', dbResult.id);
        }
      } catch (error) {
        console.error('Email sending error:', error);
        emailErrors.push('خطأ في إرسال الإشعارات');
      }
    } else {
      emailErrors.push('لم يتم تكوين مفتاح البريد الإلكتروني');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        projectRef,
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
      JSON.stringify({ 
        error: 'حدث خطأ في معالجة الطلب',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});