import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DiagnosticRequest {
  email: string;
  password: string;
  action: 'diagnose' | 'self-test';
}

// رسائل الخطأ الموحدة باللغة العربية
const ERROR_MESSAGES = {
  E_USER_NOT_FOUND: 'لا يوجد حساب لهذا البريد.',
  E_NOT_ACTIVE: 'الرجاء تفعيل بريدك قبل تسجيل الدخول.',
  E_PASSWORD_MISMATCH: 'بيانات تسجيل الدخول غير صحيحة.',
  E_RLS_BLOCK: 'تعذّر الوصول لبيانات الحساب (سياسة أمان).',
  E_COOKIE_DOMAIN: 'تكوين الجلسة غير مكتمل (النطاق/الأمان).',
  E_CORS: 'تكوين الجلسة غير مكتمل (النطاق/الأمان).',
  E_DOUBLE_HASH: 'كلمة المرور بحاجة لإعادة تعيين.',
  E_INVALID_EMAIL: 'تنسيق البريد الإلكتروني غير صحيح.',
  E_ACCOUNT_BLOCKED: 'تم حظر حسابك. يرجى التواصل مع الإدارة.',
  E_ACCOUNT_INACTIVE: 'حسابك غير مفعل.',
  E_WRONG_REALM: 'نوع المستخدم غير متطابق مع نوع تسجيل الدخول.'
};

async function performDiagnostic(email: string, password: string) {
  console.log(`🔍 Starting diagnostic for email: ${email}`);
  
  try {
    // استدعاء دالة التشخيص من قاعدة البيانات
    const { data: diagnosticResult, error: diagnosticError } = await supabase.rpc(
      'auth_diagnostic_check',
      { 
        p_email: email,
        p_password: password 
      }
    );

    if (diagnosticError) {
      console.error('Diagnostic function error:', diagnosticError);
      return {
        success: false,
        error: 'فشل في تشغيل التشخيص',
        diagnostic_data: null
      };
    }

    // إضافة فحوصات إضافية
    const enhancedDiagnostic = {
      ...diagnosticResult,
      cookie_check: checkCookieConfiguration(),
      jwt_check: checkJWTConfiguration(),
      cors_check: checkCORSConfiguration(),
      role_target: determineRoleTarget(email),
      environment_check: checkEnvironment()
    };

    // تحديد الأخطاء والتوصيات
    const issues = identifyIssues(enhancedDiagnostic);
    
    console.log('✅ Diagnostic completed:', enhancedDiagnostic);
    
    return {
      success: true,
      diagnostic_data: enhancedDiagnostic,
      issues: issues,
      recommendations: generateRecommendations(issues)
    };

  } catch (error: any) {
    console.error('Diagnostic error:', error);
    return {
      success: false,
      error: 'خطأ غير متوقع في التشخيص',
      diagnostic_data: null
    };
  }
}

function checkCookieConfiguration() {
  const domain = Deno.env.get('SESSION_COOKIE_DOMAIN');
  const sameSite = Deno.env.get('COOKIE_SAME_SITE') || 'Lax';
  const secure = Deno.env.get('COOKIE_SECURE') === 'true';
  
  return {
    domain_configured: !!domain,
    domain_value: domain || null,
    same_site: sameSite,
    secure: secure,
    issues: []
  };
}

function checkJWTConfiguration() {
  const jwtSecret = Deno.env.get('JWT_SECRET');
  const supabaseJWT = Deno.env.get('SUPABASE_JWT_SECRET');
  
  return {
    jwt_secret_present: !!jwtSecret,
    supabase_jwt_present: !!supabaseJWT,
    secrets_match: jwtSecret === supabaseJWT,
    issues: []
  };
}

function checkCORSConfiguration() {
  const allowedOrigins = Deno.env.get('CORS_ALLOWED_ORIGINS');
  const customDomain = Deno.env.get('CUSTOM_DOMAIN');
  
  return {
    cors_configured: !!allowedOrigins,
    custom_domain: customDomain || null,
    origins: allowedOrigins ? allowedOrigins.split(',') : [],
    issues: []
  };
}

function determineRoleTarget(email: string) {
  // تحديد نوع المستخدم المتوقع بناء على البريد الإلكتروني أو النطاق
  const adminDomains = ['ashholding.com', 'alialshehriholding.com'];
  const domain = email.split('@')[1];
  
  if (adminDomains.includes(domain)) {
    return {
      expected_role: 'admin',
      endpoint_type: 'admin',
      correct_realm: true
    };
  }
  
  return {
    expected_role: 'client',
    endpoint_type: 'client', 
    correct_realm: true
  };
}

function checkEnvironment() {
  return {
    environment: Deno.env.get('ENVIRONMENT') || 'development',
    supabase_url: !!Deno.env.get('SUPABASE_URL'),
    supabase_service_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    resend_configured: !!Deno.env.get('RESEND_API_KEY')
  };
}

