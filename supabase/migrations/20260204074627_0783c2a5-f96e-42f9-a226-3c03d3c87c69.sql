-- Create integrations table to store API credentials and settings
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  integration_type TEXT NOT NULL, -- 'marketing', 'payment', 'sms', 'analytics'
  provider TEXT NOT NULL, -- 'google_merchant', 'meta_ads', 'paylink', 'twilio', etc.
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  webhook_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  is_connected BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(tenant_id, provider)
);

-- Create integration logs for tracking activity
CREATE TABLE public.integration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integrations using existing is_admin function
CREATE POLICY "Admins can view all integrations"
  ON public.integrations FOR SELECT
  USING (is_admin(auth.uid(), tenant_id));

CREATE POLICY "Admins can manage integrations"
  ON public.integrations FOR ALL
  USING (is_admin(auth.uid(), tenant_id));

-- RLS Policies for integration logs
CREATE POLICY "Admins can view integration logs"
  ON public.integration_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.integrations i
      WHERE i.id = integration_logs.integration_id
      AND is_admin(auth.uid(), i.tenant_id)
    )
  );

CREATE POLICY "System can insert integration logs"
  ON public.integration_logs FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.integrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.integration_logs;

-- Trigger for updated_at
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();