-- Update payment methods with bank transfer configuration
UPDATE payment_methods 
SET configuration = jsonb_build_object(
  'company_name', 'شركة علي صالح الشهري القابضة',
  'account_number', '161000010006086071040',
  'iban', 'SA1980000161608016071040',
  'bank_name', 'البنك الأهلي السعودي',
  'requires_receipt', true,
  'processing_time', '24 ساعة'
)
WHERE provider = 'bank_transfer';

-- Update Tamara configuration with proper API settings
UPDATE payment_methods 
SET configuration = jsonb_build_object(
  'min_amount', 100,
  'max_amount', 50000,
  'sandbox_mode', true,
  'api_url', 'https://api-sandbox.tamara.co',
  'currency', 'SAR',
  'country_code', 'SA'
)
WHERE provider = 'tamara';