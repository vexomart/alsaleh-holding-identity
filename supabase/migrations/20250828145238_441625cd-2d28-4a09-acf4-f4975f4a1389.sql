-- Update payment methods data with correct information
UPDATE public.payment_methods 
SET configuration = '{
  "supported_cards": ["visa", "mastercard", "mada"],
  "supported_wallets": ["apple_pay", "stc_pay"],
  "currencies": ["SAR"],
  "min_amount": 1,
  "max_amount": 50000,
  "description": "دفع آمن بالفيزا ومدى وApple Pay عبر بوابة تاب"
}'
WHERE provider = 'tabby';

UPDATE public.payment_methods 
SET configuration = '{
  "payment_types": ["pay_in_3", "pay_in_4", "pay_next_month"],
  "currencies": ["SAR"],
  "min_amount": 100,
  "max_amount": 10000,
  "installments": [3, 4],
  "description": "اشتري الآن وادفع لاحقاً بأقساط مريحة عبر تمارا"
}'
WHERE provider = 'tamara';