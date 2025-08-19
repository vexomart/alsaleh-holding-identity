-- إضافة تشفير آمن لكلمات مرور المشرفين
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- تحديث جدول admin_users لاستخدام تشفير آمن
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS password_salt TEXT,
ADD COLUMN IF NOT EXISTS session_secret TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE DEFAULT now();

-- دالة تشفير كلمة المرور
CREATE OR REPLACE FUNCTION encrypt_admin_password(plain_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  salt TEXT;
  hash TEXT;
BEGIN
  -- إنشاء salt عشوائي
  salt := encode(gen_random_bytes(16), 'hex');
  
  -- تشفير كلمة المرور باستخدام salt
  hash := crypt(plain_password || salt, gen_salt('bf', 12));
  
  RETURN json_build_object(
    'hash', hash,
    'salt', salt
  );
END;
$$;

-- دالة التحقق من كلمة المرور
CREATE OR REPLACE FUNCTION verify_admin_password(plain_password TEXT, stored_hash TEXT, stored_salt TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- التحقق من كلمة المرور مع salt
  RETURN stored_hash = crypt(plain_password || stored_salt, stored_hash);
END;
$$;

-- تحديث admin_sessions لتكون أكثر أماناً
ALTER TABLE admin_sessions 
ADD COLUMN IF NOT EXISTS fingerprint TEXT,
ADD COLUMN IF NOT EXISTS is_revoked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT now();

-- دالة إنشاء session آمن
CREATE OR REPLACE FUNCTION create_secure_admin_session(
  admin_user_id UUID,
  user_ip INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_token TEXT;
  session_secret TEXT;
  fingerprint_hash TEXT;
BEGIN
  -- الحصول على session_secret للمستخدم
  SELECT admin_users.session_secret INTO session_secret
  FROM admin_users 
  WHERE admin_users.id = admin_user_id AND admin_users.is_active = TRUE;
  
  IF session_secret IS NULL THEN
    RAISE EXCEPTION 'User not found or inactive';
  END IF;
  
  -- إنشاء fingerprint من المعلومات
  fingerprint_hash := encode(digest(COALESCE(user_agent, '') || COALESCE(user_ip::text, ''), 'sha256'), 'hex');
  
  -- إنشاء session token آمن
  session_token := encode(
    hmac(
      admin_user_id::text || extract(epoch from now())::text || fingerprint_hash,
      session_secret,
      'sha256'
    ),
    'hex'
  );
  
  -- حفظ session في قاعدة البيانات
  INSERT INTO admin_sessions (
    admin_user_id, 
    session_token, 
    expires_at, 
    ip_address, 
    user_agent,
    fingerprint,
    last_activity
  ) VALUES (
    admin_user_id, 
    session_token, 
    now() + interval '8 hours', -- انتهاء صلاحية خلال 8 ساعات
    user_ip, 
    user_agent,
    fingerprint_hash,
    now()
  );
  
  RETURN session_token;
END;
$$;

-- دالة التحقق من صحة session
CREATE OR REPLACE FUNCTION validate_admin_session(token TEXT, user_agent TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_record RECORD;
  current_fingerprint TEXT;
BEGIN
  -- البحث عن session
  SELECT 
    s.*,
    u.id as user_id,
    u.name,
    u.email,
    u.role,
    u.is_active
  INTO session_record
  FROM admin_sessions s
  JOIN admin_users u ON s.admin_user_id = u.id
  WHERE s.session_token = token 
    AND s.expires_at > now()
    AND s.is_revoked = FALSE
    AND u.is_active = TRUE;
  
  IF session_record IS NULL THEN
    RETURN json_build_object('valid', FALSE, 'reason', 'Invalid or expired session');
  END IF;
  
  -- التحقق من fingerprint
  current_fingerprint := encode(digest(COALESCE(user_agent, ''), 'sha256'), 'hex');
  
  IF session_record.fingerprint != current_fingerprint THEN
    -- إلغاء session عند اختلاف fingerprint
    UPDATE admin_sessions 
    SET is_revoked = TRUE 
    WHERE session_token = token;
    
    RETURN json_build_object('valid', FALSE, 'reason', 'Session hijacking detected');
  END IF;
  
  -- تحديث last_activity
  UPDATE admin_sessions 
  SET last_activity = now() 
  WHERE session_token = token;
  
  RETURN json_build_object(
    'valid', TRUE,
    'user', json_build_object(
      'id', session_record.user_id,
      'name', session_record.name,
      'email', session_record.email,
      'role', session_record.role
    )
  );
END;
$$;

-- RLS محسنة لحماية البيانات الحساسة
-- حماية معلومات العملاء
CREATE POLICY "Enhanced: Customer data protection"
ON contracts
FOR ALL
USING (
  -- المشرفون فقط أو صاحب العقد
  has_role(auth.uid(), 'admin'::app_role) OR 
  (auth.uid() = user_id AND check_contract_rate_limit(auth.uid()))
)
WITH CHECK (
  -- التحقق من معدل الوصول للبيانات الحساسة
  has_role(auth.uid(), 'admin'::app_role) OR 
  (auth.uid() = user_id AND check_contract_rate_limit(auth.uid()))
);

-- حماية السجلات المالية المحسنة
CREATE POLICY "Enhanced: Financial records protection"
ON invoices
FOR ALL
USING (
  -- المشرفون أو أصحاب الفواتير مع تدقيق أمني
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (auth.uid() = user_id AND public.enhanced_rate_limit_check(
    auth.uid()::text, 
    'financial_access', 
    5, -- 5 عمليات وصول مالية كحد أقصى
    60 -- خلال ساعة واحدة
  ))
)
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (auth.uid() = user_id AND public.enhanced_rate_limit_check(
    auth.uid()::text, 
    'financial_insert', 
    3, -- 3 عمليات إدراج مالية كحد أقصى
    60 -- خلال ساعة واحدة
  ))
);

-- حماية الإشعارات من تسريب المعلومات
CREATE POLICY "Enhanced: Secure notifications"
ON notifications
FOR SELECT
USING (
  -- المستخدم يرى إشعاراته فقط مع تشفير البيانات الحساسة
  (user_id = auth.uid()) OR 
  (has_role(auth.uid(), 'admin'::app_role) AND 
   public.enhanced_rate_limit_check(
     auth.uid()::text, 
     'notification_admin_access', 
     20, -- 20 عملية وصول للإشعارات
     60  -- خلال ساعة واحدة
   ))
);

-- جدول جديد لتدقيق الوصول للبيانات الحساسة
CREATE TABLE IF NOT EXISTS sensitive_data_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  access_type TEXT NOT NULL,
  data_classification TEXT NOT NULL, -- 'public', 'internal', 'confidential', 'restricted'
  success BOOLEAN NOT NULL,
  risk_score INTEGER DEFAULT 0, -- 0-100
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS على جدول التدقيق
ALTER TABLE sensitive_data_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit: Only admins can view audit logs"
ON sensitive_data_audit
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Audit: System can insert audit logs"
ON sensitive_data_audit
FOR INSERT
WITH CHECK (TRUE);

-- دالة لتسجيل الوصول للبيانات الحساسة
CREATE OR REPLACE FUNCTION log_sensitive_data_access(
  p_resource_type TEXT,
  p_resource_id TEXT,
  p_access_type TEXT,
  p_classification TEXT,
  p_success BOOLEAN,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  risk_score INTEGER := 0;
BEGIN
  -- حساب risk score بناءً على نوع البيانات والوصول
  CASE p_classification
    WHEN 'restricted' THEN risk_score := 90;
    WHEN 'confidential' THEN risk_score := 70;
    WHEN 'internal' THEN risk_score := 30;
    ELSE risk_score := 10;
  END CASE;
  
  -- زيادة المخاطر للوصول الفاشل
  IF NOT p_success THEN
    risk_score := risk_score + 20;
  END IF;
  
  INSERT INTO sensitive_data_audit (
    user_id,
    resource_type,
    resource_id,
    access_type,
    data_classification,
    success,
    risk_score,
    metadata
  ) VALUES (
    auth.uid(),
    p_resource_type,
    p_resource_id,
    p_access_type,
    p_classification,
    p_success,
    risk_score,
    p_metadata
  );
END;
$$;