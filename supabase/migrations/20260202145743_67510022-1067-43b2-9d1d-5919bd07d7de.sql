-- Allow customers to create finance contracts for their own applications
CREATE POLICY "Customers can create contracts for their applications"
ON public.finance_contracts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM finance_applications fa
    JOIN entities e ON fa.entity_id = e.id
    WHERE fa.id = application_id
    AND e.owner_user_id = auth.uid()
  )
);

-- Allow customers to view their own contracts
CREATE POLICY "Customers can view their own contracts"
ON public.finance_contracts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM finance_applications fa
    JOIN entities e ON fa.entity_id = e.id
    WHERE fa.id = application_id
    AND e.owner_user_id = auth.uid()
  )
);

-- Allow customers to update their own contracts (for signing)
CREATE POLICY "Customers can sign their own contracts"
ON public.finance_contracts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM finance_applications fa
    JOIN entities e ON fa.entity_id = e.id
    WHERE fa.id = application_id
    AND e.owner_user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM finance_applications fa
    JOIN entities e ON fa.entity_id = e.id
    WHERE fa.id = application_id
    AND e.owner_user_id = auth.uid()
  )
);