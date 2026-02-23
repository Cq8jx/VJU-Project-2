# Document Migration Plan

## Overview

全文書のソースファイル（PDF・MD）は `docs/data/` に集約済み。
今後のフォーマット正規化はこのリポジトリ上でオンラインで実施する。

**ソースリポジトリ:** `5. DX-VJU/VJU-Project/` （4ディレクトリ）
**移行先:** `docs/data/`
**全ファイル数:** 203（glossary含む）

## Status Legend

| Status | 意味 |
|--------|------|
| `done` | フォーマット正規化完了。YAML・disclaimer・見出し・用語集すべて適用済み |
| `staged` | ソースファイルをコピー済み。フォーマット正規化が未完了 |
| `skip` | 移行対象外 |

## Naming Convention

```
{Document_ID}_{English_Title}_transcription.md       ← VI（原文）
{Document_ID}_{English_Title}_transcription_en.md    ← English
{Document_ID}_{English_Title}_transcription_ja.md    ← Japanese
{Document_ID}_{English_Title}_source.pdf             ← Original PDF
```

- **Document ID** = 文書の公式ID（例: `3626-QD-DHQGHN`, `BGDDT-TT-2021-08`）
- **English Title** = スペースそのまま
- Sub-documents: `{base}_Annex {N} {Short Title}_*`

---

## Group A: VNU Regulations (DHQGHN)

| # | Doc ID | Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status |
|---|--------|-----------------|------------|:---:|:--:|:--:|:--:|:------:|
| 1 | DHQGHN-QD-3626 | `3626-QD-DHQGHN_Regulation on Undergraduate Training` | Regulation on Undergraduate Training | Y | Y | Y | Y | done |
| 2 | DHQGHN-QD-3636 | `3636-QD-DHQGHN_Regulation on Masters Training` | Regulation on Master's Training | Y | Y | Y | Y | done |
| 3 | DHQGHN-QD-3638 | `3638-QD-DHQGHN_Regulation on Doctoral Training` | Regulation on Doctoral Training | Y | Y | Y | Y | done |
| 4 | DHQGHN-QD-2459 | `2459-QD-DHQGHN_Amendment to Masters Training Regulation` | Amendment to Master's Training Reg | Y | Y | Y | Y | done |
| 5 | DHQGHN-QD-2486 | `2486-QD-DHQGHN_Amendment to Undergraduate Admission Regulation` | Amendment to Undergrad Admission Reg | Y | Y | Y | Y | done |
| 6 | DHQGHN-QD-4391 | `4391-QD-DHQGHN_Online Training and E-Lecture Regulations` | Online Training & E-Lecture Regulations | Y | Y | Y | Y | done |
| 7 | DHQGHN-QD-4455 | `4455-QD-DHQGHN_Diploma and Certificate Management` | Diploma & Certificate Management | Y | Y | Y | Y | done |
| 8 | DHQGHN-QD-4618 | `4618-QD-DHQGHN_Scholarship Management and Use` | Scholarship Management & Use | Y | Y | Y | Y | done |
| 9 | DHQGHN-QD-5115 | `5115-QD-DHQGHN_Superseded Undergraduate Training` | [Superseded] Undergraduate Training | Y | Y | Y | Y | done |
| 10 | DHQGHN-QD-628 | `628-QD-DHQGHN_Educational Quality Assurance Regulation` | Educational Quality Assurance at VNU | Y | Y | Y | Y | done |

## Group B: VJU Regulations & Guidelines (DHVN)

