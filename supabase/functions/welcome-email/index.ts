import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WelcomeEmailRequest {
  user_email: string;
  user_name: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_email, user_name, user_id }: WelcomeEmailRequest = await req.json();

    console.log('Sending welcome email to:', user_email, 'with name:', user_name);

    // إرسال إيميل ترحيبي مع تفعيل المحفظة الرقمية
    const emailResult = await supabase.functions.invoke('wallet-email-notifications', {
      body: {
        type: 'welcome',
        customer_email: user_email,
        customer_name: user_name || 'عميلنا الكريم',
        data: {
          user_id: user_id,
          welcome_message: 'مرحباً بك في منصتنا! تم إنشاء محفظتك الرقمية بنجاح.',
          initial_balance: 0,
          wallet_features: [
            'إيداع وسحب الأموال بسهولة',
            'تتبع جميع المعاملات المالية',
            'إشعارات فورية عند كل معاملة',
            'أمان عالي لحماية أموالك'
          ]
        }
      }
    });

    console.log('Welcome email sent:', emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم إرسال إيميل الترحيب بنجاح',
        email_sent: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'خطأ في إرسال إيميل الترحيب',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);