import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧪 Starting registration test...');

    // Test password hash creation
    const { data: passwordData, error: hashError } = await supabase.rpc('create_secure_password_hash', {
      plain_password: 'Alshehri@@#@@1409'
    });

    if (hashError) {
      console.error('❌ Password hash error:', hashError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Password hash failed', 
        details: hashError 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log('✅ Password hash created:', passwordData);

    // Test user insertion
    const passwordInfo = passwordData as any;
    const { data: userData, error: userError } = await supabase
      .from('ash_users')
      .insert({
        name: 'AliAlshehri',
        email: 'test_edge_function@gmail.com',
        email_lower: 'test_edge_function@gmail.com',
        phone: '+966502463367',
        role: 'client',
        status: 'pending',
        password_hash: '',
        password_algo: passwordInfo.password_algo,
        password_salt_b64: passwordInfo.password_salt_b64,
        password_hash_b64: passwordInfo.password_hash_b64
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ User insertion error:', userError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User insertion failed', 
        details: userError 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log('✅ User created successfully:', userData);

    // Test authentication
    const { data: authData, error: authError } = await supabase.rpc('simple_authenticate_user', {
      email_lower_param: 'test_edge_function@gmail.com',
      plain_password: 'Alshehri@@#@@1409'
    });

    if (authError) {
      console.error('❌ Auth test error:', authError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Auth test failed', 
        details: authError 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    console.log('✅ Authentication test result:', authData);

    return new Response(JSON.stringify({
      success: true,
      message: 'Registration test completed successfully',
      steps: {
        password_hash: passwordData,
        user_creation: userData,
        authentication: authData
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('💥 Test failed:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});