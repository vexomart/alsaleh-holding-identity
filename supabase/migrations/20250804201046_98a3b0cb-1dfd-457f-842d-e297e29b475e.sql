-- Update domain prices with 10 USD markup (approximately 37.5 SAR at current rate)
UPDATE public.domain_prices SET 
  price = CASE extension
    WHEN '.com' THEN 87.50      -- was 50, now 50 + 37.5
    WHEN '.net' THEN 82.50      -- was 45, now 45 + 37.5
    WHEN '.org' THEN 77.50      -- was 40, now 40 + 37.5
    WHEN '.info' THEN 72.50     -- was 35, now 35 + 37.5
    WHEN '.sa' THEN 187.50      -- was 150, now 150 + 37.5
    WHEN '.com.sa' THEN 157.50  -- was 120, now 120 + 37.5
    WHEN '.biz' THEN 67.50      -- was 30, now 30 + 37.5
    WHEN '.me' THEN 92.50       -- was 55, now 55 + 37.5
    WHEN '.co' THEN 97.50       -- was 60, now 60 + 37.5
    WHEN '.io' THEN 117.50      -- was 80, now 80 + 37.5
    ELSE price + 37.50
  END;