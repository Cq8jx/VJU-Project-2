# Spec.md — GlobalNotice VN

> **最終更新:** 2026-02-20

---

## 1. Data Schema（データスキーマ）

### `data.json`（GitHub Pages でホスト）
```json
{
  "version": "1.0.0",
  "updated_at": "2026-02-20T00:00:00Z",
  "notices": [
    {
      "id": "notice-001",
      "title": "お知らせタイトル",
      "category": "academic",
      "date": "2026-02-20",
      "body_md": "Markdown形式の本文...",
      "attachments": [
        {
          "type": "pdf",
          "label": "資料名",
          "url": "https://raw.githubusercontent.com/.../file.pdf"
        }
      ]
    }
  ]
}
```

**カテゴリ値（`category`）:**
| 値 | 説明 |
|----|------|
| `academic` | 学務連絡 |
| `event` | 行事・イベント |
| `general` | 一般連絡 |
| `urgent` | 緊急連絡 |

---

## 2. API Contract（データ取得仕様）

### 2.1 `data.json` フェッチ
```
GET https://<github-pages-host>/data.json
```
- 認証: 不要（Public Repository）
- キャッシュ: `idb-keyval` に TTL 1時間でキャッシュ
- エラー時: キャッシュが存在すればキャッシュを表示、なければエラー Toast を表示

### 2.2 PDF フェッチ
```
GET <attachments[].url>  # raw.githubusercontent.com or GitHub Pages
```
- ブラウザ `fetch()` → `Blob` → `URL.createObjectURL()` でビューアに渡す
- 使用後: `URL.revokeObjectURL()` で必ず解放

---

## 3. Interface Rules（画面と状態遷移）

### ルーティング（ハッシュベース）
| ハッシュ | 表示コンポーネント |
|---------|-------------------|
| `#/` または `#/list` | `NoticeList` |
| `#/detail/:id` | `NoticeDetail` |

### 状態遷移
```
[一覧画面]
  │ カード選択
  ▼
[詳細画面]
  │ PDF リンク選択
  ▼
[PDF ビューア (インライン)]
  │ 閉じる / 戻る
  ▼
[詳細画面に戻る]
```

---

## 4. Error Handling（エラー処理仕様）

| エラー種別 | 処理 |
|-----------|------|
| `data.json` フェッチ失敗 | キャッシュがあれば表示。なければ Toast「データを取得できません」 |
| PDFフェッチ失敗 | `<iframe>` フォールバック → ダウンロードリンクを表示 |
| 不正な `data.json` 形式 | ErrorBoundary でキャッチ → 「データ形式エラー」表示 |
| ネットワーク完全断 | オフラインバナーを表示。キャッシュで動作継続 |
| 個別コンポーネントクラッシュ | `ErrorBoundary` による隔離。他コンポーネントは継続表示 |

---

## 5. Offline / Cache Spec

- **ライブラリ:** `idb-keyval`（IndexedDB ラッパー）
- **キャッシュキー:** `notice-list`, `notice-detail-{id}`
- **TTL:** 1時間（`cache_expires_at` フィールドを一緒に保存して比較）
- **クリア:** 設定画面からワンクリックでキャッシュすべて削除可能
