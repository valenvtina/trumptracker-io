import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtxhxqjwqcyoztqjnpvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0eGh4cWp3cWN5b3p0cWpucHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5OTI0NzAsImV4cCI6MjAyNDU2ODQ3MH0.qJ9PZuJJQkQxk8mG9l9YXqzJ7A4KlzRqvQbE8zFgqHQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const initializeDatabase = async () => {
  try {
    // Create analyses table
    const { error: analysesError } = await supabase.rpc('create_analyses_table');
    if (analysesError) throw analysesError;

    // Create promise stats table
    const { error: statsError } = await supabase.rpc('create_promise_stats_table');
    if (statsError) throw statsError;

    // Initialize promise stats if needed
    const { data: stats, error: checkError } = await supabase
      .from('promise_stats')
      .select('promise_id')
      .limit(1);

    if (!stats?.length || checkError) {
      const initialStats = Array.from({ length: 20 }, (_, i) => ({
        promise_id: i + 1,
        positive_count: 0,
        negative_count: 0,
        neutral_count: 0,
        fact_count: 0,
        opinion_count: 0,
        last_updated: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('promise_stats')
        .upsert(initialStats);

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Initialize database on load
initializeDatabase().catch(console.error);