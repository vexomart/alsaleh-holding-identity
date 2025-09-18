// Using Deno.serve directly for Supabase Edge runtime
import { Resend } from 'npm:resend@4.0.0';
// Using simple inline HTML templates to avoid React email rendering in Edge Functions

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    // Send customer confirmation email
    const customerEmailResult = await resend.emails.send({
      from: 'Projects@alialshehriholding.com',
      to: [projectRequest.email],
      subject: `تأكيد استلام طلب المشروع - ${projectRef}`,
      html: customerEmailHtml,
    });

    console.log('Customer email sent:', customerEmailResult);

    // Send admin notification email
    const adminEmailResult = await resend.emails.send({
      from: 'Projects@alialshehriholding.com',
      to: ['info@alialshehriholding.com'],
      subject: `طلب مشروع جديد - ${emailData.projectTypeArabic} - ${projectRef}`,
      html: adminEmailHtml,
    });

    console.log('Admin email sent:', adminEmailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        projectRef,
        customerEmailId: customerEmailResult.data?.id,
        adminEmailId: adminEmailResult.data?.id
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