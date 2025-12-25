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

## テストコード作成時の厳守事項

### 絶対に守ってください！

#### テストコードの品質
- テストは必ず実際の機能を検証すること
- 'expect(true).toBe(true)'のような意味のないアサーションは絶対に書かない
- 各テストケースは具体的な入力と期待される出力を検証すること
- モックは必要最小限に留め、実際の動作に近い形でテストすること

#### ハードコーディングの禁止
- テストを通すためだけのハードコードは絶対に禁止
- 本番コードに'if(testMode)'のような条件分岐を入れない
- テスト用の特別な値（マジックナンバー）を本番コードに埋め込まない
- 環境変数や設定ファイルを使用して、テストかんきょうと本番環境を適切に分離すること

#### テスト実施の原則
- テストが失敗する状態から始めること（Red-Green-Refactor）
- 境界値、異常系、エラーケースも必ずテストすること
- カバレッジだけでなく、実際の品質を重視すること
- テストケース名は何をテストしているか明確に記述すること

#### 実装前の確認
- 機能の仕様を正しく理解してからテストを書くこと
- 不明な点があれば、仮の実装ではなく、ユーザーに確認すること