| # | Doc ID | Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status |
|---|--------|-----------------|------------|:---:|:--:|:--:|:--:|:------:|
| 11 | DHVN-QD-473 | `473-QD-DHVN_Academic Advisory Work Regulations` | Academic Advisory Work Regulations | Y | Y | Y | Y | done |
| 12 | DHVN-QD-700 | `700-QD-DHVN_Anti-Plagiarism Regulations` | Anti-Plagiarism Regulations | Y | Y | Y | Y | done |
| 13 | DHVN-HD-000 | `000-HD-DHVN_Foreign Language Certificate Guidelines` | Foreign Language Cert Guidelines (VJU2022+) | Y | Y | Y | Y | done |
| 14 | DHVN-HD-259 | `259-HD-DHVN_Foreign Language Certificate Guidelines VJU2020-2021` | Foreign Language Cert Guidelines (VJU2020-21) | Y | Y | Y | Y | done |
| 15 | DHVN-HD-259 a1 | `259-HD-DHVN_Annex 1 Certificate Equivalency Table` | Certificate Equivalency Table | Y | Y | Y | Y | done |
| 16 | DHVN-HD-259 a2 | `259-HD-DHVN_Annex 2 JLPT Authorization Letter Template` | JLPT Authorization Letter Template | Y | Y | Y | Y | done |
| 17 | DHVN-HD-304 | `304-HD-DHVN_Learning Outcome Recognition and Credit Transfer` | Learning Outcome Recognition & Credit Transfer | Y | Y | Y | Y | done |
| 18 | DHVN-HD-483 | `483-HD-DHVN_Practical Internship Guidance` | Practical Internship Guidance | Y | Y | Y | Y | done |
| 19 | DHVN-HD-1534 | `1534-HD-DHVN_Thesis and Graduation Project Guidelines` | Thesis & Graduation Project Guidelines | - | Y | Y | Y | done |
| 20 | DHVN-HD-1534 en | `1534-HD-DHVN_Annex Templates English Format` | Thesis Annex Templates (EN Format) | Y | Y | Y | Y | done |
| 21 | DHVN-HD-1534 layout | `1534-HD-DHVN_Annex Templates Layout Guide` | Thesis Annex Layout Guide | - | Y | Y | Y | staged |
| 22 | DHVN-DT-840 | `840-DT-DHVN_Academic Calendar 2025-2026` | Academic Calendar 2025-26 Cover Letter | - | Y | Y | Y | done |
| 23 | DHVN-DT-840 a1 | `840-DT-DHVN_Academic Calendar 2025-2026 Annex 1 VJU2025` | Schedule VJU2025 | Y | Y | Y | Y | done |
| 24 | DHVN-DT-840 a2 | `840-DT-DHVN_Academic Calendar 2025-2026 Annex 2 VJU2024-2023` | Schedule VJU2024/2023 | Y | Y | Y | Y | done |
| 25 | DHVN-DT-840 a3 | `840-DT-DHVN_Academic Calendar 2025-2026 Annex 3 VJU2022-2020` | Schedule VJU2022/2021/2020 | Y | Y | Y | Y | done |
| 26 | DHVN-DT-840 a4 | `840-DT-DHVN_Academic Calendar 2025-2026 Annex 4 Masters-PhD` | Master's & PhD Schedule | Y | Y | Y | Y | done |
| 27 | DHVN-TB-911 | `911-TB-DHVN_Foreign Language Certificate Submission VJU2024` | Language Cert Submission (VJU2024) | Y | Y | Y | Y | done |
| 28 | DHVN-TB-984 | `984-TB-DHVN_Foreign Language Certificate Submission VJU2023` | Language Cert Submission (VJU2023) | Y | Y | Y | Y | done |
| 29 | DHVN-TB-1010 | `1010-TB-DHVN_English Certificate Submission VJU2025` | English Cert Submission (VJU2025) | Y | Y | Y | Y | done |

## Group C: Ministry of Education (BGDDT)

| # | Doc ID | Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status |
|---|--------|-----------------|------------|:---:|:--:|:--:|:--:|:------:|
| 30 | BGDDT-TT-2021-08 | `08-2021-TT-BGDDT_Regulation on Undergraduate Training` | Regulation on Undergraduate Training | Y | Y | Y | Y | staged |
| 31 | BGDDT-TT-2021-17 | `17-2021-TT-BGDDT_Standards for Higher Education Programs` | Standards for Higher Education Programs | Y | Y | Y | Y | staged |
| 32 | BGDDT-TT-2021-18 | `18-2021-TT-BGDDT_Doctoral Admission and Training Regulation` | Doctoral Admission & Training Regulation | Y | Y | Y | Y | staged |
| 33 | BGDDT-TT-2021-23 | `23-2021-TT-BGDDT_Masters Admission and Training Regulation` | Master's Admission & Training Regulation | Y | Y | Y | Y | staged |
| 34 | BGDDT-TT-2024-01 | `01-2024-TT-BGDDT_Standards for Higher Education Institutions` | Standards for Higher Education Institutions | Y | Y | Y | Y | staged |
| 35 | BGDDT-TT-2020-04 | `04-2020-TT-BGDDT_Foreign Cooperation in Education` | Foreign Cooperation in Education | Y | Y | Y | Y | staged |
| 36 | BGDDT-CV-2085 | `BGDDT-CV-2085_Self-Assessment and External Evaluation` | Self-Assessment & External Evaluation | Y | Y | Y | Y | staged |
| 37 | BGDDT-CV-774 | `BGDDT-CV-774_Adjustment to Appendices CV-2085` | Adjustment to Appendices of CV-2085 | Y | Y | Y | Y | staged |
| 38 | BGDDT-QD-4998 | `BGDDT-QD-4998_Education Database Technical Specifications` | Education Database Technical Specs | Y | Y | Y | Y | staged |
| 39 | BGDDT-TT-2013-38 | `BGDDT-TT-2013-38_QA Accreditation Process and Cycle` | QA Accreditation Process & Cycle | Y | Y | Y | Y | staged |
| 40 | BGDDT-TT-2016-04 | `04-2016-TT-BGDDT_Quality Standards for HE Programs` | Quality Standards for HE Programs | Y | Y | Y | Y | staged |
| 41 | BGDDT-TT-2020-39 | `39-2020-TT-BGDDT_Quality Standards for Distance Programs` | Quality Standards for Distance Programs | Y | Y | Y | Y | staged |

