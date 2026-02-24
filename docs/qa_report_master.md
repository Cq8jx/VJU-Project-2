# QA Master Report (PDF -> MD)

- This file is the consolidated QA log for PDF->Markdown quality assurance, fixes, and reviews.
- New QA entries are appended with date and status updates.

## 2026-02-23 Batch 1 (Initial QA via script + Claude)

### Scope
- `911-TB-DHVN_Foreign Language Certificate Submission VJU2024`
- `984-TB-DHVN_Foreign Language Certificate Submission VJU2023`
- `1010-TB-DHVN_English Certificate Submission VJU2025`

### Script Checks (common findings)
- YAML standardized fields missing / incomplete in all three documents (all language variants)
- Disclaimer block missing in all three documents (all language variants)
- Notification documents have no `##` headings (not necessarily a defect; checklist item may not apply to all TB docs)
- `_source` contamination detected in some `title` fields
- EN/JA table rendering defects suspected (ASCII grid / escaped pipes)

### Claude QA Findings Summary

#### 911-TB-DHVN (VJU2024)
- EN/JA Appendix 1 and Appendix 2 tables are broken (ASCII/escaped-pipe formatting, unreadable) [CRITICAL]
- EN/JA Section 2 table also broken [CRITICAL]
- EN/JA header/recipient/signature blocks collapsed into single-line formatting [MEDIUM]
- EN/JA institutional name translation error: `Nam Can Tho University` rendered as `Can Tho University` [HIGH]
- VI front matter title contains `_source` suffix [HIGH]

#### 984-TB-DHVN (VJU2023)
- EN/JA cross-reference doc IDs incorrectly changed from `ĐHQGHN` to `ĐHVN` and lost diacritics [HIGH]
- EN/JA Appendix formatting severely degraded (table escape / wrapping issues) [LOW-MEDIUM for rendering, HIGH where IDs wrong]
- VI/EN/JA section 1.2 bullet markers missing vs PDF [MEDIUM]
- `id` field format and `issue_date: null` metadata need normalization [MEDIUM]
- VI front matter title contains `_source` suffix [MEDIUM]

#### 1010-TB-DHVN (VJU2025)
- JA version is from a different source document (content contamination), requiring full rewrite [CRITICAL]
- JA structure/sections/appendices do not match PDF/VI/EN [CRITICAL]
- VI front matter title contains `_source` suffix [HIGH]
- EN only minor issues; VI/EN are mostly structurally faithful [LOW-MEDIUM]

### Additional QA Checks Added to Standard Workflow
1. Source-document contamination check (translations must match the exact source document, not related prior-year documents)
2. EN/JA table format validation (fail on ASCII grid tables or escaped-pipe pseudo tables for intended Markdown tables)
3. Proper-name list reconciliation for annexes (e.g., university names, row-by-row against VI)
4. Doc ID preservation check (keep diacritics and issuing institution codes in references)
5. Notification layout block check (header / recipients / signature must not collapse into one line)

### Next Actions (planned)
- [ ] Claude fix + Claude review: `1010` JA full rewrite
- [ ] Claude fix + Claude review: `911` EN/JA table/layout repair
- [ ] Claude fix + Claude review: `984` EN/JA ID + table/layout repair

## 2026-02-23 Batch 1A (Claude Fix Attempt / Timeout Tracking)

### Claude Execution Notes
- `1010` JA full rewrite (direct file edit request) timed out at 180s with no response.
- `1010` JA full rewrite (reduced scope: VI/EN-based rewrite, no PDF read) timed out at 180s with no response.
- Per user rule, these >3 min no-response events were reported immediately during execution.

### Claude-applied Fixes (completed)
- Target: `1010-TB-DHVN_English Certificate Submission VJU2025`
- EN footnote marker formatting corrected in Appendix 2 footnote definition: `(**)` -> `(\*\*)` (rendering-safe literal marker)
- VI title front matter checked by Claude; no additional fix required (already clean)

### Claude Feedback (for QA/formatter improvements)
- Add an automatic rule to verify footnote marker escape consistency between reference markers and footnote definitions (e.g., `(*)`, `(\*\*)`, `†`) so Markdown does not reinterpret literal markers as emphasis.

### Remaining Work (still pending)
- `1010` JA file: full rewrite to correct source-document contamination
- `1010` PDF-based post-fix review by Claude (after JA rewrite)
## 2026-02-23 1010-TB-DHVN Script Check Pass (Pre-fix)

