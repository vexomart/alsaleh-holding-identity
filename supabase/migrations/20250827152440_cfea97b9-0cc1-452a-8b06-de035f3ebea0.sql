-- حذف trigger الذي يسبب المشكلة في wallet deposits
DROP TRIGGER IF EXISTS wallet_deposit_notification_trigger ON wallet_transactions;
DROP FUNCTION IF EXISTS create_wallet_deposit_notification();

-- حذف أي triggers أخرى مشابهة قد تسبب مشاكل
DROP TRIGGER IF EXISTS payment_transaction_notification_trigger ON payment_transactions;
DROP FUNCTION IF EXISTS create_payment_notification();

-- التأكد من عدم وجود triggers مشابهة
DROP TRIGGER IF EXISTS wallet_transaction_notification_trigger ON wallet_transactions;
DROP FUNCTION IF EXISTS create_wallet_transaction_notification();