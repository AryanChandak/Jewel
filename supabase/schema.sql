-- ============================================================
-- Elegance Admin — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Products table ──────────────────────────────────────────
create table if not exists products (
  id           bigserial primary key,
  name         text          not null default '',
  category     text          not null default 'Engagement',
  style        text          not null default 'Solitaire',
  metal        text          not null default 'Gold',
  stone        text          not null default 'Diamond',
  price        integer       not null default 25000,
  description  text          not null default '',
  gender       text          not null default 'Female',
  occasion     text          not null default '',
  personality  text          not null default 'Classic',
  design       text          not null default '',
  budget_range text          not null default '20k-50k',
  size_min     integer       not null default 5,
  size_max     integer       not null default 20,
  images       text[]        not null default '{}',
  in_stock     boolean       not null default true,
  featured     boolean       not null default false,
  is_custom    boolean       not null default false,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

-- ── Category images table ───────────────────────────────────
create table if not exists category_images (
  id           bigserial     primary key,
  category     text          not null,
  url          text          not null,
  storage_path text          not null default '',
  created_at   timestamptz   not null default now()
);

-- ── Auto-update updated_at on products ──────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
alter table products        enable row level security;
alter table category_images enable row level security;

-- Storefront: anyone can read products
create policy "Public read products"
  on products for select to anon using (true);

-- Admin: authenticated users have full access to products
create policy "Auth full access products"
  on products for all to authenticated
  using (true) with check (true);

-- Storefront: anyone can read category images
create policy "Public read category_images"
  on category_images for select to anon using (true);

-- Admin: authenticated users have full access to category images
create policy "Auth full access category_images"
  on category_images for all to authenticated
  using (true) with check (true);

-- ── Storage Buckets (SQL — run this too) ────────────────────
insert into storage.buckets (id, name, public)
  values ('product-images',  'product-images',  true)
  on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
  values ('category-images', 'category-images', true)
  on conflict (id) do update set public = true;

-- ── Storage RLS policies ─────────────────────────────────────

-- product-images: public read
drop policy if exists "Public read product-images"  on storage.objects;
create policy "Public read product-images"
  on storage.objects for select to anon
  using (bucket_id = 'product-images');

-- product-images: authenticated upload / update / delete
drop policy if exists "Auth write product-images"   on storage.objects;
create policy "Auth write product-images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Auth delete product-images"  on storage.objects;
create policy "Auth delete product-images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

-- category-images: public read
drop policy if exists "Public read category-images" on storage.objects;
create policy "Public read category-images"
  on storage.objects for select to anon
  using (bucket_id = 'category-images');

-- category-images: authenticated upload / delete
drop policy if exists "Auth write category-images"  on storage.objects;
create policy "Auth write category-images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'category-images');

drop policy if exists "Auth delete category-images" on storage.objects;
create policy "Auth delete category-images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'category-images');

-- ============================================================
-- Admin User (create manually in Supabase Dashboard)
-- ============================================================
-- Go to: Authentication → Users → Add user → Create new user
--
--   Email:    (your admin email)
--   Password: (your chosen password)
--
-- Then: Authentication → Settings → Email Auth
--       → disable "Enable email confirmations" → Save
-- ============================================================
