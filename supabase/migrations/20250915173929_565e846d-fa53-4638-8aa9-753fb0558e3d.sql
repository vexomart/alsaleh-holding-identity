-- ===== Extensions =====
create extension if not exists citext;

-- ===== Helpers: Normalization =====
create or replace function public.normalize_email(txt text)
returns text language sql immutable as $$
  select lower(trim(txt));
$$;

create or replace function public.normalize_digits(txt text)
returns text language sql immutable as $$
  select translate(coalesce(txt,''),'٠١٢٣٤٥٦٧٨٩','0123456789');
$$;

-- ===== Sites registry =====
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  domain text unique not null,
  created_at timestamptz default now()
);

-- Insert default site
insert into public.sites (id, slug, domain) values
  ('11111111-1111-1111-1111-111111111111','holding','alialshehriholding.com')
on conflict (domain) do nothing;

-- ===== Profiles table (1:1 with auth.users) =====
drop table if exists public.profiles cascade;
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext not null,
  full_name text,
  phone text,
  company text,
  role text not null default 'customer',   -- 'admin','manager','agent','customer'
  site_id uuid not null references public.sites(id) on delete restrict,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Unique index prevents email duplication within same site only
create unique index uniq_profile_email_site
  on public.profiles (normalize_email(email), site_id);

-- Useful indexes
create index idx_profiles_site on public.profiles(site_id);
create index idx_profiles_role on public.profiles(role);

-- Trigger for timestamps
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger trg_profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- ===== RLS Policies =====
alter table public.profiles enable row level security;

-- Owner can see and edit their profile
create policy prof_select_self on public.profiles
for select using (auth.uid() = user_id);

create policy prof_update_self on public.profiles
for update using (auth.uid() = user_id);

-- Site admins can see all users in their site
create policy prof_select_admin on public.profiles
for select using (
  exists (
    select 1 from public.profiles p2
    where p2.user_id = auth.uid()
      and p2.role in ('admin','manager')
      and p2.site_id = profiles.site_id
  )
);

-- Updates by admins within same site
create policy prof_update_admin on public.profiles
for update using (
  exists (
    select 1 from public.profiles p2
    where p2.user_id = auth.uid()
      and p2.role in ('admin','manager')
      and p2.site_id = profiles.site_id
  )
);

-- Insert via trigger with elevated privileges
create policy prof_insert_via_trigger on public.profiles
for insert with check (true);

-- ===== Create profile on auth.users insert =====
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_email text;
  v_full_name text;
  v_phone text;
  v_company text;
  v_site_id uuid;
begin
  -- Read metadata from frontend
  v_email     := coalesce(new.email, (new.raw_user_meta_data->>'email'));
  v_full_name := new.raw_user_meta_data->>'full_name';
  v_phone     := public.normalize_digits(new.raw_user_meta_data->>'phone');
  v_company   := new.raw_user_meta_data->>'company_name';

  -- Try to get site_id directly, or via slug/domain
  if (new.raw_user_meta_data ? 'site_id') then
    v_site_id := (new.raw_user_meta_data->>'site_id')::uuid;
  elsif (new.raw_user_meta_data ? 'site_slug') then
    select id into v_site_id from public.sites where slug = new.raw_user_meta_data->>'site_slug';
  elsif (new.raw_user_meta_data ? 'domain') then
    select id into v_site_id from public.sites where domain = new.raw_user_meta_data->>'domain';
  else
    -- Default to first site if no site specified
    select id into v_site_id from public.sites limit 1;
  end if;

  if v_site_id is null then
    raise exception 'site_id is required on signup';
  end if;

  insert into public.profiles(user_id, email, full_name, phone, company, site_id)
  values (new.id, v_email, v_full_name, v_phone, v_company, v_site_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();