### Files
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_transcription.md`
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_transcription_en.md`
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_transcription_ja.md`

### Script results (Codex-run)
- VI: metadata fields present, source-note present, pipe tables detected, no structural warning triggered
- EN: metadata fields present, source-note present, pipe tables detected, no structural warning triggered
- JA: metadata fields present, but script flags triggered:
  - sanitized `QD` token pattern detected in body references (likely diacritic loss)
  - ASCII separator lines detected (`ascii-separator-lines=7`), indicating non-Markdown table formatting contamination
  - no pipe-table lines detected (`pipe_table_lines=0`) while VI/EN have 45 each

### Status
- Pre-fix script checks confirm JA requires structural rewrite before PDF-based re-review.
## 2026-02-23 1010-TB-DHVN Claude QA -> Fix -> Review Cycle (Completed)

### Scope
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_source.pdf`
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_transcription.md`
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_transcription_en.md`
- `data/1010-TB-DHVN_English Certificate Submission VJU2025_transcription_ja.md`

### Claude QA Findings (pre-fix)
- JA file was contaminated by a different source document (critical): wrong sections, wrong tables, wrong appendices (JLPT template mixed in), ASCII-art tables, missing actual appendices.
- VI/EN structures were mostly faithful; no critical PDF->MD issues confirmed there.
- Claude provided a 3-chunk fix plan for JA (`Chunk A: header+Sec1-2`, `Chunk B: Sec3-4+signature`, `Chunk C: appendices`).

### Claude-based Fixes Applied
- JA file rebuilt by applying Claude-generated replacement chunks for all content after the source-note.
- Fixed JA structural alignment with VI/EN:
  - Restored sections 1-4 with correct headings
  - Replaced ASCII-art blocks with Markdown pipe tables (main table + Appendix 1 + Appendix 2)
  - Restored Appendix 1 conversion table and Appendix 2 institution list (27 rows)
  - Removed contaminated JLPT authorization content from unrelated document
  - Restored Vietnamese document IDs with diacritics (`QĐ-ĐHQGHN`, `HD-ĐHQGHN`, `HD-ĐHVN`)
- Additional Claude polish pass applied:
  - Corrected VJU/ĐHQGHN wording to avoid organization-code confusion
  - Unified `VJU2025年度生` wording
  - Unified JA terminology (`資格証明書・認定書`)
  - Normalized style in Sections 3-4 toward formal register
  - Normalized `枠組み` spelling

### Script Validation (post-fix, Codex-run)
- JA `pipe_table_lines`: `45` (matches VI/EN expectation)
- JA `ascii_sep_lines`: `0` (ASCII table contamination removed)
- Required IDs present: `QĐ-ĐHQGHN`, `1011/HD-ĐHQGHN`, `880/HD-ĐHVN`
- Contamination tokens absent: `JLPT`, `委任状`, `CTĐT`, `標準トレーニング`

### Claude Post-fix Review (intermediate)
- Result: `PASS WITH NOTES`
- Notes addressed by additional Claude fix pass:
  - JA wording `日越大学（ĐHQGHN）` ambiguity
  - `VJU2025コースの学生` term consistency
  - mixed register / mixed terminology in sections 3-4

### Claude Final Post-fix Review
- Result: `JA contamination RESOLVED`
- No `Critical` / `High` issues remaining
- Remaining low-priority metadata item:
  - `issue_date: null` in all 3 files can be populated as `2025-09-09`

### Claude Feedback (captured)
- Add JA style-register consistency checks (e.g., detect mixed `です/ます` and `である/こと` in the same document)
- Add intra-document terminology consistency checks (same concept translated differently in separate sections)
- Add abbreviation/organization-code disambiguation checks for patterns like `A（B）` vs `A、B`
- Populate `issue_date` automatically from document date line when confidently parsed

### Timeout Events (300s threshold)
- None in this cycle
## 2026-02-23 Batch 2 Script Checks (911 / 984 / 1010 metadata follow-up)

### Scope
- `911-TB-DHVN_Foreign Language Certificate Submission VJU2024` (VI/EN/JA)
- `984-TB-DHVN_Foreign Language Certificate Submission VJU2023` (VI/EN/JA)
- `1010-TB-DHVN_English Certificate Submission VJU2025` (metadata follow-up only)

