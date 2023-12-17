-- Please edit the YOUR_PROJECT_REF on line 15, and set it to your Supabase project's reference.
-- The project ref is available in your project's General Settings as `Reference ID`.
-- Click https://supabase.com/dashboard/project/_/settings/general to go there.
-- After you've changed the value on line 15, delete the code on line 9 to stop raising an error.

-----------------------------
-- get_project_ref() function
-----------------------------

DO $$ BEGIN RAISE EXCEPTION 'Please edit the `sql/0000_init.sql` file and set the value of your supabase project reference in the `get_project_ref` function.'; END $$;

CREATE OR REPLACE FUNCTION get_project_ref()
RETURNS VARCHAR AS
$$
BEGIN
  RETURN 'YOUR_PROJECT_REF';
END;
$$
LANGUAGE plpgsql;

-----------------
-- Profiles Table
-----------------

BEGIN;

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  avatar_url text not null,
  website text,

  constraint username_length check (char_length(username) >= 3),
  constraint avatar_url_check check (avatar_url like 'https://gravatar.com/avatar/%' OR avatar_url like 'https://' || get_project_ref() || '.supabase.co/storage/v1/public/avatars/%')
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', substring(new.email, 1, position('@' in new.email) - 1)), 'https://gravatar.com/avatar/' || md5(new.email) || '.jpg?d=' || coalesce(new.raw_user_meta_data->>'avatar_url', 'https%3A%2F%2Fapi.dicebear.com%2F7.x%2Finitials%2Fsvg%3Fseed%3D' || new.email || '%26backgroundType%3DgradientLinear'));
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'Avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Enable realtime
alter publication supabase_realtime add table profiles;

COMMIT;

---------
-- Stages
---------

BEGIN;
-- Create table
create table stages (
  id text not null,
  name text not null,
  description text null,
  invite_only boolean not null default false,
  created_at timestamp with time zone not null default now(),
  owner_id uuid not null default auth.uid(),
  constraint stages_pkey primary key (id),
  constraint stages_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
);

-- Enable realtime
alter publication supabase_realtime add table stages;

-- Enable RLS
alter table stages enable row level security;

create policy "Everyone can read all stages." on stages for select to public using (true);

create policy "Owners can insert their own stages." on stages for insert to authenticated with check (owner_id = auth.uid());

create policy "Owners can update their own stages." on stages for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Owners can delete their own stages." on stages for delete to authenticated using (owner_id = auth.uid());

COMMIT;

----------------
-- Stage invites
----------------

BEGIN;

create table stage_invites (
  id bigint generated by default as identity,
  from_id uuid not null default auth.uid(),
  to_id uuid not null,
  stage_id text not null,
  acknowledged boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint stage_invites_pkey primary key (id),
  constraint stage_invites_id_key unique (id),
  constraint stage_invites_from_id_fkey foreign key (from_id) references auth.users (id) on update cascade on delete cascade,
  constraint stage_invites_stage_id_fkey foreign key (stage_id) references stages (id) on update cascade on delete cascade,
  constraint stage_invites_to_id_fkey foreign key (to_id) references auth.users (id) on update cascade on delete cascade
);

-- Enable realtime
alter publication supabase_realtime add table stage_invites;
alter table stage_invites replica identity full;

-- Enable RLS
alter table stage_invites enable row level security;

create policy "Allow users to read their own invites." on stage_invites for select to authenticated using ( from_id = auth.uid() or to_id = auth.uid() );

create policy "Allow users to create non-acknowledged invites." on stage_invites for insert to authenticated with check (from_id = auth.uid() AND acknowledged = false);

create policy "Allow users to acknowledge their invites." on stage_invites for update to authenticated using (to_id = auth.uid()) with check (to_id = auth.uid());

create policy "Allow users to delete invites." on stage_invites for delete to authenticated using ( from_id = auth.uid() or to_id = auth.uid() );

-- Make sure that the user can't change the from_id
create or replace function check_from_id () returns trigger as $$
begin
  if auth.role() = 'anon' or auth.role() = 'authenticated' then
    if new.from_id <> old.from_id then
      raise exception 'from_id must be the same as the previous from_id';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger check_from_id_trigger before update on stage_invites for each row execute function check_from_id ();

COMMIT;

----------------
-- Join requests
----------------

BEGIN;

create table join_requests (
  id bigint generated by default as identity,
  stage_id text not null,
  from_id uuid not null default auth.uid(),
  created_at timestamp with time zone not null default now(),
  constraint join_requests_pkey primary key (id),
  constraint join_requests_from_id_fkey foreign key (from_id) references auth.users (id) on update cascade on delete cascade,
  constraint join_requests_stage_id_fkey foreign key (stage_id) references stages (id) on update cascade on delete cascade
);

-- Enable realtime
alter publication supabase_realtime add table join_requests;
alter table join_requests replica identity full;

-- Enable RLS
alter table join_requests enable row level security;

create policy "Allow authenticated to read join requests." on public.join_requests for select to authenticated using (true);

create policy "Allow authenticated to create join requests." on public.join_requests for insert to authenticated with check (from_id = auth.uid());

create policy "Allow relevant users to delete." on public.join_requests for delete using ( auth.uid () = ( select owner_id from public.stages where id = stage_id) or auth.uid () = from_id);

COMMIT;

