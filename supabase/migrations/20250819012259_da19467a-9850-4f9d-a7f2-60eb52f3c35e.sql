-- Fix security issues without referencing auth.users directly

-- 1. Create security audit logs table if not exists (without auth reference)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'security_audit_logs') THEN
    CREATE TABLE public.security_audit_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type text NOT NULL,
      user_id uuid,
      action text NOT NULL,
      resource_type text,
      resource_id text,
      risk_level text DEFAULT 'low',
      metadata jsonb DEFAULT '{}',
      ip_address inet,
      user_agent text,
      created_at timestamp with time zone DEFAULT now()
    );
    
    ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Only admins can access security audit logs"
    ON public.security_audit_logs FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END
$$;

-- 2. Create user activity logs table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_activity_logs') THEN
    CREATE TABLE public.user_activity_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid,
      activity_type text NOT NULL,
      description text,
      metadata jsonb DEFAULT '{}',
      ip_address inet,
      user_agent text,
      created_at timestamp with time zone DEFAULT now()
    );
    
    ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Only admins can access user activity logs"
    ON public.user_activity_logs FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END
$$;

-- 3. Create support tickets table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    CREATE TABLE public.support_tickets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid,
      title text NOT NULL,
      description text,
      status text DEFAULT 'open',
      priority text DEFAULT 'medium',
      assigned_to uuid,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
    
    ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Admin can manage all support tickets"
    ON public.support_tickets FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "Users can manage their own support tickets"
    ON public.support_tickets FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- 4. Create ticket replies table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ticket_replies') THEN
    CREATE TABLE public.ticket_replies (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id uuid,
      user_id uuid,
      message text NOT NULL,
      is_staff_reply boolean DEFAULT false,
      created_at timestamp with time zone DEFAULT now()
    );
    
    ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Admin can manage all ticket replies"
    ON public.ticket_replies FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "Users can view replies to their tickets"
    ON public.ticket_replies FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE support_tickets.id = ticket_replies.ticket_id 
        AND support_tickets.user_id = auth.uid()
      )
    );

    CREATE POLICY "Users can reply to their own tickets"
    ON public.ticket_replies FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.support_tickets 
        WHERE support_tickets.id = ticket_replies.ticket_id 
        AND support_tickets.user_id = auth.uid()
      ) AND auth.uid() = user_id
    );
  END IF;
END
$$;

-- 5. Create payment transactions table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_transactions') THEN
    CREATE TABLE public.payment_transactions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid,
      amount numeric NOT NULL,
      currency text DEFAULT 'SAR',
      status text DEFAULT 'pending',
      payment_method text,
      transaction_ref text,
      metadata jsonb DEFAULT '{}',
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
    
    ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Admin can manage all payment transactions"
    ON public.payment_transactions FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

    CREATE POLICY "Users can view their own payment transactions"
    ON public.payment_transactions FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END
$$;