### Script Findings Summary
- `911` VI: pipe tables detected (`38`), no ASCII-table warning
- `911` EN/JA: no pipe tables; ASCII table separators detected (`6`), escaped pipes detected, sanitized `QD` token pattern detected
- `984` VI: pipe tables detected (`10`), no ASCII-table warning
- `984` EN/JA: ASCII table separators detected (`2`), escaped pipes detected, sanitized `QD` token pattern detected
- `1010` VI/EN/JA: structural checks clean; all three still have `issue_date: null` (low-priority metadata normalization)

### Status
- `911` / `984` require Claude-based structure/table repairs + ID corrections
- `1010` requires only metadata cleanup (`issue_date`)
- Script-check commit stamp: `984-TB-DHVN` included in Batch 2 (same findings block above)
- Script-check commit stamp: `1010-TB-DHVN` metadata follow-up included in Batch 2 (same findings block above)
## 2026-02-23 Batch 2 Claude QA -> Fix -> Review Cycle (911 / 984 / 1010)

### 911-TB-DHVN (VJU2024)
- Claude QA (pre-fix): EN/JA had table corruption (ASCII/escaped pipe), header/recipient/signature layout collapse, doc-ID diacritic loss; VI mostly good.
- Claude fixes applied:
  - VI title `_source` removed
  - EN/JA header/title block layout normalized
  - EN/JA recipients/signature block restored to multi-line structure
  - EN/JA §2 + Appendix 1 + Appendix 2 converted to markdown pipe tables
  - EN/JA doc-ID diacritics restored (`QĐ-ĐHQGHN`, `QĐ-ĐHNN`)
  - JA terminology fixes (`履修免除`, formal closing phrase)
  - JA appendix institution ambiguity fixed (`Nam Cần Thơ`, `Tây Nguyên` disambiguation)
- Claude post-fix review: `PASS WITH NOTES`
- Remaining notes (non-blocking): old front-matter `id` format, body `911/TB-DHVN` lacking `Đ`, EN wording `credit` vs `score`, JA line-break hygiene, CDR expansion.
- Claude QA feedback captured: add JA line-break hygiene check under `breaks: true` rendering.

### 984-TB-DHVN (VJU2023)
- Claude QA (pre-fix): EN/JA doc-ID errors (issuer + diacritics), table/appendix formatting breakage (`\\|`, ASCII separators), recipients/signature layout collapse, item #18 Nam Cần Thơ translation error. VI missing section 1.2 bullets and title `_source` contamination.
- Claude fixes applied:
  - VI title `_source` removed; section 1.2 bullet formatting restored (2 bullets)
  - EN/JA doc-IDs corrected with diacritics and correct issuer codes
  - EN/JA section 1.2 bullets restored
  - EN/JA appendix/table rendering repaired (escaped pipes removed, formatting normalized)
  - EN/JA recipients/signature block layout restored
  - EN wording fixed: `Vietnam National University, Hanoi`
  - EN/JA item #18 fixed to `Nam Can Tho` / `ナムカントー大学`
  - JA oversized separators replaced with standard `---`
  - JA proper-noun ambiguity patch: entry 1/23 disambiguated with romanization (`Thái Nguyên` / `Tây Nguyên`)
  - JA appendix footnote institution term corrected: `言語国際研究大学` -> `外国語大学`
- Claude post-fix review: `PASS WITH NOTES` -> after follow-up patches, no high issues remain (only low/cosmetic/metadata notes reported).
- Claude QA feedback captured: add JA katakana proper-noun disambiguation rule (same katakana from different Vietnamese names).

### 1010-TB-DHVN (metadata follow-up)
- Claude QA confirmed `issue_date` is safely derivable as `2025-09-09` from VI/EN/JA date lines.
- Claude fix applied: set `issue_date: "2025-09-09"` in all 3 language files only.
- Claude review result: `PASS` (no unintended metadata changes).

### Batch 2 Timeout Events (300s threshold)
- None

### Additional QA Checks Added/Strengthened (from Claude feedback)
1. JA line-break hygiene for rendered markdown with `breaks: true` (avoid accidental visible mid-sentence breaks)
2. JA proper-noun disambiguation when different Vietnamese names collapse to identical katakana (use parenthetical romanization)
3. Metadata normalization pass for `issue_date` from body date line when unambiguous across VI/EN/JA

## 2026-02-23 Document 3626 QA Integration

### Scope
- `data/3626-QD-DHQGHN_Regulation on Undergraduate Training_transcription.md`
- `data/3626-QD-DHQGHN_Regulation on Undergraduate Training_transcription_en.md`
- `data/3626-QD-DHQGHN_Regulation on Undergraduate Training_transcription_ja.md`
- Checklist reference: `docs/QA_CHECKLIST.md`

