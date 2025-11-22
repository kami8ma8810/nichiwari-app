---
title: Supabase設定
category: infrastructure
dependencies: [../02-architecture/data-model.md, ../05-implementation/phase-3-backend.md]
phase: 3
last-updated: 2024-11-22
---

# Supabase設定

## 1. プロジェクトセットアップ

### 1.1 プロジェクト作成

```bash
# Supabase CLIインストール
brew install supabase/tap/supabase

# ログイン
supabase login

# プロジェクト初期化
supabase init

# プロジェクトリンク
supabase link --project-ref xxxxx
```

### 1.2 環境設定

```env
# .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_KEY=xxxxx
SUPABASE_JWT_SECRET=xxxxx
```

## 2. データベース設計

### 2.1 テーブル定義

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 1 AND price <= 1000000000),
  years DECIMAL(4,1) NOT NULL CHECK (years >= 0.5 AND years <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculations table
CREATE TABLE calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  daily_cost INTEGER NOT NULL,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at DESC)
);

-- Happiness scores table
CREATE TABLE happiness_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calculation_id UUID REFERENCES calculations(id) ON DELETE CASCADE UNIQUE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  frequency INTEGER CHECK (frequency >= 1 AND frequency <= 5),
  satisfaction INTEGER CHECK (satisfaction >= 1 AND satisfaction <= 5),
  necessity INTEGER CHECK (necessity >= 1 AND necessity <= 5),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comparisons table
CREATE TABLE comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  emoji TEXT,
  unit TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_data JSONB,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_event_name (event_name),
  INDEX idx_event_created (created_at DESC)
);
```

### 2.2 トリガー設定

```sql
-- updated_at自動更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 計算履歴の自動削除（100件超過分）
CREATE OR REPLACE FUNCTION limit_user_calculations()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM calculations
  WHERE user_id = NEW.user_id
    AND id NOT IN (
      SELECT id FROM calculations
      WHERE user_id = NEW.user_id
      ORDER BY created_at DESC
      LIMIT 100
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_calculations
  AFTER INSERT ON calculations
  FOR EACH ROW
  EXECUTE FUNCTION limit_user_calculations();
```

## 3. Row Level Security (RLS)

### 3.1 基本ポリシー

```sql
-- RLS有効化
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE happiness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Products: 全員読み取り可能
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Products: 認証ユーザーのみ作成可能
CREATE POLICY "Authenticated users can create products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Calculations: 自分のデータのみアクセス可能
CREATE POLICY "Users can view own calculations"
  ON calculations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create calculations"
  ON calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own calculations"
  ON calculations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON calculations FOR DELETE
  USING (auth.uid() = user_id);

-- Happiness scores: 計算結果の所有者のみアクセス
CREATE POLICY "Users can manage own happiness scores"
  ON happiness_scores
  USING (
    EXISTS (
      SELECT 1 FROM calculations
      WHERE calculations.id = happiness_scores.calculation_id
        AND (calculations.user_id = auth.uid() OR calculations.user_id IS NULL)
    )
  );

-- Comparisons: 全員読み取り可能
CREATE POLICY "Comparisons are viewable by everyone"
  ON comparisons FOR SELECT
  USING (is_active = true);
```

### 3.2 管理者ポリシー

```sql
-- 管理者ロール作成
CREATE ROLE admin_user;

-- 管理者は全データアクセス可能
CREATE POLICY "Admins have full access to products"
  ON products
  USING (auth.jwt() ->> 'role' = 'admin_user');

CREATE POLICY "Admins have full access to calculations"
  ON calculations
  USING (auth.jwt() ->> 'role' = 'admin_user');

CREATE POLICY "Admins have full access to analytics"
  ON analytics_events
  USING (auth.jwt() ->> 'role' = 'admin_user');
```

## 4. Edge Functions

### 4.1 計算処理関数

```typescript
// supabase/functions/calculate-daily-cost/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { price, years, name, userId } = await req.json()

    // バリデーション
    if (!price || !years) {
      return new Response(
        JSON.stringify({ error: 'Price and years are required' }),
        { status: 400 }
      )
    }

    // 計算
    const dailyCost = Math.floor(price / (years * 365))

    // Supabaseクライアント
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_KEY')!
    )

    // 商品保存
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({ name: name || 'Unknown', price, years })
      .select()
      .single()

    if (productError) throw productError

    // 計算結果保存
    const { data: calculation, error: calcError } = await supabase
      .from('calculations')
      .insert({
        product_id: product.id,
        daily_cost: dailyCost,
        user_id: userId
      })
      .select()
      .single()

    if (calcError) throw calcError

    return new Response(
      JSON.stringify({
        product,
        calculation,
        dailyCost
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
```

### 4.2 統計情報取得

```typescript
// supabase/functions/get-statistics/index.ts
serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  )

  // 統計情報取得
  const [
    totalCalculations,
    averageDailyCost,
    popularProducts,
    happinessStats
  ] = await Promise.all([
    // 総計算数
    supabase
      .from('calculations')
      .select('count')
      .single(),

    // 平均日額
    supabase
      .from('calculations')
      .select('daily_cost')
      .then(({ data }) => {
        if (!data || data.length === 0) return 0
        const sum = data.reduce((acc, item) => acc + item.daily_cost, 0)
        return Math.round(sum / data.length)
      }),

    // 人気商品
    supabase
      .from('products')
      .select('name, count:calculations(count)')
      .order('count', { ascending: false })
      .limit(10),

    // 幸福度統計
    supabase
      .from('happiness_scores')
      .select('score')
      .then(({ data }) => {
        if (!data || data.length === 0) return null
        const scores = data.map(d => d.score)
        return {
          average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          min: Math.min(...scores),
          max: Math.max(...scores)
        }
      })
  ])

  return new Response(
    JSON.stringify({
      totalCalculations: totalCalculations.count,
      averageDailyCost,
      popularProducts,
      happinessStats
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
})
```

## 5. リアルタイム機能

### 5.1 リアルタイム購読設定

```typescript
// lib/supabase-realtime.ts
export const setupRealtimeSubscription = () => {
  const supabase = useSupabase()

  // 計算履歴のリアルタイム更新
  const calculationsChannel = supabase
    .channel('calculations-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calculations',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Calculation change:', payload)

        switch (payload.eventType) {
          case 'INSERT':
            // 新規追加処理
            break
          case 'UPDATE':
            // 更新処理
            break
          case 'DELETE':
            // 削除処理
            break
        }
      }
    )
    .subscribe()

  // プレゼンス（オンラインユーザー）
  const presenceChannel = supabase.channel('online-users')

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState()
      console.log('Online users:', state)
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key)
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: userId,
          online_at: new Date().toISOString()
        })
      }
    })

  return {
    calculationsChannel,
    presenceChannel
  }
}
```

## 6. バックアップとリストア

### 6.1 自動バックアップ設定

```yaml
# supabase/backup.yml
backup:
  schedule: "0 2 * * *" # 毎日2時
  retention: 30 # 30日間保持

  databases:
    - name: production
      tables:
        - products
        - calculations
        - happiness_scores
        - comparisons

  storage:
    provider: s3
    bucket: nichiwari-backups
    region: ap-northeast-1
