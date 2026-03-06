-- ============================================================
-- Jubileu OS — Calendar Events & Notifications
-- Epic 7 Story 7.3: Inbox & Calendar
-- ============================================================

-- Calendar events
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT false,
  color TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  source_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_calendar_events_user_date ON calendar_events(user_id, start_date);
CREATE INDEX idx_calendar_events_source ON calendar_events(source, source_id);

CREATE TRIGGER calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  module TEXT NOT NULL DEFAULT 'system',
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users manage own calendar events
CREATE POLICY "Users manage own calendar events"
  ON calendar_events FOR ALL
  USING (user_id = auth.uid());

-- Admins can view all calendar events
CREATE POLICY "Admins can view all calendar events"
  ON calendar_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users manage own notifications
CREATE POLICY "Users manage own notifications"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'member'))
  );
