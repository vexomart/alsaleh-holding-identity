import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Knowledge base about Al Alshehri Holding services
const COMPANY_KNOWLEDGE = `
شركة آل الشهري القابضة - معلومات الخدمات:

## الخدمات الرئيسية:

### 1. الحلول التصميمية:
- تصميم الهوية التجارية والشعارات
- تصميم المواقع الإلكترونية والتطبيقات
- التصميم الجرافيكي والطباعة
- تصميم وسائل التواصل الاجتماعي
- الرابط: /design-solutions

### 2. الخدمات التجارية:
- الاستشارات الإدارية والمالية
- التحول الرقمي للشركات
- التخطيط الاستراتيجي
- إدارة المشاريع
- الرابط: /business-services

### 3. التقنيات المتقدمة:
- الذكاء الاصطناعي والتعلم الآلي
- إنترنت الأشياء (IoT)
- الحوسبة السحابية
- الأمن السيبراني
- الرابط: /technologies

### 4. تطوير البرمجيات:
- تطوير المواقع الإلكترونية
- تطوير التطبيقات الذكية
- أنظمة إدارة المحتوى
- حلول الدفع الإلكتروني
- الرابط: /development

### 5. التسويق الرقمي:
- إدارة وسائل التواصل الاجتماعي
- التسويق بالمحتوى
- إعلانات جوجل وفيسبوك
- تحسين محركات البحث (SEO)
- الرابط: /digital-marketing

### 6. خدمات أخرى:
- التدريب والتطوير
- الاستضافة والخوادم
- الصيانة والدعم التقني
- استشارات تقنية متخصصة

## معلومات الاتصال:
- الموقع الرئيسي: https://alialshehriholding.com
- صفحة التواصل: /contact
- حجز استشارة: /book-consultation
- معرض الأعمال: /portfolio

## الأقسام:
- قسم التصميم: /departments (قسم الحلول التصميمية)
- قسم التطوير: /departments (قسم تطوير البرمجيات)
- قسم التسويق: /departments (قسم التسويق الرقمي)
- قسم الاستشارات: /departments (قسم الخدمات التجارية)

## العروض الحالية:
- عروض خاصة على باقات التصميم
- خصومات على الخدمات التقنية للشركات الناشئة
- باقات متكاملة للمشاريع الجديدة
- الرابط: /current-offers

تعليمات للبوت:
- قدم إجابات مفيدة ومختصرة
- وجه العملاء للصفحات المناسبة
- اقترح الخدمات التي تناسب احتياجاتهم
- كن ودوداً ومحترفاً
- استخدم اللغة العربية أو الإنجليزية حسب لغة السؤال
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
        content: `أنت مساعد ذكي لشركة آل الشهري القابضة. مهمتك مساعدة العملاء والرد على استفساراتهم حول خدمات الشركة وتوجيههم للصفحات المناسبة.

${COMPANY_KNOWLEDGE}

قواعد مهمة:
1. أجب بنفس لغة السؤال (عربي أو إنجليزي)
2. قدم روابط مباشرة للصفحات المناسبة عند الحاجة
3. كن مختصراً ومفيداً
4. إذا لم تعرف إجابة محددة، وجه العميل لصفحة التواصل
5. اقترح خدمات إضافية قد تهم العميل
6. استخدم أسلوباً ودوداً ومهنياً

مثال على الرد المطلوب:
"مرحباً! يمكننا مساعدتك في تصميم هوية تجارية متكاملة تشمل الشعار والألوان والخطوط. يمكنك مراجعة أعمالنا في التصميم على: /design-solutions أو حجز استشارة مجانية من: /book-consultation"`
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