```

### 6.2 手動バックアップ

```bash
#!/bin/bash
# scripts/backup-supabase.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

# データベースダンプ
pg_dump $SUPABASE_DB_URL > $BACKUP_FILE

# S3にアップロード
aws s3 cp $BACKUP_FILE s3://nichiwari-backups/

# ローカルファイル削除
rm $BACKUP_FILE

echo "Backup completed: $BACKUP_FILE"
```

### 6.3 リストア手順

```bash
#!/bin/bash
# scripts/restore-supabase.sh

# 最新バックアップ取得
LATEST_BACKUP=$(aws s3 ls s3://nichiwari-backups/ | sort | tail -n 1 | awk '{print $4}')

# ダウンロード
aws s3 cp s3://nichiwari-backups/$LATEST_BACKUP ./

# リストア
psql $SUPABASE_DB_URL < $LATEST_BACKUP

echo "Restore completed from: $LATEST_BACKUP"
```

## 7. パフォーマンス最適化

### 7.1 インデックス設計

```sql
-- 頻繁なクエリ用インデックス
CREATE INDEX idx_calculations_user_created
  ON calculations(user_id, created_at DESC);

CREATE INDEX idx_calculations_daily_cost
  ON calculations(daily_cost);

CREATE INDEX idx_products_price_range
  ON products(price);

CREATE INDEX idx_happiness_scores_score
  ON happiness_scores(score);

-- 部分インデックス
CREATE INDEX idx_active_comparisons
  ON comparisons(name)
  WHERE is_active = true;

-- 複合インデックス
CREATE INDEX idx_analytics_composite
  ON analytics_events(event_name, created_at DESC);
```

### 7.2 クエリ最適化

```sql
-- マテリアライズドビュー
CREATE MATERIALIZED VIEW daily_statistics AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_calculations,
  AVG(daily_cost) as avg_daily_cost,
  COUNT(DISTINCT user_id) as unique_users
FROM calculations
GROUP BY DATE(created_at);

-- 定期更新
CREATE OR REPLACE FUNCTION refresh_daily_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_statistics;
END;
$$ LANGUAGE plpgsql;

-- cronジョブで毎日更新
SELECT cron.schedule(
  'refresh-daily-stats',
  '0 1 * * *',
  'SELECT refresh_daily_statistics();'
);
```

## 8. 監視とアラート

### 8.1 メトリクス監視

```typescript
// supabase/functions/monitor-health/index.ts
serve(async (req) => {
  const checks = {
    database: await checkDatabase(),
    storage: await checkStorage(),
    functions: await checkFunctions(),
    realtime: await checkRealtime()
  }

  const healthy = Object.values(checks).every(c => c.healthy)

  return new Response(
    JSON.stringify({
      status: healthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString()
    }),
    {
      status: healthy ? 200 : 503,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

async function checkDatabase() {
  try {
    const { error } = await supabase
      .from('calculations')
      .select('count')
      .limit(1)

    return {
      healthy: !error,
      message: error?.message
    }
  } catch (error) {
    return {
      healthy: false,
      message: error.message
    }
  }
}
```

## 関連ドキュメント

- [データモデル](../02-architecture/data-model.md)
- [バックエンド連携](../05-implementation/phase-3-backend.md)
- [セキュリティ](./security.md)