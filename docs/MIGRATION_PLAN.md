# Document Migration Plan

## Source Directories
| # | Path | Category |
|---|------|----------|
| 1 | `5. DX-VJU/VJU-Project/3. University Regulations/` | University Regulations |
| 2 | `5. DX-VJU/VJU-Project/2. Quality Assurance/` | Quality Assurance |
| 3 | `5. DX-VJU/VJU-Project/4. Education Testing/` | Education Testing |
| 4 | `5. DX-VJU/VJU-Project/1. Public Report 2025/` | Public Reports |

**Destination:** `3. DX-General/VJU Project 2/docs/data/`

## Naming Convention

```
{Document_ID}_{English_Title}_transcription.md       ← 文字起こし（通常VI）
{Document_ID}_{English_Title}_transcription_en.md    ← English
{Document_ID}_{English_Title}_transcription_ja.md    ← Japanese
{Document_ID}_{English_Title}_source.pdf             ← Original PDF
```

- **Document ID** = 文書の公式ID。ベトナムの公文書では `{番号}-{種別}-{発行者}` の形式
  （例: `3626-QD-DHQGHN`, `BGDDT-TT-2021-08`）。
  日本語・英語の文書ではIDの形式が異なる場合があるので注意。
- **English Title** = 英語タイトルをそのまま記述（スペースOK）

Examples:
- `3626-QD-DHQGHN_Regulation on Undergraduate Training_transcription.md`
- `BGDDT-TT-2021-08_Regulation on Undergraduate Training_transcription_en.md`
- `DHVN-HD-304_Learning Outcome Recognition and Credit Transfer_source.pdf`

Sub-documents (annexes): `{base}_Annex {N} {Short Title}_*`

## Legend
- Status: `done` / `pending` / `skip`
- VI/EN/JA: `Y` = file exists, `-` = missing
- PDF: `Y` = PDF, `doc` = .doc/.docx only, `-` = none

---

## Group A: VNU Regulations (DHQGHN) — from `3. University Regulations`

| # | Doc ID | New Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status | Notes |
|---|--------|---------------------|------------|:---:|:--:|:--:|:--:|:------:|-------|
| 1 | DHQGHN-QD-3626 | `3626-QD-DHQGHN_Regulation on Undergraduate Training` | Regulation on Undergraduate Training | Y | Y | Y | Y | done | Format normalization done (9b330ad) |
| 2 | DHQGHN-QD-3636 | `3636-QD-DHQGHN_Regulation on Masters Training` | Regulation on Master's Training | Y | Y | Y | Y | done | |
| 3 | DHQGHN-QD-3638 | `3638-QD-DHQGHN_Regulation on Doctoral Training` | Regulation on Doctoral Training | Y | Y | Y | Y | done | |
| 4 | DHQGHN-QD-2459 | `2459-QD-DHQGHN_Amendment to Masters Training Regulation` | Amendment to Master's Training Reg (3636) | Y | Y | Y | Y | done | Amends #2 |
| 5 | DHQGHN-QD-2486 | `2486-QD-DHQGHN_Amendment to Undergraduate Admission Regulation` | Amendment to Undergrad Admission Reg | Y | Y | Y | Y | done | |
| 6 | DHQGHN-QD-4391 | `4391-QD-DHQGHN_Online Training and E-Lecture Regulations` | Online Training & E-Lecture Regulations | Y | Y | Y | Y | done | |
| 7 | DHQGHN-QD-4455 | `4455-QD-DHQGHN_Diploma and Certificate Management` | Diploma & Certificate Management | Y | Y | Y | Y | done | |
| 8 | DHQGHN-QD-4618 | `4618-QD-DHQGHN_Scholarship Management and Use` | Scholarship Management & Use | Y | Y | Y | Y | done | |
| 9 | DHQGHN-QD-5115 | `5115-QD-DHQGHN_Superseded Undergraduate Training` | [Superseded] Undergraduate Training | Y | Y | Y | Y | done | Replaced by #1 |
| 10 | DHQGHN-QD-628 | `628-QD-DHQGHN_Educational Quality Assurance` | Educational Quality Assurance at VNU | Y | Y | Y | Y | pending | from QA dir |

