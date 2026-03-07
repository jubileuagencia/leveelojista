-- Community tables for Camarim Sideral

-- Categories
create table public.community_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  emoji text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.community_categories enable row level security;

create policy "Anyone can view categories"
  on public.community_categories for select
  using (true);

create policy "Admins can manage categories"
  on public.community_categories for all
  using (public.is_admin(auth.uid()));

-- Posts
create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.user_profiles(id) on delete cascade,
  category_id uuid not null references public.community_categories(id) on delete cascade,
  title text not null,
  body text not null,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  reaction_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

create policy "Community members can view posts"
  on public.community_posts for select
  using (public.has_community_access(auth.uid()));

create policy "Community members can create posts"
  on public.community_posts for insert
  with check (public.has_community_access(auth.uid()) and auth.uid() = author_id);

create policy "Authors can update own posts"
  on public.community_posts for update
  using (auth.uid() = author_id or public.is_admin(auth.uid()));

create policy "Authors or admins can delete posts"
  on public.community_posts for delete
  using (auth.uid() = author_id or public.is_admin(auth.uid()));

-- Comments
create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.user_profiles(id) on delete cascade,
  parent_id uuid references public.community_comments(id) on delete cascade,
  body text not null,
  reaction_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_comments enable row level security;

create policy "Community members can view comments"
  on public.community_comments for select
  using (public.has_community_access(auth.uid()));

create policy "Community members can create comments"
  on public.community_comments for insert
  with check (public.has_community_access(auth.uid()) and auth.uid() = author_id);

create policy "Authors can update own comments"
  on public.community_comments for update
  using (auth.uid() = author_id or public.is_admin(auth.uid()));

create policy "Authors or admins can delete comments"
  on public.community_comments for delete
  using (auth.uid() = author_id or public.is_admin(auth.uid()));

-- Reactions
create table public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_comments(id) on delete cascade,
  reaction_type text not null default '⭐',
  created_at timestamptz not null default now(),
  constraint unique_post_reaction unique (user_id, post_id),
  constraint unique_comment_reaction unique (user_id, comment_id),
  constraint reaction_target_check check (post_id is not null or comment_id is not null)
);

alter table public.community_reactions enable row level security;

create policy "Community members can view reactions"
  on public.community_reactions for select
  using (public.has_community_access(auth.uid()));

create policy "Community members can react"
  on public.community_reactions for insert
  with check (public.has_community_access(auth.uid()) and auth.uid() = user_id);

create policy "Users can remove own reactions"
  on public.community_reactions for delete
  using (auth.uid() = user_id);

-- Indexes
create index idx_posts_category on public.community_posts(category_id);
create index idx_posts_author on public.community_posts(author_id);
create index idx_posts_pinned on public.community_posts(is_pinned desc, created_at desc);
create index idx_comments_post on public.community_comments(post_id);
create index idx_reactions_post on public.community_reactions(post_id);
create index idx_reactions_comment on public.community_reactions(comment_id);

-- Trigger: update comment_count on posts
create or replace function public.update_post_comment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.community_posts set comment_count = comment_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.community_posts set comment_count = comment_count - 1 where id = OLD.post_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger trg_comment_count
  after insert or delete on public.community_comments
  for each row execute function public.update_post_comment_count();

-- Trigger: update reaction_count on posts/comments
create or replace function public.update_reaction_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.post_id is not null then
      update public.community_posts set reaction_count = reaction_count + 1 where id = NEW.post_id;
    end if;
    if NEW.comment_id is not null then
      update public.community_comments set reaction_count = reaction_count + 1 where id = NEW.comment_id;
    end if;
  elsif TG_OP = 'DELETE' then
    if OLD.post_id is not null then
      update public.community_posts set reaction_count = reaction_count - 1 where id = OLD.post_id;
    end if;
    if OLD.comment_id is not null then
      update public.community_comments set reaction_count = reaction_count - 1 where id = OLD.comment_id;
    end if;
  end if;
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger trg_reaction_count
  after insert or delete on public.community_reactions
  for each row execute function public.update_reaction_count();

-- Seed default categories
insert into public.community_categories (slug, name, description, emoji, sort_order) values
  ('geral', 'Geral', 'Discussões gerais da comunidade', '💬', 0),
  ('mapa-astral', 'Mapa Astral', 'Dúvidas e análises de mapa astral', '🗺️', 1),
  ('transitos', 'Trânsitos', 'Trânsitos planetários e previsões', '🌍', 2),
  ('sinastria', 'Sinastria', 'Compatibilidade e relações', '💕', 3),
  ('estudos', 'Estudos', 'Material de estudo e recomendações', '📚', 4),
  ('apresentacoes', 'Apresentações', 'Apresente-se para a comunidade', '👋', 5);
