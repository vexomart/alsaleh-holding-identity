-- Create contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT NOT NULL UNIQUE,
  client_type TEXT NOT NULL CHECK (client_type IN ('individual', 'institution', 'company')),
  
  -- Client Information
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_id_number TEXT,
  client_address TEXT,
  
  -- Institution/Company specific fields
  commercial_register TEXT,
  tax_number TEXT,
  authorized_person TEXT,
  
  -- Service Details
  service_type TEXT NOT NULL,
  service_description TEXT,
  service_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  
  -- Contract Terms
  contract_duration TEXT,
  start_date DATE,
  end_date DATE,
  payment_terms TEXT,
  
  -- Status and Approval
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'signed', 'active', 'completed', 'cancelled')),
  client_approved BOOLEAN DEFAULT FALSE,
  client_approved_at TIMESTAMP WITH TIME ZONE,
  company_approved BOOLEAN DEFAULT FALSE,
  company_approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Nafath Integration
  nafath_request_id TEXT,
  nafath_verified BOOLEAN DEFAULT FALSE,
  nafath_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Contract Document
  contract_pdf_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own contracts" 
ON public.contracts 
FOR SELECT 
USING (true); -- For now, allow viewing all contracts (can be restricted later)

CREATE POLICY "Anyone can create contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own contracts" 
ON public.contracts 
FOR UPDATE 
USING (true); -- For now, allow updating all contracts (can be restricted later)

-- Create function to generate contract number
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  contract_num TEXT;
BEGIN
  -- Get current year last 2 digits
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- Get the next counter for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 5 FOR 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.contracts
  WHERE contract_number LIKE 'C' || year_suffix || '%';
  
  -- Format as C + YY + 4-digit counter
  contract_num := 'C' || year_suffix || LPAD(counter::TEXT, 4, '0');
  
  RETURN contract_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate contract number
CREATE OR REPLACE FUNCTION public.set_contract_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := public.generate_contract_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_contract_number_trigger
  BEFORE INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_contract_number();

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();