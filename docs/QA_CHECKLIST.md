# QA Checklist — VJU Document Portal

## 1. 文書フォーマット検証 (Document Format Validation)

### 1.1 YAML Front Matter

- [ ] `doc_id` is official notation with diacriticals and slash (e.g. `3626/QĐ-ĐHQGHN`)
- [ ] `date` in ISO format (YYYY-MM-DD)
- [ ] `department` is one of: Academic Affairs, Quality Assurance, Financial Affairs, General Affairs
- [ ] `type` is one of: Regulation, Circular, Guideline, Notification, Decree, Decision, Report
- [ ] `restricted` is boolean (true/false)
- [ ] `last_updated` exists

### 1.2 Disclaimer Block

- [ ] All 3 language versions have language-appropriate disclaimer
- [ ] Placed after YAML, before first heading (renders above document title)
- [ ] States AI-generated and reference-only purpose
- [ ] Disclaimer uses blockquote (`>`) or `<div class="source-note">` for styled rendering
- [ ] Background color matches warning style (yellow `#fffbeb` with orange left border `#f59e0b`)

### 1.3 Heading Normalization

- [ ] Chapters use `#` (h1)
- [ ] Articles use `##` (h2)
- [ ] Diacritical marks preserved in headings (Điều, Chương)
- [ ] Nesting is correct (parent → child → grandchild)

### 1.4 Decision Section (QĐ documents only)

- [ ] Legal bases in italic (`*Căn cứ...*`)
- [ ] Decision articles in bold (`**Điều 1.**`) — NOT headings
- [ ] Recipient section in HTML flex div (2-column)
- [ ] Signature block in `<div>`
- [ ] Horizontal rules (`---`) properly placed

### 1.5 khoản/điểm Indentation

- [ ] khoản (1., 2.): 4 spaces
- [ ] điểm (a), b)): 8 spaces
- [ ] Sub-lists: 8 spaces + `- `
- [ ] New khoản resets indent level (not child of previous điểm)
- [ ] No mixing of khoản (1.) and điểm (a)) numbering at same level
- [ ] khoản (1., 2., 3.) are NOT indented — they are clause-level elements, not list items
- [ ] khoản are distinguished from bullet lists: numbered clauses at article body level vs sub-item lists
- [ ] điểm / bullet indentation visually checked in browser (avoid excessive left padding after CSS changes)

### 1.6 HTML Inside Markdown

- [ ] No `*...*` or `**...**` inside `<p>`, `<div>`, `<span>` tags
- [ ] Emphasis inside HTML uses `<em>`, `<strong>`
- [ ] `<p align="center">` content uses HTML tags

## 1.7 PDF → MD レイアウト整合性 (PDF Layout Fidelity)

**[CRITICAL REQUIRED STEP]** EN版・JA版の修正作業に入る前に、まず必ず原本PDFの内容やレイアウトがベトナム語(VI)のMarkdownに完全に、欠落なく正確に反映（変換）されているかの品質保証（QA）を先に行うこと。付録（Annex）などの末尾セクションが漏れていないか注意すること。

PDFの視覚的レイアウトがMDに正確に反映されていることを確認する。

- [ ] PDFで中央揃えの箇所（タイトル、サブタイトル、発行注記等）が `<p align="center">` で中央揃えになっている
- [ ] 規程本文の冒頭タイトルブロック（例: "QUY CHẾ" / "Đào tạo thạc sĩ..." / "(Ban hành kèm theo...)"）が3行とも中央揃え
- [ ] 決定文の "QUYẾT ĐỊNH" タイトルが中央揃え（`#` 見出しの場合はCSS依存のため `<p align="center">` を推奨）
- [ ] 2カラムレイアウト（送付先・署名欄）がflex divで再現されている
- [ ] 署名欄の役職名・氏名が `text-align: center` で中央揃え
- [ ] 上記のレイアウトが3言語（VI/EN/JA）で統一されている
- [ ] ブラウザ印刷による比較を行う場合、アプリUI全体ではなく「本文のみ (content-only)」を印刷/exportして比較する
- [ ] ブラウザ保存PDFのページ構成が比較対象として妥当か確認する（UI印刷で極端に少ページ化している場合は比較無効）

## 2. 文書ID・命名規則 (Document ID & Naming)

### 2.1 File Naming

- [ ] Location: `data/` (root level)
- [ ] Format: `{Document_ID}_{English_Title}_transcription[_lang].md`
- [ ] Document ID in filename uses `-` separator (sanitized)
- [ ] Translation files have `_en.md` or `_ja.md` suffix

### 2.2 Document ID Integrity

- [ ] YAML `doc_id` keeps `/` and diacriticals
- [ ] EN/JA translations keep original Vietnamese doc_id
- [ ] No accidental diacritical removal (❌ `QD-DHQGHN`)
- [ ] No institution name translation in ID (❌ `QD-VNU`)

### 2.3 DOC_REGISTRY Consistency

- [ ] Key is sanitized doc_id (`-` separated)
- [ ] `prefix` matches filename base
- [ ] `title` is English
- [ ] `tags` relate to department
- [ ] `department` is valid value
- [ ] `relations` array references valid doc IDs

