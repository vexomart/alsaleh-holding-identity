import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing wallet deposit notification request...');
    
    const { transactionId, userEmail, userName, amount, referenceId } = await req.json();
    
    console.log('Notification data:', { transactionId, userEmail, userName, amount, referenceId });

    // Send email notification to admin
    const adminEmailBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
        <h2>طلب شحن محفظة جديد</h2>
        <p><strong>رقم المعاملة:</strong> ${referenceId}</p>
        <p><strong>اسم العميل:</strong> ${userName}</p>
        <p><strong>إيميل العميل:</strong> ${userEmail}</p>
        <p><strong>المبلغ:</strong> ${amount} ريال سعودي</p>
        <p><strong>حالة المعاملة:</strong> في انتظار الموافقة</p>
        <br>
        <p>يرجى مراجعة الطلب في لوحة التحكم الإدارية.</p>
      </div>
    `;

    // Send confirmation email to customer
    const customerEmailBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
        <h2>تأكيد طلب شحن المحفظة</h2>
        <p>عزيزي ${userName}،</p>
        <p>تم استلام طلب شحن محفظتك بنجاح.</p>
        <p><strong>رقم المرجع:</strong> ${referenceId}</p>
        <p><strong>المبلغ:</strong> ${amount} ريال سعودي</p>
        <p><strong>طريقة الدفع:</strong> حوالة بنكية</p>
        <br>
        <p>سيتم مراجعة طلبك خلال 24 ساعة وسنقوم بإشعارك عند اكتمال العملية.</p>
        <p>شكراً لك على ثقتك بنا.</p>
      </div>
    `;

    // Send emails
    const emailPromises = [
      // Admin notification
      fetch('https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: 'admin@tasaheel.com.sa',
          subject: 'طلب شحن محفظة جديد',
          html: adminEmailBody,
        }),
      }),
      // Customer confirmation
      fetch('https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          to: userEmail,
          subject: 'تأكيد طلب شحن المحفظة',
          html: customerEmailBody,
        }),
      }),
    ];

    await Promise.all(emailPromises);
    console.log('Emails sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'تم إرسال الإشعارات بنجاح'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in wallet deposit notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});