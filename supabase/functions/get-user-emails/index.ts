import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // إنشاء عميل Supabase مع صلاحيات الخدمة
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { user_ids } = await req.json()

    if (!user_ids || !Array.isArray(user_ids)) {
      return new Response(
        JSON.stringify({ error: 'user_ids array is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Fetching emails for user IDs:', user_ids);

    // جلب معلومات المستخدمين من auth.users
    const users = [];
    for (const userId of user_ids) {
      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (!userError && userData.user) {
          users.push({
            id: userData.user.id,
            email: userData.user.email || null,
            phone: userData.user.phone || null
          });
        } else {
          console.log(`User not found in auth: ${userId}`);
          // إضافة المستخدم بدون إيميل إذا لم يوجد في auth
          users.push({
            id: userId,
            email: null,
            phone: null
          });
        }
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        users.push({
          id: userId,
          email: null,
          phone: null
        });
      }
    }

    console.log('Found users:', users);

    return new Response(
      JSON.stringify({ users }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in get-user-emails function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})