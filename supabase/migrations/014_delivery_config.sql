-- Migration 014: Seed delivery_config in app_config
-- T5.6 — Config Dinamica Expandida

INSERT INTO app_config (key, value)
VALUES (
  'delivery_config',
  '{
    "order_cutoff_time": "18:00",
    "free_shipping_min": 300,
    "pix_discount_pct": 5,
    "delivery_radius_km": 30
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
