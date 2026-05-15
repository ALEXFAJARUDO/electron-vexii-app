-- Vexii Smart Charger - Supabase Schema

create table stores (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  address     text,
  phone       text,
  hours       text,
  logo_url    text,
  lat         double precision,
  lng         double precision,
  created_at  timestamptz default now()
);

create table chargers (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid not null references stores(id) on delete cascade,
  label      text not null,
  status     text not null default 'available' check (status in ('available','in_use','offline')),
  created_at timestamptz default now()
);

create table ads (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references stores(id) on delete cascade,
  title       text not null,
  image_url   text,
  link_url    text,
  sort_order  int default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

create table coupons (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references stores(id) on delete cascade,
  title       text not null,
  description text,
  discount    text not null,
  code        text not null,
  expires_at  timestamptz,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table stores  enable row level security;
alter table chargers enable row level security;
alter table ads     enable row level security;
alter table coupons enable row level security;

-- Public read access
create policy "public read stores"  on stores  for select using (true);
create policy "public read chargers" on chargers for select using (true);
create policy "public read ads"     on ads     for select using (active = true);
create policy "public read coupons" on coupons for select using (active = true);

-- Sample data
insert into stores (id, name, description, address, phone, hours) values
  ('00000000-0000-0000-0000-000000000001', 'Demo Cafe', '居心地の良いカフェです', '東京都渋谷区道玄坂1-1-1', '03-1234-5678', '8:00〜22:00');

insert into chargers (id, store_id, label, status) values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'テーブルA-1', 'available');

insert into coupons (store_id, title, description, discount, code, expires_at) values
  ('00000000-0000-0000-0000-000000000001', 'ドリンク10%OFF', '充電中にご利用いただけるクーポンです', '10% OFF', 'VEXII10', now() + interval '30 days');
