
-- 1. Create a table to store analytics snapshot reports.
CREATE TABLE public.analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL, -- for example, "June Summary" or "2025-06-15 midnight snapshot"
  snapshot JSONB NOT NULL -- stores the computed analytics as JSON
);

-- 2. Optionally, grant open access (for demo/testing/RLS off)
-- In production, you may want RLS with auth integration

-- No RLS policies are added, so this table is OPEN for access (READ/WRITE) by default.