### Checklist Items Verified / Addressed
- YAML front matter validation
- Heading normalization (Chapter/Article levels)
- Decision-section formatting (legal basis / articles / signature blocks)
- khoản/điểm indentation normalization across VI/EN/JA
- PDF->MD layout fidelity (high-level structural checks)
- Cross-language structural consistency
- Heading translation pattern consistency

### Fix Summary
- Applied hierarchical indentation across all three language files:
  - Level 1 clauses (`1.`, `2.`): no indent
  - Level 2 items (`a)`, `b)`): 4 spaces
  - Level 3 sub-items (`-`): 8 spaces
- Corrected broken LaTeX formula syntax in Article 8 across VI/EN/JA (`\times`, `\bigcap`, `\textstyle`, `\text`)

### Findings / Deviations
- `docs/QA_CHECKLIST.md` indentation guidance conflicts with observed repository convention (8-space vs 4-space for second-level items).
- QA chose 4-space indentation for level-2 items to preserve readability and consistency with existing documents; this should be reviewed as a checklist standardization item.

### Remaining Risks
- QA focused on formatting/structure consistency and checklist adherence.
- No full line-by-line semantic verification against the source PDF was recorded, so non-structural transcription issues may remain.

### Final Status
- `SUCCESS`

## 2026-02-23 Document 3636 QA Integration

### Scope
- `data/3636-QD-DHQGHN_Regulation on Masters Training_source.pdf`
- `data/3636-QD-DHQGHN_Regulation on Masters Training_transcription.md`
- `data/3636-QD-DHQGHN_Regulation on Masters Training_transcription_en.md`
- `data/3636-QD-DHQGHN_Regulation on Masters Training_transcription_ja.md`
- Checklist reference: `docs/QA_CHECKLIST.md`

### Fix Summary
- Structural / heading normalization:
  - Converted main DECISION heading to centered non-heading paragraph in VI/EN/JA
  - Rebuilt EN/JA signature and recipient (`Nơi nhận`) blocks with two-column HTML layout
- Content / metadata correction:
  - Corrected EN/JA subtitle document ID from `QD-VNU` to `QĐ-ĐHQGHN`
  - Changed EN/JA header number labels to source-consistent `Số:`
- Indentation / list formatting:
  - Removed leading whitespace from EN/JA top-level numbered clauses (`1.`, `2.`...) to match VI structure and checklist rendering expectations

### QA Checklist Items Addressed
- Heading normalization
- Decision section formatting / layout
- khoản/điểm indentation
- PDF layout fidelity (structural scope only)
- Document ID integrity
- Cross-language structural consistency
- Heading translation patterns

### Findings / Risks
- Primary issue was structural drift between VI and EN/JA (lists, HTML layout blocks, signature section).
- Minor metadata inconsistencies (document ID and labels) were also present in translations.
- Content accuracy and translation fidelity were not verified against the source PDF.
- Final visual browser rendering was not explicitly verified after structural fixes.

### Final Status
- `PARTIAL` (formatting/structure QA completed; semantic/source-PDF verification not completed)
## 2026-02-23 WEB-TTTS2026-VJU (Website Article Intake Page) — PDF Save + MD/EN/JA + Viewer Registration

### Source
- URL: `https://vju.ac.vn/ttts2026/`
- Saved PDF snapshot: `data/WEB-TTTS2026-VJU_Undergraduate Admissions Information 2026_source.pdf` (Playwright print, A4, 37 pages)
- Article content extracted from WordPress REST API (`/wp-json/wp/v2/posts/43086`) and converted from HTML to Markdown via `pandoc`

### Deliverables Created
- `data/WEB-TTTS2026-VJU_Undergraduate Admissions Information 2026_transcription.md` (VI)
- `data/WEB-TTTS2026-VJU_Undergraduate Admissions Information 2026_transcription_en.md` (EN)
- `data/WEB-TTTS2026-VJU_Undergraduate Admissions Information 2026_transcription_ja.md` (JA)
- `index.html` updated with new card + `DOC_REGISTRY` entry (`WEB-TTTS2026-VJU`)

### Script Checks (Codex-run)
- VI/EN/JA all present with front matter + source metadata (`source_url`, `source_modified`)
- Line counts: VI 2037 / EN 2035 / JA 2029
- Markdown tables: 56 lines (all 3)
- HTML tables: 14 (all 3)
- `index.html` card and `DOC_REGISTRY` entry confirmed for `WEB-TTTS2026-VJU`