## Group B: VJU Regulations & Guidelines (DHVN) — from `3. University Regulations`

| # | Doc ID | New Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status | Notes |
|---|--------|---------------------|------------|:---:|:--:|:--:|:--:|:------:|-------|
| 11 | DHVN-QD-473 | `dhvn-qd-473` | Academic Advisory Work Regulations | Y | Y | Y | Y | pending | |
| 12 | DHVN-QD-700 | `dhvn-qd-700` | Anti-Plagiarism Regulations | Y | Y | Y | Y | pending | Also in Testing dir |
| 13 | DHVN-HD-000 | `dhvn-hd-000` | Foreign Language Cert Guidelines (VJU2022+) | Y | Y | Y | Y | pending | |
| 14 | DHVN-HD-259 | `dhvn-hd-259` | Foreign Language Cert Guidelines (VJU2020-21) | Y | Y | Y | Y | pending | Main doc |
| 15 | DHVN-HD-259 a1 | `dhvn-hd-259-annex1` | Certificate Equivalency Table | Y | Y | Y | Y | pending | |
| 16 | DHVN-HD-259 a2 | `dhvn-hd-259-annex2` | JLPT Authorization Letter Template | Y | Y | Y | Y | pending | |
| 17 | DHVN-HD-304 | `dhvn-hd-304` | Learning Outcome Recognition & Credit Transfer | Y | Y | Y | Y | pending | |
| 18 | DHVN-HD-483 | `dhvn-hd-483` | Practical Internship Guidance | Y | Y | Y | Y | pending | |
| 19 | DHVN-HD-1534 | `dhvn-hd-1534` | Thesis & Graduation Project Guidelines | Y | Y | Y | Y | pending | Main doc |
| 20 | DHVN-HD-1534 en | `dhvn-hd-1534-annex-en` | Thesis Annex Templates (EN Format) | Y | Y | Y | Y | pending | |
| 21 | DHVN-HD-1534 layout | `dhvn-hd-1534-layout` | Thesis Annex Layout Guide | doc | Y | Y | Y | pending | .docx only |
| 22 | DHVN-DT-840 | `dhvn-dt-840` | Academic Calendar 2025-26 Cover Letter | - | Y | Y | Y | pending | No PDF |
| 23 | DHVN-DT-840 a1 | `dhvn-dt-840-annex1` | Schedule VJU2025 | Y | Y | Y | Y | pending | |
| 24 | DHVN-DT-840 a2 | `dhvn-dt-840-annex2` | Schedule VJU2024/2023 | Y | Y | Y | Y | pending | |
| 25 | DHVN-DT-840 a3 | `dhvn-dt-840-annex3` | Schedule VJU2022/2021/2020 | Y | Y | Y | Y | pending | |
| 26 | DHVN-DT-840 a4 | `dhvn-dt-840-annex4` | Master's & PhD Schedule | Y | Y | Y | Y | pending | |
| 27 | DHVN-TB-911 | `dhvn-tb-911` | Language Cert Submission (VJU2024) | Y | Y | Y | Y | pending | |
| 28 | DHVN-TB-984 | `dhvn-tb-984` | Language Cert Submission (VJU2023) | Y | Y | Y | Y | pending | |
| 29 | DHVN-TB-1010 | `dhvn-tb-1010` | English Cert Submission (VJU2025) | Y | Y | Y | Y | pending | |

## Group C: Ministry of Education (BGDDT) — from `3. University Regulations` + `2. Quality Assurance`

