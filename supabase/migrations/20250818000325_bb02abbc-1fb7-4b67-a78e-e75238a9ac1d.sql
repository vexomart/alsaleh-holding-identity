-- Create product_orders table for software products purchases
CREATE TABLE public.product_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  product_version TEXT DEFAULT 'V 1.0',
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders" 
ON public.product_orders 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create orders" 
ON public.product_orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all orders" 
ON public.product_orders 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  order_num TEXT;
BEGIN
  -- Get current year last 2 digits
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- Get the next counter for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.product_orders
  WHERE order_number LIKE 'ORD' || year_suffix || '%';
  
  -- Format as ORD + YY + 6-digit counter
  order_num := 'ORD' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN order_num;
END;
$function$;

-- Create trigger for automatic order number generation
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER set_product_order_number
  BEFORE INSERT ON public.product_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_number();

-- Create trigger for updated_at
CREATE TRIGGER update_product_orders_updated_at
  BEFORE UPDATE ON public.product_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();