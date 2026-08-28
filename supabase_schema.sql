-- Updated Supabase SQL Schema for YOVA (Production Ready)

-- Clean up existing tables
drop table if exists public.invitation_revisions cascade;
drop table if exists public.invitation_rsvps cascade;
drop table if exists public.invitation_guests cascade;
drop table if exists public.rentals cascade;
drop table if exists public.invitation_projects cascade;
drop table if exists public.dresses cascade;

-- 1. Dresses Table (Inventory)
create table public.dresses (
  id uuid primary key default uuid_generate_v4(),
  collection_code text unique not null,
  name text not null,
  category text check (category in ('Wanita', 'Pria', 'Couple')) default 'Wanita',
  description text,
  status text check (status in ('available', 'booked', 'rented', 'maintenance')) default 'available',
  price decimal not null default 0,
  deposit decimal not null default 150000,
  size text,
  images text[] default '{}',
  included_items text[] default '{}',
  measurements jsonb default '{}',
  colors text[] default '{}',
  resize_available boolean default true,
  fit_notes text,
  recommended_height text,
  estimated_available timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects Table
create table public.invitation_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  template_id text not null,
  slug text unique not null,
  title text not null,
  status text check (status in ('draft', 'published')) default 'draft',
  data jsonb not null default '{}',
  is_active boolean default false,
  voucher_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Guests Table
create table public.invitation_guests (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.invitation_projects(id) on delete cascade not null,
  name text not null,
  whatsapp text,
  category text default 'Friend',
  guest_count integer default 2,
  status text check (status in ('invited', 'sent', 'opened')) default 'invited',
  rsvp_status text check (rsvp_status in ('pending', 'attending', 'not_attending', 'maybe')) default 'pending',
  slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RSVP Responses Table
create table public.invitation_rsvps (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.invitation_projects(id) on delete cascade not null,
  guest_id uuid references public.invitation_guests(id) on delete set null,
  name text not null,
  attendance text not null,
  guests integer default 1,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Revisions Table
create table public.invitation_revisions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.invitation_projects(id) on delete cascade not null,
  version text not null,
  note text,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Rentals / Fitting Table
create table public.rentals (
  id uuid primary key default uuid_generate_v4(),
  booking_id text unique not null,
  customer_name text not null,
  whatsapp text not null,
  event_date date not null,
  dress_code text references public.dresses(collection_code),
  fitting_date date,
  fitting_time text,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  completed_steps text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. RLS Policies
alter table public.invitation_projects enable row level security;
alter table public.invitation_guests enable row level security;
alter table public.invitation_rsvps enable row level security;
alter table public.invitation_revisions enable row level security;
alter table public.dresses enable row level security;
alter table public.rentals enable row level security;

create policy "Projects owners manage" on public.invitation_projects for all using (auth.uid() = user_id);
create policy "Projects public read" on public.invitation_projects for select using (true);
create policy "Guests owners manage" on public.invitation_guests for all using (exists (select 1 from public.invitation_projects where id = invitation_guests.project_id and user_id = auth.uid()));
create policy "Guests public read" on public.invitation_guests for select using (true);
create policy "RSVP insert" on public.invitation_rsvps for insert with check (true);
create policy "RSVP owner read" on public.invitation_rsvps for select using (exists (select 1 from public.invitation_projects where id = invitation_rsvps.project_id and user_id = auth.uid()));
create policy "Revisions manage" on public.invitation_revisions for all using (exists (select 1 from public.invitation_projects where id = invitation_revisions.project_id and user_id = auth.uid()));
create policy "Dresses public read" on public.dresses for select using (true);
create policy "Dresses admin manage" on public.dresses for all using (true); -- Set to admin check in real prod
create policy "Rentals insert" on public.rentals for insert with check (true);
create policy "Rentals read" on public.rentals for select using (true);

-- 8. Seed Data (Restore Original Collection)
insert into public.dresses (id, collection_code, name, category, status, price, deposit, size, images, included_items, measurements)
values
('60779776-9694-4d87-8461-419741497674', 'PR-01', 'Baju Akad Wanita Classic', 'Wanita', 'available', 500000, 150000, 'All Size',
  array['https://images.unsplash.com/photo-1771808022279-cf15a2a9eaca?w=800&h=1000&fit=crop&auto=format'],
  array['Dress', 'Veil', 'Bros', 'Garment Bag'], '{"lingkarDada": "88 cm", "lebarBahu": "38 cm", "panjangBaju": "145 cm"}'),

('d2f0d4b1-91a1-460d-8877-37750942811e', 'PR-02', 'Baju Akad Wanita Songket', 'Wanita', 'available', 600000, 150000, 'All Size',
  array['https://images.unsplash.com/photo-1650377509428-11e7fe8614a9?w=800&h=1000&fit=crop&auto=format'],
  array['Dress', 'Veil', 'Songket', 'Bros', 'Garment Bag'], '{"lingkarDada": "90 cm", "panjangBaju": "148 cm"}'),

('a1b2c3d4-e5f6-4a5b-8c9d-165037750945', 'PR-03', 'Baju Akad Pria Classic', 'Pria', 'available', 400000, 150000, 'L',
  array['https://images.unsplash.com/photo-1650377509454-1bbd8392e122?w=800&h=1000&fit=crop&auto=format'],
  array['Kemeja Akad', 'Peci', 'Garment Bag'], '{"lebarBahu": "44 cm", "panjangBaju": "72 cm"}'),

('b2c3d4e5-f6a7-4b6c-9d8e-177961902369', 'PR-04', 'Paket Couple Akad', 'Couple', 'available', 850000, 150000, 'Custom',
  array['https://images.unsplash.com/photo-1779619023694-be6bfdd18290?w=800&h=1000&fit=crop&auto=format'],
  array['Dress Wanita', 'Baju Pria', 'Veil', 'Peci', 'Bros'], '{"tinggiBadan": "Wanita 155-168cm"}');
