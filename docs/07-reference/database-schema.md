---
title: データベーススキーマ定義
category: reference
dependencies: [../02-architecture/data-model.md, ../06-infrastructure/supabase.md]
phase: 1
last-updated: 2024-11-22
---

# データベーススキーマ定義

## 1. データベース構成

### 1.1 基本情報

```yaml
データベース: PostgreSQL 15
プロバイダー: Supabase
タイムゾーン: UTC
文字エンコード: UTF-8
照合順序: ja_JP.UTF-8
```

### 1.2 命名規則

```yaml
テーブル名: 複数形、スネークケース（例: calculations）
カラム名: スネークケース（例: created_at）
主キー: id（UUID）
外部キー: テーブル名_id（例: product_id）
インデックス: idx_テーブル名_カラム名
制約: テーブル名_制約タイプ_カラム名
```

## 2. テーブル定義

### 2.1 products（商品）

```sql
CREATE TABLE products (
  -- 主キー
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 基本情報
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  years DECIMAL(4,1) NOT NULL,

  -- メタデータ
  category TEXT,
  brand TEXT,
  model TEXT,
  description TEXT,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 制約
  CONSTRAINT products_price_check
    CHECK (price >= 1 AND price <= 1000000000),
  CONSTRAINT products_years_check
    CHECK (years >= 0.5 AND years <= 100 AND years % 0.5 = 0),
  CONSTRAINT products_name_length
    CHECK (char_length(name) <= 100)
);

-- インデックス
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- コメント
COMMENT ON TABLE products IS '商品マスタ';
COMMENT ON COLUMN products.id IS '商品ID';
COMMENT ON COLUMN products.name IS '商品名';
COMMENT ON COLUMN products.price IS '購入価格（円）';
COMMENT ON COLUMN products.years IS '使用予定年数';
```

### 2.2 calculations（計算履歴）

```sql
CREATE TABLE calculations (
  -- 主キー
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 外部キー
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID,

  -- 計算結果
  daily_cost INTEGER NOT NULL,

  -- セッション情報
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 制約
  CONSTRAINT calculations_daily_cost_check
    CHECK (daily_cost >= 0)
);

-- インデックス
CREATE INDEX idx_calculations_user_id ON calculations(user_id);
CREATE INDEX idx_calculations_product_id ON calculations(product_id);
CREATE INDEX idx_calculations_created_at ON calculations(created_at DESC);
CREATE INDEX idx_calculations_daily_cost ON calculations(daily_cost);

-- 複合インデックス
CREATE INDEX idx_calculations_user_created
  ON calculations(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- コメント
COMMENT ON TABLE calculations IS '計算履歴';
COMMENT ON COLUMN calculations.daily_cost IS '1日あたりの金額（円）';
```

### 2.3 happiness_scores（幸福度スコア）

```sql
CREATE TABLE happiness_scores (
  -- 主キー
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 外部キー（1対1）
  calculation_id UUID NOT NULL UNIQUE
    REFERENCES calculations(id) ON DELETE CASCADE,

  -- スコア
  score INTEGER NOT NULL,
  frequency INTEGER NOT NULL,
  satisfaction INTEGER NOT NULL,
  necessity INTEGER NOT NULL,

  -- 詳細
  message TEXT,
  feedback TEXT,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 制約
  CONSTRAINT happiness_scores_score_check
    CHECK (score >= 0 AND score <= 100),
  CONSTRAINT happiness_scores_frequency_check
    CHECK (frequency >= 1 AND frequency <= 5),
  CONSTRAINT happiness_scores_satisfaction_check
    CHECK (satisfaction >= 1 AND satisfaction <= 5),
  CONSTRAINT happiness_scores_necessity_check
    CHECK (necessity >= 1 AND necessity <= 5)
);

-- インデックス
CREATE INDEX idx_happiness_scores_score ON happiness_scores(score);
CREATE INDEX idx_happiness_scores_created_at ON happiness_scores(created_at DESC);

-- コメント
COMMENT ON TABLE happiness_scores IS '幸福度スコア';
COMMENT ON COLUMN happiness_scores.frequency IS '使用頻度（1:全く使わない〜5:毎日使う）';
COMMENT ON COLUMN happiness_scores.satisfaction IS '満足度（1:不満〜5:大満足）';
COMMENT ON COLUMN happiness_scores.necessity IS '必要性（1:不要〜5:必須）';
```

### 2.4 comparisons（比較アイテム）

