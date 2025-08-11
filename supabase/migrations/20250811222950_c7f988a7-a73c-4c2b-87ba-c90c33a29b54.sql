-- Create public storage bucket for contracts (if not exists)
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', true)
on conflict (id) do nothing;

-- Allow public read access to contracts bucket
create policy if not exists "Public read contracts files"
on storage.objects for select
using (bucket_id = 'contracts');

-- Allow public upload to contracts bucket (used by client after payment)
create policy if not exists "Public upload contracts files"
on storage.objects for insert
with check (bucket_id = 'contracts');

-- Allow public update (overwrite) for contracts bucket
create policy if not exists "Public update contracts files"
on storage.objects for update
using (bucket_id = 'contracts');