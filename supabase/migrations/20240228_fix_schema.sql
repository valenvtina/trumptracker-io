-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS create_analyses_table();
DROP FUNCTION IF EXISTS create_promise_stats_table();
DROP FUNCTION IF EXISTS update_promise_stats(INTEGER, TEXT, BOOLEAN, TIMESTAMPTZ);

-- Create function to create analyses table
CREATE OR REPLACE FUNCTION create_analyses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS analyses (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    classification TEXT NOT NULL,
    results JSONB NOT NULL
  );
  
  CREATE INDEX IF NOT EXISTS idx_analyses_timestamp ON analyses(timestamp DESC);
END;
$$;

-- Create function to create promise stats table
CREATE OR REPLACE FUNCTION create_promise_stats_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS promise_stats (
    promise_id INTEGER PRIMARY KEY,
    positive_count INTEGER DEFAULT 0,
    negative_count INTEGER DEFAULT 0,
    neutral_count INTEGER DEFAULT 0,
    fact_count INTEGER DEFAULT 0,
    opinion_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
  );
END;
$$;

-- Create function to update promise stats
CREATE OR REPLACE FUNCTION update_promise_stats(
  promise_id INTEGER,
  impact_type TEXT,
  is_fact BOOLEAN,
  timestamp TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE promise_stats
  SET
    positive_count = CASE WHEN impact_type = 'positive' THEN positive_count + 1 ELSE positive_count END,
    negative_count = CASE WHEN impact_type = 'negative' THEN negative_count + 1 ELSE negative_count END,
    neutral_count = CASE WHEN impact_type = 'neutral' THEN neutral_count + 1 ELSE neutral_count END,
    fact_count = CASE WHEN is_fact THEN fact_count + 1 ELSE fact_count END,
    opinion_count = CASE WHEN NOT is_fact THEN opinion_count + 1 ELSE opinion_count END,
    last_updated = timestamp
  WHERE promise_id = $1;
END;
$$;