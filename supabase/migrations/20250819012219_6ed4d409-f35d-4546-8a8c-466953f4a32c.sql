-- Fix remaining security issues with correct table structures

-- 1. Fix admin_users table - make it system-only
DROP POLICY IF EXISTS "Admin users: System functions only" ON admin_users;

CREATE POLICY "Admin users: System functions only"
ON admin_users FOR ALL
USING (false)
WITH CHECK (false);

-- 2. Fix admin_sessions table - system-only access  
DROP POLICY IF EXISTS "Admin sessions: System only access" ON admin_sessions;

CREATE POLICY "Admin sessions: System only access"
ON admin_sessions FOR ALL
USING (false)
WITH CHECK (false);

-- 3. Fix client_contacts table
DROP POLICY IF EXISTS "Admin can manage all client contacts" ON client_contacts;
DROP POLICY IF EXISTS "Users can manage their own client contacts" ON client_contacts;

CREATE POLICY "Admin can manage all client contacts"
ON client_contacts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own client contacts"
ON client_contacts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid()
  )
);

-- 4. Create security audit logs table if not exists
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
  END IF;
END
$$;

CREATE POLICY "Only admins can access security audit logs"
ON security_audit_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create user activity logs table if not exists
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
  END IF;
END
$$;

CREATE POLICY "Only admins can access user activity logs"
ON user_activity_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create support tickets table if not exists
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
  END IF;
END
$$;

CREATE POLICY "Admin can manage all support tickets"
ON support_tickets FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own support tickets"
ON support_tickets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Create ticket replies table if not exists
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
  END IF;
END
$$;

CREATE POLICY "Admin can manage all ticket replies"
ON ticket_replies FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view replies to their tickets"
ON ticket_replies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM support_tickets 
    WHERE support_tickets.id = ticket_replies.ticket_id 
    AND support_tickets.user_id = auth.uid()
  )
);

CREATE POLICY "Users can reply to their own tickets"
ON ticket_replies FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM support_tickets 
    WHERE support_tickets.id = ticket_replies.ticket_id 
    AND support_tickets.user_id = auth.uid()
  ) AND auth.uid() = user_id
);

-- 8. Enhanced business financial data protection
DROP POLICY IF EXISTS "Secure: Admin can manage all business invoices" ON business_invoices;
DROP POLICY IF EXISTS "Secure: Users can manage their client invoices only" ON business_invoices;

CREATE POLICY "Secure: Admin can manage all business invoices"
ON business_invoices FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Secure: Users can manage their client invoices only"
ON business_invoices FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = business_invoices.client_id 
    AND clients.created_by = auth.uid()
  ) OR created_by = auth.uid()
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = business_invoices.client_id 
    AND clients.created_by = auth.uid()
  ) OR created_by = auth.uid()
);

-- 9. Enhanced business payments protection
DROP POLICY IF EXISTS "Secure: Admin can manage all business payments" ON business_payments;
DROP POLICY IF EXISTS "Secure: Users can view their invoice payments only" ON business_payments;

CREATE POLICY "Secure: Admin can manage all business payments"
ON business_payments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Secure: Users can view their invoice payments only"
ON business_payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM business_invoices bi
    JOIN clients c ON bi.client_id = c.id
    WHERE bi.id = business_payments.invoice_id 
    AND c.created_by = auth.uid()
  )
);