### Claude QA / Fix / Review Summary
- Claude translated EN/JA in 4 chunks (A-D) preserving markdown/HTML/tables
- Claude QA found and fixes were applied for:
  - `ẸMM` typo -> `EMJM` (all 3)
  - `D11D53` cell ambiguity -> `D11<br />D53` (all 3)
  - VI typo `Bộ GB&ĐT` -> `Bộ GD&ĐT`
  - EN HSA term consistency -> `Competency Assessment Test (HSA)`
  - EN decimal consistency `20,5` -> `20.5` (11.1 table values)
  - EN/JA Section 11.1 table program names translated (previously left in Vietnamese)
  - Added formula omission note near first `ĐQĐ` formula because source web page itself omits term before `+`
  - Missing `)` restored in VJU5 row (VI/EN/JA)
- User-provided screenshots (SAT and interview conversion tables) were used as supplemental visual confirmation for the conversion table values and formulas shown in section 3 tables.

### Final QA State
- Verdict from Claude: `CONDITIONAL PASS` -> after targeted fixes, no blocking structural/data issues remain for publication.
- Remaining items are low-priority wording/consistency cleanups (mainly JA terminology harmonization and minor cosmetic artifacts).

### QA Feedback Added
- For long website article conversions, prefer chunked translation + chunked review to avoid LLM timeouts and preserve large table/HTML blocks.

### 2026-02-23 Final Adjustment (ĐQĐ notation note clarification)
- User requested a clearer explanation of the shorthand in the source-omitted formula fragment `ĐQĐ = + Điểm ƯT (ĐT, KV)`.
- Claude provided revised note text for VI/EN/JA clarifying:
  - `ĐQĐ = Điểm quy đổi` (converted score / 換算点)
  - `Điểm ƯT = Điểm ưu tiên` (priority points / 優先加点)
  - `(ĐT, KV)` = object/category and region priority categories
- Updated the explanatory note in both occurrences of the formula fragment (section 3.1) across VI/EN/JA files.

### 2026-02-23 PDF Source Replacement (A4 message-focused version adopted)
- Replaced `data/WEB-TTTS2026-VJU_Undergraduate Admissions Information 2026_source.pdf` with a message-focused local-HTML print (A4 portrait) that hides site chrome/CTA widgets.
- Rationale: prior full-page snapshot was too narrow in content area and produced an unnecessarily tall render.
- Removed temporary alternates after adoption:
  - `*_source_message_a4.pdf`
  - `*_source_message_wide.pdf`

### 2026-02-23 Viewer Update + Terminology Audit (WEB-TTTS2026-VJU)
- Reader UI updated to prefer a sanitized VI HTML fragment for `WEB-TTTS2026-VJU` (`*_transcription_vi.html`) while keeping EN/JA markdown translations.
- Purpose: preserve web article tables/layout fidelity in GitHub Pages viewer while retaining split-view translation workflow.
- Split-view enhancements applied in `index.html`:
  - TOC fallback for article-style documents (`h1/h2/h3`)
  - Scroll sync fallback by scroll ratio when heading alignment is sparse
- Claude terminology audit run for EN/JA (focus: VJU naming, HSA/SAT, STT/TT, EMJM/BGDI/BICA).
- Fixes applied based on Claude findings:
  - JA `STT` / `TT` table headers -> `番号`
  - JA university naming maintained as `日越大学`
  - EN `Vietnam Japan University` hyphenation unified (no hyphen)
  - EN HSA naming unified (`Competency Assessment Test (HSA)`)
  - JA EMJM / BGDI / BICA program-name terminology unified
  - EN BGDI / Japanese Studies naming unified
- Local glossary updated with admissions-web abbreviations and program names (`STT`, `TT`, `HSA`, `SAT`, `ĐQĐ`, `ĐT/KV`, `EMJM`, `BGDI`, `BICA`, `VJU/ĐHVJ`).
- Claude review result after fixes: `PASS WITH NOTES` (remaining differences reduced to non-blocking style/notation variants).

### 2026-02-23 Follow-up Viewer Fix (TOC for HTML-first article rendering)
- User reported TOC generation issues after switching `WEB-TTTS2026-VJU` VI pane to HTML-first rendering (incorrect/misaligned entries, comment-related items mixed in).
- Root causes identified:
  - TOC previously relied on heading index alignment from markdown-style structures.
  - WordPress article HTML uses many `p/strong` and `ol/li/strong` pseudo-headings instead of semantic `h2/h3`.
  - Comment form section (`Để lại một bình luận`) remained in the VI HTML fragment and polluted TOC candidates.
