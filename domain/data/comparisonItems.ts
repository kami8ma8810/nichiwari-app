/**
 * 比較アイテムのデータベース
 * 価格帯ごとに身近で比較しやすいアイテムを定義
 */

export interface ComparisonItemData {
  id: string
  name: string
  price: number
  unit: string
}

/**
 * 比較結果（表示用）
 */
export interface ComparisonResult {
  name: string
  price: number
  unit: string
  quantity: string
  period: '日' | '月' | '年'
}

/**
 * 比較アイテム一覧
 * 価格の低い順にソート済み
 */
export const comparisonItemsData: ComparisonItemData[] = [
  // 〜200円: 毎日の小さな出費
  { id: 'gum', name: 'ガム', price: 100, unit: '個' },
  { id: 'vending', name: '自販機の飲み物', price: 130, unit: '本' },
  { id: 'coffee', name: 'コンビニコーヒー', price: 150, unit: '杯' },
  { id: 'onigiri', name: 'おにぎり', price: 150, unit: '個' },

  // 200〜500円: 軽めの食事・交通費
  { id: 'bread', name: 'パン屋のパン', price: 250, unit: '個' },
  { id: 'train', name: '電車運賃（初乗り）', price: 180, unit: '回' },
  { id: 'convenience-bento', name: 'コンビニ弁当', price: 500, unit: '個' },
  { id: 'cafe-latte', name: 'カフェのラテ', price: 500, unit: '杯' },
  { id: 'manga', name: '漫画', price: 500, unit: '冊' },

  // 500〜1000円: しっかりした食事・本
  { id: 'book', name: '文庫本', price: 700, unit: '冊' },
  { id: 'lunch', name: 'ランチ', price: 800, unit: '食' },
  { id: 'ramen', name: 'ラーメン', price: 900, unit: '杯' },
  { id: 'subscription', name: '動画サブスク', price: 1000, unit: 'ヶ月' },

  // 1000〜3000円: ちょっとした贅沢
  { id: 'dinner', name: '外食ディナー', price: 1500, unit: '食' },
  { id: 'karaoke', name: 'カラオケ（2時間）', price: 1500, unit: '回' },
  { id: 'spa', name: '日帰り温泉', price: 1500, unit: '回' },
  { id: 'movie', name: '映画', price: 1900, unit: '回' },
  { id: 'gym', name: 'ジム（1回）', price: 2000, unit: '回' },

  // 3000〜10000円: 週末の娯楽
  { id: 'haircut', name: '美容院カット', price: 4000, unit: '回' },
  { id: 'drinking', name: '飲み会', price: 4000, unit: '回' },
  { id: 'massage', name: 'マッサージ', price: 6000, unit: '回' },
  { id: 'theme-park', name: 'テーマパーク', price: 8000, unit: '回' },
  { id: 'concert', name: 'ライブ', price: 8000, unit: '回' },
  { id: 'hotel', name: 'ホテル1泊', price: 8000, unit: '泊' },

  // 10000円以上: 特別な出費
  { id: 'domestic-trip', name: '国内旅行（1泊2日）', price: 30000, unit: '回' },
  { id: 'smartphone', name: 'スマホ（分割月額）', price: 4000, unit: 'ヶ月' },
]

/**
 * 数量をフォーマット
 */
function formatQuantity(quantity: number): string {
  if (quantity >= 100) {
    return Math.round(quantity).toString()
  }
  else if (quantity >= 10) {
    return Math.round(quantity).toString()
  }
  else if (quantity >= 1) {
    return quantity.toFixed(1)
  }
  else {
    return quantity.toFixed(1)
  }
}

/**
 * 分かりやすい比較を選択
 * 日割り・月割り・年割りから最も分かりやすい単位で比較
 */
export function selectComparisonItems(
  dailyCost: number,
  monthlyCost: number,
  yearlyCost: number,
): ComparisonResult[] {
  const results: ComparisonResult[] = []

  // 日割りで分かりやすいもの（0.5〜5程度の数量になるもの）
  const dailyItems = comparisonItemsData.filter((item) => {
    const qty = dailyCost / item.price
    return qty >= 0.3 && qty <= 5
  })

  // 月割りで分かりやすいもの
  const monthlyItems = comparisonItemsData.filter((item) => {
    const qty = monthlyCost / item.price
    return qty >= 0.5 && qty <= 10
  })

  // 年割りで分かりやすいもの
  const yearlyItems = comparisonItemsData.filter((item) => {
    const qty = yearlyCost / item.price
    return qty >= 0.5 && qty <= 20
  })

  // 日割りから1つ選ぶ（最も1に近いもの）
  if (dailyItems.length > 0) {
    const best = dailyItems.reduce((a, b) => {
      const qtyA = dailyCost / a.price
      const qtyB = dailyCost / b.price
      return Math.abs(qtyA - 1) < Math.abs(qtyB - 1) ? a : b
    })
    results.push({
      name: best.name,
      price: best.price,
      unit: best.unit,
      quantity: formatQuantity(dailyCost / best.price),
      period: '日',
    })
  }

  // 月割りから1つ選ぶ（日割りと重複しないもの）
  const usedIds = new Set(results.map(r => r.name))
  const availableMonthly = monthlyItems.filter(item => !usedIds.has(item.name))
  if (availableMonthly.length > 0) {
    const best = availableMonthly.reduce((a, b) => {
      const qtyA = monthlyCost / a.price
      const qtyB = monthlyCost / b.price
      return Math.abs(qtyA - 1) < Math.abs(qtyB - 1) ? a : b
    })
    results.push({
      name: best.name,
      price: best.price,
      unit: best.unit,
      quantity: formatQuantity(monthlyCost / best.price),
      period: '月',
    })
  }

  // 年割りから1つ選ぶ
  usedIds.clear()
  results.forEach(r => usedIds.add(r.name))
  const availableYearly = yearlyItems.filter(item => !usedIds.has(item.name))
  if (availableYearly.length > 0) {
    const best = availableYearly.reduce((a, b) => {
      const qtyA = yearlyCost / a.price
      const qtyB = yearlyCost / b.price
      return Math.abs(qtyA - 1) < Math.abs(qtyB - 1) ? a : b
    })
    results.push({
      name: best.name,
      price: best.price,
      unit: best.unit,
      quantity: formatQuantity(yearlyCost / best.price),
      period: '年',
    })
  }

  // 3つに満たない場合は追加で選ぶ
  if (results.length < 3) {
    const allUsedIds = new Set(results.map(r => r.name))
    const remaining = comparisonItemsData.filter(item => !allUsedIds.has(item.name))

    for (const item of remaining) {
      if (results.length >= 3)
        break

      // 月割りで計算
      const qty = monthlyCost / item.price
      if (qty >= 0.3 && qty <= 20) {
        results.push({
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: formatQuantity(qty),
          period: '月',
        })
      }
    }
  }

  return results.slice(0, 3)
}
