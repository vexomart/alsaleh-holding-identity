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

// قاعدة معرفية شاملة ومحدثة لشركة علي صالح الشهري القابضة
const COMPANY_KNOWLEDGE = `
🏢 **شركة علي صالح الشهري القابضة - دليل الخدمات الشامل**
*الرائدة في الحلول التقنية والتجارية المتكاملة منذ 2015*

═══════════════════════════════════════════════════════════════

## 🎨 1. خدمات التصميم والهوية التجارية

### التخصصات المتاحة:
**🎯 تصميم الهوية التجارية الشاملة:**
- الشعارات الاحترافية والمتميزة
- أدلة الهوية التجارية المتكاملة
- تصميم البروشورات والكتالوجات
- تصميم الأظرف والأوراق الرسمية
- تصميم اللوحات الإعلانية والبنرات

**💻 التصميم الرقمي المتقدم:**
- واجهات المواقع الإلكترونية (UI/UX)
- تصميم التطبيقات الذكية
- قوالب وسائل التواصل الاجتماعي
- الرسوم المتحركة والإنفوجرافيك
- تصميم المحتوى التفاعلي

**🎨 التصميم الطباعي والإعلاني:**
- تصميم المجلات والكتب
- اللافتات والبوسترات الاحترافية
- تصميم المعارض والستاندات
- تصميم الهدايا التذكارية
- التصاميم ثلاثية الأبعاد

### الباقات والأسعار:
📦 **باقة البداية الذكية**: 2,500 ريال
- شعار احترافي + 3 مراجعات
- دليل استخدام الهوية
- ملفات بجميع الصيغ المطلوبة
- استشارة مجانية لمدة ساعة

📦 **باقة الأعمال المتقدمة**: 5,000 ريال
- هوية تجارية شاملة
- 5 قطع تصميمية إضافية
- تصميم قالب الموقع الأساسي
- مراجعات غير محدودة

📦 **باقة المؤسسات الشاملة**: 10,000 ريال
- هوية تجارية متكاملة
- دليل استخدام مفصل
- 10 قطع تصميمية متنوعة
- تصميم موقع وتطبيق أساسي

### الضمانات والمميزات:
✅ فريق مصممين معتمدين من Adobe و Google
✅ ضمان الرضا 100% أو استرداد كامل
✅ سرعة في التسليم (3-7 أيام عمل)
✅ مراجعات مجانية حسب الباقة
✅ ملفات تصميم مفتوحة المصدر
✅ دعم فني لمدة سنة كاملة

---

## 💼 2. الخدمات التجارية والاستشارات

### تخصصاتنا الاستشارية:
**📊 الاستشارات الإدارية والمالية:**
- التخطيط الاستراتيجي للشركات
- إعادة هيكلة العمليات التجارية
- دراسات الجدوى الاقتصادية التفصيلية
- استشارات الاستثمار والتمويل
- تحليل المخاطر وإدارتها

**🔄 التحول الرقمي الشامل:**
- تقييم الوضع الحالي للشركة
- وضع خطة التحول الرقمي المرحلية
- تدريب الموظفين على التقنيات الجديدة
- أتمتة العمليات الإدارية
- قياس مؤشرات الأداء الرقمي

**📈 إدارة المشاريع الاحترافية:**
- تخطيط وتنفيذ المشاريع الكبرى
- إدارة الفرق والموارد البشرية
- متابعة الجداول الزمنية والميزانيات
- ضمان الجودة والمعايير الدولية
- تقارير دورية مفصلة للإدارة العليا

### الأسعار والخدمات:
💰 **استشارة إدارية متخصصة**: 300 ريال/ساعة
💰 **دراسة جدوى شاملة**: من 5,000 - 25,000 ريال
💰 **خطة تحول رقمي**: من 15,000 - 50,000 ريال
💰 **إدارة مشروع متكاملة**: 2,000 - 8,000 ريال/شهر

### شهاداتنا واعتماداتنا:
🏆 معتمدون من وزارة التجارة والاستثمار السعودية
🏆 حاصلون على شهادة ISO 9001:2015 لإدارة الجودة
🏆 شراكات استراتيجية مع McKinsey و Deloitte
🏆 عضوية في الاتحاد السعودي للاستشارات الإدارية
🏆 أكثر من 1000 مشروع استشاري ناجح

---

## 🚀 3. التقنيات المتقدمة والذكاء الاصطناعي

### حلولنا التقنية المبتكرة:
**🤖 الذكاء الاصطناعي والتعلم الآلي:**
- تطوير نماذج التعلم المخصصة
- أنظمة التوصيات الذكية
- تحليل البيانات الضخمة
- معالجة اللغات الطبيعية (NLP)
- الرؤية الحاسوبية والتعرف على الصور

**🌐 إنترنت الأشياء (IoT):**
- أنظمة المنازل والمباني الذكية
- حلول المدن الذكية
- مراقبة المعدات الصناعية
- أنظمة الأمان والمراقبة المتقدمة
- تطبيقات الزراعة الذكية

**☁️ الحوسبة السحابية:**
- بناء البنية السحابية المخصصة
- خدمات Amazon AWS وMicrosoft Azure
- حلول النسخ الاحتياطي والأمان
- تطبيقات المؤسسات السحابية
- إدارة قواعد البيانات الضخمة

**🔒 الأمن السيبراني المتطور:**
- تقييم الثغرات الأمنية الشامل
- أنظمة كشف التسلل والحماية
- حماية البيانات والخصوصية
- التدريب على الأمن السيبراني
- الاستجابة للحوادث الأمنية

### الأسعار والتكاليف:
🔥 **نموذج ذكاء اصطناعي مخصص**: من 25,000 - 100,000 ريال
🔥 **تطبيق إنترنت الأشياء**: من 20,000 - 80,000 ريال
🔥 **بنية سحابية متكاملة**: من 15,000 - 60,000 ريال
🔥 **حلول الأمن السيبراني**: من 30,000 - 120,000 ريال

### إنجازاتنا التقنية:
🏅 أكثر من 200 مشروع تقني متطور منجز
🏅 شراكات تقنية مع Microsoft وAWS وGoogle Cloud
🏅 براءات اختراع في مجال الذكاء الاصطناعي
🏅 فريق من 50+ مطور ومهندس متخصص
🏅 حلول لأكثر من 15 قطاع مختلف

---

## 💻 4. تطوير البرمجيات والتطبيقات

### خدمات التطوير المتكاملة:
**🌐 تطوير المواقع الإلكترونية:**
- مواقع الشركات والمؤسسات التفاعلية
- المتاجر الإلكترونية المتقدمة
- منصات التعليم الإلكتروني
- مواقع الأخبار والمجلات الرقمية
- البوابات الحكومية والخدمية

**📱 برمجة التطبيقات الذكية:**
- تطبيقات iOS وAndroid الأصلية
- تطبيقات الويب التفاعلية (PWA)
- تطبيقات الألعاب والترفيه
- تطبيقات التجارة الإلكترونية
- تطبيقات إدارة الأعمال (ERP)

**⚙️ الأنظمة المخصصة:**
- أنظمة إدارة المحتوى (CMS)
- أنظمة إدارة علاقات العملاء (CRM)
- أنظمة المحاسبة والفواتير
- منصات التعلم الإلكتروني (LMS)
- أنظمة إدارة المخازن والمبيعات

**💳 حلول الدفع الإلكتروني:**
- ربط البوابات الائتمانية الآمنة
- محافظ رقمية مخصصة
- أنظمة الفواتير الإلكترونية
- حلول الدفع بالهاتف المحمول
- أنظمة نقاط الولاء والمكافآت

### باقات تطوير البرمجيات:
📱 **موقع شركة أساسي**: 8,000 - 15,000 ريال
- تصميم متجاوب احترافي
- لوحة إدارة كاملة
- تحسين محركات البحث (SEO)
- شهادة أمان SSL
- استضافة سنة مجانية

📱 **موقع شركة متقدم**: 15,000 - 30,000 ريال
- جميع مميزات الباقة الأساسية
- نظام إدارة المحتوى المتطور
- تكامل مع وسائل التواصل
- تحليلات مفصلة وتقارير
- دعم فني لسنتين

📱 **متجر إلكتروني شامل**: 20,000 - 50,000 ريال
- كتالوج منتجات متقدم
- نظام سلة التسوق الذكي
- ربط بوابات الدفع المتعددة
- إدارة المخزون والطلبات
- تطبيق جوال مجاني

📱 **تطبيق جوال احترافي**: 25,000 - 80,000 ريال
- تطوير لنظامي iOS وAndroid
- تصميم واجهات مستخدم متميز
- ربط مع قواعد البيانات
- إشعارات الهاتف المحمول
- تحديثات دورية مجانية لسنة

### ضماناتنا التقنية:
✅ تصميم متجاوب لجميع الأجهزة والشاشات
✅ سرعة تحميل فائقة أقل من 3 ثوان
✅ أمان عالي مع أحدث بروتوكولات الحماية
✅ تحسين محركات البحث (SEO) المتقدم
✅ دعم فني مدى الحياة مع تحديثات مجانية
✅ ضمان عدم انقطاع الخدمة 99.9%

---

## 📱 5. التسويق الرقمي والإعلان الإلكتروني

### خدماتنا التسويقية الشاملة:
**📊 إدارة وسائل التواصل الاجتماعي:**
- إدارة احترافية لجميع المنصات الرقمية
- تطوير استراتيجيات المحتوى المبتكر
- تصميم منشورات وقصص تفاعلية
- جدولة ونشر المحتوى الأمثل
- تفاعل مع الجمهور والرد على الاستفسارات

**🎯 الحملات الإعلانية المدفوعة:**
- إعلانات فيسبوك وإنستقرام المستهدفة
- حملات جوجل ادوردز الاحترافية
- إعلانات يوتيوب وتيك توك
- حملات لينكد إن للشركات
- إعلانات سناب شات وتويتر

**📝 تسويق المحتوى الإبداعي:**
- كتابة مقالات ومدونات متخصصة
- إنتاج فيديوهات تسويقية احترافية
- تصميم إنفوجرافيك ومحتوى تفاعلي
- البودكاست والمحتوى الصوتي
- النشرات الإخبارية والإيميل ماركتنج

**🔍 تحسين محركات البحث (SEO):**
- تحليل الكلمات المفتاحية المربحة
- تحسين المواقع تقنياً وتسويقياً
- بناء الروابط الخارجية القوية
- تحسين السرعة وتجربة المستخدم
- تقارير مفصلة عن الأداء والترتيب

### باقات التسويق الرقمي الشهرية:
🚀 **باقة البداية المتميزة**: 2,500 ريال/شهر
- إدارة 3 منصات تواصل اجتماعي
- 20 منشور شهرياً عالي الجودة
- تقرير أداء شهري مفصل
- استراتيجية تسويقية أساسية
- دعم عبر الهاتف والواتساب

🚀 **باقة الأعمال المتقدمة**: 5,000 ريال/شهر
- إدارة 5 منصات تواصل اجتماعي
- 40 منشور ومحتوى شهرياً
- حملة إعلانية مدفوعة شهرياً
- فيديو تسويقي احترافي شهرياً
- استشارة تسويقية أسبوعية

🚀 **باقة المؤسسات الشاملة**: 10,000 ريال/شهر
- إدارة جميع منصات التواصل (6+)
- محتوى يومي متنوع وإبداعي
- 3 حملات إعلانية مستهدفة
- 2 فيديو احترافي شهرياً
- تقارير تحليلية تفصيلية أسبوعية

🚀 **باقة الشركات الكبرى**: 20,000 ريال/شهر
- حلول تسويقية مخصصة بالكامل
- فريق تسويق مخصص للعميل
- حملات متعددة ومتنوعة
- محتوى فيديو وصور احترافي
- دعم على مدار الساعة

### نتائجنا المحققة والمثبتة:
📈 زيادة المتابعين الحقيقيين بمعدل 300% خلال 6 أشهر
📈 زيادة مبيعات العملاء بمعدل 150% في السنة الأولى
📈 وصول المحتوى لأكثر من 2 مليون شخص شهرياً
📈 تحسين ترتيب المواقع في جوجل بنسبة 400%
📈 نسبة رضا العملاء 98% من جميع الحملات المنفذة

---

## 🏗️ 6. خدمات إضافية متميزة

### خدمات الاستضافة والنطاقات:
**☁️ استضافة المواقع الإلكترونية:**
- استضافة مشتركة اقتصادية وموثوقة
- خوادم مخصصة عالية الأداء
- استضافة سحابية مرنة وقابلة للتوسع
- حماية متقدمة ضد الهجمات السيبرانية
- نسخ احتياطية يومية آمنة

**🌐 حجز النطاقات:**
- نطاقات دولية بجميع الامتدادات
- نطاقات سعودية (.sa) رسمية
- نطاقات عربية (.عرب) مميزة
- إدارة DNS متقدمة ومرنة
- تجديد تلقائي لضمان الاستمرارية

### خدمات التصوير الاحترافي:
**📸 تصوير المنتجات:**
- تصوير منتجات للمتاجر الإلكترونية
- خلفيات بيضاء احترافية للكتالوجات
- تصوير 360 درجة تفاعلي
- ريتوش وتحرير الصور المتقدم
- تصوير منتجات للحملات الإعلانية

**🎥 إنتاج الفيديو الاحترافي:**
- فيديوهات تعريفية للشركات
- إعلانات تجارية قصيرة ومؤثرة
- تغطية الفعاليات والمؤتمرات
- فيديوهات تدريبية تعليمية
- بث مباشر للفعاليات الكبرى

### خدمات كتابة المحتوى:
**✍️ المحتوى العربي المتخصص:**
- كتابة مقالات تقنية وتجارية
- المحتوى التسويقي الإبداعي
- ترجمة احترافية من وإلى العربية
- كتابة البيانات الصحفية
- محتوى مواقع التواصل الاجتماعي

---

## 📞 معلومات التواصل والدعم

### قنوات التواصل المباشر:
📞 **الهاتف**: 0502463346 (متاح 24/7)
📧 **البريد الإلكتروني**: info@alialshehriholding.com
💬 **واتساب**: +966502463346
📍 **العنوان**: الرياض، المملكة العربية السعودية

### أوقات العمل والدعم:
🕒 **ساعات العمل**: الأحد - الخميس (8:00 ص - 6:00 م)
🕒 **خدمة العملاء**: متاحة 24/7 عبر الواتساب
🕒 **الدعم التقني**: على مدار الساعة للعملاء المميزين
🕒 **الاستشارات العاجلة**: متاحة في جميع الأوقات

### إحصائيات ومؤشرات الأداء:
🎯 **معدل الاستجابة**: أقل من 30 دقيقة في أوقات العمل
🎯 **معدل رضا العملاء**: 98.5% من جميع المشاريع
🎯 **سرعة التسليم**: نلتزم بالمواعيد في 99% من المشاريع
🎯 **دعم ما بعد البيع**: مدى الحياة لجميع خدماتنا

---

## 🔧 أدوات وإجراءات النظام للبوت:

### عند طلب معلومات عن خدمة:
[ACTION:SERVICE_INFO:اسم_الخدمة]

### عند طلب حجز استشارة:
[ACTION:BOOK_CONSULTATION:نوع_الخدمة]

### عند طلب عرض سعر:
[ACTION:GET_QUOTE:نوع_الخدمة]

### عند التحويل لصفحة معينة:
[ACTION:REDIRECT:رابط_الصفحة]

### الصفحات المهمة في الموقع:
- صفحة التواصل المباشر: /contact
- حجز استشارة مجانية: /book-consultation  
- معرض الأعمال والمشاريع: /portfolio
- العروض والخصومات الحالية: /current-offers
- تعرف على فريق العمل: /team
- الأقسام والتخصصات: /departments
- كتالوج الخدمات الشامل: /services-catalog
- بدء مشروع جديد: /start-project

═══════════════════════════════════════════════════════════════
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
      
      return aiResponse + `\n\n✅ **تم بدء المحادثة وإرسال طلبك للإدارة!**\n\nسيتم التواصل معك خلال 24 ساعة من فريق المبيعات المختص.\n\n📞 للاستفسارات العاجلة: 0502463346\n📧 البريد الإلكتروني: info@alialshehriholding.com`;
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