- Fixes applied:
  - Removed comments section from `*_transcription_vi.html` HTML fragment.
  - Reworked TOC heading collection in `index.html` to support HTML-first articles by extracting heading candidates from:
    - native `h1/h2/h3`
    - red banner `p > span > strong`
    - list headings `ol > li > strong`
    - numbered `p > strong` paragraph headings (`1.1`, `2.3`, `10.5.1`, etc.)
  - TOC remains anchored to the currently visible left pane and regenerates on left-language switch.
- Outcome:
  - HTML-first rendering retained for display fidelity.
  - TOC resilience improved for WordPress article structures without destructively rewriting source HTML.

### 2026-02-23 Glossary Alignment Follow-up (Public Google Sheets)
- User requested alignment of academic program names with the public glossary sheet (`gid=962055076`), including abbreviations and program-name forms.
- Public glossary entries confirmed for program names (e.g., `BCSE`, `BGDI`, `BICA`, `EMJM`, `ECE`, `EFTH`, `ESAS`, `ESCT`) and institution aliases (`VJU`, `ĐHVJ`).
- EN/JA for `WEB-TTTS2026-VJU` were updated to use glossary-form **program names** in program-name contexts (tables, program lists, quota tables, and related labels), while preserving degree-title rows as separate concepts.
- Additional cleanup applied:
  - EN duplicate wording caused by prior replacement (`Bachelor of Bachelor's ...`) corrected
  - JA repeated suffix (`...プログラム（EMJM）プログラム`) corrected
- Local glossary (`data/glossary_vi_en_ja.md`) was updated so the admissions-web abbreviation rows for `EMJM`, `BGDI`, `BICA` match the public glossary naming convention (previously short-form variants caused QA mismatch noise).


## 2026-02-24 Batch 3 Script Checks (50 / WEB-TTTS2026 / 1274)

### Scope
- `50-2026-KH-DHVN_VJU Quality Assurance Plan 2026` (VI only)
- `WEB-TTTS2026-VJU_Undergraduate Admissions Information 2026` (VI/EN/JA)
- `1274-HD-KTDBCL_End-of-Course Exam Guidance S1 2025-2026` (VI/EN/JA)

### Script Findings Summary (Codex-run)
- `50-2026` VI: YAML present but missing `id`, `language`, `issue_date`; disclaimer/source note present; pipe tables detected (`28`); ASCII separator line detected (`1`) indicating possible table truncation/format risk
- `WEB-TTTS2026` VI/EN/JA: YAML present, missing `language` key (uses `lang` convention); disclaimer/source note present; pipe tables detected (`56` each); ASCII separators detected (`5` each) likely due to intentional mixed HTML/Markdown tables
- `1274` VI/EN/JA: YAML present but missing `id`, `language`, `issue_date`; disclaimer/source note present; heavy pipe-table usage (`165` each); no ASCII-table separator warnings

### Status
- `50-2026`: escalate to Claude QA/fix due to structural risk (table truncation likely)
- `WEB-TTTS2026`: send to Claude QA for confirmation; likely low-risk
- `1274`: send to Claude QA for content/translation contamination review


## 2026-02-24 Batch 3 Claude QA -> Fix -> Review Cycle (50 / WEB-TTTS2026 / 1274)

### 1274-HD-KTDBCL (End-of-Course Exam Guidance S1 2025-2026)
- Claude QA (pre-fix): EN contamination string repeated (`Department of Testing and 2. Quality Assurance`), mistranslation `ACTING RECTOR`, Appendix 4a value drift (`1.5` vs source `1` point per sub-question), EN Appendix 7 blockquote break, missing source footer notes.
- Claude-based fixes applied (Codex executed exact Claude instructions):
  - EN global contamination replacement (`... 2. Quality Assurance` -> `... Quality Assurance`) including `Dept.` variant
  - EN signature block term fixed to `ON BEHALF OF THE RECTOR`
  - EN Appendix 4a scoring value restored to `1 point / sub-question`
  - EN Appendix 7 blockquote continuity restored by prefixing missing `> ` lines
  - Added source footer note to VI/EN/JA files
