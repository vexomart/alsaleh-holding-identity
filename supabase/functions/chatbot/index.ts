import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Knowledge base about Al Alshehri Holding services - Saudi dialect focused
const COMPANY_KNOWLEDGE = `
شركة آل الشهري القابضة - دليل الخدمات:

## خدماتنا الأساسية:

### 1. الحلول التصميمية:
- تصميم الهوية التجارية والشعارات العالمية
- تصميم المواقع والتطبيقات بأحدث التقنيات  
- التصميم الجرافيكي والطباعة الاحترافية
- تصميم المحتوى لوسائل التواصل الاجتماعي
- صفحة الخدمة: /design-solutions

### 2. الخدمات التجارية:
- الاستشارات الإدارية والمالية المتخصصة
- حلول التحول الرقمي للشركات
- التخطيط الاستراتيجي طويل المدى
- إدارة وتنفيذ المشاريع الكبرى
- صفحة الخدمة: /business-services

### 3. التقنيات المتقدمة:
- حلول الذكاء الاصطناعي والتعلم الآلي
- تطبيقات إنترنت الأشياء (IoT)
- خدمات الحوسبة السحابية
- أنظمة الأمن السيبراني المتطورة
- صفحة الخدمة: /technologies

### 4. تطوير البرمجيات:
- تطوير المواقع الإلكترونية المتقدمة
- برمجة التطبيقات الذكية
- أنظمة إدارة المحتوى المخصصة
- حلول الدفع الإلكتروني الآمنة
- صفحة الخدمة: /development

### 5. التسويق الرقمي:
- إدارة منصات التواصل الاجتماعي
- استراتيجيات التسويق بالمحتوى
- حملات الإعلانات المدفوعة
- تحسين محركات البحث (SEO)
- صفحة الخدمة: /digital-marketing

### 6. خدمات إضافية:
- برامج التدريب والتطوير
- خدمات الاستضافة والخوادم
- الصيانة والدعم التقني 24/7
- الاستشارات التقنية المتخصصة

## صفحات مهمة:
- صفحة التواصل: /contact
- حجز استشارة مجانية: /book-consultation  
- معرض أعمالنا: /portfolio
- العروض الحالية: /current-offers
- فريق العمل: /team
- الأقسام: /departments

## إرشادات الرد (اللهجة السعودية):
- استخدم عبارات مثل: "أهلاً وسهلاً"، "حياك الله"، "نورت"، "ان شاء الله"، "بالتوفيق"
- كن ودود ومرحب بالأسلوب السعودي
- استخدم "إيش" بدل "ماذا" و "وش" بدل "ما" أحياناً
- قدم أزرار تفاعلية للصفحات بدلاً من الروابط النصية
- اقترح خدمات تكميلية حسب احتياج العميل
- استخدم الرموز التعبيرية بشكل مناسب

## صيغة الأزرار المطلوبة:
عند اقتراح صفحة معينة، استخدم الصيغة التالية:
[BUTTON:عنوان الزر:/رابط-الصفحة]

مثال: [BUTTON:شاهد خدمات التصميم:/design-solutions]
`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: ChatRequest = await req.json();

    console.log('Received chat message:', message);

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `أنت موظف خدمة العملاء في شركة آل الشهري القابضة. مهمتك مساعدة العملاء والرد على استفساراتهم باللهجة السعودية الودودة وتوجيههم للخدمات المناسبة في شركة آل الشهري القابضة.

${COMPANY_KNOWLEDGE}

قواعد مهمة:
1. استخدم اللهجة السعودية الودودة (حياك الله، أهلاً وسهلاً، نورت، إيش تحتاج، وش رايك)
2. قدم أزرار تفاعلية بالصيغة [BUTTON:النص:/الرابط] بدلاً من الروابط النصية
3. كن مختصراً ومفيداً مع الحماس السعودي
4. إذا ما تعرف إجابة محددة، وجه العميل لصفحة التواصل
5. اقترح خدمات إضافية حسب احتياج العميل في شركة آل الشهري القابضة
6. استخدم الرموز التعبيرية بشكل مناسب 😊
7. اذكر دائماً الاسم الكامل "شركة آل الشهري القابضة" عند الحديث عن الشركة

مثال على الرد المطلوب:
"حياك الله! 😊 يا هلا ومرحبا فيك في شركة آل الشهري القابضة

قدرنا نساعدك في تصميم هوية تجارية متكاملة تشمل الشعار والألوان والخطوط لشركة آل الشهري القابضة. ان شاء الله تعجبك أعمالنا:

[BUTTON:شاهد أعمال التصميم في شركة آل الشهري القابضة 🎨:/design-solutions]
[BUTTON:احجز استشارة مجانية مع شركة آل الشهري القابضة 📞:/book-consultation]

إيش رايك تشوف أعمال شركة آل الشهري القابضة وتقولي وش تحتاج بالضبط؟"`
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: crypto.randomUUID()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chatbot function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);