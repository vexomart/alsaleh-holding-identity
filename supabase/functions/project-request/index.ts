import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { ProjectRequestNotification } from './_templates/project-request-notification.tsx';
import { ProjectRequestConfirmation } from './_templates/project-request-confirmation.tsx';

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

    // Render customer confirmation email
    const customerEmailHtml = await renderAsync(
      React.createElement(ProjectRequestConfirmation, emailData)
    );

    // Render admin notification email  
    const adminEmailHtml = await renderAsync(
      React.createElement(ProjectRequestNotification, emailData)
    );

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

serve(handler);