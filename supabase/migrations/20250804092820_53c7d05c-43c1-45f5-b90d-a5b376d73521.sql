-- Create contracts table for unified contract system
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT NOT NULL UNIQUE,
  client_type TEXT NOT NULL CHECK (client_type IN ('individual', 'company', 'institution')),
  
  -- Client Information
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_address TEXT,
  client_city TEXT,
  national_id TEXT,
  commercial_register TEXT,
  
  -- NAFATH Integration
  nafath_verified BOOLEAN DEFAULT FALSE,
  nafath_session_id TEXT,
  nafath_verification_date TIMESTAMP WITH TIME ZONE,
  
  -- Service Details
  service_type TEXT NOT NULL,
  service_description TEXT,
  service_price DECIMAL(10,2) NOT NULL,
  service_duration INTEGER, -- in days
  
  -- Contract Terms
  contract_terms TEXT NOT NULL,
  special_conditions TEXT,
  payment_terms TEXT,
  
  -- Status and Workflow
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_client_approval', 'pending_company_approval', 'approved', 'signed', 'active', 'completed', 'cancelled')),
  client_approved_at TIMESTAMP WITH TIME ZONE,
  company_approved_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  
  -- File Management
  contract_pdf_url TEXT,
  client_signature_url TEXT,
  company_signature_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Clients can view their own contracts" 
ON public.contracts 
FOR SELECT 
USING (client_email = auth.jwt() ->> 'email');

CREATE POLICY "Anyone can create contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Clients can update their pending contracts" 
ON public.contracts 
FOR UPDATE 
USING (client_email = auth.jwt() ->> 'email' AND status IN ('draft', 'pending_client_approval'));

-- Create function to generate contract numbers
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TEXT AS $$
DECLARE
  year_str TEXT;
  sequence_num INTEGER;
  contract_num TEXT;
BEGIN
  year_str := EXTRACT(YEAR FROM now())::TEXT;
  
  -- Get next sequence number for the year
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM '\d{4}-(\d+)') AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.contracts
  WHERE contract_number LIKE year_str || '-%';
  
  contract_num := year_str || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN contract_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate contract number
CREATE OR REPLACE FUNCTION set_contract_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := generate_contract_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_contract_number
  BEFORE INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION set_contract_number();

-- Create trigger for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();