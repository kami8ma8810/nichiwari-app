/**
 * 計算機プリセットデータ
 * 開発時のテスト入力やユーザーの参考用
 *
 * 価格は2024-2025年の中央値・相場を参考に設定（価格の小さい順）
 * ソース:
 * - Kindle: 約2万円（Kindle Paperwhite 2024年モデル、Amazon調べ）
 * - Switch2: 約5万円（Nintendo Switch2、任天堂公式価格49,980円）
 * - 掃除機: 約6万円（ロボット掃除機ミドルクラス、価格.com調べ）
 * - スマホ: 約12.5万円（iPhone 16 128GB、Apple Store定価）
 * - PC: 約16.5万円（MacBook Air M3 16GB/256GB、Apple Store定価）
 * - 家電: 約20万円（ドラム式洗濯機平均）
 * - ゲーミングPC: 約23万円（ゲーミングPC平均、各社調べ）
 * - カメラ: 約25万円（フルサイズミラーレス一眼、価格.com調べ）
 */

export interface CalculatorPreset {
  id: string
  label: string
  name: string
  price: number
  years: number
  months: number
}

export const calculatorPresets: CalculatorPreset[] = [
  {
    id: 'kindle',
    label: 'Kindle',
    name: 'Kindle Paperwhite',
    price: 20000,
    years: 4,
    months: 0,
  },
  {
    id: 'switch',
    label: 'ゲーム機',
    name: 'Nintendo Switch2',
    price: 50000,
    years: 5,
    months: 0,
  },
  {
    id: 'robot-cleaner',
    label: '掃除機',
    name: 'ロボット掃除機',
    price: 60000,
    years: 5,
    months: 0,
  },
  {
    id: 'smartphone',
    label: 'スマホ',
    name: 'iPhone 16',
    price: 125000,
    years: 3,
    months: 0,
  },
  {
    id: 'pc',
    label: 'MacBook',
    name: 'MacBook Air M3',
    price: 165000,
    years: 5,
    months: 0,
  },
  {
    id: 'appliance',
    label: '家電',
    name: 'ドラム式洗濯機',
    price: 200000,
    years: 10,
    months: 0,
  },
  {
    id: 'gaming-pc',
    label: 'ゲーミングPC',
    name: 'ゲーミングPC',
    price: 230000,
    years: 5,
    months: 0,
  },
  {
    id: 'camera',
    label: 'カメラ',
    name: 'フルサイズカメラ',
    price: 250000,
    years: 7,
    months: 0,
  },
]
