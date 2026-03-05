-- Seed plans
insert into public.plans (slug, name, description, price_cents, billing_period) values
  ('curso-solo', 'Decifrando o Mapa Astral', 'Acesso vitalicio ao curso completo com 23 aulas em 5 modulos.', 14700, 'one_time'),
  ('camarim-mensal', 'Camarim Sideral Mensal', 'Acesso mensal ao Camarim Sideral com lives semanais e comunidade.', 1900, 'monthly'),
  ('pacote-anual', 'Pacote Completo Anual', 'Curso Decifrando + Camarim Sideral por 1 ano.', 29700, 'yearly');

-- Seed courses
insert into public.courses (slug, title, subtitle, description, instructor_name, is_published) values
  ('decifrando-mapa-astral', 'Decifrando o Mapa Astral', 'O metodo das 5 camadas para interpretar qualquer mapa astral', 'Aprenda a ler um mapa astral completo em 23 aulas praticas. Do basico ao avancado com o Metodo das 5 Camadas.', 'Victor Dhornelas', true),
  ('introducao-astrologia', 'Introducao a Astrologia', 'Seus primeiros passos no universo astrologico', 'Um curso introdutorio para quem quer entender os fundamentos da astrologia.', 'Victor Dhornelas', false);

-- Link plans to courses
-- curso-solo gives access to decifrando only
insert into public.plan_courses (plan_id, course_id)
select p.id, c.id
from public.plans p, public.courses c
where p.slug = 'curso-solo' and c.slug = 'decifrando-mapa-astral';

-- pacote-anual gives access to both courses
insert into public.plan_courses (plan_id, course_id)
select p.id, c.id
from public.plans p, public.courses c
where p.slug = 'pacote-anual' and c.slug = 'decifrando-mapa-astral';

insert into public.plan_courses (plan_id, course_id)
select p.id, c.id
from public.plans p, public.courses c
where p.slug = 'pacote-anual' and c.slug = 'introducao-astrologia';

-- camarim-mensal gives access to both courses
insert into public.plan_courses (plan_id, course_id)
select p.id, c.id
from public.plans p, public.courses c
where p.slug = 'camarim-mensal' and c.slug = 'decifrando-mapa-astral';

insert into public.plan_courses (plan_id, course_id)
select p.id, c.id
from public.plans p, public.courses c
where p.slug = 'camarim-mensal' and c.slug = 'introducao-astrologia';

-- Seed modules for Decifrando o Mapa Astral
with course as (select id from public.courses where slug = 'decifrando-mapa-astral')
insert into public.modules (course_id, title, description, sort_order) values
  ((select id from course), 'Fundamentos', 'As bases da astrologia e como funciona o mapa astral', 1),
  ((select id from course), 'Os Planetas', 'Sol, Lua e planetas pessoais — como interpretá-los', 2),
  ((select id from course), 'Os Signos', 'A energia de cada signo e como se manifesta', 3),
  ((select id from course), 'As Casas', 'As 12 casas astrológicas e suas áreas da vida', 4),
  ((select id from course), 'Aspectos e Síntese', 'Aspectos planetários e leitura integrada do mapa', 5);
