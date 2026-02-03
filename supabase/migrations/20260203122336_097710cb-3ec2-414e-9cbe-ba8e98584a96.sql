-- Fix security warnings: Set search_path and restrict event insertion

-- Fix function search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
  SELECT status INTO v_old_status FROM public.referrals WHERE id = p_referral_id;
  
  UPDATE public.referrals 
  SET status = p_new_status, updated_at = now()
  WHERE id = p_referral_id
  RETURNING * INTO v_referral;
  
  INSERT INTO public.referral_events (
    referral_id, actor, actor_user_id, old_status, new_status, event_type, metadata, tenant_id
  ) VALUES (
    p_referral_id, p_actor, p_actor_user_id, v_old_status, p_new_status, 'status_change', p_metadata, v_referral.tenant_id
  );
  
  RETURN v_referral;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix permissive RLS policy for referral_events insert
DROP POLICY IF EXISTS "System can insert events" ON public.referral_events;

CREATE POLICY "Users can insert events for own referrals"
  ON public.referral_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.referrals r 
      WHERE r.id = referral_events.referral_id 
      AND (r.referrer_user_id = auth.uid() OR r.referred_user_id = auth.uid())
    )
    OR is_admin(auth.uid(), tenant_id)
  );