## 3. Markdown → HTML レンダリング (Rendering)

### 3.1 Front Matter Processing

- [ ] `parseFrontMatter()`: YAML block correctly extracted
- [ ] `parseFrontMatter()`: No YAML → returns `{}`
- [ ] `parseFrontMatter()`: `restricted` converted to boolean
- [ ] `stripFrontMatter()`: YAML block removed, body text returned
- [ ] `stripFrontMatter()`: No YAML → returns original text

### 3.2 Markdown Parser (marked.js)

- [ ] `breaks: true` configured
- [ ] `1. ` lines escaped to `1\. ` (prevent `<ol>` conversion)
- [ ] No unintended `<ol>` in rendered output
- [ ] Vietnamese legal điểm letters (a-e, g-h, i-k) handled in preprocessor
- [ ] Dash list items (`- `) with 4+ spaces indentation do not render as code blocks (monospace font)
- [ ] `preprocessLegalMd` strips excess indentation from `- ` list items

### 3.3 HTML Post-processing

- [ ] Regex allows whitespace after tags: `<p>\s*(\d+)\. `
- [ ] CSS class assignment: `.khoan` / `.diem` applied correctly
- [ ] DOMPurify sanitization with custom allowed tags/attrs

### 3.4 Indent Method Consistency

- [ ] Single indent method used (CSS `padding-left` only, no NBSP)
- [ ] `.khoan` class has `padding-left: 0` (khoản is NOT a list — must not be indented)
- [ ] `.diem` class has appropriate `padding-left` for sub-item indentation
- [ ] No NBSP characters embedded in text content

## 4. 翻訳品質 (Translation Quality)

### 4.1 Glossary Compliance

- [ ] Organization names match glossary (ĐHQGHN → VNU / ベトナム国家大学ハノイ校)
- [ ] Titles match glossary (Giám đốc → President / 総長)
- [ ] Abbreviations sections 11.1-11.5 all applied
- [ ] KT. (Ký thay = Acting/代理署名) correctly translated
- [ ] No "ハノイ国家大学" (must be "ベトナム国家大学ハノイ校")
- [ ] No "所長" for Giám đốc (must be "総長")

### 4.2 Structural Consistency Across Languages

- [ ] khoản/điểm indent identical in VI/EN/JA
- [ ] HTML div structures (2-column etc.) identical in all 3
- [ ] List structures identical in all 3
- [ ] Heading translation follows gold standard pattern
- [ ] No suspicious early line breaks in prose (mid-sentence wraps preserved from OCR/translation are merged when not intentional)
- [ ] JA版で `breaks: true` レンダリング時に中途改行が可視化される不自然な改行がない（箇条書き文中の継続行を重点確認）
- [ ] JA版で異なるベトナム語固有名詞が同一カタカナ表記に潰れていない（必要に応じてローマ字併記で識別）
- [ ] 同一文書内で同じ概念の訳語が不必要に揺れていない（例: `証明書/認証` と `資格証明書・認定書`）

### 4.3 Heading Translation Patterns

- [ ] VI: `# Chương I. ...` → EN: `# CHAPTER I. ...` → JA: `# 第I章 ...`
- [ ] VI: `## Điều 1. ...` → EN: `## Article 1. ...` → JA: `## 第1条 ...`

## 5. ブラウザ動作検証 (Browser/UI Testing)

### 5.1 Document Loading

- [ ] index.html loads on GitHub Pages
- [ ] Public document card click → reader opens
- [ ] All 3 languages display correctly
- [ ] 404 shows "Translation not available" message

### 5.2 Split View & Scroll Sync

- [ ] VI pane (left) and EN/JA pane (right) display side-by-side
- [ ] Left scroll → right follows (heading-based sync)
- [ ] Drag handle adjusts pane ratio
- [ ] Min-width constraints work at extreme ratios

### 5.3 TOC Navigation

- [ ] TOC extracts chapter/article headings
- [ ] TOC item click → scrolls to correct section
- [ ] Scroll spy highlights current section in TOC
- [ ] Auto-scroll TOC to keep active link visible

### 5.4 Firebase Auth (Restricted Docs)

- [ ] Unauthenticated → login modal appears
- [ ] Google login with @vju.ac.vn → document displays
- [ ] Google login with @gmail.com → Access Denied modal
- [ ] Firebase config placeholder → no continuous console errors
- [ ] `isVjuMember()` correctly checks email domain
- [ ] `currentUser` state accurate after auth changes

### 5.5 PDF Download

- [ ] PDF download button works
- [ ] Restricted PDF uses signed URL protection
- [ ] `Print/Export (Content Only)` で reader UI を除外した本文PDFを保存できる
- [ ] content-only PDF を原本PDFと比較する際、比較範囲（対象ページ/対象レイアウト要素）を記録する

### 5.6 Responsive Design

- [ ] Desktop: split view works
- [ ] Tablet/Mobile: functional
- [ ] Chrome/Safari/Firefox latest versions

## 6. エッジケース (Edge Cases)

