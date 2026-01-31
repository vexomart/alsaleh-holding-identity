-- Create system_settings table for storing all system configurations
CREATE TABLE public.system_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'general', 'appearance', 'email', 'security', 'localization', 'notifications'
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(tenant_id, category)
);

-- Create index for faster lookups
CREATE INDEX idx_system_settings_tenant_category ON public.system_settings(tenant_id, category);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage system settings
CREATE POLICY "Admins can manage system settings"
  ON public.system_settings
  FOR ALL
  USING (is_admin(auth.uid(), tenant_id));

-- Super admins can manage all settings (global settings where tenant_id is null)
CREATE POLICY "Super admins can manage global settings"
  ON public.system_settings
  FOR ALL
  USING (is_super_admin(auth.uid()) AND tenant_id IS NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings for each category (global settings with tenant_id NULL)
INSERT INTO public.system_settings (tenant_id, category, settings) VALUES
(NULL, 'general', '{
  "companyName": "ASH Holding",
  "companyNameAr": "علي الشهري القابضة",
  "tagline": "Your Business Partner",
  "taglineAr": "شريكك في النجاح",
  "email": "info@ash-holding.sa",
  "phone": "+966 50 000 0000",
  "address": "Riyadh, Saudi Arabia",
  "addressAr": "الرياض، المملكة العربية السعودية",
  "website": "https://ash-holding.sa",
  "vatNumber": "300000000000003",
  "crNumber": "1010000000",
  "maintenanceMode": false
}'::jsonb),
(NULL, 'appearance', '{
  "colorScheme": "amber",
  "fontSize": 16,
  "fontFamily": "cairo",
  "enableAnimations": true,
  "compactMode": false,
  "highContrast": false
}'::jsonb),
(NULL, 'email', '{
  "senderName": "ASH Holding",
  "senderEmail": "info@ash-holding.sa",
  "replyToEmail": "support@ash-holding.sa",
  "smtpProvider": "resend",
  "enableEmailNotifications": true,
  "enableOrderEmails": true,
  "enableMarketingEmails": false,
  "bccAdmin": true,
  "bccEmail": "admin@ash-holding.sa"
}'::jsonb),
(NULL, 'security', '{
  "minPasswordLength": 8,
  "requireUppercase": true,
  "requireNumbers": true,
  "requireSpecialChars": true,
  "passwordExpiry": "90",
  "sessionTimeout": "30",
  "maxSessions": "3",
  "enable2FA": false,
  "enforce2FAForAdmin": true,
  "maxLoginAttempts": "5",
  "lockoutDuration": "15",
  "enableCaptcha": true,
  "enableAuditLog": true,
  "auditRetentionDays": "365"
}'::jsonb),
(NULL, 'localization', '{
  "defaultLanguage": "ar",
  "allowLanguageSwitching": true,
  "timezone": "Asia/Riyadh",
  "currency": "SAR",
  "dateFormat": "DD/MM/YYYY",
  "calendarType": "both",
  "use24HourFormat": false,
  "showHijriDate": true
}'::jsonb),
(NULL, 'notifications', '{
  "emailNewOrder": true,
  "emailOrderStatus": true,
  "emailNewUser": true,
  "emailSystemAlerts": true,
  "pushEnabled": true,
  "pushNewOrder": true,
  "pushUrgentOnly": false,
  "inAppEnabled": true,
  "inAppSound": true,
  "inAppDesktop": false,
  "digestEnabled": true,
  "digestFrequency": "daily",
  "quietHoursEnabled": false,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00"
}'::jsonb);