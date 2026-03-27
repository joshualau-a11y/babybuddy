-- BabyBuddy – Supabase Schema
-- Im Supabase SQL-Editor ausführen: https://app.supabase.com → SQL Editor

-- 1. Profiles (erweitert Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text check (role in ('parent', 'sitter')) not null,
  avatar_url text,
  bio text,
  location text,
  hourly_rate numeric,
  years_experience int,
  certifications text[],
  rating numeric default 0,
  review_count int default 0,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Profiles viewable by all" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. Verfügbarkeitsslots
create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  sitter_id uuid references profiles(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  is_booked boolean default false,
  created_at timestamptz default now()
);

alter table availability enable row level security;
create policy "Availability viewable by all" on availability for select using (true);
create policy "Sitters manage own availability" on availability for all using (auth.uid() = sitter_id);

-- 3. Buchungen
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references profiles(id) on delete cascade,
  sitter_id uuid references profiles(id) on delete cascade,
  availability_id uuid references availability(id),
  status text check (status in ('pending','confirmed','cancelled','completed')) default 'pending',
  child_count int default 1,
  message text,
  created_at timestamptz default now()
);

alter table bookings enable row level security;
create policy "Parents see own bookings" on bookings for select using (auth.uid() = parent_id);
create policy "Sitters see own bookings" on bookings for select using (auth.uid() = sitter_id);
create policy "Parents create bookings" on bookings for insert with check (auth.uid() = parent_id);
create policy "Parties update bookings" on bookings for update using (auth.uid() in (parent_id, sitter_id));

-- 4. Gespräche (Conversations)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references profiles(id) on delete cascade,
  sitter_id uuid references profiles(id) on delete cascade,
  last_message text,
  updated_at timestamptz default now(),
  unique(parent_id, sitter_id)
);

alter table conversations enable row level security;
create policy "Participants view conversations" on conversations
  for select using (auth.uid() in (parent_id, sitter_id));
create policy "Participants create conversations" on conversations
  for insert with check (auth.uid() in (parent_id, sitter_id));

-- 5. Nachrichten
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Participants view messages" on messages for select
  using (exists (
    select 1 from conversations c
    where c.id = conversation_id
    and auth.uid() in (c.parent_id, c.sitter_id)
  ));
create policy "Participants send messages" on messages for insert
  with check (auth.uid() = sender_id);

-- Realtime für Chat aktivieren
alter publication supabase_realtime add table messages;

-- 6. Bewertungen
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  reviewer_id uuid references profiles(id),
  reviewee_id uuid references profiles(id),
  rating int check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now(),
  unique(booking_id, reviewer_id)
);

alter table reviews enable row level security;
create policy "Reviews viewable by all" on reviews for select using (true);
create policy "Reviewers create reviews" on reviews for insert
  with check (auth.uid() = reviewer_id);

-- Trigger: Durchschnittsbewertung aktualisieren
create or replace function update_sitter_rating()
returns trigger as $$
begin
  update profiles set
    rating = (select avg(rating) from reviews where reviewee_id = new.reviewee_id),
    review_count = (select count(*) from reviews where reviewee_id = new.reviewee_id)
  where id = new.reviewee_id;
  return new;
end;
$$ language plpgsql;

create trigger after_review_insert
  after insert on reviews
  for each row execute function update_sitter_rating();