| Case | Expected Behavior |
|------|-------------------|
| MD file 404 | "Translation not available" message per language |
| No YAML Front Matter | Text returned as-is |
| `restricted: true` + no Firebase config | Login modal shows, Firestore error after login |
| Google popup blocked | Error caught, user guidance shown |
| 500+ line document | marked.js renders ≤ 3 seconds |
| Unregistered docId in DOC_REGISTRY | docId returned as fallback (no error) |
| Multiple documents opened sequentially | No memory leak (innerHTML overwrite) |
| Extreme drag handle position | Min-width constraint prevents collapse |

## 7. 失敗条件 (Failure Conditions — Must Fix)

These are bugs that must be fixed immediately:

- ❌ Document card click → white screen
- ❌ YAML Front Matter visible in rendered output
- ❌ @gmail.com login → restricted document accessible
- ❌ TOC click → scrolls to wrong section
- ❌ One split pane stays blank/doesn't update
- ❌ `navigateTo()` doesn't switch view
- ❌ Firebase config placeholder → continuous errors

## 8. 回帰テスト (Regression — New Document Addition)

When adding a new document:

- [ ] DOC_REGISTRY entry added with correct fields
- [ ] 3 language MD files exist in `data/`
- [ ] YAML Front Matter formatted correctly
- [ ] Card added to index.html with `data-doc` attribute
- [ ] Card click → reader opens
- [ ] All 3 languages render correctly
- [ ] Run suspicious line-break detection (heuristic + manual review) and fix only true positives
- [ ] `issue_date` が `null` の場合、本文日付行（VI/EN/JA）から一意に復元可能なら ISO日付を設定
- [ ] push → deploy → hard reload confirms on GitHub Pages
- [ ] （高精度QA時）Browser direct check に加えて content-only PDF を保存し、原本PDFと目視比較した結果を記録

## 9. パフォーマンス・セキュリティ (Performance & Security)

### 9.1 Performance

- [ ] Initial load ≤ 3 seconds (Promise.all parallel fetch)
- [ ] marked.js rendering: no perceptible delay

### 9.2 Security

- [ ] Firebase config is public (Security Rules protect data)
- [ ] No secrets in client-side code
- [ ] Only @vju.ac.vn domain accesses restricted docs (Security Rules)

### 9.3 Hosting

- [ ] GitHub Pages (static)
- [ ] No build step required
- [ ] No CORS issues

## 10. 実装教訓 (Lessons Learned)

| # | Lesson | Impact |
|---|--------|--------|
| 1 | `replace_all` with trailing spaces can lose whitespace | Always verify diffs after bulk replace |
| 2 | Firebase Compat SDK required for single-file SPA | ES Module version has scope issues |
| 3 | CSS global selector changes have wide side effects | Use preprocessor, not CSS, for document formatting |
| 4 | Prefer DOM API over regex for HTML post-processing | Regex breaks on whitespace variations |
| 5 | `breaks: true` + `text-indent` conflict in lists | Escape `1. ` in preprocessor instead |
| 6 | Always verify on deployed GitHub Pages | Local testing alone is insufficient |
| 7 | Large translations (500+ lines): split into parallel agents | 4 agents by chapter groups |

## 11. 進行中タスク — 3636 インデント修正 (2026-02-23)

### 完了済み

| # | 作業内容 | コミット | 状態 |
|---|---------|---------|------|
| 1 | VI版 ダッシュリスト 4sp→2sp | `2667d75` | ✅ pushed |
| 2 | EN/JA版 ダッシュリスト 4sp→2sp (8件ずつ) | `9ca6f84` | ✅ pushed |
| 3 | CSS: `p.khoan` padding-left 1.5em→0 | `1f11cab` | ✅ pushed |
| 4 | テストコード修正・追加 (下記参照) | — | ⚠️ 未コミット |

### 未コミットの変更 (ファイル2件)

**`test/test-qa-validation.js`:**
- `validateIndentation()` ロジック反転: khoản列0=正 / 4sp字下げ=誤
- 4spダッシュリスト検出テスト追加 (2件)
- `validateCssRules()` 関数追加: `p.khoan` の padding-left: 0 検証
- CSS検証テスト追加 (2件)

**`test/test-markdown-preprocessing.js`:**
- `preprocessForTest()` を行ごと処理に書き換え（index.html の `preprocessLegalMd` と同期）
- 4spダッシュリスト除去ロジック追加
- 4spダッシュリスト除去テスト追加 (2件)

### 残タスク

- [ ] **テスト実行**: `test/test-runner.html` をブラウザで開き全テストパス確認
- [ ] **テストコード commit & push**: 上記2ファイルをコミット
- [ ] **デプロイ検証 (CSS修正)**: GitHub Pages で 3636 EN版 Article 35 付近を表示し、khoản番号がインデントされていないことを確認
- [ ] **デプロイ検証 (ダッシュリスト)**: Article 35 のダッシュリスト項目がモノスペースフォントでなく通常フォントで表示されていることを確認
- [ ] **JA版も同様に確認**: JP切替で同じ箇所が正常表示されること
