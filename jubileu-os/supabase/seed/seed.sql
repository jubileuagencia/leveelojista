-- ============================================================
-- Jubileu OS — Seed Data (Development/Testing)
-- Run after migration with: psql -f seed.sql
-- ============================================================

-- NOTE: In Supabase, auth.users are created via the Auth API.
-- This seed assumes profiles are auto-created by the trigger.
-- Use Supabase Dashboard or API to create test users first.
-- The UUIDs below are placeholders; replace with real auth.users IDs.

-- Test Clients
INSERT INTO clients (id, name, slug, contacts, links, clickup_tag, notion_root_page_id) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Pelicula Sideral', 'pelicula-sideral',
    '[{"name": "Victor Dhornelas", "role": "Fundador", "email": "peliculasideral@gmail.com"}]'::jsonb,
    '{"instagram": "https://instagram.com/peliculasideral", "substack": "https://peliculasideral.substack.com"}'::jsonb,
    'pelicula-sideral', '313a973e-04ac-81ab-a792-d9ac3b0fbffe'),

  ('c0000000-0000-0000-0000-000000000002', 'Levee', 'levee',
    '[{"name": "Contato Levee", "role": "CEO"}]'::jsonb,
    '{"website": "https://levee.com.br"}'::jsonb,
    'levee', '319a973e-04ac-80a2-843f-ca81e121db9e');

-- Once test users are created via Supabase Auth, uncomment and update UUIDs:
--
-- INSERT INTO user_clients (user_id, client_id) VALUES
--   ('ADMIN_UUID', 'c0000000-0000-0000-0000-000000000001'),
--   ('ADMIN_UUID', 'c0000000-0000-0000-0000-000000000002'),
--   ('MEMBER_UUID', 'c0000000-0000-0000-0000-000000000001'),
--   ('CLIENT_UUID', 'c0000000-0000-0000-0000-000000000001');
--
-- Sample activity log entries:
-- INSERT INTO activity_logs (user_id, action, entity_type, entity_name, client_id) VALUES
--   ('ADMIN_UUID', 'system.login', 'system', 'Login', NULL),
--   ('ADMIN_UUID', 'client.created', 'client', 'Pelicula Sideral', 'c0000000-0000-0000-0000-000000000001'),
--   ('MEMBER_UUID', 'task.created', 'task', 'Criar landing page', 'c0000000-0000-0000-0000-000000000001');
