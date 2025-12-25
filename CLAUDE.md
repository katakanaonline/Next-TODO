# Next-TODO

Next.js + TypeScript + Tailwind CSSで作成したTODOアプリ

## 技術スタック

- Next.js 16
- TypeScript
- Tailwind CSS
- LocalStorage（データ永続化）

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run start  # プロダクションサーバー起動
npm run lint   # ESLint実行
```

## プロジェクト構成

```
src/
  app/
    page.tsx      # メインのTODOアプリコンポーネント
    layout.tsx    # ルートレイアウト
    globals.css   # グローバルスタイル
```

## デプロイ

- GitHub: https://github.com/katakanaonline/Next-TODO
- Vercel: https://next-todo-iota-nine.vercel.app

masterブランチへのプッシュで自動デプロイされる
