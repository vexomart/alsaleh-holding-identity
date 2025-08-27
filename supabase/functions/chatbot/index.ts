import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://ibfcgweykqkzdodrfmci.supabase.co';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmNnd2V5a3FremRvZHJmbWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTAxNDUsImV4cCI6MjA2OTY2NjE0NX0.m8uOkaZsoTRbG90TW7xHVFUJJ5zrF7QTP4zMO1NpuvI';

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive knowledge base for Ali Saleh Al-Shehri Holding Company - Enterprise Level
const COMPANY_KNOWLEDGE = `
شركة علي صالح الشهري القابضة - دليل الخدمات الشامل:

## الخدمات الأساسية - التفاصيل الكاملة:

### 1. الحلول التصميمية 🎨
**الوصف الشامل:**
- تصميم الهوية التجارية الاحترافية والشعارات العالمية
- تصميم المواقع الإلكترونية المتقدمة والتطبيقات الذكية
- التصميم الجرافيكي والطباعة عالية الجودة
- تصميم المحتوى لوسائل التواصل الاجتماعي

**الباقات والأسعار:**
- باقة الهوية الأساسية: تبدأ من 2,500 ريال
- باقة الهوية المتقدمة: تبدأ من 5,000 ريال
- باقة الهوية الشاملة: تبدأ من 10,000 ريال

**المميزات:**
✅ فريق مصممين معتمدين دولياً
✅ استشارة مجانية لمدة ساعة
✅ 3 مراجعات مجانية
✅ ملفات التصميم بجميع الصيغ
✅ دليل استخدام الهوية التجارية

**الأعمال المميزة:**
- أكثر من 500 هوية تجارية منجزة
- عملاء من 15 دولة مختلفة
- معدل رضا العملاء 98%

---

### 2. الخدمات التجارية 💼
**الوصف الشامل:**
- الاستشارات الإدارية والمالية المتخصصة
- حلول التحول الرقمي الشاملة للشركات
- التخطيط الاستراتيجي طويل المدى
- إدارة وتنفيذ المشاريع الكبرى

**الخدمات المتاحة:**
- استشارات إدارية: 300 ريال/ساعة
- دراسة جدوى شاملة: تبدأ من 5,000 ريال
- خطة تحول رقمي: تبدأ من 15,000 ريال
- إدارة مشروع: 2,000 ريال/شهر

**المميزات:**
✅ فريق استشاريين معتمدين
✅ تقارير مفصلة ومهنية
✅ متابعة دورية للمشاريع
✅ ضمان النتائج
✅ دعم تقني 24/7

**الشهادات:**
- معتمدون من وزارة التجارة السعودية
- حاصلون على ISO 9001:2015
- شراكات مع أكبر الشركات العالمية

---

### 3. التقنيات المتقدمة 🚀
**الوصف الشامل:**
- حلول الذكاء الاصطناعي والتعلم الآلي المتقدمة
- تطبيقات إنترنت الأشياء (IoT) المبتكرة
- خدمات الحوسبة السحابية الآمنة
- أنظمة الأمن السيبراني المتطورة

**الحلول المتاحة:**
- تطوير نماذج الذكاء الاصطناعي: تبدأ من 25,000 ريال
- تطبيقات IoT: تبدأ من 20,000 ريال
- بناء البنية السحابية: تبدأ من 15,000 ريال
- حلول الأمن السيبراني: تبدأ من 30,000 ريال

**المميزات:**
✅ تقنيات حديثة ومتطورة
✅ فريق مطورين خبراء
✅ دعم فني متخصص
✅ تدريب فريق العمل
✅ ضمان سنة كاملة

**الإنجازات:**
- أكثر من 200 مشروع تقني منجز
- شراكة مع Microsoft وAWS
- براءات اختراع في مجال الذكاء الاصطناعي

---

### 4. تطوير البرمجيات 💻
**الوصف الشامل:**
- تطوير المواقع الإلكترونية المتقدمة والمتاجر الإلكترونية
- برمجة التطبيقات الذكية (iOS & Android)
- أنظمة إدارة المحتوى المخصصة
- حلول الدفع الإلكتروني الآمنة

**الباقات المتاحة**

- موقع شركة أساسي: تبدأ من 8,000 ريال
- موقع شركة متقدم: تبدأ من 15,000 ريال  
- متجر إلكتروني: تبدأ من 20,000 ريال
- تطبيق جوال: تبدأ من 25,000 ريال

**المميزات المضمونة**

✅ تصميم متجاوب لجميع الأجهزة
✅ محرك بحث محسن (SEO)  
✅ أمان عالي وحماية متقدمة
✅ سرعة تحميل فائقة
✅ دعم فني مدى الحياة

**التقنيات المستخدمة:**
- React, Node.js, Python
- AWS, Google Cloud
- قواعد بيانات متقدمة
- أحدث معايير الأمان

---

### 5. التسويق الرقمي 📱
**الوصف الشامل:**
- إدارة منصات التواصل الاجتماعي بطريقة احترافية
- استراتيجيات التسويق بالمحتوى المبتكر
- حملات الإعلانات المدفوعة المستهدفة
- تحسين محركات البحث (SEO) المتقدم

**الباقات الشهرية**

- باقة البداية: 2,500 ريال/شهر
- باقة المتقدمة: 5,000 ريال/شهر
- باقة الشاملة: 10,000 ريال/شهر  
- باقة المؤسسية: 20,000 ريال/شهر

**ما نقدمه لك**

✅ إدارة 6 منصات تواصل
✅ محتوى إبداعي يومي
✅ تقارير تحليلية شهرية
✅ استراتيجية تسويقية شاملة
✅ إدارة الحملات الإعلانية

**النتائج المحققة:**
- زيادة المتابعين بمعدل 300%
- زيادة المبيعات بمعدل 150%
- وصول لأكثر من 2 مليون شخص شهرياً

---

## ACTIONS النظام:
عند طلب معلومات عن خدمة معينة، استخدم:
[ACTION:SERVICE_INFO:اسم_الخدمة]

عند طلب حجز استشارة:
[ACTION:BOOK_CONSULTATION:نوع_الخدمة]

عند طلب عرض سعر:
[ACTION:GET_QUOTE:نوع_الخدمة]

عند التحويل لصفحة:
[ACTION:REDIRECT:رابط_الصفحة]

## صفحات مهمة:
- التواصل: /contact
- الاستشارة: /book-consultation  
- الأعمال: /portfolio
- العروض: /current-offers
- الفريق: /team
- الأقسام: /departments
`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

