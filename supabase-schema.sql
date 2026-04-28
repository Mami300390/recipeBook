create extension if not exists "pgcrypto";

do $$
begin
  create type recipe_visibility as enum ('public', 'private');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type recipe_difficulty as enum ('Easy', 'Medium', 'Hard');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.profiles
set display_name = coalesce(display_name, 'Cook')
where display_name is null;

alter table public.profiles
  alter column display_name set not null;

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  photo_url text not null default '',
  servings integer not null default 4 check (servings > 0),
  prep_time integer not null default 0 check (prep_time >= 0),
  cook_time integer not null default 0 check (cook_time >= 0),
  difficulty recipe_difficulty not null default 'Easy',
  cuisine text not null default 'Home',
  dietary text[] not null default '{}',
  ingredients jsonb not null default '[]'::jsonb,
  steps text[] not null default '{}',
  notes text not null default '',
  visibility recipe_visibility not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists recipes_touch_updated_at on public.recipes;
create trigger recipes_touch_updated_at
before update on public.recipes
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, full_name, email, avatar_url)
  values (
    new.id,
    split_part(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Cook'), ' ', 1),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Cook'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    full_name = excluded.full_name,
    email = excluded.email,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "Profiles are readable by authenticated users" on public.profiles;
create policy "Profiles are readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users insert their own profile" on public.profiles;
create policy "Users insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Owners and public recipes are readable" on public.recipes;
create policy "Owners and public recipes are readable"
on public.recipes for select
to authenticated
using (owner_id = auth.uid() or visibility = 'public');

drop policy if exists "Users insert their own recipes" on public.recipes;
create policy "Users insert their own recipes"
on public.recipes for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Users update their own recipes" on public.recipes;
create policy "Users update their own recipes"
on public.recipes for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Users delete their own recipes" on public.recipes;
create policy "Users delete their own recipes"
on public.recipes for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Users read their own favorites" on public.favorites;
create policy "Users read their own favorites"
on public.favorites for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users add their own favorites" on public.favorites;
create policy "Users add their own favorites"
on public.favorites for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users remove their own favorites" on public.favorites;
create policy "Users remove their own favorites"
on public.favorites for delete
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('recipe-photos', 'recipe-photos', true)
on conflict (id) do nothing;

drop policy if exists "Recipe photos are public" on storage.objects;
create policy "Recipe photos are public"
on storage.objects for select
using (bucket_id = 'recipe-photos');

drop policy if exists "Users upload to their own recipe photo folder" on storage.objects;
create policy "Users upload to their own recipe photo folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'recipe-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update their own recipe photo folder" on storage.objects;
create policy "Users update their own recipe photo folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'recipe-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'recipe-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