function identifyIssues(diagnostic: any) {
  const issues = [];
  
  if (!diagnostic.user_row_found) {
    issues.push({
      code: 'E_USER_NOT_FOUND',
      severity: 'error',
      message: ERROR_MESSAGES.E_USER_NOT_FOUND,
      category: 'user_data'
    });
  }
  
  if (diagnostic.user_row_found && diagnostic.user_status === 'pending') {
    issues.push({
      code: 'E_NOT_ACTIVE',
      severity: 'warning',
      message: ERROR_MESSAGES.E_NOT_ACTIVE,
      category: 'account_status'
    });
  }
  
  if (diagnostic.user_row_found && !diagnostic.password_match) {
    issues.push({
      code: 'E_PASSWORD_MISMATCH',
      severity: 'error',
      message: ERROR_MESSAGES.E_PASSWORD_MISMATCH,
      category: 'authentication'
    });
  }
  
  if (diagnostic.user_row_found && !diagnostic.password_salt_present) {
    issues.push({
      code: 'E_MISSING_SALT',
      severity: 'warning',
      message: 'لم يتم العثور على salt - قد تحتاج كلمة المرور لإعادة تعيين',
      category: 'security'
    });
  }
  
  if (diagnostic.hash_algorithm_detected === 'unknown') {
    issues.push({
      code: 'E_UNKNOWN_HASH',
      severity: 'error',
      message: 'خوارزمية التشفير غير معروفة',
      category: 'security'
    });
  }
  
  return issues;
}

function generateRecommendations(issues: any[]) {
  const recommendations = [];
  
  for (const issue of issues) {
    switch (issue.code) {
      case 'E_USER_NOT_FOUND':
        recommendations.push('تأكد من صحة البريد الإلكتروني أو قم بإنشاء حساب جديد');
        break;
      case 'E_NOT_ACTIVE':
        recommendations.push('قم بالبحث عن رمز التفعيل في البريد الإلكتروني وأكمل عملية التفعيل');
        break;
      case 'E_PASSWORD_MISMATCH':
        recommendations.push('تحقق من صحة كلمة المرور أو استخدم خيار "نسيت كلمة المرور"');
        break;
      case 'E_MISSING_SALT':
        recommendations.push('استخدم خيار إعادة تعيين كلمة المرور لتحديث التشفير');
        break;
      case 'E_UNKNOWN_HASH':
        recommendations.push('اتصل بالمطور لتحديث خوارزمية التشفير');
        break;
    }
  }
  
  return recommendations;
}

async function performSelfTest() {
  console.log('🧪 Starting self-test...');
  
  const testResults = [];
  const testEmail = `test+${Date.now()}@ashholding.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    // اختبار 1: تسجيل مستخدم تجريبي
    const { data: registerResult, error: registerError } = await supabase.functions.invoke('ash-auth', {
      body: {
        action: 'register',
        email: testEmail,
        password: testPassword,
        name: 'Test User'
      }
    });
    
    testResults.push({
      test: 'user_registration',
      passed: !registerError && registerResult?.success,
      details: registerError || registerResult,
      message: registerError ? 'فشل في التسجيل' : 'نجح التسجيل'
    });
    
    // اختبار 2: تسجيل الدخول قبل التفعيل
    const { data: loginBeforeVerifyResult, error: loginBeforeVerifyError } = await supabase.functions.invoke('ash-auth', {
      body: {
        action: 'login',
        email: testEmail,
        password: testPassword
      }
    });
    
    testResults.push({
      test: 'login_before_verification',
      passed: loginBeforeVerifyError || !loginBeforeVerifyResult?.success,
      details: loginBeforeVerifyError || loginBeforeVerifyResult,
      message: 'يجب أن يفشل تسجيل الدخول قبل التفعيل'
    });
    
    // تنظيف: حذف المستخدم التجريبي
    await supabase
      .from('ash_users')
      .delete()
      .eq('email', testEmail);
      
  } catch (error: any) {
    console.error('Self-test error:', error);
    testResults.push({
      test: 'self_test_execution',
      passed: false,
      details: error.message,
      message: 'فشل في تنفيذ الاختبار الذاتي'
    });
  }
  
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  
  return {
    success: true,
    summary: {
      total_tests: totalTests,
      passed_tests: passedTests,
      failed_tests: totalTests - passedTests,
      success_rate: `${Math.round((passedTests / totalTests) * 100)}%`
    },
    test_results: testResults
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, action }: DiagnosticRequest = await req.json();

    console.log(`🔧 Auth Diagnostic Action: ${action} for ${email}`);

    if (action === 'diagnose') {
      if (!email || !password) {
        return new Response(JSON.stringify({
          success: false,
          error: 'البريد الإلكتروني وكلمة المرور مطلوبان'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      const result = await performDiagnostic(email, password);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'self-test') {
      const result = await performSelfTest();
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'إجراء غير مدعوم'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });

  } catch (error: any) {
    console.error('Auth diagnostic error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطأ في الخادم'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});