```sql
CREATE TABLE comparisons (
  -- 主キー
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- 基本情報
  name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  emoji TEXT,
  unit TEXT NOT NULL DEFAULT '個',

  -- カテゴリ
  category TEXT NOT NULL DEFAULT 'general',

  -- ステータス
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 制約
  CONSTRAINT comparisons_price_check
    CHECK (price > 0)
);

-- インデックス
CREATE INDEX idx_comparisons_category ON comparisons(category);
CREATE INDEX idx_comparisons_active ON comparisons(is_active);
CREATE INDEX idx_comparisons_order ON comparisons(display_order);

-- コメント
COMMENT ON TABLE comparisons IS '比較アイテムマスタ';
```

### 2.5 users（ユーザー）

```sql
CREATE TABLE users (
  -- 主キー（Supabase Authと連携）
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- プロフィール
  display_name TEXT,
  avatar_url TEXT,

  -- 設定
  preferences JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',

  -- 統計
  total_calculations INTEGER DEFAULT 0,
  last_calculation_at TIMESTAMPTZ,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 制約
  CONSTRAINT users_display_name_length
    CHECK (char_length(display_name) <= 50)
);

-- インデックス
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- コメント
COMMENT ON TABLE users IS 'ユーザー情報';
```

### 2.6 analytics_events（分析イベント）

```sql
CREATE TABLE analytics_events (
  -- 主キー
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- イベント情報
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value INTEGER,

  -- ユーザー情報
  user_id UUID,
  session_id TEXT,
  anonymous_id TEXT,

  -- デバイス情報
  user_agent TEXT,
  ip_address INET,
  referer TEXT,
  url TEXT,

  -- データ
  event_data JSONB,
  metadata JSONB,

  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- パーティショニング用
  created_date DATE GENERATED ALWAYS AS (DATE(created_at)) STORED
);

-- パーティショニング（月次）
CREATE TABLE analytics_events_2024_01 PARTITION OF analytics_events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- インデックス
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);

-- 複合インデックス
CREATE INDEX idx_analytics_events_name_date
  ON analytics_events(event_name, created_date);

-- コメント
COMMENT ON TABLE analytics_events IS '分析イベントログ';
```

## 3. ビュー定義

### 3.1 計算履歴詳細ビュー

```sql
CREATE VIEW v_calculation_details AS
SELECT
  c.id,
  c.daily_cost,
  c.created_at,
  c.user_id,
  p.name AS product_name,
  p.price AS product_price,
  p.years AS product_years,
  p.category AS product_category,
  h.score AS happiness_score,
  h.frequency,
  h.satisfaction,
  h.necessity,
  h.message AS happiness_message
FROM calculations c
  INNER JOIN products p ON c.product_id = p.id
  LEFT JOIN happiness_scores h ON h.calculation_id = c.id
ORDER BY c.created_at DESC;
```

### 3.2 日次統計ビュー

```sql
CREATE MATERIALIZED VIEW mv_daily_statistics AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_calculations,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(daily_cost)::INTEGER as avg_daily_cost,
  MIN(daily_cost) as min_daily_cost,
  MAX(daily_cost) as max_daily_cost
FROM calculations
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- インデックス
CREATE UNIQUE INDEX idx_mv_daily_statistics_date ON mv_daily_statistics(date);

-- 定期更新
CREATE OR REPLACE FUNCTION refresh_daily_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_statistics;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 人気商品ビュー

```sql
CREATE VIEW v_popular_products AS
SELECT
  p.name,
  p.category,
  COUNT(c.id) as calculation_count,
  AVG(c.daily_cost)::INTEGER as avg_daily_cost,
  AVG(h.score)::INTEGER as avg_happiness_score
FROM products p
  INNER JOIN calculations c ON p.id = c.product_id
  LEFT JOIN happiness_scores h ON h.calculation_id = c.id
