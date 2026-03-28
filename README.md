# Hackathon Starter

[Next.js 15](https://nextjs.org) + [Supabase](https://supabase.com) を使ったハッカソン向け高速プロトタイピングテンプレートです。

[![CI](https://github.com/your-org/your-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/your-repo/actions/workflows/ci.yml)

> **このテンプレートを使い始めたら**、このREADMEをあなたのプロジェクト内容に書き換えてください。

---

## 技術スタック

| レイヤー       | 技術                     |
|---------------|--------------------------|
| フレームワーク  | Next.js 15 (App Router)  |
| 言語           | TypeScript               |
| データベース    | Supabase (PostgreSQL)    |
| 認証           | Supabase Auth            |
| ランタイム      | Bun                      |
| Lint           | Biome                    |
| テスト          | Vitest + Testing Library |
| ホスティング    | Vercel                   |
| CI/CD          | GitHub Actions           |

---

## 前提条件

- [Bun](https://bun.sh) — `curl -fsSL https://bun.sh/install | bash`
- [Git](https://git-scm.com)
- [GitHub](https://github.com) アカウント
- [Supabase](https://supabase.com) プロジェクト（無料枠で OK）

---

## ローカルセットアップ

### 1. このテンプレートから新しいリポジトリを作成

GitHub で **「Use this template」** をクリックし、作成したリポジトリをクローン：

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

### 2. 環境変数を設定

```bash
cp .env.example .env.local
```

`.env.local` を開き、Supabase の認証情報を入力：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

値の確認場所：Supabase ダッシュボード → Project Settings → API

### 3. 依存関係をインストール

```bash
bun install
```

### 4. データベースをセットアップ（任意 — デモ画面の表示に必要）

Supabase の SQL Editor で `supabase/seed.sql` を実行すると、`demo_items` テーブルとサンプルデータが作成されます。

### 5. 開発サーバーを起動

```bash
bun dev
```

[http://localhost:3000](http://localhost:3000) を開くと、データベース接続状態を表示するホーム画面が確認できます。

---

## 開発フロー

```bash
bun dev              # 開発サーバー起動 (http://localhost:3000)
bun run build        # プロダクションビルド
bun run test:ci      # テスト実行
bunx biome check .   # Lint + フォーマットチェック
```

**PR の流れ：**

1. `main` からブランチを切る
2. 機能を実装する
3. Pull Request を作成 — CI が自動実行（シークレットスキャン → lint → build → test）
4. PR ごとに Vercel がプレビュー URL を自動生成
5. `main` にマージ → 本番環境が自動デプロイ

---

## Vercel へのデプロイ

1. [vercel.com](https://vercel.com) でこの GitHub リポジトリをインポート
2. Project Settings → Environment Variables に以下を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** をクリック

`main` へのプッシュで本番デプロイが自動実行されます。PR ごとのプレビュー URL も設定不要で自動生成されます。

---

## spec-kit ワークフロー

このテンプレートには [spec-kit](docs/spec-kit/README.md) が組み込まれています。Claude Code のスラッシュコマンドを使った仕様駆動開発ツールです。

アイデア → 仕様 → 設計 → タスク → コードの流れを1時間以内で進められます：

```
/speckit.specify  →  /speckit.clarify  →  /speckit.plan  →  /speckit.tasks  →  /speckit.implement
```

詳細は [docs/spec-kit/README.md](docs/spec-kit/README.md) を参照してください。

---

## プロジェクト構成

```
.
├── app/                    # Next.js App Router（ページ・APIルート）
│   ├── (auth)/callback/    # OAuth / マジックリンクのコールバック
│   ├── api/health/         # ヘルスチェックエンドポイント
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # ホームページ
├── components/
│   └── features/           # 機能別コンポーネント
├── lib/
│   ├── supabase/           # Supabase クライアント（ブラウザ・サーバー・ミドルウェア）
│   ├── env.ts              # 環境変数バリデーション
│   └── utils.ts            # 共通ユーティリティ
├── supabase/
│   └── seed.sql            # DBスキーマ + シードデータ
├── tests/                  # ユニット・コンポーネントテスト
├── docs/                   # プロジェクトドキュメント
│   └── spec-kit/           # spec-kit ワークフローガイド
└── specs/                  # フィーチャー仕様書（spec-kit の出力先）
```
