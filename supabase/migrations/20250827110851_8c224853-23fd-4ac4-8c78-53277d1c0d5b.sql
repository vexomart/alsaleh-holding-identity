-- Create wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES public.customer_wallets(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment', 'refund', 'transfer')),
  amount NUMERIC NOT NULL CHECK (amount != 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT NOT NULL,
  reference_id TEXT, -- For external payment references
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet transactions
CREATE POLICY "Users can view their own wallet transactions"
ON public.wallet_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet transactions"
ON public.wallet_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id AND amount != 0);

CREATE POLICY "Admins can manage all wallet transactions"
ON public.wallet_transactions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update wallet balance after transaction
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update balance for completed transactions
  IF NEW.status = 'completed' THEN
    -- Update the wallet balance
    UPDATE public.customer_wallets
    SET 
      balance = balance + NEW.amount,
      updated_at = now()
    WHERE user_id = NEW.user_id;
    
    -- Create wallet if it doesn't exist
    INSERT INTO public.customer_wallets (user_id, balance, currency)
    VALUES (NEW.user_id, NEW.amount, NEW.currency)
    ON CONFLICT (user_id) DO UPDATE SET
      balance = customer_wallets.balance + NEW.amount,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update wallet balance
CREATE TRIGGER update_wallet_balance_trigger
  AFTER INSERT ON public.wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_balance();

-- Create function to handle wallet balance adjustment on transaction update
CREATE OR REPLACE FUNCTION handle_wallet_transaction_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed from completed to something else, reverse the transaction
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE public.customer_wallets
    SET 
      balance = balance - OLD.amount,
      updated_at = now()
    WHERE user_id = OLD.user_id;
  END IF;
  
  -- If status changed to completed from something else, apply the transaction
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    UPDATE public.customer_wallets
    SET 
      balance = balance + NEW.amount,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for transaction updates
CREATE TRIGGER handle_wallet_transaction_update_trigger
  AFTER UPDATE ON public.wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_wallet_transaction_update();

-- Add updated_at trigger
CREATE TRIGGER update_wallet_transactions_updated_at
  BEFORE UPDATE ON public.wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION _update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_transactions_type ON public.wallet_transactions(transaction_type);

-- Add unique constraint to customer_wallets if not exists
ALTER TABLE public.customer_wallets 
ADD CONSTRAINT customer_wallets_user_id_unique UNIQUE (user_id);