interface CustomerRequest {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceType?: string;
  requestDetails?: string;
  budget?: string;
  timeline?: string;
  completedSteps?: string[];
}

// Store for managing conversation state and customer requests
const conversationStore = new Map<string, {
  customerRequest: CustomerRequest;
  conversationStep: string;
  lastActivity: Date;
}>();

// Helper function to extract information from user message
const extractCustomerInfo = (message: string, existing: CustomerRequest = {}): CustomerRequest => {
  const nameMatch = message.match(/اسمي\s+([^\s]+)|الاسم\s+([^\s]+)|أنا\s+([^\s]+)/);
  const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const phoneMatch = message.match(/(\+?9665\d{8}|05\d{8}|\d{10})/);
  const budgetMatch = message.match(/الميزانية\s+([^\s]+)|ميزانيتي\s+([^\s]+)|(\d+)\s*(ريال|رس)/);

  return {
    ...existing,
    ...(nameMatch && { customerName: nameMatch[1] || nameMatch[2] || nameMatch[3] }),
    ...(emailMatch && { customerEmail: emailMatch[1] }),
    ...(phoneMatch && { customerPhone: phoneMatch[1] }),
    ...(budgetMatch && { budget: budgetMatch[1] || budgetMatch[2] || budgetMatch[3] })
  };
};

// Enhanced AI response generation using OpenAI
const generateAIResponse = async (message: string, conversationHistory: ChatMessage[] = [], conversationId?: string): Promise<string> => {
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    return generateFallbackResponse(message);
  }

  try {
    // Get conversation state if exists
    let conversationState = conversationId ? conversationStore.get(conversationId) : null;
    if (!conversationState) {
      conversationState = {
        customerRequest: {},
        conversationStep: 'initial',
        lastActivity: new Date()
      };
      if (conversationId) {
        conversationStore.set(conversationId, conversationState);
      }
    }

    // Extract customer information from the message
    conversationState.customerRequest = extractCustomerInfo(message, conversationState.customerRequest);

    const systemPrompt = `أنت مساعد ذكي متخصص في خدمة العملاء لشركة علي صالح الشهري القابضة.

مهمتك:
1. فهم احتياجات العميل بدقة
2. جمع المعلومات المطلوبة بطريقة طبيعية ومنظمة
3. تقديم معلومات دقيقة عن الخدمات
4. توجيه العميل للحل المناسب
5. جمع طلب العميل بالتفصيل وإرساله للإدارة

معلومات الشركة:
${COMPANY_KNOWLEDGE}

معلومات العميل المجمعة حتى الآن:
${JSON.stringify(conversationState.customerRequest, null, 2)}

خطوة المحادثة الحالية: ${conversationState.conversationStep}

قواعد مهمة:
- استخدم اللهجة السعودية الودودة
- اجعل المحادثة طبيعية وغير آلية
- اجمع المعلومات تدريجياً دون إجبار العميل
- قدم معلومات دقيقة عن الأسعار والخدمات
- عندما تجمع معلومات كافية، اقترح التواصل المباشر
- استخدم الأزرار [BUTTON:النص:الرابط] لتسهيل التنقل
- لا تكرر نفس الأسئلة إذا كانت الإجابة موجودة
- إذا كان العميل يريد طلب خدمة محددة، اجمع: الاسم، الإيميل، رقم الهاتف، تفاصيل الطلب، الميزانية المتوقعة، الوقت المطلوب للتسليم`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10), // Keep last 10 messages for context
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Update conversation state
    conversationState.lastActivity = new Date();
    
    // Check if we have enough information to send request to admin
    const { customerName, customerEmail, customerPhone, serviceType, requestDetails } = conversationState.customerRequest;
    
    if (customerName && customerEmail && customerPhone && requestDetails) {
      // Send detailed request to admin
      await sendCustomerRequestToAdmin(conversationState.customerRequest, conversationId || 'unknown');
      
      // Update conversation step
      conversationState.conversationStep = 'completed';
      
      return aiResponse + `\n\n✅ **تم استلام طلبك بنجاح!**\n\nسيتم التواصل معك خلال 24 ساعة من فريق المبيعات المختص.\n\n📞 للاستفسارات العاجلة: 0502463346\n📧 البريد الإلكتروني: info@alialshehriholding.com`;
    }

    return aiResponse;

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return generateFallbackResponse(message);
  }
};

