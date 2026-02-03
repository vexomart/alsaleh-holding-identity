-- =============================================
-- REFERRAL SYSTEM TABLES - Enterprise Grade
-- =============================================

-- 1) Referrals Main Table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID, -- Nullable until signup
  referral_code TEXT NOT NULL UNIQUE,
  referral_link TEXT NOT NULL,
  referred_email TEXT,
  referred_phone TEXT,
  referred_name TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'registered', 'service_requested', 'contract_signed', 'qualified', 'reward_paid', 'rejected')),
  reward_amount NUMERIC DEFAULT 0,
  reward_currency TEXT DEFAULT 'SAR',
  fraud_flags JSONB DEFAULT '[]'::jsonb,
  device_fingerprint TEXT,
  ip_address INET,
  metadata JSONB DEFAULT '{}'::jsonb,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2) Referral Events (Timeline/Audit)
CREATE TABLE public.referral_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  actor TEXT NOT NULL DEFAULT 'system' CHECK (actor IN ('system', 'admin', 'user')),
  actor_user_id UUID,
  old_status TEXT,
  new_status TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'status_change',
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3) Referral Rewards
CREATE TABLE public.referral_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'SAR',
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'paid', 'failed', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_reference TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4) Referral Settings (Admin configurable)
CREATE TABLE public.referral_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  reward_amount_per_referral NUMERIC DEFAULT 100,
  reward_currency TEXT DEFAULT 'SAR',
  min_conversion_status TEXT DEFAULT 'qualified',
  max_referrals_per_ip INTEGER DEFAULT 5,
  max_referrals_per_user INTEGER DEFAULT 100,
  cooldown_hours INTEGER DEFAULT 24,
  is_active BOOLEAN DEFAULT true,
  terms_ar TEXT,
  terms_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_user_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referrals_tenant ON public.referrals(tenant_id);
CREATE INDEX idx_referral_events_referral ON public.referral_events(referral_id);
CREATE INDEX idx_referral_rewards_user ON public.referral_rewards(user_id);
CREATE INDEX idx_referral_rewards_status ON public.referral_rewards(payout_status);

-- =============================================
-- RLS POLICIES
-- =============================================
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;

-- Referrals Policies
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (referrer_user_id = auth.uid() AND referrer_user_id != referred_user_id);

CREATE POLICY "Admins can manage all referrals"
  ON public.referrals FOR ALL
  USING (is_admin(auth.uid(), tenant_id));

-- Referral Events Policies
CREATE POLICY "Users can view own referral events"
  ON public.referral_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.referrals r 
    WHERE r.id = referral_events.referral_id 
    AND (r.referrer_user_id = auth.uid() OR r.referred_user_id = auth.uid())
  ));

CREATE POLICY "System can insert events"
  ON public.referral_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all events"
  ON public.referral_events FOR ALL
  USING (is_admin(auth.uid(), tenant_id));

-- Referral Rewards Policies
CREATE POLICY "Users can view own rewards"
  ON public.referral_rewards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all rewards"
  ON public.referral_rewards FOR ALL
  USING (is_admin(auth.uid(), tenant_id));

-- Settings Policies
CREATE POLICY "Anyone can view active settings"
  ON public.referral_settings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage settings"
  ON public.referral_settings FOR ALL
  USING (is_admin(auth.uid(), tenant_id));

-- =============================================
-- FUNCTIONS
-- =============================================

-- Generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text || user_id::text), 1, 8));
    SELECT COUNT(*) INTO exists_count FROM public.referrals WHERE referral_code = code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update referral status with event logging
CREATE OR REPLACE FUNCTION public.update_referral_status(
  p_referral_id UUID,
  p_new_status TEXT,
  p_actor TEXT DEFAULT 'system',
  p_actor_user_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS public.referrals AS $$
DECLARE
  v_referral public.referrals;
  v_old_status TEXT;
BEGIN
  -- Get current status
  SELECT status INTO v_old_status FROM public.referrals WHERE id = p_referral_id;
  
  -- Update referral
  UPDATE public.referrals 
  SET status = p_new_status, updated_at = now()
  WHERE id = p_referral_id
  RETURNING * INTO v_referral;
  
  -- Log event
  INSERT INTO public.referral_events (
    referral_id, actor, actor_user_id, old_status, new_status, event_type, metadata, tenant_id
  ) VALUES (
    p_referral_id, p_actor, p_actor_user_id, v_old_status, p_new_status, 'status_change', p_metadata, v_referral.tenant_id
  );
  
  RETURN v_referral;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referral_rewards_updated_at
  BEFORE UPDATE ON public.referral_rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referral_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referral_rewards;

-- Insert default settings
INSERT INTO public.referral_settings (reward_amount_per_referral, reward_currency, min_conversion_status, is_active)
VALUES (100, 'SAR', 'qualified', true);