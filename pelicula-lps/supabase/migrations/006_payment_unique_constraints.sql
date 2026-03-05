-- Add unique constraint on mp_payment_id for webhook upserts
create unique index idx_payments_mp_payment_id
  on public.payments(mp_payment_id)
  where mp_payment_id is not null;

-- Add unique constraint on mp_subscription_id for webhook updates
create unique index idx_subscriptions_mp_subscription_id
  on public.subscriptions(mp_subscription_id)
  where mp_subscription_id is not null;