- Claude post-fix review: `PASS WITH NOTES`
- Remaining note (non-blocking): Appendix 7 formatting style differs between EN (`>` blockquote) and VI/JA (plain quoted paragraph), content intact.
- QA checks added from Claude feedback:
  1. Department-name contamination pattern scan for embedded numbering (e.g., `/\d+\.\s*Quality/`)
  2. Cross-language value parity check for template tables (detect translator-altered numeric values)
  3. Blockquote formatting consistency across language variants for equivalent passages
  4. Glossary mapping for `TL. HIỆU TRƯỞNG` -> EN/JA standard terms

### WEB-TTTS2026-VJU (Undergraduate Admissions Information 2026)
- Claude QA result: `PASS WITH NOTES` (no fixes required)
- Verified by Claude:
  - YAML/front matter completeness with localized titles/issuers and `lang` fields
  - Source-note/disclaimer block present in all 3 languages
  - 11-section structure fidelity across VI/EN/JA and PDF
  - Table integrity across mixed Markdown/HTML tables; row counts and numeric values aligned
  - Formula omission annotations faithfully preserve source gaps
  - No source contamination in EN/JA; Vietnamese text in degree-name column is intentional
- Minor notes only: source-preserved `VJU 7/8/9` spacing inconsistency and stray `&nbsp;` blank lines (cosmetic, no fix applied).

### 50-2026-KH-DHVN (VJU Quality Assurance Plan 2026, VI only)
- Claude QA (pre-fix): `FAIL` due to severe table truncation (Sections III/IV/V largely missing), section numbering alterations (`4.1/4.2` incorrectly normalized to `1.1/1.2`), Thai character contamination (`ของ`), missing source note footer.
- Claude full-rebuild fix attempt (complete file rewrite from PDF): `TIMEOUT >300s no output`
- Claude-based partial fixes applied (Codex executed exact Claude instructions):
  - Restored source numbering `4.1. Mục tiêu chung` and `4.2. Mục tiêu cụ thể`
  - Fixed Thai contamination token `phản hồiของ` -> `phản hồi của`
  - Added source note footer with PDF reference
- Claude post-fix review: `PARTIALLY COMPLETE`
- Remaining critical issues (Claude-reviewed):
  - Table row omissions remain across III-1 (1.3-1.6), III-2..III-6 (all rows), IV (rows 2,3,4,5,7), and V (all rows)
  - Row 1.7 / 1.8 `Sản phẩm dự kiến` text still truncated vs PDF
- Claude suggested next fix action: chunked rebuild in 5 steps (III-1 missing rows -> III-2..III-6 -> IV missing rows -> V -> row 1.7/1.8 text completion) to avoid timeout.

### Batch 3 Timeout Events (300s threshold)
- `50-2026` Claude full-table rebuild / complete-file rewrite attempt timed out at >300s with no output (`tmp/qa_runs/50_fix_call.txt`).

### Batch 3 Status Summary
- Completed with fixes + review: `1274-HD-KTDBCL`
- Completed QA-only (no fixes needed): `WEB-TTTS2026-VJU`
- Partial completion (critical content still missing): `50-2026-KH-DHVN`


## 2026-02-24 1592-QD-DHVN Script Check Pass (Pre-QA)

### Scope
- `data/1592-QD-DHVN_Budget Estimate Disclosure 2025_source.pdf`
- `data/1592-QD-DHVN_Budget Estimate Disclosure 2025_transcription.md`
- `data/1592-QD-DHVN_Budget Estimate Disclosure 2025_transcription_en.md`
- `data/1592-QD-DHVN_Budget Estimate Disclosure 2025_transcription_ja.md`

### Page Count + Chunk Plan
- Page count: `2` (tool: `pdfinfo`)
- Chunk ranges used: `no chunking` (<=30 pages)

### Script results (Codex-run)
- VI/EN/JA: YAML fields (`id`, `title`, `issue_date`) present; `lang` field present
- Tables detected in all variants (`pipe` lines ~28); no ASCII-table separator warning
- Source/disclaimer note detected in VI and JA; EN source/disclaimer note not detected by script pattern (needs Claude confirmation)


## 2026-02-24 323-QD-DHVN Script Check Pass (Pre-QA)

### Scope
- `data/323-QD-DHVN_Q1 2025 Budget Execution Disclosure_source.pdf`
- `data/323-QD-DHVN_Q1 2025 Budget Execution Disclosure_transcription.md`
- `data/323-QD-DHVN_Q1 2025 Budget Execution Disclosure_transcription_en.md`
- `data/323-QD-DHVN_Q1 2025 Budget Execution Disclosure_transcription_ja.md`

