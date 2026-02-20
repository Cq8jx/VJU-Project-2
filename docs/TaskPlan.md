# TaskPlan.md — GlobalNotice VN

> **最終更新:** 2026-02-20
> **ステータス:** 計画中

---

## Milestones

| # | マイルストーン | 内容 |
|---|---------------|------|
| M1 | **環境構築** | index.html + Import Maps 動作確認 |
| M2 | **データ層** | data.json フェッチ・idb-keyval キャッシュ |
| M3 | **一覧表示** | NoticeList コンポーネント |
| M4 | **詳細表示** | NoticeDetail + HashRouter |
| M5 | **PDF ビューア** | react-pdf (ESM) + iframe フォールバック |
| M6 | **オフライン** | キャッシュ TTL・オフラインバナー |
| M7 | **UI 品質** | Toast・ErrorBoundary・詳細フィルタ |
| M8 | **デバッグ機能** | ログエクスポート・設定画面 |

---

## Dependencies（依存関係）

```
M1 (環境構築)
 └── M2 (データ層)
      ├── M3 (一覧表示)
      │    └── M4 (詳細表示)
      │         └── M5 (PDF ビューア)
      └── M6 (オフライン)
           └── M7 (UI 品質)
                └── M8 (デバッグ機能)
```

---

## Implementation Order（実装順序）

### Phase 1: 基盤（M1-M2）
- [ ] `index.html` に Import Maps を定義
- [ ] Tailwind CDN を追加（Play CDN v3）
- [ ] `src/main.js` で React18 `createRoot` 動作確認
- [ ] `lib/fetch.js` で `data.json` フェッチ関数実装
- [ ] `hooks/useNotices.js` で idb-keyval キャッシュ実装

### Phase 2: コアUI（M3-M4）
- [ ] `NoticeList.js` — カード一覧・カテゴリ別表示
- [ ] `App.js` — ハッシュルーティング実装
- [ ] `NoticeDetail.js` — 詳細ページ表示

### Phase 3: PDF（M5）
- [ ] `PdfViewer.js` — react-pdf (ESM) による表示
- [ ] `<iframe>` フォールバックと DL リンクを実装

### Phase 4: オフライン・品質（M6-M8）
- [ ] オフラインバナーコンポーネント
- [ ] `Toast.js` — 通知コンポーネント
- [ ] `ErrorBoundary.js` — 部分障害の隔離
- [ ] 設定画面 — キャッシュクリア、デバッグログ保存

---

## Risk Notes（リスクと対応）

| リスク | 影響 | 対応 |
|--------|------|------|
| esm.sh の CDN 障害 | 全機能停止 | pinned URL に加え jsDelivr をフォールバックとして検討 |
| react-pdf の ESM 非対応 | PDF 表示不可 | `<iframe>` + DL リンクで代替（要確認） |
| GitHub Pages の CORS | JSON 取得失敗 | `raw.githubusercontent.com` へのフォールバック |
| IndexedDB 無効環境（Safari プライベートモード） | キャッシュ動作しない | メモリキャッシュへフォールバック |
