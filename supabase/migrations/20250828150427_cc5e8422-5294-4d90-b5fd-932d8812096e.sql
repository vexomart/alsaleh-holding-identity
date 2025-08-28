-- إضافة Tap Now كطريقة دفع جديدة إذا لم تكن موجودة
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.payment_methods WHERE provider = 'tap_now') THEN
    INSERT INTO public.payment_methods (
      name,
      name_ar,
      provider,
      icon_name,
      is_active,
      is_live_mode,
      configuration
    ) VALUES (
      'Tap Now',
      'تاب الان',
      'tap_now',
      'CreditCard',
      true,
      false,
      jsonb_build_object(
        'currencies', ARRAY['SAR', 'USD', 'AED', 'KWD'],
        'payment_types', ARRAY['card', 'wallet', 'bnpl'],
        'supported_cards', ARRAY['visa', 'mastercard', 'mada', 'american_express'],
        'supported_wallets', ARRAY['apple_pay', 'google_pay', 'samsung_pay', 'stc_pay'],
        'min_amount', 1,
        'max_amount', 50000,
        'description', 'ادفع بسهولة باستخدام تاب الان - دعم للبطاقات والمحافظ الرقمية',
        'processing_fee_percentage', 2.75,
        'fixed_fee', 0,
        'settlement_days', 1,
        'features', ARRAY['instant_payment', 'refunds', 'webhooks', 'recurring_payments']
      )
    );
  END IF;
END $$;