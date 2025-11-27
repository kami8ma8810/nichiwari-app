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
 * - スタバコーヒー: https://menu.starbucks.co.jp/
 * - 音楽サブスク: https://www.spotify.com/jp/premium/
 * - ゲームサブスク: https://www.playstation.com/ja-jp/ps-plus/
 * - クラウドストレージ: https://one.google.com/about/plans?hl=ja
 * - 日経電子版: https://www.nikkei.com/help/subscribe/price/
 * - ネイルサロン: https://context-japan.jp/ryoukin/nailsalon.html
 * - エステ: https://context-japan.jp/ryoukin/estesalon-14889.html
 * - ヨガ: https://www.yogahazime.com/yoga-ryoukin/
 * - パーソナルジム: https://chicken-gym.jp/column/personalgym-price/
 * - サプリメント: https://prtimes.jp/main/html/rd/p/000000766.000044800.html
 * - ケーキ: https://www.jpmarket-conditions.com/1712/
 * - ゲームソフト: https://www.jpmarket-conditions.com/9156/
 * - ゴルフ練習場: https://golf-medley.com/articles/driving-range-price
 * - ガチャ10連: https://review.ore-shika.com/gacha-about/
 * - 電子書籍: https://www.nikkei.com/article/DGKKZO83038290X20C24A8EAC000/
 * - クリーニング: https://www.global-style.jp/enjoy-order/?p=19713
 * - コインランドリー: https://cojicaji.jp/laundry/laundry-tips/1293
 * - 宅配便: https://plus-shipping.com/blogs/shipping-fee-60-size
 * - ATM手数料: https://www.mizuhobank.co.jp/rate_fee/fee_time_conveni_atm.html
 * - タクシー: https://www.correc.co.jp/taxiappnavi/takusiryokintokyo
 * - レンタカー: https://rentacar.carlifestadium.com/blog/otoku/132/
 * - カーシェア: https://carshare.life/carshare-ranking/price-ranking
 * - 駐車場: https://www.ypark.co.jp/contents/price-system/
 * - ファミレス: https://gyokai-search.com/3-fami.htm
 * - 回転寿司: https://www.nikkei.com/article/DGXZQOUC1866Y0Y5A410C2000000/
 * - 焼肉: https://www.ryutsuu.biz/sales/q053078.html
 */
export const comparisonItemsData: ComparisonItemData[] = [
  // 〜200円: 毎日の小さな出費
  { id: 'gum', name: 'ガム', price: 120, unit: '個' },
  { id: 'coffee', name: 'コンビニコーヒー', price: 130, unit: '杯' },
  { id: 'vending', name: '自販機の飲み物', price: 160, unit: '本' },
  { id: 'onigiri', name: 'おにぎり', price: 160, unit: '個' },

  // 200〜500円: 軽めの食事・交通費・デジタル
  { id: 'train', name: '電車運賃（初乗り）', price: 180, unit: '回' },
  { id: 'atm-fee', name: 'ATM手数料', price: 220, unit: '回' },
  { id: 'cloud-storage', name: 'クラウドストレージ', price: 250, unit: 'ヶ月' },
  { id: 'bread', name: 'パン屋のパン', price: 280, unit: '個' },
  { id: 'coin-laundry', name: 'コインランドリー', price: 400, unit: '回' },
  { id: 'parking', name: '駐車場（1時間）', price: 400, unit: '回' },
  { id: 'starbucks', name: 'スタバのコーヒー', price: 420, unit: '杯' },
  { id: 'taxi', name: 'タクシー初乗り', price: 500, unit: '回' },
  { id: 'cake', name: 'ケーキ', price: 500, unit: '個' },

  // 500〜1000円: しっかりした食事・本・サブスク
  { id: 'manga', name: '漫画', price: 550, unit: '冊' },
  { id: 'convenience-bento', name: 'コンビニ弁当', price: 550, unit: '個' },
  { id: 'cafe-latte', name: 'カフェのラテ', price: 550, unit: '杯' },
  { id: 'ebook', name: '電子書籍（漫画）', price: 700, unit: '冊' },
  { id: 'book', name: '文庫本', price: 750, unit: '冊' },
  { id: 'game-subscription', name: 'ゲームサブスク', price: 850, unit: 'ヶ月' },
  { id: 'car-share', name: 'カーシェア（1時間）', price: 900, unit: '回' },
  { id: 'super-sento', name: 'スーパー銭湯', price: 900, unit: '回' },
  { id: 'ramen', name: 'ラーメン', price: 950, unit: '杯' },
  { id: 'delivery', name: '宅配便（60サイズ）', price: 1000, unit: '回' },

  // 1000〜2000円: 普段の外食・娯楽・サブスク
  { id: 'lunch', name: '外食ランチ', price: 1000, unit: '食' },
  { id: 'subscription', name: '動画サブスク', price: 1000, unit: 'ヶ月' },
  { id: 'music-subscription', name: '音楽サブスク', price: 1080, unit: 'ヶ月' },
  { id: 'famires', name: 'ファミレス', price: 1200, unit: '食' },
  { id: 'cleaning', name: 'クリーニング（スーツ）', price: 1500, unit: '回' },
  { id: 'karaoke', name: 'カラオケ（2時間）', price: 1500, unit: '回' },
  { id: 'golf-practice', name: 'ゴルフ練習場', price: 1500, unit: '回' },
  { id: 'sushi', name: '回転寿司', price: 1900, unit: '食' },

  // 2000〜5000円: ちょっとした贅沢
  { id: 'movie', name: '映画', price: 2000, unit: '回' },
  { id: 'dinner', name: '外食ディナー', price: 2500, unit: '食' },
  { id: 'gym', name: 'ジム（1回）', price: 2500, unit: '回' },
  { id: 'supplement', name: 'サプリメント', price: 3000, unit: 'ヶ月' },
  { id: 'gacha', name: 'ガチャ10連', price: 3000, unit: '回' },
  { id: 'yoga', name: 'ヨガ（1回）', price: 3000, unit: '回' },
  { id: 'yakiniku', name: '焼肉', price: 4000, unit: '食' },
  { id: 'nikkei', name: '日経電子版', price: 4300, unit: 'ヶ月' },

  // 5000〜10000円: 週末の娯楽
  { id: 'haircut', name: '美容院カット', price: 4500, unit: '回' },
  { id: 'nail-salon', name: 'ネイルサロン', price: 5000, unit: '回' },
  { id: 'drinking', name: '飲み会', price: 5000, unit: '回' },
  { id: 'smartphone', name: 'スマホ（分割月額）', price: 5000, unit: 'ヶ月' },
  { id: 'massage', name: 'マッサージ', price: 6000, unit: '回' },
  { id: 'game-software', name: 'ゲームソフト（新作）', price: 7000, unit: '本' },
  { id: 'rental-car', name: 'レンタカー（1日）', price: 7000, unit: '回' },
  { id: 'personal-gym', name: 'パーソナルジム（1回）', price: 8000, unit: '回' },
  { id: 'esthe', name: 'エステ', price: 8000, unit: '回' },
  { id: 'theme-park', name: 'テーマパーク', price: 9000, unit: '回' },
  { id: 'concert', name: 'ライブ', price: 9000, unit: '回' },
  { id: 'hotel', name: 'ホテル1泊', price: 10000, unit: '泊' },

  // 10000円以上: 特別な出費
  { id: 'domestic-trip', name: '国内旅行（1泊2日）', price: 35000, unit: '回' },
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
