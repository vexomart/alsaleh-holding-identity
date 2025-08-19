import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { action, email, password, fullName, role = 'editor' } = await req.json();

      if (action === 'create_first_admin') {
        // Create the first admin user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: {
            full_name: fullName,
            is_admin: 'true',
            role: role
          },
          email_confirm: true // Skip email confirmation for first admin
        });

        if (authError) {
          return new Response(
            JSON.stringify({ error: authError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // Manually create admin profile since the trigger only works for signups
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            role: role,
            is_active: true
          });

        if (profileError) {
          console.error('Failed to create admin profile:', profileError);
          // Clean up auth user if profile creation fails
          await supabase.auth.admin.deleteUser(authData.user.id);
          
          return new Response(
            JSON.stringify({ error: 'Failed to create admin profile' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // Log the first admin creation
        await supabase.from('security_audit_logs').insert({
          event_type: 'first_admin_created',
          user_id: authData.user.id,
          action: 'admin_setup',
          risk_level: 'medium',
          metadata: {
            email: email,
            role: role,
            setup_time: new Date().toISOString(),
            method: 'admin_setup_function'
          }
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: {
              id: authData.user.id,
              email: authData.user.email,
              full_name: fullName,
              role: role
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'check_admin_exists') {
        // Check if any admin users exist
        const { data: adminCount, error } = await supabase
          .from('admin_profiles')
          .select('id', { count: 'exact' })
          .eq('is_active', true);

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to check admin users' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            admin_exists: (adminCount?.length || 0) > 0 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );

  } catch (error) {
    console.error('Admin setup error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});