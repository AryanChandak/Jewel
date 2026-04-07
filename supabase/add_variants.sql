
-- Run this in Supabase Dashboard → SQL Editor:

-- Add slug column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug text DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products(slug) WHERE slug != '';

-- Create variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id            bigserial PRIMARY KEY,
  product_id    bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id    text NOT NULL,
  title         text NOT NULL DEFAULT '',
  metal_karat   text NOT NULL DEFAULT '',
  diamond_type  text NOT NULL DEFAULT '',
  price_inr     numeric(10,2) NOT NULL DEFAULT 0,
  compare_price numeric(10,2),
  sku           text NOT NULL DEFAULT '',
  available     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS variants_product_id_idx ON product_variants(product_id);

-- RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read variants"
  ON product_variants FOR SELECT TO anon USING (true);

CREATE POLICY "Auth full access variants"
  ON product_variants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
