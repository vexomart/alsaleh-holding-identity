-- Fix all remaining security issues with proper RLS policies

-- 1. Fix admin_users table - restrict to admin-only access
DROP POLICY IF EXISTS "Admin users: Can update own record" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Can view own record only" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can create users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can delete users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Owners can manage all users" ON admin_users;

-- Only system functions can access admin_users table
CREATE POLICY "Admin users: System functions only"
ON admin_users FOR ALL
USING (false)
WITH CHECK (false);

-- 2. Fix admin_sessions table - ensure system-only access
DROP POLICY IF EXISTS "Admin sessions: Only system can manage sessions" ON admin_sessions;

CREATE POLICY "Admin sessions: System only access"
ON admin_sessions FOR ALL
USING (false)
WITH CHECK (false);

-- 3. Fix client_contacts table - ensure proper user access
DROP POLICY IF EXISTS "Admin can manage all contacts" ON client_contacts;
DROP POLICY IF EXISTS "Users can manage contacts for their clients" ON client_contacts;

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

-- 4. Create missing payment_transactions table policies
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  amount numeric NOT NULL,
  currency text DEFAULT 'SAR',
  status text DEFAULT 'pending',
  payment_method text,
  transaction_ref text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all payment transactions"
ON payment_transactions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own payment transactions"
ON payment_transactions FOR SELECT
USING (auth.uid() = user_id);

-- 5. Create missing security audit logs table and policies
CREATE TABLE IF NOT EXISTS security_audit_logs (
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

ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access security audit logs"
ON security_audit_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. Create missing user activity logs table and policies
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  activity_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access user activity logs"
ON user_activity_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 7. Create missing support tickets table and policies
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  status text DEFAULT 'open',
  priority text DEFAULT 'medium',
  assigned_to uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all support tickets"
ON support_tickets FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own support tickets"
ON support_tickets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. Create missing ticket replies table and policies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id),
  user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  is_staff_reply boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

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

-- 9. Enhanced business financial data protection
DROP POLICY IF EXISTS "Admin can manage all business invoices" ON business_invoices;
DROP POLICY IF EXISTS "Users can manage invoices for their clients" ON business_invoices;

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

-- 10. Enhanced business payments protection
DROP POLICY IF EXISTS "Admin can manage all business payments" ON business_payments;
DROP POLICY IF EXISTS "Users can view payments for their invoices" ON business_payments;

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