-- Plans
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_cents int not null,
  billing_period text check (billing_period in ('one_time', 'monthly', 'yearly')),
  mp_plan_id text, -- Mercado Pago preapproval_plan id (for subscriptions)
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Anyone can view active plans"
  on public.plans for select
  using (is_active = true);

-- Plan-course access mapping
create table public.plan_courses (
  plan_id uuid not null references public.plans(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  primary key (plan_id, course_id)
);

alter table public.plan_courses enable row level security;

create policy "Anyone can view plan courses"
  on public.plan_courses for select
  using (true);

-- Subscriptions (for recurring plans)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  mp_subscription_id text, -- Mercado Pago preapproval id
  status text not null default 'pending' check (status in ('pending', 'authorized', 'paused', 'cancelled', 'expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  subscription_id uuid references public.subscriptions(id),
  mp_payment_id text,
  amount_cents int not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'refunded', 'cancelled')),
  payment_method text,
  mp_status_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- User course access (decoupled from payment method)
create table public.user_course_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  granted_by text not null default 'payment' check (granted_by in ('payment', 'subscription', 'admin', 'promo')),
  payment_id uuid references public.payments(id),
  subscription_id uuid references public.subscriptions(id),
  expires_at timestamptz, -- null = lifetime access
  created_at timestamptz not null default now(),
  unique(user_id, course_id)
);

alter table public.user_course_access enable row level security;

create policy "Users can view own access"
  on public.user_course_access for select
  using (auth.uid() = user_id);

-- Indexes
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_payments_user_id on public.payments(user_id);
create index idx_user_course_access_user_id on public.user_course_access(user_id);
create index idx_user_course_access_course_id on public.user_course_access(course_id);