GROUP BY p.id, p.name, p.category
HAVING COUNT(c.id) >= 5
ORDER BY calculation_count DESC
LIMIT 100;
```

## 4. 関数・トリガー

### 4.1 更新日時自動更新

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー適用
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER happiness_scores_updated_at
  BEFORE UPDATE ON happiness_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.2 計算履歴制限

```sql
CREATE OR REPLACE FUNCTION limit_user_calculations()
RETURNS TRIGGER AS $$
BEGIN
  -- ユーザーごとに100件まで
  IF NEW.user_id IS NOT NULL THEN
    DELETE FROM calculations
    WHERE user_id = NEW.user_id
      AND id NOT IN (
        SELECT id FROM calculations
        WHERE user_id = NEW.user_id
        ORDER BY created_at DESC
        LIMIT 100
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_calculations_trigger
  AFTER INSERT ON calculations
  FOR EACH ROW EXECUTE FUNCTION limit_user_calculations();
```

### 4.3 統計更新

```sql
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET
    total_calculations = total_calculations + 1,
    last_calculation_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT ON calculations
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION update_user_statistics();
```

## 5. Row Level Security (RLS)

### 5.1 ポリシー定義

```sql
-- RLS有効化
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE happiness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products: 全員読み取り可能
CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_insert_authenticated" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Calculations: 自分のデータのみ
CREATE POLICY "calculations_select_own" ON calculations
  FOR SELECT USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "calculations_insert_own" ON calculations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
  );

CREATE POLICY "calculations_update_own" ON calculations
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calculations_delete_own" ON calculations
  FOR DELETE USING (auth.uid() = user_id);

-- Happiness Scores: 計算履歴の所有者のみ
CREATE POLICY "happiness_scores_manage_own" ON happiness_scores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM calculations
      WHERE calculations.id = happiness_scores.calculation_id
        AND (calculations.user_id = auth.uid() OR calculations.user_id IS NULL)
    )
  );

-- Comparisons: 全員読み取り可能
CREATE POLICY "comparisons_select_active" ON comparisons
  FOR SELECT USING (is_active = true);

CREATE POLICY "comparisons_admin_all" ON comparisons
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users: 本人のみ
CREATE POLICY "users_select_self" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_self" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

## 6. マイグレーション

### 6.1 初期マイグレーション

```sql
-- migrations/001_initial_schema.sql
BEGIN;

-- テーブル作成
CREATE TABLE IF NOT EXISTS products (...);
CREATE TABLE IF NOT EXISTS calculations (...);
CREATE TABLE IF NOT EXISTS happiness_scores (...);
CREATE TABLE IF NOT EXISTS comparisons (...);
CREATE TABLE IF NOT EXISTS analytics_events (...);

-- インデックス作成
CREATE INDEX IF NOT EXISTS ...;

-- ビュー作成
CREATE VIEW IF NOT EXISTS ...;

-- 関数・トリガー作成
CREATE OR REPLACE FUNCTION ...;

-- RLS設定
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;

-- 初期データ投入
INSERT INTO comparisons (name, price, emoji, unit, category) VALUES
  ('コンビニコーヒー', 150, '☕', '杯', 'drink'),
  ('ペットボトル', 150, '🥤', '本', 'drink'),
  ('電車運賃', 200, '🚃', '回', 'transport'),
  ('映画チケット', 1800, '🎬', '回', 'entertainment'),
  ('ランチ', 1000, '🍱', '食', 'food');

COMMIT;
```

### 6.2 バージョンアップ

```sql
-- migrations/002_add_analytics.sql
BEGIN;

-- 新テーブル追加
CREATE TABLE IF NOT EXISTS analytics_events (...);

-- 既存テーブル変更
ALTER TABLE calculations
  ADD COLUMN IF NOT EXISTS ip_address INET,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_analytics_events_name
  ON analytics_events(event_name);

COMMIT;
```

## 7. バックアップ・リストア

### 7.1 バックアップ

```bash
# フルバックアップ
pg_dump -h db.supabase.co -U postgres -d postgres \
  --schema=public \
  --no-owner \
  --no-privileges \
  > backup_$(date +%Y%m%d).sql

# テーブル指定バックアップ
pg_dump -h db.supabase.co -U postgres -d postgres \
  -t products \
  -t calculations \
  -t happiness_scores \
  > backup_data_$(date +%Y%m%d).sql

# データのみバックアップ
pg_dump -h db.supabase.co -U postgres -d postgres \
  --data-only \
  --inserts \
  > backup_inserts_$(date +%Y%m%d).sql
```

### 7.2 リストア

```bash
# フルリストア
psql -h db.supabase.co -U postgres -d postgres < backup.sql

# テーブル単位リストア
psql -h db.supabase.co -U postgres -d postgres \
  -c "TRUNCATE products CASCADE;" \
  -f backup_products.sql
```

## 関連ドキュメント

- [データモデル](../02-architecture/data-model.md)
- [Supabase設定](../06-infrastructure/supabase.md)
- [API仕様書](./api-spec.md)
