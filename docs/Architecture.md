# Architecture.md — GlobalNotice VN

> **最終更新:** 2026-02-20
> **ステータス:** 確定

---

## 1. System Constraints（絶対制約）

> [!IMPORTANT]
> - **Node.js 禁止**: npm / vite / webpack は使用不可
> - **ランタイム**: ブラウザのみ（Google AI Studio / GitHub Pages）
> - **ビルドステップ**: 存在しない。すべてのコードはブラウザが直接解釈する

---

## 2. System Structure（システム構成）

```
root/
  ├── index.html        # エントリポイント。Import Map + Tailwind CDN を定義
  ├── src/
  │     ├── main.js     # ReactDOM.createRoot でアプリを起動
  │     ├── App.js      # ルーティング（ハッシュベース or State切替）
  │     ├── components/ # UI コンポーネント群（各自 ESM として export）
  │     │     ├── NoticeList.js
  │     │     ├── NoticeDetail.js
  │     │     ├── PdfViewer.js
  │     │     └── Toast.js
  │     ├── hooks/      # カスタムフック（useNotices, useCache 等）
  │     └── lib/        # ユーティリティ（fetch, idb-keyval ラッパー 等）
  └── style.css         # カスタム CSS（Tailwind の補足のみ）
```

---

## 3. Dependency Management（依存関係）

**Import Maps** を `index.html` に定義することで、npm 不要で ESM ライブラリをブラウザで利用する。

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "lucide-react": "https://esm.sh/lucide-react",
    "clsx": "https://esm.sh/clsx",
    "tailwind-merge": "https://esm.sh/tailwind-merge",
    "idb-keyval": "https://esm.sh/idb-keyval",
    "react-markdown": "https://esm.sh/react-markdown"
  }
}
</script>
```

---

## 4. Module Boundaries（モジュール境界）

| モジュール | 責務 | 依存 |
|-----------|------|------|
| `App.js` | ルーティング・グローバル状態 | React, hooks |
| `components/` | 表示ロジックのみ、副作用禁止 | React, lib |
| `hooks/` | データフェッチ・キャッシュ制御 | lib, idb-keyval |
| `lib/fetch.js` | GitHub Raw/Pages への HTTP 通信 | なし（fetch API のみ）|

---

## 5. Data Flow（データフロー）

```
GitHub Pages (data.json)
        │
        ▼
  lib/fetch.js  ←── Promise.all で並列フェッチ
        │
        ▼
  hooks/useNotices.js  ←── idb-keyval でキャッシュ
        │
        ▼
  components/NoticeList.js  ──▶  ユーザー表示
        │
        ▼ (選択)
  components/NoticeDetail.js
        │
        ▼ (PDF あり)
  components/PdfViewer.js  ──▶  react-pdf または <iframe> フォールバック
```

---

## 6. Routing（ルーティング方針）

- **採用**: ハッシュベースルーティング（`#/list`, `#/detail/:id`）
- **理由**: サーバー側の Rewrite 設定なしで GitHub Pages / ファイル直接起動でも動作するため
- **禁止**: `pushState` ベースの BrowserRouter（静的ホスティングで 404 になるため）

---

## 7. Tech Decisions（技術選定根拠）

| 決定 | 理由 |
|------|------|
| React 18 (ESM) | コンポーネントベースの UI 構築。Node.js 不要で esm.sh 経由で利用可能 |
| Tailwind CSS (CDN) | ビルドなしでユーティリティクラスが使える（v3 Play CDN） |
| idb-keyval | IndexedDB の軽量ラッパー。ESM 対応 |
| GitHub Pages (data.json) | CORS フリー、レート制限なし（GitHub API の 60回/時 制限を回避） |
| react-pdf (ESM) | モバイル互換性向上。ESM 提供あり |
| HashRouter | サーバー設定不要で SPA 動作が可能 |