| # | Doc ID | New Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status | Notes |
|---|--------|---------------------|------------|:---:|:--:|:--:|:--:|:------:|-------|
| 30 | BGDDT-TT-2021-08 | `bgddt-tt-2021-08` | Regulation on Undergraduate Training | Y | Y | Y | Y | pending | National level |
| 31 | BGDDT-TT-2021-17 | `bgddt-tt-2021-17` | Standards for Higher Education Programs | Y | Y | Y | Y | pending | |
| 32 | BGDDT-TT-2021-18 | `bgddt-tt-2021-18` | Doctoral Admission & Training Regulation | Y | Y | Y | Y | pending | |
| 33 | BGDDT-TT-2021-23 | `bgddt-tt-2021-23` | Master's Admission & Training Regulation | Y | Y | Y | Y | pending | |
| 34 | BGDDT-TT-2024-01 | `bgddt-tt-2024-01` | Standards for Higher Education Institutions | Y | Y | Y | Y | pending | |
| 35 | BGDDT-TT-2020-04 | `bgddt-tt-2020-04` | Foreign Cooperation in Education | Y | Y | Y | Y | pending | |
| 36 | BGDDT-CV-2085 | `bgddt-cv-2085` | Self-Assessment & External Evaluation | Y | Y | Y | Y | pending | +Annex .doc |
| 37 | BGDDT-CV-774 | `bgddt-cv-774` | Adjustment to Appendices of CV-2085 | Y | Y | Y | Y | pending | |
| 38 | BGDDT-QD-4998 | `bgddt-qd-4998` | Education Database Technical Specs | Y | Y | Y | Y | pending | +Annex .docx |
| 39 | BGDDT-TT-2013-38 | `bgddt-tt-2013-38` | QA Accreditation Process & Cycle | Y | Y | Y | Y | pending | from QA dir |
| 40 | BGDDT-TT-2016-04 | `bgddt-tt-2016-04` | Quality Standards for HE Programs | Y | Y | Y | Y | pending | from QA dir |
| 41 | BGDDT-TT-2020-39 | `bgddt-tt-2020-39` | Quality Standards for Distance Programs | Y | Y | Y | Y | pending | from QA dir |

## Group D: Other Government (CP, BTC, DHNN, TTCP) — from `3. University Regulations` + `2. Quality Assurance`

| # | Doc ID | New Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status | Notes |
|---|--------|---------------------|------------|:---:|:--:|:--:|:--:|:------:|-------|
| 42 | CP-ND-2021-86 | `cp-nd-2021-86` | Decree on Overseas Study/Research | Y | Y | Y | Y | pending | |
| 43 | CP-ND-2023-24 | `cp-nd-2023-24` | Decree on Base Salary | Y | Y | Y | Y | pending | |
| 44 | BTC-TT-2013-111 | `btc-tt-2013-111` | Personal Income Tax Implementation | Y | Y | Y | Y | pending | |
| 45 | DHNN-TB-2184 | `dhnn-tb-2184` | VNU-TESTS Language Assessment Plan | Y | Y | Y | Y | pending | |
| 46 | TTCP-QD-2022-78 | `ttcp-qd-2022-78` | QA & Accreditation Program 2022-2030 | Y | Y | Y | Y | pending | from QA dir |

## Group E: Education Testing — from `4. Education Testing`

| # | Doc ID | New Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status | Notes |
|---|--------|---------------------|------------|:---:|:--:|:--:|:--:|:------:|-------|
| 47 | DHVN-QD-1132 | `dhvn-qd-1132` | Examination Affairs Regulations | Y | Y | Y | Y | pending | Main decision |
| 48 | DHVN-QD-1132 app | `dhvn-qd-1132-appendix` | Examination Affairs Appendix | Y | Y | Y | Y | pending | |
| 49 | 1274-HD-KTDBCL | `1274-hd-ktdbcl` | End-of-Course Exam Guidance S1 2025-26 | Y | Y | Y | Y | pending | |

## Group F: Public Reports — from `1. Public Report 2025`

| # | Doc ID | New Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status | Notes |
|---|--------|---------------------|------------|:---:|:--:|:--:|:--:|:------:|-------|
| 50 | DHVN-KT&DBCL-826 | `dhvn-kt-dbcl-826` | Public Report 2024-2025 | Y | Y | Y | Y | pending | |
| 51 | DHVN-QD-1592 | `dhvn-qd-1592` | Budget Estimate Disclosure 2025 | Y | Y | Y | Y | pending | |
| 52 | DHVN-QD-323 | `dhvn-qd-323` | Q1 2025 Budget Execution Disclosure | Y | Y | Y | Y | pending | |