// Send customer request to admin via email
const sendCustomerRequestToAdmin = async (customerRequest: CustomerRequest, conversationId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('contact-form', {
      body: {
        name: customerRequest.customerName,
        email: customerRequest.customerEmail,
        phone: customerRequest.customerPhone,
        message: `طلب جديد من البوت الذكي:

📋 **تفاصيل الطلب:**
- نوع الخدمة: ${customerRequest.serviceType || 'غير محدد'}
- تفاصيل الطلب: ${customerRequest.requestDetails}
- الميزانية المتوقعة: ${customerRequest.budget || 'غير محددة'}
- الإطار الزمني: ${customerRequest.timeline || 'غير محدد'}

🆔 **معرف المحادثة:** ${conversationId}

⏰ **تاريخ الطلب:** ${new Date().toLocaleString('ar-SA')}`,
        subject: `طلب خدمة جديد من البوت الذكي - ${customerRequest.customerName}`,
        type: 'chatbot_request'
      }
    });

    console.log('Customer request sent to admin:', { data, error });
  } catch (error) {
    console.error('Error sending customer request to admin:', error);
  }
};

// Fallback response function (if OpenAI fails)
const generateFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Basic greeting responses
  if (lowerMessage.includes('مرحب') || lowerMessage.includes('سلام') || lowerMessage.includes('هلا')) {
    return `حياك الله وأهلاً وسهلاً فيك! 😊

🏢 **شركة علي صالح الشهري القابضة**
*رائدة في الحلول التقنية والتجارية المتكاملة*

أنا هنا لمساعدتك في جميع احتياجاتك. ما الخدمة اللي تهمك؟

[BUTTON:الحلول التصميمية 🎨:/design-solutions]
[BUTTON:الخدمات التجارية 💼:/business-services]
[BUTTON:التقنيات المتقدمة 🚀:/technologies]
[BUTTON:تطوير البرمجيات 💻:/development]
[BUTTON:التسويق الرقمي 📱:/digital-marketing]
[BUTTON:احجز استشارة مجانية 📞:/book-consultation]`;
  }

  // Service-specific responses
  if (lowerMessage.includes('تصميم') || lowerMessage.includes('شعار') || lowerMessage.includes('هوية')) {
    return `## خدمات التصميم والهوية التجارية 🎨

لدينا خبرة أكثر من 10 سنوات في التصميم الاحترافي:

### الباقات المتاحة:
• **باقة الهوية الأساسية**: 2,500 ريال
• **باقة الهوية المتقدمة**: 5,000 ريال  
• **باقة الهوية الشاملة**: 10,000 ريال

ممكن تحدثني أكثر عن مشروعك؟ إيش نوع النشاط وإيش توقعاتك للتصميم؟

[BUTTON:شاهد أعمالنا 🎨:/design-solutions]
[BUTTON:احجز استشارة مجانية 📞:/book-consultation]`;
  }

  return `شكراً لتواصلك معنا! 😊

أنا هنا لمساعدتك في جميع خدمات شركة علي صالح الشهري القابضة.

ممكن تحدثني أكثر عن الخدمة اللي تحتاجها عشان أقدر أساعدك بشكل أفضل؟

[BUTTON:جميع خدماتنا 📋:/services]
[BUTTON:تواصل مباشر 📞:/contact]`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, conversationId }: ChatRequest & { conversationId?: string } = await req.json();

    console.log('Received chat message:', { message, conversationId, historyLength: conversationHistory?.length || 0 });

    // Generate unique conversation ID if not provided
    const currentConversationId = conversationId || crypto.randomUUID();

    // Use enhanced AI response generation
    const aiResponse = await generateAIResponse(message, conversationHistory || [], currentConversationId);

    console.log('Generated AI Response:', aiResponse);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: currentConversationId
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