### Page Count + Chunk Plan
- Page count: `3` (tool: `pdfinfo`)
- Chunk ranges used: `no chunking` (<=30 pages)

### Script results (Codex-run)
- VI/EN/JA: YAML fields (`id`, `title`, `issue_date`) present; `lang` field present
- Tables detected in all variants (`pipe` lines ~40); no ASCII-table separator warning
- Source/disclaimer note detected in VI and JA; EN source/disclaimer note not detected by script pattern (needs Claude confirmation)


## 2026-02-24 Batch (Time-limited) Claude QA Results (1592 / 323)

### 1592-QD-DHVN_Budget Estimate Disclosure 2025
- Files processed: VI/EN/JA + source PDF
- Page count + tool: `2` (`pdfinfo`)
- Chunk ranges used: `no chunking`
- Claude QA result: `CONDITIONAL PASS`
- Claude findings:
  - `CRITICAL` JA legal-basis year error (`2024` -> should be `2017`)
  - `MINOR` EN source-note wrapper missing `<div class="source-note">` HTML parity with VI/JA
  - `MINOR` JA closing punctuation missing final period (`。/.` expected)
  - Table completeness and VI fidelity verified as OK by Claude
- Claude fix instructions received (not applied in this batch due time limit stop)
- Review outcome: not run (stopped due to time limit)
- New QA checks suggested by Claude:
  1. Date cross-check across VI/EN/JA legal bases
  2. Source-note HTML parity across languages
  3. Closing punctuation preservation for `./.` convention
  4. Budget table sum verification

### 323-QD-DHVN_Q1 2025 Budget Execution Disclosure
- Files processed: VI/EN/JA + source PDF
- Page count + tool: `3` (`pdfinfo`)
- Chunk ranges used: `no chunking`
- Claude QA result: `FAIL`
- Claude findings:
  - `CRITICAL` table data loss in all 3 files: missing Section II rows `3` through `7.2` between rows `2.2` and `8`
  - `CRITICAL` JA legal-basis year error (`2024` -> should be `2017`)
  - `MEDIUM` YAML `issue_date: null` in all 3 files (should be `2025-04-04`)
  - `MEDIUM` EN source note lacks `<div class="source-note">` wrapper
  - `MINOR` VI row `2.1` trailing dots omitted
  - `MINOR` JA closing punctuation missing final period
- Claude fix instructions received (rows + metadata + wording), not applied in this batch due time limit stop
- Review outcome: not run (stopped due to time limit)
- New QA checks suggested by Claude:
  1. Row-count parity check vs PDF
  2. Standard-form completeness check for budget disclosure section-II categories
  3. Date cross-validation VI vs EN/JA
  4. Source-note format consistency
  5. YAML `issue_date` non-null when body date is clear

### Time-limit Handling
- Batch stopped before fix/review phases for `1592` and `323` due execution time limit policy.
- No Claude timeout events in this batch.


## Batch Execution Summary (auto)

- Batch date: 2026-02-24
- Processed sets (completed all phases): none
- Partially processed sets: `1592-QD-DHVN_Budget Estimate Disclosure 2025` (QA only), `323-QD-DHVN_Q1 2025 Budget Execution Disclosure` (QA only)
- Skipped sets due to time limit: all other candidates not started this batch
- Estimated remaining sets: `44` (total detected incomplete `44` - completed this batch `0`)
- Major issues:
  - `323` missing Section II budget rows `3`-`7.2` in all language files (critical data loss)
  - `1592` and `323` JA legal-basis year error (`2024` vs source `2017`)
  - `323` YAML `issue_date: null` and EN source-note wrapper inconsistency
- Major fixes applied: none (fix/review phases skipped due time limit stop)
- New QA checks discovered:
  - Date cross-check across VI/EN/JA legal bases
  - Source-note HTML parity across languages
  - Budget table sum verification
  - Row-count parity vs PDF and standard-form completeness for budget disclosure tables
  - YAML `issue_date` non-null when body date is clear
- Timeout events: none
- Git push failures: none
- Suggested next targets: `323-QD-DHVN_Q1 2025 Budget Execution Disclosure` (apply Claude fix set first), `1592-QD-DHVN_Budget Estimate Disclosure 2025` (quick fix+review), `840-DT-DHVN_Academic Calendar 2025-2026 Annex 1 VJU2025`
- Runtime duration: `00:39:27`
- Stop reason: `Stopped due to time limit`