---

## Format Normalization: 3626-QD-DHQGHN (Pending)

3626の3言語版（VI/EN/JA）でPDF原文との不整合が発見された。以下の正規化が必要:

| # | Rule | Pattern | Target | Est. Count (per file) | Status |
|---|------|---------|--------|:---------------------:|:------:|
| 1 | khoản → 番号付きリスト | `- N.` → `N.` | 行頭の `- 1.`〜`- 10.` | ~176-180 | pending |
| 2 | điểm → 通常段落 | `   - a)` → `a)` | `   - a)`〜`   - i)` (含đ) | ~238-256 | pending |
| 3 | điểm (period) | `   - a.` → `a.` | Art.36のみ | 4 | pending |
| 4 | 3rd-level nest | `     - text` → `- text` | Art.35のみ | ~6 | pending |
| 5 | Chapter heading merge | 番号+タイトル結合 | 9章分 | 9 | pending |

詳細な計画: セッションログ参照（`9a13c057-0e48-44a8-a8d1-c0ab082f7351`）

**Note:** 非構造化箇条書き（`- テキスト`、番号なし）はPDFでもインデント付きなのでそのまま保持。

---

## Summary

| Group | Total | Done | Pending | Est. Files |
|-------|:-----:|:----:|:-------:|:----------:|
| A: VNU Regulations (DHQGHN) | 10 | 6 | 4 | ~28 MD + 7 PDF |
| B: VJU Guidelines (DHVN) | 19 | 0 | 19 | ~57 MD + ~17 PDF |
| C: Ministry of Education (BGDDT) | 12 | 0 | 12 | ~36 MD + 12 PDF |
| D: Other Government | 5 | 0 | 5 | ~15 MD + 5 PDF |
| E: Education Testing | 3 | 0 | 3 | ~9 MD + 3 PDF |
| F: Public Reports | 3 | 0 | 3 | ~9 MD + 3 PDF |
| **Total** | **52** | **6** | **46** | **~154 MD + ~47 PDF** |

## YAML Front Matter Template

```yaml
---
doc_id: "3626/QĐ-ĐHQGHN"        # 公式文書番号（正式表記）
title: "..."
date: YYYY-MM-DD
department: "Academic Affairs|Financial Affairs|Quality Assurance|..."
type: "Regulation|Circular|Guideline|Notification|Decree|Decision|Report"
restricted: false
last_updated: 2026-02-21
---
```

- `doc_id` = 公式文書番号そのまま（スラッシュ・ダイアクリティカル付き）
- ファイル名・HTML属性・JSキーではサニタイズ版を使用（`/` → `-`、ダイアクリティカル除去）

## Processing Steps (per document)

1. **Copy** VI/EN/JA `.md` files → rename to `{id}_{lang}.md`
2. **Copy** source `.pdf` → rename to `{id}_source.pdf`
3. **Replace** old YAML front matter with new standardized format
4. **Verify** front matter stripped correctly, content renders

## Execution Priority

1. **Group A** — VNU core academic regulations (highest priority)
2. **Group B** — VJU operational guidelines
3. **Group E** — Testing regulations (small, quick)
4. **Group C** — Ministry-level reference regulations
5. **Group D** — Supporting government decrees
6. **Group F** — Financial/public reports (lowest priority)

## Duplicate/Overlap Notes

- `DHVN-QD-700` exists in both `3. University Regulations` and `4. Education Testing` → use Regulations version as canonical
- `DHVN-HD-259` has duplicate annex PDFs (Annex vs Appendix naming) → use one set
- `BGDDT-QD-4998` has both `.pdf` and `.docx` sources → migrate PDF only
- `DHQGHN-QD-5115` is superseded by `3626` → migrate with `[Superseded]` note

## Important Notes

- **Document ID format**: Vietnamese public documents follow `{Number}-{Type}-{Issuer}` convention
  (e.g. `3626-QD-DHQGHN`). Documents from Japan or other countries may use different ID formats.
  Always verify the official document ID before assigning filenames.
