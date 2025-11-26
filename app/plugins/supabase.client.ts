/**
 * Supabase クライアント初期化プラグイン
 * クライアントサイドでのみ実行
 */

import type { Database } from '#root/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

export type SupabaseClientType = SupabaseClient<Database> | null

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  // Supabaseが設定されていない場合はスキップ
  if (!supabaseUrl || !supabaseAnonKey) {
    console.info('[Supabase] Not configured, skipping initialization')
    return {
      provide: {
        supabase: null as SupabaseClientType,
      },
    }
  }

  const supabase: SupabaseClientType = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // 匿名利用のためセッション不要
    },
  })

  return {
    provide: {
      supabase,
    },
  }
})
