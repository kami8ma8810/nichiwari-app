/**
 * Supabase データベース型定義
 */

export interface Database {
  public: {
    Tables: {
      calculations: {
        Row: {
          id: string
          product_name: string | null
          price: number
          years: number
          months: number
          daily_cost: number
          monthly_cost: number
          yearly_cost: number
          created_at: string
          user_agent: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          product_name?: string | null
          price: number
          years: number
          months: number
          daily_cost: number
          monthly_cost: number
          yearly_cost: number
          created_at?: string
          user_agent?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          product_name?: string | null
          price?: number
          years?: number
          months?: number
          daily_cost?: number
          monthly_cost?: number
          yearly_cost?: number
          created_at?: string
          user_agent?: string | null
          referrer?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type CalculationRecord = Database['public']['Tables']['calculations']['Row']
export type CalculationInsert = Database['public']['Tables']['calculations']['Insert']
