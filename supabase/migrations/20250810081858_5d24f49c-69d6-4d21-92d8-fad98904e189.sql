-- Add client_id to profiles table for unique client identification
ALTER TABLE public.profiles 
ADD COLUMN client_id TEXT UNIQUE;

-- Create function to generate client ID
CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS TEXT AS $$
DECLARE
    counter INTEGER;
    client_id_num TEXT;
BEGIN
    -- Get the next counter
    SELECT COALESCE(MAX(CAST(SUBSTRING(client_id FROM 3) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.profiles
    WHERE client_id IS NOT NULL AND client_id LIKE 'CL%';
    
    -- Format as CL + 6-digit number
    client_id_num := 'CL' || LPAD(counter::TEXT, 6, '0');
    
    RETURN client_id_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate client_id
CREATE OR REPLACE FUNCTION public.set_client_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.client_id IS NULL THEN
        NEW.client_id := public.generate_client_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_client_id_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_client_id();

-- Update existing profiles with client IDs
UPDATE public.profiles 
SET client_id = public.generate_client_id()
WHERE client_id IS NULL;

-- Create tickets table for support system
CREATE TABLE public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'technical', 'billing', 'feature_request')),
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for tickets
CREATE POLICY "Users can view their own tickets" 
ON public.tickets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" 
ON public.tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
ON public.tickets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tickets" 
ON public.tickets FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Create function to generate ticket number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    year_suffix TEXT;
    counter INTEGER;
    ticket_num TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.tickets
    WHERE ticket_number LIKE 'TK' || year_suffix || '%';
    
    ticket_num := 'TK' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket number
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := public.generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number_trigger
    BEFORE INSERT ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.set_ticket_number();

-- Create ticket messages table for conversations
CREATE TABLE public.ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ticket messages
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for ticket messages
CREATE POLICY "Users can view messages for their tickets" 
ON public.ticket_messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE tickets.id = ticket_messages.ticket_id 
        AND (tickets.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
);

CREATE POLICY "Users can create messages for their tickets" 
ON public.ticket_messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE tickets.id = ticket_messages.ticket_id 
        AND (tickets.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
);

-- Create user activity logs table
CREATE TABLE public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'logout', 'password_change', 'profile_update', 'service_request', 'payment', 'ticket_created')),
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on activity logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for activity logs
CREATE POLICY "Users can view their own activity logs" 
ON public.user_activity_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs" 
ON public.user_activity_logs FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all activity logs" 
ON public.user_activity_logs FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Add client_id to invoices table
ALTER TABLE public.invoices 
ADD COLUMN client_id TEXT;

-- Update existing invoices with client_id from profiles
UPDATE public.invoices 
SET client_id = (
    SELECT profiles.client_id 
    FROM public.profiles 
    WHERE profiles.user_id = invoices.user_id
)
WHERE user_id IS NOT NULL;

-- Add client_id to service_requests table
ALTER TABLE public.service_requests 
ADD COLUMN client_id TEXT;

-- Update existing service requests with client_id
UPDATE public.service_requests 
SET client_id = (
    SELECT profiles.client_id 
    FROM public.profiles 
    WHERE profiles.user_id = service_requests.user_id
);

-- Create payment history table
CREATE TABLE public.payment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.payment_transactions(id),
    invoice_id UUID REFERENCES public.invoices(id),
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'SAR',
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on payment history
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for payment history
CREATE POLICY "Users can view their own payment history" 
ON public.payment_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert payment history" 
ON public.payment_history FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all payment history" 
ON public.payment_history FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Create update triggers for timestamps
CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_activity_type ON public.user_activity_logs(activity_type);
CREATE INDEX idx_payment_history_user_id ON public.payment_history(user_id);