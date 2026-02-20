# Testing.md — GlobalNotice VN

> **最終更新:** 2026-02-20

---

## 1. Definition of Done（完成の定義）

以下をすべて満たした場合にのみ「完成」とみなす:

- [ ] `index.html` を直接ブラウザで開いて動作する（ローカルサーバー不要）
- [ ] `data.json` が正常に取得・表示される
- [ ] オフライン状態でキャッシュから一覧が表示される
- [ ] PDF がアプリ内で閲覧できる（またはフォールバックDLリンクが機能する）
- [ ] コンソールに未処理エラーがない

---

## 2. Unit Test 方針

> **注意:** Google AI Studio 環境はテストフレームワーク（Jest 等）の実行環境ではない。
> テストは **関数の手動実行確認** または **サンドボックス環境での Playwright** で代替する。

| 対象 | 検証方法 |
|------|---------|
| `lib/fetch.js` | `console.log` でレスポンスを確認 |
| `hooks/useNotices.js` | キャッシュの読み書きを DevTools → Application → IndexedDB で確認 |
| ルーティング | ブラウザの URL バーで `#/detail/notice-001` を手動入力して遷移確認 |
| ErrorBoundary | 意図的に throw させて画面崩壊しないことを確認 |

---

## 3. Edge Cases（エッジケース）

| ケース | 期待される動作 |
|--------|---------------|
| `data.json` が空配列 `[]` | 「お知らせがありません」メッセージを表示 |
| 存在しない `#/detail/invalid-id` | 一覧画面へリダイレクト or「見つかりません」表示 |
| PDF URL が 404 | フォールバック DL リンクを表示、Toast でエラー通知 |
| IndexedDB 無効環境 | キャッシュなしでフェッチ動作。エラーは出さない |
| オフライン + キャッシュなし | 「接続できません」バナーを全面表示 |
| 非常に長いタイトル（100文字以上） | テキストが折り返しまたは省略（`overflow: hidden`）で表示 |
| モバイル縦向き | レスポンシブレイアウトで崩れない |

---

## 4. Failure Conditions（失敗条件）

以下が発生した場合は**バグとして必ず修正**する:

- ❌ `Uncaught TypeError: Failed to resolve module specifier` — Import Maps 未設定
- ❌ アプリが白画面になる（ErrorBoundary が機能していない）
- ❌ PDF を閉じてもメモリが解放されない（Object URL 未解放）
- ❌ `#/detail/:id` でリロードすると一覧に戻らず 404 になる（HashRouter を使っていない）
- ❌ `data.json` フェッチが 60回/時 を超えて GitHub API レート制限に引っかかる
