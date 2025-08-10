-- Fix security warnings by adding SECURITY DEFINER SET search_path to new functions

-- Update generate_client_id function
CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
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
$$;

-- Update set_client_id function
CREATE OR REPLACE FUNCTION public.set_client_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    IF NEW.client_id IS NULL THEN
        NEW.client_id := public.generate_client_id();
    END IF;
    RETURN NEW;
END;
$$;

-- Update generate_ticket_number function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
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
$$;

-- Update set_ticket_number function
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := public.generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$;