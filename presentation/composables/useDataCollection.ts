/**
 * 計算データ収集用 Composable
 * Supabaseに計算結果を匿名で送信
 */

import type { SupabaseClientType } from '#root/app/plugins/supabase.client'

export function useDataCollection() {
  const nuxtApp = useNuxtApp()
  const supabase = nuxtApp.$supabase as SupabaseClientType

  const isEnabled = computed(() => !!supabase)

  /**
   * 計算結果をSupabaseに保存
   * エラーが発生してもユーザー体験に影響しないよう、静かに失敗する
   */
  async function saveCalculation(data: {
    productName?: string
    price: number
    years: number
    months: number
    dailyCost: number
    monthlyCost: number
    yearlyCost: number
  }): Promise<void> {
    if (!supabase) {
      return
    }

    try {
      const { error } = await supabase
        .from('calculations')
        .insert({
          product_name: data.productName || null,
          price: data.price,
          years: data.years,
          months: data.months,
          daily_cost: data.dailyCost,
          monthly_cost: data.monthlyCost,
          yearly_cost: data.yearlyCost,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        })

      if (error) {
        // エラーログのみ出力、ユーザーには通知しない
        console.error('[DataCollection] Failed to save calculation:', error.message)
      }
    }
    catch (error) {
      // ネットワークエラー等も静かに処理
      console.error('[DataCollection] Error:', error)
    }
  }

  return {
    isEnabled,
    saveCalculation,
  }
}
