
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Anyone can view roles" on public.user_roles for select using (true);
create policy "Admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  university text,
  field_of_study text,
  year_of_study text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Fields
create table public.fields (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz not null default now()
);
alter table public.fields enable row level security;
create policy "Fields readable by all" on public.fields for select using (true);
create policy "Admins manage fields" on public.fields for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Sites
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  field_id uuid references public.fields(id) on delete cascade not null,
  name text not null,
  url text not null,
  description text,
  category text,
  region text,
  is_free boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.sites enable row level security;
create policy "Sites readable by all" on public.sites for select using (true);
create policy "Admins manage sites" on public.sites for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger sites_touch before update on public.sites for each row execute function public.touch_updated_at();

-- Favorites
create table public.favorites (
  user_id uuid references auth.users(id) on delete cascade not null,
  site_id uuid references public.sites(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, site_id)
);
alter table public.favorites enable row level security;
create policy "Users view own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Users add favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users remove favorites" on public.favorites for delete using (auth.uid() = user_id);

-- Seed fields
insert into public.fields (name, slug, description, icon) values
  ('Computer Science', 'computer-science', 'Software, AI, data, and tech internships', '💻'),
  ('Engineering', 'engineering', 'Mechanical, electrical, civil, chemical roles', '⚙️'),
  ('Business & Finance', 'business', 'Banking, consulting, marketing, analytics', '📈'),
  ('Medicine & Health', 'medicine', 'Clinical, research, public health placements', '🩺'),
  ('Design & Arts', 'design', 'UX, graphic, product, and creative roles', '🎨'),
  ('Law', 'law', 'Legal internships, clerkships, fellowships', '⚖️'),
  ('Sciences', 'sciences', 'Biology, chemistry, physics research opportunities', '🔬'),
  ('Education', 'education', 'Teaching, research, and education programs', '📚');

-- Seed sites
insert into public.sites (field_id, name, url, description, category, region, is_free) values
  ((select id from public.fields where slug='computer-science'), 'GitHub Jobs / Trending', 'https://github.com/trending', 'Discover open-source projects and contributors', 'community', 'Global', true),
  ((select id from public.fields where slug='computer-science'), 'AngelList Talent', 'https://wellfound.com', 'Startup jobs and internships in tech', 'job-board', 'Global', true),
  ((select id from public.fields where slug='computer-science'), 'Outreachy', 'https://www.outreachy.org', 'Paid open-source internships for students', 'internship', 'Global', true),
  ((select id from public.fields where slug='engineering'), 'EngineerJobs', 'https://www.engineerjobs.com', 'Engineering-focused job listings', 'job-board', 'US/EU', true),
  ((select id from public.fields where slug='engineering'), 'IAESTE', 'https://iaeste.org', 'International technical internships for students', 'internship', 'Global', true),
  ((select id from public.fields where slug='business'), 'Vault', 'https://www.vault.com', 'Internship rankings and company reviews', 'research', 'US', true),
  ((select id from public.fields where slug='business'), 'eFinancialCareers', 'https://www.efinancialcareers.com', 'Finance and banking internships globally', 'job-board', 'Global', true),
  ((select id from public.fields where slug='medicine'), 'AAMC Careers', 'https://careers.aamc.org', 'Medical student opportunities and residencies', 'job-board', 'US', true),
  ((select id from public.fields where slug='medicine'), 'Work the World', 'https://www.worktheworld.com', 'International medical electives and placements', 'placement', 'Global', false),
  ((select id from public.fields where slug='design'), 'Dribbble Jobs', 'https://dribbble.com/jobs', 'Design jobs and internships', 'job-board', 'Global', true),
  ((select id from public.fields where slug='design'), 'Working Not Working', 'https://workingnotworking.com', 'Creative talent network for designers', 'community', 'Global', true),
  ((select id from public.fields where slug='law'), 'Law Crossing', 'https://www.lawcrossing.com', 'Legal internships and clerkships', 'job-board', 'US', false),
  ((select id from public.fields where slug='sciences'), 'NSF REU', 'https://www.nsf.gov/crssprgm/reu/', 'Research Experiences for Undergraduates', 'research', 'US', true),
  ((select id from public.fields where slug='sciences'), 'Nature Careers', 'https://www.nature.com/naturecareers/', 'Science research positions worldwide', 'job-board', 'Global', true),
  ((select id from public.fields where slug='education'), 'Teach For All', 'https://teachforall.org', 'Global teaching fellowships for graduates', 'fellowship', 'Global', true),
  ((select id from public.fields where slug='business'), 'Handshake', 'https://joinhandshake.com', 'Top platform for student internships and entry roles', 'job-board', 'US', true),
  ((select id from public.fields where slug='computer-science'), 'LinkedIn Internships', 'https://www.linkedin.com/jobs/internship-jobs/', 'Filtered internship listings on LinkedIn', 'job-board', 'Global', true);
