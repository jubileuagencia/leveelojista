-- Migration 009: Tabela de eventos astrológicos dinâmicos
-- Substitui o hardcoded eclipse-data.ts por dados no banco

CREATE TABLE IF NOT EXISTS eventos (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  titulo       TEXT NOT NULL,
  tipo         TEXT NOT NULL,
  signo        TEXT NOT NULL,
  signo_key    TEXT NOT NULL,
  grau         TEXT,
  data_evento  DATE NOT NULL,
  substack_url TEXT,
  cta_texto    TEXT DEFAULT 'Ler a aula no Substack',
  cta_pergunta TEXT DEFAULT 'Quer saber o que essa pérola revela no seu mapa?',
  header_label TEXT,
  house_themes JSONB NOT NULL,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eventos_slug ON eventos (slug);
CREATE INDEX idx_eventos_active_date ON eventos (is_active, data_evento DESC);

-- RLS: permitir leitura pública dos eventos
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos são públicos para leitura"
  ON eventos FOR SELECT
  USING (true);

-- Seed inserido via REST API (Supabase JS client) para evitar problemas de encoding JSON no SQL Editor.
-- Evento: Cazimi Mercúrio-Sol em Peixes, 08/03/2026