## Group D: Other Government (CP, BTC, DHNN, TTCP)

| # | Doc ID | Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status |
|---|--------|-----------------|------------|:---:|:--:|:--:|:--:|:------:|
| 42 | CP-ND-2021-86 | `86-2021-ND-CP_Decree on Overseas Study and Research` | Decree on Overseas Study/Research | Y | Y | Y | Y | staged |
| 43 | CP-ND-2023-24 | `24-2023-ND-CP_Decree on Base Salary` | Decree on Base Salary | Y | Y | Y | Y | staged |
| 44 | BTC-TT-2013-111 | `111-2013-TT-BTC_Personal Income Tax Implementation` | Personal Income Tax Implementation | Y | Y | Y | Y | staged |
| 45 | DHNN-TB-2184 | `2184-TB-DHNN_VNU-TESTS Language Assessment Plan` | VNU-TESTS Language Assessment Plan | Y | Y | Y | Y | staged |
| 46 | TTCP-QD-2022-78 | `78-2022-QD-TTCP_QA and Accreditation Program 2022-2030` | QA & Accreditation Program 2022-2030 | Y | Y | Y | Y | staged |

## Group E: Education Testing

| # | Doc ID | Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status |
|---|--------|-----------------|------------|:---:|:--:|:--:|:--:|:------:|
| 47 | DHVN-QD-1132 | `1132-QD-DHVN_Examination Affairs Regulations` | Examination Affairs Regulations | Y | Y | Y | Y | done |
| 48 | DHVN-QD-1132 app | (merged into #47) | Examination Affairs Appendix | Y | - | - | - | done |
| 49 | 1274-HD-KTDBCL | `1274-HD-KTDBCL_End-of-Course Exam Guidance S1 2025-2026` | End-of-Course Exam Guidance S1 2025-26 | Y | Y | Y | Y | done |

## Group F: Public Reports

| # | Doc ID | Filename Prefix | Title (EN) | PDF | VI | EN | JA | Status |
|---|--------|-----------------|------------|:---:|:--:|:--:|:--:|:------:|
| 50 | DHVN-KT&DBCL-826 | `826-KTDBCL-DHVN_Public Report 2024-2025` | Public Report 2024-2025 | Y | Y | Y | Y | staged |
| 51 | DHVN-QD-1592 | `1592-QD-DHVN_Budget Estimate Disclosure 2025` | Budget Estimate Disclosure 2025 | Y | Y | Y | Y | staged |
| 52 | DHVN-QD-323 | `323-QD-DHVN_Q1 2025 Budget Execution Disclosure` | Q1 2025 Budget Execution Disclosure | Y | Y | Y | Y | staged |

---

## Progress Summary

| Group | Total | Done | Staged | Remaining |
|-------|:-----:|:----:|:------:|:---------:|
| A: VNU Regulations (DHQGHN) | 10 | 10 | 0 | 0 |
| B: VJU Guidelines (DHVN) | 19 | 18 | 1 | 0 |
| C: Ministry of Education (BGDDT) | 12 | 0 | 12 | 0 |
| D: Other Government | 5 | 0 | 5 | 0 |
| E: Education Testing | 3 | 3 | 0 | 0 |
| F: Public Reports | 3 | 0 | 3 | 0 |
| **Total** | **52** | **32** | **20** | **0** |

**全ソースファイル（PDF+MD）は `docs/data/` にコピー済み。**
残り23文書のフォーマット正規化が必要。

---

## Format Normalization Procedure

各文書を `staged` → `done` にするための手順:

### Step 1: YAML Front Matter の標準化

既存のYAMLを以下のテンプレートに置換:

```yaml
---
doc_id: "公式文書番号"          # 例: "473/QĐ-ĐHVN"
title: "文書タイトル"
date: YYYY-MM-DD
department: "Academic Affairs"   # or Quality Assurance, Financial Affairs, etc.
type: "Regulation"               # Regulation|Circular|Guideline|Notification|Decree|Decision|Report
restricted: false
last_updated: 2026-02-22
---
```

### Step 2: Disclaimer の追加

YAML直後に言語別のdisclaimer blockquoteを挿入:

- **VI:** `> **[DISCLAIMER]** Tài liệu này được tạo bởi AI...`
- **EN:** `> **[DISCLAIMER]** This document was generated by AI...`
- **JA:** `> **[DISCLAIMER]** 本文書はAIにより生成されたものであり...`

### Step 3: 見出しの正規化

| レベル | 用途 | 例 |
|--------|------|-----|
| `#` | 章 (Chapter) | `# Chương I. Quy định chung` |
| `##` | 条 (Article) | `## Điều 1. Phạm vi điều chỉnh` |
| `###` | 節 (Section) | 必要に応じて |

### Step 4: Decision セクション（該当する場合）

QĐ（決定）文書の場合、規程本文の前に決定セクションを配置:
- 根拠法令を italic で記載（`*Căn cứ...*`）
- 決定条項は太字（`**Điều 1.**`、見出しレベルではない）
- 宛先をflex divで整形
- `---` で規程本文と区切り

### Step 5: 用語集チェック

`docs/data/glossary_vi_en_ja.md` に基づく用語統一:
- JA: "ハノイ国家大学" → "ベトナム国家大学ハノイ校"
- JA: "所長" → "総長"（ĐHQGHN Giám đốc の場合）
- EN: "Testing and 2. Quality Assurance" → "Testing and Quality Assurance"

### Step 6: DOC_REGISTRY とカード追加

`docs/index.html` に以下を追加:
1. `DOC_REGISTRY` にエントリ追加
2. `<article class="doc-card">` HTML を追加

### 確認事項

- `---` の数: 決定+規程文書 = 3本（YAML/決定後/EOF前なし）、ガイダンス文書 = 1本（YAMLのみ）
- テーブル区切り線の `---` は除外して数える

---

## Execution Priority

1. **Group B** (#11, #13-21, #27-29) — VJU直轄のガイドライン（学生に直接関係）
2. **Group C** (#30-41) — 教育省レベルの規程（参照用）
3. **Group D** (#42-46) — 政府レベルの法令
4. **Group F** (#50-52) — 財務公開レポート

---

## Format Normalization: 3626-QD-DHQGHN (Special)

3626の3言語版でPDF原文との不整合あり。別途正規化が必要:

| # | Rule | Pattern | Target | Est. Count | Status |
|---|------|---------|--------|:----------:|:------:|
| 1 | khoản → 番号付きリスト | `- N.` → `N.` | 行頭の `- 1.`〜`- 10.` | ~176-180 | pending |
| 2 | điểm → 通常段落 | `   - a)` → `a)` | `   - a)`〜`   - i)` | ~238-256 | pending |
| 3 | điểm (period) | `   - a.` → `a.` | Art.36のみ | 4 | pending |
| 4 | 3rd-level nest | `     - text` → `- text` | Art.35のみ | ~6 | pending |
| 5 | Chapter heading merge | 番号+タイトル結合 | 9章分 | 9 | pending |

---

## Duplicate/Overlap Notes

- `DHVN-QD-700`: `3. University Regulations` と `4. Education Testing` の両方に存在 → Regulations版を正本として使用
- `DHVN-HD-259`: Annex/Appendix の重複PDF → Annex版を使用
- `BGDDT-QD-4998`: `.pdf` と `.docx` 両方あり → PDFのみ移行
- `DHQGHN-QD-5115`: `3626` により廃止 → `[Superseded]` 注記付きで移行済み
- `DHVN-HD-1534`: Main doc + Layout Guide はPDFなし（.docx のみ）
