-- Create analyses table
CREATE TABLE analyses (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    classification TEXT NOT NULL,
    results JSONB NOT NULL
);

-- Create promise stats table
CREATE TABLE promise_stats (
    promise_id INTEGER PRIMARY KEY,
    positive_count INTEGER DEFAULT 0,
    negative_count INTEGER DEFAULT 0,
    neutral_count INTEGER DEFAULT 0,
    fact_count INTEGER DEFAULT 0,
    opinion_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ
);

-- Initialize promise stats for all 20 promises
INSERT INTO promise_stats (promise_id)
SELECT generate_series(1, 20);

-- Create function to update promise stats
CREATE OR REPLACE FUNCTION update_promise_stats(
    analysis_results JSONB,
    classification TEXT,
    analysis_timestamp TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update counts for each promise in the results
    FOR result IN SELECT * FROM jsonb_array_elements(analysis_results)
    LOOP
        UPDATE promise_stats
        SET
            positive_count = CASE 
                WHEN result->>'impact' = 'positive' 
                THEN positive_count + 1 
                ELSE positive_count 
            END,
            negative_count = CASE 
                WHEN result->>'impact' = 'negative' 
                THEN negative_count + 1 
                ELSE negative_count 
            END,
            neutral_count = CASE 
                WHEN result->>'impact' = 'neutral' 
                THEN neutral_count + 1 
                ELSE neutral_count 
            END,
            fact_count = CASE 
                WHEN classification = 'FACT' 
                THEN fact_count + 1 
                ELSE fact_count 
            END,
            opinion_count = CASE 
                WHEN classification = 'OPINION' 
                THEN opinion_count + 1 
                ELSE opinion_count 
            END,
            last_updated = analysis_timestamp
        WHERE promise_id = (result->>'promiseId')::integer;
    END LOOP;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_analyses_timestamp ON analyses(timestamp DESC);
CREATE INDEX idx_analyses_classification ON analyses(classification);