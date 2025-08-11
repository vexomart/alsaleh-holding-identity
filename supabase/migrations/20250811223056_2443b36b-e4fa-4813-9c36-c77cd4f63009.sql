-- Create public storage bucket for contracts (idempotent)
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', true)
on conflict (id) do nothing;

-- Policies (idempotent via DO blocks)
DO $$ BEGIN
  CREATE POLICY "Public read contracts files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'contracts');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public upload contracts files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'contracts');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public update contracts files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'contracts');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;