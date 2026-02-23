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
- [ ] Placed after YAML, before first heading
- [ ] States AI-generated and reference-only purpose

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

### 1.6 HTML Inside Markdown

- [ ] No `*...*` or `**...**` inside `<p>`, `<div>`, `<span>` tags
- [ ] Emphasis inside HTML uses `<em>`, `<strong>`
- [ ] `<p align="center">` content uses HTML tags

### 1.7 PDF → MD レイアウト整合性 (PDF Layout Fidelity)

PDFの視覚的レイアウトがMDに正確に反映されていることを確認する。

- [ ] PDFで中央揃えの箇所（タイトル、サブタイトル、発行注記等）が `<p align="center">` で中央揃えになっている
- [ ] 規程本文の冒頭タイトルブロック（例: "QUY CHẾ" / "Đào tạo thạc sĩ..." / "(Ban hành kèm theo...)"）が3行とも中央揃え
- [ ] 決定文の "QUYẾT ĐỊNH" タイトルが中央揃え（`#` 見出しの場合はCSS依存のため `<p align="center">` を推奨）
- [ ] 2カラムレイアウト（送付先・署名欄）がflex divで再現されている
- [ ] 署名欄の役職名・氏名が `text-align: center` で中央揃え
- [ ] 上記のレイアウトが3言語（VI/EN/JA）で統一されている

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
- [ ] `.khoan` and `.diem` classes have correct padding
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
- [ ] push → deploy → hard reload confirms on GitHub Pages

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
