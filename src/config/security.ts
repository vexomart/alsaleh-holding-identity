// تكوين الأمان الشامل
export const securityConfig = {
  // رؤوس الأمان
  headers: {
    // HSTS - إجبار HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // CSP - سياسة أمان المحتوى
    'Content-Security-Policy': [
      "default-src 'self'",
      "img-src 'self' data: https: blob:",
      "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:",
      "connect-src 'self' https://api.whatsapp.com https://wa.me",
      "frame-src 'self' https://www.google.com",
      "media-src 'self' data: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
    ].join('; '),
    
    // حماية من XSS
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    
    // سياسة الإحالة
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // صلاحيات المتصفح
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
    
    // حماية إضافية
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none'
  },

  // تكوين Cache للأداء والأمان
  cacheHeaders: {
    // الملفات الثابتة
    static: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    },
    
    // HTML
    html: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    
    // API
    api: {
      'Cache-Control': 'no-store, max-age=0'
    }
  },

  // تكوين CORS
  cors: {
    origin: ['https://alialshehriholding.com', 'https://www.alialshehriholding.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  },

  // حماية من CSRF
  csrf: {
    enabled: true,
    // Secrets must never be embedded in the browser bundle. Token signing is server-side.
    secret: '',
    sameSite: 'strict'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // حد الطلبات
    message: {
      error: 'تم تجاوز حد الطلبات المسموح. يرجى المحاولة لاحقاً',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },

  // تشفير البيانات الحساسة
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16
  },

  // تسجيل الأحداث الأمنية
  logging: {
    enabled: true,
    level: 'warn',
    includeSensitiveData: false,
    events: [
      'failed_login',
      'unauthorized_access',
      'security_violation',
      'rate_limit_exceeded',
      'csrf_token_mismatch'
    ]
  }
};

// دالة تطبيق رؤوس الأمان
export const applySecurityHeaders = (response: Response): Response => {
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

// دالة تنظيف المدخلات
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // إزالة JavaScript
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // إزالة iframes
    .replace(/javascript:/gi, '') // إزالة javascript: URLs
    .replace(/on\w+\s*=/gi, '') // إزالة event handlers
    .replace(/[<>]/g, (match) => match === '<' ? '&lt;' : '&gt;'); // تشفير HTML
};

// دالة التحقق من صحة البريد الإلكتروني
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// دالة التحقق من صحة رقم الهاتف السعودي
export const validateSaudiPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// دالة إنشاء نموذج أمني للنماذج
export const createSecureFormData = (data: Record<string, any>) => {
  const secureData: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      secureData[key] = sanitizeInput(value);
    } else {
      secureData[key] = value;
    }
  });
  
  // إضافة timestamp للحماية من replay attacks
  secureData._timestamp = Date.now();
  secureData._nonce = Math.random().toString(36).substring(2, 15);
  
  return secureData;
};