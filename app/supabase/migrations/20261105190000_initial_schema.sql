create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'bureau'
    check (role in ('super_admin', 'bureau')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_profile text,
  photo_couple text,
  birth_date date,
  marriage_date date,
  phone text not null,
  category text not null default 'Filleul',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint members_has_anniversary
    check (birth_date is not null or marriage_date is not null)
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles (id) on delete set null,
  type text not null check (type in ('email', 'push', 'whatsapp')),
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed')),
  message text not null,
  created_at timestamptz not null default now()
);

create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('birth', 'marriage')),
  title text not null,
  content text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index message_templates_one_default_per_type
  on public.message_templates (type)
  where is_default;

create table public.poster_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  layout_type text not null,
  asset_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_reminders (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  reminder_type text not null check (reminder_type in ('birth', 'marriage')),
  reminder_date date not null,
  status text not null default 'pending'
    check (status in ('pending', 'prepared', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  constraint event_reminders_unique_event
    unique (member_id, reminder_type, reminder_date)
);

create index members_full_name_idx on public.members (full_name);
create index members_birth_date_idx on public.members (birth_date);
create index members_marriage_date_idx on public.members (marriage_date);
create index event_reminders_date_idx on public.event_reminders (reminder_date);
create index notification_logs_scheduled_at_idx
  on public.notification_logs (scheduled_at);

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger members_set_updated_at
  before update on public.members
  for each row execute procedure public.set_updated_at();

create trigger message_templates_set_updated_at
  before update on public.message_templates
  for each row execute procedure public.set_updated_at();

create trigger poster_templates_set_updated_at
  before update on public.poster_templates
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.notification_logs enable row level security;
alter table public.message_templates enable row level security;
alter table public.poster_templates enable row level security;
alter table public.event_reminders enable row level security;

grant select on public.profiles to authenticated;
grant update (full_name, role) on public.profiles to authenticated;
grant select, insert, update, delete on public.members to authenticated;
grant select, insert, update, delete on public.notification_logs to authenticated;
grant select, insert, update, delete on public.message_templates to authenticated;
grant select, insert, update, delete on public.poster_templates to authenticated;
grant select, insert, update, delete on public.event_reminders to authenticated;

create policy "Users read their profile; admins read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_super_admin()));

create policy "Only admins update profiles"
  on public.profiles for update to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

create policy "Authenticated users read members"
  on public.members for select to authenticated
  using (true);

create policy "Admins manage members"
  on public.members for all to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

create policy "Authenticated users read notification logs"
  on public.notification_logs for select to authenticated
  using (true);

create policy "Admins manage notification logs"
  on public.notification_logs for all to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

create policy "Authenticated users read message templates"
  on public.message_templates for select to authenticated
  using (true);

create policy "Admins manage message templates"
  on public.message_templates for all to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

create policy "Authenticated users read poster templates"
  on public.poster_templates for select to authenticated
  using (true);

create policy "Admins manage poster templates"
  on public.poster_templates for all to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

create policy "Authenticated users read event reminders"
  on public.event_reminders for select to authenticated
  using (true);

create policy "Admins manage event reminders"
  on public.event_reminders for all to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));
