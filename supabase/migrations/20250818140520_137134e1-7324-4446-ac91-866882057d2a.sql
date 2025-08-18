-- Create user roles enum
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor');

-- Create page status enum
CREATE TYPE page_status AS ENUM ('draft', 'published');

-- Create news type enum
CREATE TYPE news_type AS ENUM ('news', 'press');

-- Create job status enum
CREATE TYPE job_status AS ENUM ('open', 'closed');

-- Create contract type enum
CREATE TYPE contract_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');

-- Create audit action enum
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'publish', 'unpublish', 'login', 'logout');

-- Create admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'editor',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pages table
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image TEXT,
  blocks JSONB DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  status page_status DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subsidiaries table
CREATE TABLE cms_subsidiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  short_desc TEXT,
  services TEXT[] DEFAULT '{}',
  website_url TEXT,
  email TEXT,
  social_links JSONB DEFAULT '{}',
  banner TEXT,
  gallery TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  status page_status DEFAULT 'draft',
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news table
CREATE TABLE cms_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  body TEXT,
  cover TEXT,
  published_at TIMESTAMPTZ,
  type news_type DEFAULT 'news',
  tags TEXT[] DEFAULT '{}',
  status page_status DEFAULT 'draft',
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE cms_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  location TEXT DEFAULT 'الرياض، السعودية',
  contract_type contract_type DEFAULT 'full_time',
  requirements TEXT,
  responsibilities TEXT,
  status job_status DEFAULT 'open',
  publish_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE cms_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES cms_jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cv_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create forms table
CREATE TABLE cms_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  fields JSONB DEFAULT '[]',
  notifications_email TEXT,
  store_submissions BOOLEAN DEFAULT TRUE,
  success_message TEXT DEFAULT 'تم إرسال النموذج بنجاح',
  redirect_url TEXT,
  recaptcha_enabled BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create form submissions table
CREATE TABLE cms_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES cms_forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create media library table
CREATE TABLE cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  title TEXT,
  alt_text TEXT,
  usage_notes TEXT,
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE cms_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit log table
CREATE TABLE cms_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES admin_users(id),
  action audit_action NOT NULL,
  target_table TEXT,
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create revisions table for pages and news
CREATE TABLE cms_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  content JSONB NOT NULL,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_subsidiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_revisions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin users
CREATE POLICY "Admins can manage users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()::uuid 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can view themselves" ON admin_users
  FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update themselves" ON admin_users
  FOR UPDATE USING (id = auth.uid()::uuid);

-- Create function to check admin role
CREATE OR REPLACE FUNCTION has_admin_role(user_id UUID, required_role user_role DEFAULT 'editor')
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND is_active = TRUE
    AND CASE 
      WHEN required_role = 'owner' THEN role = 'owner'
      WHEN required_role = 'admin' THEN role IN ('owner', 'admin')
      ELSE role IN ('owner', 'admin', 'editor')
    END
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create RLS policies for content tables
CREATE POLICY "Admins can manage pages" ON cms_pages
  FOR ALL USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Admins can manage subsidiaries" ON cms_subsidiaries
  FOR ALL USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Admins can manage news" ON cms_news
  FOR ALL USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Admins can manage jobs" ON cms_jobs
  FOR ALL USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Admins can view applications" ON cms_applications
  FOR SELECT USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Anyone can submit applications" ON cms_applications
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can manage forms" ON cms_forms
  FOR ALL USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Admins can view submissions" ON cms_form_submissions
  FOR SELECT USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Anyone can submit forms" ON cms_form_submissions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can manage media" ON cms_media
  FOR ALL USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "Admins can manage settings" ON cms_settings
  FOR ALL USING (has_admin_role(auth.uid()::uuid, 'admin'));

CREATE POLICY "Admins can view audit log" ON cms_audit_log
  FOR SELECT USING (has_admin_role(auth.uid()::uuid, 'admin'));

CREATE POLICY "System can insert audit log" ON cms_audit_log
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view revisions" ON cms_revisions
  FOR SELECT USING (has_admin_role(auth.uid()::uuid));

CREATE POLICY "System can insert revisions" ON cms_revisions
  FOR INSERT WITH CHECK (TRUE);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_subsidiaries_updated_at
  BEFORE UPDATE ON cms_subsidiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_news_updated_at
  BEFORE UPDATE ON cms_news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_jobs_updated_at
  BEFORE UPDATE ON cms_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_forms_updated_at
  BEFORE UPDATE ON cms_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_settings_updated_at
  BEFORE UPDATE ON cms_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO cms_settings (key, value, description) VALUES
('company_name', '"مجموعة علي الشهري القابضة"', 'اسم الشركة'),
('contact_phones', '["920000000", "966112345678"]', 'أرقام الهواتف'),
('contact_emails', '["info@alialshehriholding.com", "support@alialshehriholding.com"]', 'عناوين البريد الإلكتروني'),
('social_links', '{"linkedin": "", "twitter": "", "instagram": ""}', 'روابط وسائل التواصل الاجتماعي'),
('seo_defaults', '{"title": "مجموعة علي الشهري القابضة", "description": "مجموعة علي الشهري القابضة", "og_image": ""}', 'إعدادات SEO الافتراضية'),
('integrations', '{"ga_id": "", "gtm_id": "", "recaptcha_site_key": "", "whatsapp_number": ""}', 'التكامل مع الخدمات الخارجية');

-- Create default admin user (password: admin123)
INSERT INTO admin_users (name, email, password_hash, role) VALUES
('مدير النظام', 'admin@alialshehriholding.com', '$2b$10$YourHashedPasswordHere', 'owner');

-- Create audit log function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cms_audit_log (
    actor_id,
    action,
    target_table,
    target_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    auth.uid()::uuid,
    CASE TG_OP
      WHEN 'INSERT' THEN 'create'::audit_action
      WHEN 'UPDATE' THEN 'update'::audit_action
      WHEN 'DELETE' THEN 'delete'::audit_action
    END,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    inet_client_addr()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_cms_pages
  AFTER INSERT OR UPDATE OR DELETE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_cms_news
  AFTER INSERT OR UPDATE OR DELETE ON cms_news
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_cms_subsidiaries
  AFTER INSERT OR UPDATE OR DELETE ON cms_subsidiaries
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Create revision function
CREATE OR REPLACE FUNCTION save_revision()
RETURNS TRIGGER AS $$
BEGIN
  -- Save revision for updates only
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO cms_revisions (target_table, target_id, content, created_by)
    VALUES (TG_TABLE_NAME, OLD.id, row_to_json(OLD), auth.uid()::uuid);
    
    -- Keep only last 10 revisions
    DELETE FROM cms_revisions 
    WHERE target_table = TG_TABLE_NAME 
    AND target_id = OLD.id 
    AND id NOT IN (
      SELECT id FROM cms_revisions 
      WHERE target_table = TG_TABLE_NAME 
      AND target_id = OLD.id 
      ORDER BY created_at DESC 
      LIMIT 10
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create revision triggers
CREATE TRIGGER revision_cms_pages
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION save_revision();

CREATE TRIGGER revision_cms_news
  BEFORE UPDATE ON cms_news
  FOR EACH ROW EXECUTE FUNCTION save_revision();