-- Create updates table for admin-generated updates
CREATE TABLE public.updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  update_type TEXT NOT NULL DEFAULT 'general', -- general, urgent, maintenance, feature
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  target_audience TEXT NOT NULL DEFAULT 'all', -- all, specific_client, specific_role
  target_client_id UUID NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE NULL,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for updates
CREATE POLICY "Admins can manage all updates" 
ON public.updates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view published updates" 
ON public.updates 
FOR SELECT 
USING (
  is_published = true 
  AND (
    target_audience = 'all' 
    OR (target_audience = 'specific_client' AND target_client_id = auth.uid())
  )
);

-- Create update_reads table to track which users have read which updates
CREATE TABLE public.update_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_id UUID NOT NULL REFERENCES public.updates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(update_id, user_id)
);

-- Enable RLS
ALTER TABLE public.update_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for update_reads
CREATE POLICY "Users can manage their own read status" 
ON public.update_reads 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all read status" 
ON public.update_reads 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating updated_at
CREATE TRIGGER update_updates_updated_at
BEFORE UPDATE ON public.updates
FOR EACH ROW
EXECUTE FUNCTION public._update_updated_at();

-- Enable realtime for updates
ALTER TABLE public.updates REPLICA IDENTITY FULL;
ALTER TABLE public.update_reads REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.update_reads;