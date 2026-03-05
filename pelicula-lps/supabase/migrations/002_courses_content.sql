-- Courses
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  thumbnail_url text,
  hero_image_url text,
  instructor_name text not null default 'Victor Dhornelas',
  instructor_avatar_url text,
  total_lessons int not null default 0,
  total_duration_minutes int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Anyone can view published courses"
  on public.courses for select
  using (is_published = true);

-- Modules
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Anyone can view modules of published courses"
  on public.modules for select
  using (
    exists (
      select 1 from public.courses
      where courses.id = modules.course_id and courses.is_published = true
    )
  );

-- Lessons
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  panda_video_id text,
  duration_minutes int not null default 0,
  sort_order int not null default 0,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now(),
  unique(module_id, slug)
);

alter table public.lessons enable row level security;

create policy "Anyone can view lesson metadata"
  on public.lessons for select
  using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = lessons.module_id and c.is_published = true
    )
  );

-- Index for fast lookups
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
