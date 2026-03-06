-- ============================================================
-- Jubileu OS — Deliverables Schema
-- Epic 6: Client Portal — Delivery Approval System
-- ============================================================

-- Deliverables table
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'draft',
  file_url TEXT,
  preview_url TEXT,
  due_date TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_deliverables_client ON deliverables(client_id, status);
CREATE INDEX idx_deliverables_status ON deliverables(status, created_at DESC);
CREATE INDEX idx_deliverables_created_by ON deliverables(created_by);

-- Updated_at trigger
CREATE TRIGGER deliverables_updated_at BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- Admins and members can view all deliverables
CREATE POLICY "Admins and members can view all deliverables"
  ON deliverables FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'member'))
  );

-- Client users see only deliverables for their clients
CREATE POLICY "Client users see only their deliverables"
  ON deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_clients uc
      JOIN profiles p ON p.id = uc.user_id
      WHERE uc.user_id = auth.uid() AND uc.client_id = deliverables.client_id AND p.role = 'client'
    )
  );

-- Admins and members can manage deliverables (create, update, delete)
CREATE POLICY "Admins and members can manage deliverables"
  ON deliverables FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'member'))
  );

-- Clients can update deliverable status (approve/request revision)
CREATE POLICY "Clients can review deliverables"
  ON deliverables FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_clients uc
      WHERE uc.user_id = auth.uid() AND uc.client_id = deliverables.client_id
    )
  );
