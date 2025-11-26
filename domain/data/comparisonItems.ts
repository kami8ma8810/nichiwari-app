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
 * 比較アイテム一覧（2025年現在の中央値ベース）
 * 価格の低い順にソート済み
 *
 * 価格参考:
 * - コンビニコーヒー: https://reiwajpn.net/archives/17622
 * - ランチ: https://www.nikkei.com/article/DGXZQOUC1866Y0Y5A410C2000000/
 * - 映画: https://www.nikkei.com/article/DGXZQOUC2284K0S3A620C2000000/
 * - 美容院: https://assist-all.co.jp/salon_reserve/column/20250703-6445/
 * - カラオケ: https://price.w3g.jp/karaoke
 */
export const comparisonItemsData: ComparisonItemData[] = [
  // 〜200円: 毎日の小さな出費
  { id: 'gum', name: 'ガム', price: 120, unit: '個' },
  { id: 'coffee', name: 'コンビニコーヒー', price: 130, unit: '杯' },
  { id: 'vending', name: '自販機の飲み物', price: 160, unit: '本' },
  { id: 'onigiri', name: 'おにぎり', price: 160, unit: '個' },

  // 200〜500円: 軽めの食事・交通費
  { id: 'train', name: '電車運賃（初乗り）', price: 180, unit: '回' },
  { id: 'bread', name: 'パン屋のパン', price: 280, unit: '個' },
  { id: 'manga', name: '漫画', price: 550, unit: '冊' },
  { id: 'convenience-bento', name: 'コンビニ弁当', price: 550, unit: '個' },
  { id: 'cafe-latte', name: 'カフェのラテ', price: 550, unit: '杯' },

  // 500〜1000円: しっかりした食事・本
  { id: 'book', name: '文庫本', price: 750, unit: '冊' },
  { id: 'super-sento', name: 'スーパー銭湯', price: 900, unit: '回' },
  { id: 'ramen', name: 'ラーメン', price: 950, unit: '杯' },

  // 1000〜2000円: 普段の外食・娯楽
  { id: 'lunch', name: '外食ランチ', price: 1000, unit: '食' },
  { id: 'subscription', name: '動画サブスク', price: 1000, unit: 'ヶ月' },
  { id: 'karaoke', name: 'カラオケ（2時間）', price: 1500, unit: '回' },

  // 2000〜5000円: ちょっとした贅沢
  { id: 'movie', name: '映画', price: 2000, unit: '回' },
  { id: 'dinner', name: '外食ディナー', price: 2500, unit: '食' },
  { id: 'gym', name: 'ジム（1回）', price: 2500, unit: '回' },

  // 5000〜10000円: 週末の娯楽
  { id: 'haircut', name: '美容院カット', price: 4500, unit: '回' },
  { id: 'drinking', name: '飲み会', price: 5000, unit: '回' },
  { id: 'massage', name: 'マッサージ', price: 6000, unit: '回' },
  { id: 'theme-park', name: 'テーマパーク', price: 9000, unit: '回' },
  { id: 'concert', name: 'ライブ', price: 9000, unit: '回' },
  { id: 'hotel', name: 'ホテル1泊', price: 10000, unit: '泊' },

  // 10000円以上: 特別な出費
  { id: 'domestic-trip', name: '国内旅行（1泊2日）', price: 35000, unit: '回' },
  { id: 'smartphone', name: 'スマホ（分割月額）', price: 5000, unit: 'ヶ月' },
]

/**
 * 数量をフォーマット
 */
function formatQuantity(quantity: number): string {
  // 整数に近い場合は整数で表示
  if (Math.abs(quantity - Math.round(quantity)) < 0.1) {
    return Math.round(quantity).toString()
  }
  else if (quantity >= 10) {
    return Math.round(quantity).toString()
  }
  else {
    return quantity.toFixed(1)
  }
}

/**
 * 整数に近いかどうかのスコアを計算
 * 整数に近いほど高いスコア（0〜1）を返す
 */
function getIntegerProximityScore(quantity: number): number {
  const distanceToInteger = Math.abs(quantity - Math.round(quantity))
  // 整数からの距離が0なら1、0.5なら0
  return 1 - (distanceToInteger * 2)
}

/**
 * 比較アイテムのスコアを計算
 * 整数に近い数量のアイテムを優先
 */
function calculateItemScore(quantity: number): number {
  // 数量が適切な範囲内かチェック（0.5〜10が理想）
  if (quantity < 0.5 || quantity > 20) {
    return -1
  }

  // 整数に近いかどうかのスコア（0〜1）
  const integerScore = getIntegerProximityScore(quantity)

  // 数量が1〜5の範囲にあるとボーナス（分かりやすい数）
  const rangeBonus = (quantity >= 1 && quantity <= 5) ? 0.3 : 0

  return integerScore + rangeBonus
}

interface ScoredComparison {
  item: ComparisonItemData
  quantity: number
  score: number
  period: '日' | '月' | '年'
}

/**
 * 分かりやすい比較を選択
 * 整数に近い数量になるアイテムを優先的に選択
 */
export function selectComparisonItems(
  dailyCost: number,
  monthlyCost: number,
  yearlyCost: number,
): ComparisonResult[] {
  const candidates: ScoredComparison[] = []

  // 全アイテムについて、日・月・年それぞれのスコアを計算
  for (const item of comparisonItemsData) {
    // 日割り
    const dailyQty = dailyCost / item.price
    const dailyScore = calculateItemScore(dailyQty)
    if (dailyScore > 0) {
      candidates.push({ item, quantity: dailyQty, score: dailyScore, period: '日' })
    }

    // 月割り
    const monthlyQty = monthlyCost / item.price
    const monthlyScore = calculateItemScore(monthlyQty)
    if (monthlyScore > 0) {
      candidates.push({ item, quantity: monthlyQty, score: monthlyScore, period: '月' })
    }

    // 年割り
    const yearlyQty = yearlyCost / item.price
    const yearlyScore = calculateItemScore(yearlyQty)
    if (yearlyScore > 0) {
      candidates.push({ item, quantity: yearlyQty, score: yearlyScore, period: '年' })
    }
  }

  // スコアの高い順にソート
  candidates.sort((a, b) => b.score - a.score)

  // 重複しないように3つ選ぶ（アイテム名と期間の両方が異なるもの）
  const results: ComparisonResult[] = []
  const usedItems = new Set<string>()
  const usedPeriods = new Set<string>()

  for (const candidate of candidates) {
    if (results.length >= 3) {
      break
    }

    // 同じアイテムは使わない
    if (usedItems.has(candidate.item.name)) {
      continue
    }

    // できれば異なる期間を優先（ただし3つ目は期間重複OK）
    if (results.length < 2 && usedPeriods.has(candidate.period)) {
      continue
    }

    results.push({
      name: candidate.item.name,
      price: candidate.item.price,
      unit: candidate.item.unit,
      quantity: formatQuantity(candidate.quantity),
      period: candidate.period,
    })
    usedItems.add(candidate.item.name)
    usedPeriods.add(candidate.period)
  }

  // 3つに満たない場合、期間重複を許可して追加
  if (results.length < 3) {
    for (const candidate of candidates) {
      if (results.length >= 3) {
        break
      }
      if (usedItems.has(candidate.item.name)) {
        continue
      }
      results.push({
        name: candidate.item.name,
        price: candidate.item.price,
        unit: candidate.item.unit,
        quantity: formatQuantity(candidate.quantity),
        period: candidate.period,
      })
      usedItems.add(candidate.item.name)
    }
  }

  return results
}
