import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const namecheapApiUser = Deno.env.get('NAMECHEAP_API_USER');
const namecheapApiKey = Deno.env.get('NAMECHEAP_API_KEY');
const namecheapUsername = Deno.env.get('NAMECHEAP_USERNAME');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, domain, extension, customerData } = await req.json();
    console.log('Domain management request:', { action, domain, extension });

    switch (action) {
      case 'check_availability':
        return await checkDomainAvailability(domain, extension);
      
      case 'submit_request':
        return await submitDomainRequest(domain, extension, customerData);
      
      case 'get_prices':
        return await getDomainPrices();
      
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in domain-management function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function checkDomainAvailability(domain: string, extension: string) {
  try {
    const fullDomain = domain + extension;
    
    if (!namecheapApiUser || !namecheapApiKey || !namecheapUsername) {
      console.log('Namecheap credentials not configured, using mock data');
      // Mock response for testing
      const available = Math.random() > 0.5;
      return new Response(
        JSON.stringify({ 
          available, 
          domain: fullDomain,
          price: getExtensionPrice(extension)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Real Namecheap API call
    const apiUrl = `https://api.namecheap.com/xml.response?ApiUser=${namecheapApiUser}&ApiKey=${namecheapApiKey}&UserName=${namecheapUsername}&Command=namecheap.domains.check&ClientIp=127.0.0.1&DomainList=${fullDomain}`;
    
    const response = await fetch(apiUrl);
    const xmlText = await response.text();
    
    // Parse XML response (simplified)
    const available = xmlText.includes('Available="true"');
    
    return new Response(
      JSON.stringify({ 
        available, 
        domain: fullDomain,
        price: getExtensionPrice(extension)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
}

async function submitDomainRequest(domain: string, extension: string, customerData: any) {
  try {
    const fullDomain = domain + extension;
    const price = getExtensionPrice(extension);
    
    // Insert domain request into database
    const { data, error } = await supabase
      .from('domain_requests')
      .insert({
        domain_name: domain,
        extension: extension,
        full_domain: fullDomain,
        price: price,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_company: customerData.company,
        additional_notes: customerData.notes,
        registration_period: customerData.period || 1,
        auto_renew: customerData.autoRenew || false,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Domain request submitted:', data);
    
    // Send customer confirmation email
    try {
      const customerEmailResponse = await fetch(`${supabaseUrl}/functions/v1/domain-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          customerName: customerData.name,
          customerEmail: customerData.email,
          domainName: fullDomain,
          price: price,
          registrationPeriod: customerData.period || 1,
          requestId: data.id,
          status: 'pending',
          emailType: 'customer'
        })
      });

      if (!customerEmailResponse.ok) {
        console.error('Failed to send customer email');
      }

      // Send admin notification email
      const adminEmailResponse = await fetch(`${supabaseUrl}/functions/v1/domain-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          customerName: customerData.name,
          customerEmail: customerData.email,
          domainName: fullDomain,
          price: price,
          registrationPeriod: customerData.period || 1,
          requestId: data.id,
          status: 'pending',
          emailType: 'admin'
        })
      });

      if (!adminEmailResponse.ok) {
        console.error('Failed to send admin email');
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        requestId: data.id,
        message: 'تم إرسال طلب النطاق بنجاح. سيتم التواصل معك قريباً.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error submitting domain request:', error);
    throw error;
  }
}

async function getDomainPrices() {
  try {
    const { data, error } = await supabase
      .from('domain_prices')
      .select('*')
      .eq('is_active', true)
      .order('is_popular', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ prices: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting domain prices:', error);
    throw error;
  }
}

function getExtensionPrice(extension: string): number {
  const prices: { [key: string]: number } = {
    '.com': 87.50,      // Updated with markup
    '.net': 82.50,      // Updated with markup
    '.org': 77.50,      // Updated with markup
    '.info': 72.50,     // Updated with markup
    '.sa': 187.50,      // Updated with markup
    '.com.sa': 157.50,  // Updated with markup
    '.biz': 67.50,      // Updated with markup
    '.me': 92.50,       // Updated with markup
    '.co': 97.50,       // Updated with markup
    '.io': 117.50       // Updated with markup
  };
  
  return prices[extension] || 87.50; // Default with markup
}