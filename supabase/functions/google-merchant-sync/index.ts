import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  condition: 'new' | 'used' | 'refurbished';
  brand: string;
  gtin?: string;
  mpn?: string;
  imageUrl: string;
  category: string;
}

interface SyncRequest {
  products: Product[];
  merchantId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products, merchantId }: SyncRequest = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Products array is required and cannot be empty' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Syncing ${products.length} products to Google Merchant Center`);

    // Transform products to Google Merchant Center format
    const merchantProducts = products.map(product => ({
      offerId: product.id,
      title: product.title,
      description: product.description,
      link: `https://alsaleh-holding.com/products/${product.id}`,
      imageLink: product.imageUrl.startsWith('http') 
        ? product.imageUrl 
        : `https://alsaleh-holding.com${product.imageUrl}`,
      contentLanguage: 'ar',
      targetCountry: 'SA',
      channel: 'online',
      price: {
        value: product.price,
        currency: product.currency
      },
      availability: product.availability,
      condition: product.condition,
      brand: product.brand,
      gtin: product.gtin,
      mpn: product.mpn,
      productTypes: [product.category],
      customAttributes: [
        {
          name: 'category_ar',
          value: product.category
        }
      ]
    }));

    // Simulate API calls to Google Merchant Center
    const syncResults = [];
    
    for (const product of merchantProducts) {
      try {
        // In a real implementation, you would make actual API calls here
        // using Google Merchant Center API with proper authentication
        
        console.log(`Uploading product: ${product.title}`);
        
        // Simulate API response
        const result = {
          id: product.offerId,
          status: 'success',
          googleProductId: `online:${product.contentLanguage}:${product.targetCountry}:${product.offerId}`,
          warnings: [],
          errors: []
        };

        // Add some realistic validation warnings
        if (!product.gtin && !product.mpn) {
          result.warnings.push('Product identifier (GTIN or MPN) is missing');
        }

        if (product.description.length < 150) {
          result.warnings.push('Description should be at least 150 characters for better visibility');
        }

        syncResults.push(result);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        syncResults.push({
          id: product.offerId,
          status: 'error',
          error: error.message
        });
      }
    }

    const successCount = syncResults.filter(r => r.status === 'success').length;
    const errorCount = syncResults.filter(r => r.status === 'error').length;
    const warningCount = syncResults.reduce((acc, r) => acc + (r.warnings?.length || 0), 0);

    const response = {
      success: true,
      summary: {
        totalProducts: products.length,
        successfulUploads: successCount,
        failedUploads: errorCount,
        totalWarnings: warningCount
      },
      results: syncResults,
      syncTime: new Date().toISOString(),
      nextSyncRecommended: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('Sync completed:', response.summary);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Google Merchant Sync Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error during product sync',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});