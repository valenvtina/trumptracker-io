export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: number
          text: string
          timestamp: string
          classification: string
          results: {
            promiseId: number
            impact: 'positive' | 'negative' | 'neutral'
            rationale: string
          }[]
        }
        Insert: {
          id?: number
          text: string
          timestamp: string
          classification: string
          results: {
            promiseId: number
            impact: 'positive' | 'negative' | 'neutral'
            rationale: string
          }[]
        }
      }
      promise_stats: {
        Row: {
          promise_id: number
          positive_count: number
          negative_count: number
          neutral_count: number
          fact_count: number
          opinion_count: number
          last_updated: string
        }
        Insert: {
          promise_id: number
          positive_count?: number
          negative_count?: number
          neutral_count?: number
          fact_count?: number
          opinion_count?: number
          last_updated?: string
        }
      }
    }
    Functions: {
      create_analyses_table: {
        Args: Record<string, never>
        Returns: void
      }
      create_promise_stats_table: {
        Args: Record<string, never>
        Returns: void
      }
      update_promise_stats: {
        Args: {
          promise_id: number
          impact_type: string
          is_fact: boolean
          timestamp: string
        }
        Returns: void
      }
    }
  }
}