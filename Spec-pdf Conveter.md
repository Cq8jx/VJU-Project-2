# AI PDF Converter App - App Generation Instructions

## 最新仕様更新（2026-02-08）

1. 入力形式
   1. `.pdf`, `.md`, `.docx` をサポート
2. テーブル処理
   1. 表セルの `left/center/right` 揃えを保持
   2. 左揃えセルは罫線密着を避けるため字下げを適用
   3. ページ跨ぎ表は同一テーブルとして結合
   4. 継続ページに見出し行が無い場合、見出しを捏造しない
3. メタデータ
   1. `translation_lang` を追加し、アクティブ出力タブ言語へ自動同期（手動上書き可）
   2. `Document ID` は ASCII 正規化（非ASCII除去、NFKC）
   3. `signer` は ASCII 正規化（非ASCII文字の置換・除去、NFKC）を適用する。姓名の間のスペースは保持するが、ベトナム語特有の文字（例: Đ）は ASCII 互換文字（D）に変換する。
   4. `signed_date` は「有効日」として扱い、明示が無い場合は署名日を採用
   5. `replace_id` は原則1件（直近）を記録
   6. `major_category` は以下を採用  
      `Academic_Regulations`, `Student_Handbook`, `Staff_Regulations`, `IT`, `QA`, `Other`
   7. `relations` を拡張し、親子関係・改廃関係を保持（`parent_of`, `child_of`, `replaces`, `replaced_by`, `references`）
   8. 別添識別として `part_id` 運用を採用
4. 出力とファイル命名
   1. Markdown 出力は GFM 前提
   2. タイトル表示は `doc_title_translated` を優先
   3. ソース添付ファイル名は  
      `{id}_{doc_title_translated(En)}_source.{ext}`
5. ダウンロードUI
   1. 形式選択はトグル方式（色で ON/OFF 判別）
   2. ON/OFF の文字表示は不要
   3. トグル状態はセッション保存・復元
6. 耐障害性
   1. 一部チャンク失敗時は全体停止せず、フォールバックページを挿入して完走
   2. ファイル差し替え時のメタデータ解析にはタイムアウトを設け、失敗時は初期メタデータへフォールバック
7. AI Studio ZIP 運用
   1. ZIP は必ず「フラット構成（ルート直下）」で作成
   2. 親フォルダごと圧縮しない
   3. `.env`, `.gitignore`, `.DS_Store` など不要物は除外
8. DOCX 表示ルール
   1. DOCX 本文にはメタデータ一覧（ID, Signer, Tags など）を表示しない
   2. `Chương` は見出しレベル2、`Điều` は見出しレベル3を基本とする
   3. `Điều n.` で見出し名が欠落している場合は、次行の短いタイトル候補を結合して見出し化する
   4. 箇条書きの `a)`, `b)`, `1.`, `1.1` などの記号は可能な限り保持する
   5. 表セル内テキストは上罫線に密着しないよう、セル内段落に上余白・下余白を設定する
   6. ページ跨ぎの箇条書き・段落は可能な限り連続した同一構造として出力する（強制改ページで分断しない）
   7. 抽出中に混入した単独ページ番号や `Page Break` 文字列は DOCX 本文に表示しない
9. 文字正規化と翻訳
   1. ベトナム語の `d` と `đ` は厳密に区別する
   2. 英語版・日本語版で判定が曖昧な場合は、原文綴り（`d/đ`）を保持してよい
10. タグ表記
   1. タグは先頭を大文字で保存・表示する（例: `Academic`, `Vnu`）
   17. タグは先頭を大文字・ハイフン形式へ正規化する（例: `quality assurance` -> `Quality-Assurance`）。
   18. メタデータ全般の正規化（ASCII化、空白除去等）は [Spec_PDF_Converter_App.md](Spec_PDF_Converter_App.md#11-メタデータ正規化ルール-metadata-normalization-rules) の規定に従う。

You are an expert **Web Application Developer** specializing in React, TypeScript, and Generative AI integration.
Your goal is to build a **Single Page Application (SPA)** that converts PDF documents into high-quality Markdown, with specific features for VJU Regulations but usable for general documents.

**CRITICAL ARCHITECTURE**:
To minimize API costs and ensure stability, this app **MUST** run client-side with smart session management:
1.  **Split PDF**: Convert pages to high-quality images (JPEG/PNG) in the browser.
2.  **Chunking**: Group these images into chunks of **5 pages**.
3.  **Gemini Vision**: Send *only* the images for the current chunk to the Gemini API.
4.  **Session Persistence**: Save progress to `IndexedDB` to protect against reloads (3-hour expiry).

---

## 🛠️ Technology Stack
*   **Framework**: React 18+ (Vite)
*   **Language**: TypeScript
*   **PDF Processing**: `pdfjs-dist` (Client-side rendering)
*   **Data Model**: Use a **Page-Centric** data structure (`PageData[]`) instead of plain text streams. This ensures robust image-to-page mapping.
*   **Export**: **Strictly Structured DOCX Generation**. Avoid `html-to-docx`. Use `docx` primitives with strict Base64 validation.
*   **Persistence**: `idb-keyval` (IndexedDB Wrapper)
*   **AI Integration**: Google GenAI SDK (Gemini 3.0 Flash)
*   **UI Components**: `lucide-react` (Icons), Tailwind CSS (VJU Colors)

---

## 📱 Application Flow & Features

### 0. **Step 0: Session Check (Auto-Restore)**
*   **On Load**: Check `IndexedDB` (key: `vju_converter_session`).
*   **Expiry Logic**:
    *   Read `timestamp`. If `(Date.now() - timestamp) > 3 hours` (10,800,000 ms), **DELETE** the session.
    *   Otherwise: **Restore** the File (Blob), Metadata, and Work Progress.
*   **UI**:
    *   **Auto-Restore**: If session valid, show "Resume Previous Session?" Card in Step 1.
    *   **Content**: Show Filename, Progress %, and "Last Updated" time.
    *   **Actions**: `[Resume]` (Jump to saved step) or `[Dismiss]` (Clear session).

### 1. **Step 1: Upload & Configuration**
*   **Supported Inputs**: `.pdf` (Standard), `.md`.
*   **UI**: Elegant Drag & Drop zone.
*   **Action**:
    1.  **Format Detection**:
        *   **PDF**: Continue to PDF Pre-Processing.
        *   **Markdown (.md)**: 
            *   **Route**: Skip OCR. Go directly to **Step 2 (Repair/Translate)**.
            *   **Use Case**: User uploads a rough `.md` (or translated `.md`) to apply VJU Table rules or Translation.
    2.  **PDF Pre-Processing (Lazy Load)**:
        *   **Action**: Render **Page 1 ONLY** (Correct Orientation, Optimized JPEG).
        *   **Purpose**: Immediate startup for huge files.
    2.  **Metadata Extraction**:
        *   **Strategy**:
            *   **PDF**: Send **Page 1 Image** to Gemini.
            *   **MD**: Send **first 2000 characters** of text to Gemini.
        *   **Prompt**: Use `METADATA_PROMPT`.
        *   **Classify**: Determine if **VJU** or **Generic**.
    3.  **Editable Metadata Card (Persistent)**:
        *   **Visibility**: Show this card in **Step 1, Step 2, and Step 3**. (Always accessible).
        *   **Context-Adaptive Fields**:
            *   **Initial State (Step 1)**: Show `Title (Original)`, `ID`, `Issuer`, `Type`, `Date`, `Related IDs`, `Tags`. 
                *   *Hide*: `Title (Translation Suggestion)`, `Signer` (User can manually expand if needed).
            *   **Post-Transcription (Step 2/3)**: 
                *   AI fills `Signer` if detected in full text.
                *   User can verify/edit `Signer` (ASCII Only, normalize "Đ"->"D").
            *   **Translation Mode**: 
                *   **Show**: `Title (Translation Suggestion)` field. Default: Auto-translated title.
            *   **Tags Field**: Display selected tags.
                *   **Action**: Include `[✎ Manage Tags]` button **inside** this field area.
                *   **Behavior**: Clicking opens a Popover/Modal with the "Available Tags" cloud (Add/Remove custom tags).
                *   **Persistence**: Custom tags added here must be saved to `IndexedDB` (key: `vju_tags`).
        *   **Impact**: User edits MUST overwrite the values used for **Filename Generation** and **Metadata Injection**.
    4.  **Session Recovery Info**: If user navigated back from Step 2/3, show "File is currently processing. [Go to Step X]" button prominently.
*   **Configuration (COMPACT UI)**:
    *   **Style Constraint**: All buttons/inputs must be **Compact**.
        *   **Buttons**: Max height `h-12` (48px). Use `flex-row` not `flex-col` where possible.
        *   **Grid**: Use `grid-cols-2 gap-3` to save vertical space.
    *   **VJU Glossary**: Toggle (Default: ON). Label must include clickable link to `https://docs.google.com/spreadsheets/d/1kfRklEPr2MbZJeKY8Me0lTO68-8G4EtZlviktDpR1pA/edit`.
    *   **Vocabulary / Reference Files**: Upload [.txt, .md] files.
        *   **Action**: Read content of these files and store as `userVocabularyContext`.
    *   **Vocabulary / Reference Files**: Upload [.txt, .md] files.
        *   **Action**: Read content of these files and store as `userVocabularyContext`.
    *   **Sequential Translation**: Verbatim -> English -> Japanese (Auto-start).
    *   **Page Range**: Inputs for `Start Page` (Default: 1) and `End Page` (Default: Max).
        *   **Validation**: Start >= 1, End <= TotalPages, Start <= End.
    *   **Processing Mode**:
        *   **Buttons**: Render as **2 Compact Cards** side-by-side (`h-14` max).
            *   Selected: `bg-blue-600 text-white`.
            *   Unselected: `bg-slate-100`.
        *   **Standard (Default)**: Client-side Image Chunking. (Best for control).
        *   **Fast Mode (File API)**: Upload PDF to Google Server. (Faster start, lower token cost).
            *   *Note*: Requires uploading the file.
            *   **Interaction**: On Click -> **IMMEDIATELY** validate API capability (e.g., call `listFiles` or check key type).
            *   **Validation Failure**:
                *   If check returns error (403/404), **REVERT** selection to "Standard".
                *   **Show Modal**: Display "Fast Mode Setup Guide" immediately (see Step 2 for content).
    *   **Time Estimate**: Display "Approximate time based on Mode".
        *   Calculation: `(SelectedPageRangeChunks * 45 seconds) * 1.2`. (Safety buffer).

### 2. **Step 2: Processing (Sequential Loop)**
*   **Mode A: Standard (Image Chunking)**:
    *   **Loop**:
        1.  **Render**: Just-In-Time render the next batch (e.g., 5 pages) to images.
        *   **Image Handling (CRITICAL)**:
            *   **Validation**: Ensure all inserted images are valid JPEGs and under 10MB to prevent "Unreadable Content" errors in Word.
            *   **Dimensions**: Constrain image width to Page Width (minus margins) to prevent layout breakage.
            *   **Word Constraint**: Explicitly set image width to `6.5 inches` (approx 624px) in the Docx generator. Do NOT rely on "auto" sizing for high-res images.
            *   **Cropping**: If the user applied a Crop in the UI, export the **Cropped** version, not the original full page.
            *   **Alt Text**: Set Alt Text to "Figure from Page X".
        2.  **Send**: Send images to Gemini.
        3.  **Repeat**: Until Page Range end.
*   **Mode B: Fast Mode (File API)**:
    *   **Action**: Upload PDF via `File API` (`uploadFile`).
    *   **Loop**: Send prompt with `file_uri` + "Target Pages: X-Y".
        *   *Note*: Still chunk prompts (e.g., "Summarize pages 1-10") to keep responses manageable.
        *   **CRITICAL ERROR HANDLING**:
            *   If `uploadFile` fails (e.g., 403, 404, or Network Error), **STOP IMMEDIATELY**.
            *   **DO NOT** proceed to generation (Outputting empty files is unacceptable).
            *   **UI Alert**: Show "File API Error" Modal.
            *   **Guide**: Display the following instructions in the modal:
                > **Fast Mode Setup Guide**:
                > 1. Ensure your API Key is from **Google AI Studio**.
                > 2. The File API is enabled by default for AI Studio keys.
                > 3. If using Vertex AI, ensure `Google Cloud Storage` and `Generative Language API` are enabled.
                > 4. [Get Key Here](https://aistudio.google.com/app/apikey)
*   **Gemini Request**: Send Payload + `SYSTEM_PROMPT`.
    *   **Context Injection**: If `userVocabularyContext` exists, append to `SYSTEM_PROMPT` under `5. USER VOCABULARY`.
    *   **Rate Limit Protection (Critical)**:
        *   Handle `429 Too Many Requests`.
        *   **Action**: Implement **Exponential Backoff** (Wait 2s, 4s, 8s, 16s...) up to 30s max wait.
        *   **User Notification**: Show "Pausing for API Cooldown..." status if waiting.
    *   **Phase 1a: Metadata Analysis**: (Existing) Extract ID, Title, etc.
        *   **Frontmatter Injection (Mandatory)**:
            *   Prepend YAML Frontmatter to the *start* of the generated Markdown for each tab.
            ```yaml
            ---
            title: "..."               # Title in THIS file's language
            title_original: "..."      # Title in Original Document
            lang_this_file: "en"       # Language of THIS file
            lang_original: "vi"        # Language of Original Document
            type: "Original" | "Translation"
            doc_id: "..."
            part_id: "..."
            relations: ["references:...", "replaces:..."]
            issuer: "..."
            doc_type: "..."
            effective_date: "YYYY-MM-DD"
            translation_language: "en" | null   # Original(verbatim) は null
            document_status: "active" | "superseded" | "repealed" | "draft" | "unknown"   # default: active
            signer: "..."
            glossary_used: boolean
            ---
            ```
    *   **Phase 1b: Visual Classification (New - CRITICAL)**:
        *   **Goal**: Deterministically decide WHICH pages need an image tag, BEFORE text extraction.
        *   **Input**: Send thumbnails of ALL pages (batch size ~20) to Gemini Flash.
        *   **Prompt**: `VISUAL_CLASSIFICATION_PROMPT` (See System Prompts).
        *   **Output**: JSON Map `{ "1": true, "2": false, "3": true ... }` (True = Page contains Figures/Tables/Signatures/Diagrams).
        *   **Storage**: Save to `visual_map` state.
    *   **Phase 2: Batch Processing (Page-Centric Extraction)**:
        *   **Concept**: Process text in chunks (e.g., 5 pages) but map results back to a structured `pages: PageData[]` state.
        *   **Data Structure**:
            ```typescript
            interface PageData {
              pageNumber: number;
              rawText: string;
              cleanedText: string;
              image?: string;       // Base64 (from Phase 1b)
              hasVisual: boolean;   // (from Phase 1b)
            }
            ```
        *   **Logic**:
            1.  Initialize `pages` array with visual classification results.
            2.  Send chunks to AI.
            3.  Parse AI output (looking for `[[PAGE_START_X]]` markers) to populate `cleanedText` for each page.
            4.  **Result**: A fully structured array where every page has its Text and Image independent of the other.
            4.  **Parse**: Iterate the JSON Block Array.
            5.  **Result**: A fully structured array where every page has its Text and Image independent of the other.
    *   **DISCLAIMER INJECTION (Global)**:
        *   Insert the following disclaimer block as the **first JSON block** for all documents:
            *   Type: "quote"
            *   Text: (See below languages)
                > **[DISCLAIMER]** This document was generated by AI and is for reference only. It has no legal validity. Please refer to the original official document.
            *   **Japanese**:
                > **【免責事項】** 本文書はAIによって作成されたものであり、法的効力はありません。正式な文書については、オリジナルの文書をご確認ください。
            *   **Vietnamese**:
                > **[MIỄN TRỪ TRÁCH NHIỆM]** Tài liệu này được tạo bởi AI và chỉ mang tính chất tham khảo. Tài liệu không có giá trị pháp lý. Vui lòng tham khảo tài liệu gốc.
*   **Persistence**: Auto-save to `IndexedDB` after *every* successful chunk.
*   **AUTOMATED VALIDATION (Syntax Check)**:
    *   **Chunk Handling Logic (Sanitization First)**:
            1.  **Receive**: Get raw text from Gemini via `JSON.parse(response.text)`.
            2.  **Newline Normalization (CRITICAL)**:
                *   **Problem**: When using `responseMimeType: "application/json"` with structured schemas, the AI may output literal `\\n` escape sequences instead of actual newline characters. This causes the entire document to appear on a single line.
                *   **FIX (Mandatory)**: After `JSON.parse()`, apply: `content = content.replace(/\\\\n/g, '\n')`.
                *   *This converts all escaped newlines to real newlines BEFORE any further processing.*
            3.  **Sanitize**: Run `fixMarkdownSyntax(text)` **IMMEDIATELY**.
                *   Regex 1: `text.replace(/(^|\n)(#+)([^ \n])/g, '$1$2 $3')` (Fix `#Title`).
                *   Regex 2: `text.replace(/(#+) +$/gm, '')` (Remove trailing hashes).
            4.  **Validate**: Run syntax check on the *sanitized* text.
                *   *Result*: The "Missing space" error should NEVER trigger now.
            5.  **Display**: Show sanitized text in preview.
    *   **Run after generation**:
        1.  **HTML Tags**: Count `<table`, `</table`, `<tr`, `</tr`. If mismatched -> **FAIL**.
        2.  **Code Blocks**: Count triple backticks ` ``` `. If not even -> **FAIL**.
        *   **UI Outcome**:
        *   **Pass**: Show ✅ on chunk. **Style**: Green Border/Background.
        *   **Warning**: Show ⚠️ on chunk. **Style**: Yellow/Orange. (For minor spacing issues).
        *   **Fail**: Use **"Self-Healing" Pipeline**.
            1.  **Validation Check**: If regex fails (e.g., Header format).
            2.  **Silent Auto-Repair (Attempt 1)**:
                *   Log to `Diagnostic Trace`: "Validation Failed. Attempting Silent Repair..."
                *   **Phase A: Deterministic Script Fix (Priority)**:
                    *   **Logic**: Before calling AI, try to fix known patterns with Regex.
                    *   **Rules**:
                        1.  `Missing Space`: `text.replace(/(^|\n)(#+)([^ \n])/g, '$1$2 $3')`
                        2.  `Trailing Hash`: `text.replace(/(#+) +$/gm, '')`
                        3.  `Unclosed CodeBlock`: `text.replace(/(```.*?)```$/s, '$1')`
                    *   **Log**: "Phase A (Regex) applied. Re-validating..."
                *   **Phase B: Iterative Micro-Repair (Smart Loop)**:
                    *   **Trigger**: If Re-Validation after Phase A still fails.
                    *   **Strategy**: Fix errors **one by one** to avoid timeouts.
                    *   **Loop**: `while (errors.length > 0 && attempts < 3)`:
                        1.  **Select**: Pick the FIRST validation error.
                        2.  **Context Extraction**: Extract strictly `Line[i-2]` to `Line[i+2]` (5 lines max).
                        3.  **Action**: Send **Micro-Payload** to Gemini Flash.
                            *   *Prompt*: "Fix the syntax error in the middle line. Return ONLY the corrected 5 lines."
                            *   *Input*: `{ short_context_string, error_message }`.
                            *   *Timeout*: **15 seconds**.
                        4.  **Patch**: Replace the 5 lines in the main text with the AI result.
                        5.  **Re-Validate**: Check if error count decreased.
                    *   **Log**: "Phase B: Micro-Repair applied to Line [X]..."
            3.  **Outcome**:
                *   **Success**: 
                    *   Status -> **Pass (Green)**.
                    *   **UI**: Do **NOT** show error alert.
                    *   **Log**: "Silent Repair Successful."
                *   **Still Fail**:
                    *   Status -> **Fail (Red)**.
                    *   **UI**: Show ❌ in Header & **Full Error Message** Box.
                    *   **Log (CRITICAL)**: "❌ Repair FAILED: [Reason]. Triggering User Alert." (Must appear in Trace Buffer).
            *   **Error Display (CRITICAL - Only if Repair Fails)**:
                *   Render the **Full Error Message** in a `div.w-full.bg-red-50.text-red-700.p-2.rounded.mt-2.break-words` box inside the card.
                *   **Constraint**: Do NOT hide inside a tooltip. Do NOT truncate. Allow text to wrap to multiple lines.
            *   **Action**: Show `[✨]` (Fix with AI) button next to the error box.
                *   **Interaction**: Click -> Show "Repairing..." Spinner.
                *   **Logic**: 
                    1.  Send chunk + error msg to Gemini with `REPAIR_PROMPT`.
                    2.  **Auto-Fix Application**: Apply the Regex Auto-Fix (`text.replace(/(^|\n)(#+)([^ \n])/g, '$1$2 $3')`) to the AI output *before* saving. (Double safety).
                *   **On Success**: 
                    1.  Replace chunk text.
                    2.  **Re-Run Validation**: If Pass, **IMMEDIATELY** change style to **Green (Success)**.
                    3.  **Badge**: Add "✨ Repaired" label.
                    4.  **Log**: Write detailed fix to Work Log.
        *   **Actions (Per Chunk)**:
            *   **Constraint**: All icon-only buttons **MUST** have a tooltip (`title` attribute).
            *   `[✨]` (Sparkle Icon): Tooltip="Fix Syntax Errors with AI".
            *   `[⬇ Docx]` (Word Icon): Tooltip="Download Chunk Docx".
        *   **Header Check**:
            *   Pattern: `^(#+)([^ \t#])`. (Hash not followed by space, tab, or another hash). -> **FAIL** "Invalid Header Format".
            *   *Note*: Ensure `### Title` (multiple hashes) is NOT flagged as invalid.
            *   Pattern: `^(#+).+(#+)$`. (Trailing hashes). -> **FAIL** "Remove trailing hashes used for closing headers".
            *   Spacing: If a `#` line follows a non-empty line without `\n\n`, it might not render. (Ensure double newline).
            *   **Leaked Hash Check**: If output text contains literal `## ` at start of line (meaning it wasn't parsed as a Header), -> **WARNING**.
            *   **Fake Header Check**: pattern `^\*\*.+\*\*$` (Line is just bold text). -> **FAIL** "Use '# Title' instead of '**Title**' for structure.".
    *   **Image Insertion (Page-Centric Mode)**:
        *   **Principle**: Images are attributes of the `PageData` object, not strings in the text.
        *   **Standard Images**: If `page.hasVisual` is true, the Renderers (Viewer & Export) MUST inject the image.
        *   **Export Logic (Strict DOCX)**:
            *   **Library**: `docx` (by Dolan).
            *   **Method**: **DO NOT** use `html-to-docx`. You must manually iterate the Markdown AST (e.g., via `marked.lexer`) and create `new Paragraph()`, `new Table()` objects.
            *   **Image Handling**:
                *   Use `new ImageRun()`.
                *   **CRITICAL VALIDATION**: You **MUST** strip the Base64 header (`data:image/...;base64,`) before passing data to `ImageRun`. Failing to do this causes "Word found unreadable content".
                *   **Dimensions**: Width fixed to ~624px (6.5 inches).
        *   **Strict Text Priority (CRITICAL)**:
            *   **Rule**: Image injection does not replace text. It complements it.
            *   **Mixed Content**: Render the text, then inject the image (e.g., at the top or bottom of the page's section).
*   **UI Feedback**: Tabbed view (`[Verbatim]`, `[English]`).
    *   **View Mode Toggle**: Include `[Preview]` vs `[Preview (text file)]` switch.
        *   **Preview (Default)**: Shows the rendered HTML with specific fonts and hidden metadata.
        *   **Preview (text file)**: 
            *   Shows the **Exact Source Code** in a `textarea` or `pre` (Monospace).
            *   **Content**: Must include the YAML Frontmatter (so user can check metadata).
            *   **Editable**: Read-Only for V1 (to avoid sync complexity), but allow Copy-Paste.
    *   **Live Font Preview**: The preview text area (Rendered Mode) MUST use the fonts selected in Step 3.
        *   e.g., If "Meiryo" is selected, the preview text should render in Meiryo.
    *   **Rendering Logic (CRITICAL)**:
        *   **Hide Metadata**: The Preview MUST **STRIP** the YAML Frontmatter (`--- ... ---`) before rendering. Do not show raw metadata to the user.
        *   **Style Disclaimers**: Detect Blockquotes (`>`) containing `[DISCLAIMER]` or `[MIỄN TRỪ`.
            *   **Style**: Render as an Alert Box (`bg-yellow-50`, `border-l-4`, `border-yellow-500`, `p-4`, `italic`, `text-yellow-800`).
            *   Do NOT render as a generic gray blockquote.
    *   **Collapsible Container**: Wrap the entire preview area in a `<details>`/Accordion.
        *   **Default State**: **Collapsed** (Hidden) to save space.
        *   **Label**: "Show Live Preview".
    *   **Navigation**:
        *   **Top Bar**: 
            *   `[← Upload New File]` (Confirm: "Discard current progress?").
            *   **Step 2 Controls**: `[Stop / Pause]` button. (Stops the loop, saves current chunks, allows partial download).

### 3. **Step 3: Completion & Download**
*   **Final Output**: DOCX Generation Only.
*   **Merged Document Export (TOP ONLY)**:
    *   **Placement**: Render the following "Export Bar" at the **TOP** of the preview area (Sticky/Fixed). **(Do NOT render at the bottom).**
    *   **Content of Export Bar**:
        1.  **Export Settings**:
            *   **English/Vietnamese Font**: Dropdown [Arial, Times New Roman, Segoe UI, Calibri]. Default: **Arial**. (Apply to Preview).
            *   **Japanese Font**: Dropdown [MS Gothic, MS Mincho, MS P Gothic, Meiryo]. Default: **MS Gothic**. (Apply to Preview).
        2.  **Export Buttons (Merged)**:
            *   **Download All (ZIP)**: Contains the following folders:
                *   `/merged/`: Full DOCX files (Original/Translated).
                *   `/chunks/`: Per-chunk DOCX files.
                *   `/debug/images/`: The EXACT images sent to AI (Cropped/Optimized). (Critical for local repro).
                *   `/debug/json/`: The RAW JSON responses from Gemini.
            *   **Download Merged Word (.docx)**: Only for current tab.
    *   **Grouping**: Keep Settings and Buttons visually grouped (e.g., flex-row).
*   **Filename Strategy for Merged**:
    *   Format: `[ID]_[Title]_Q[start]-[end]_[Suffix].[ext]`。
    *   Suffix ルール:
        1. Verbatim は `transcription`（旧 `Original` は使用しない）。
        2. 翻訳は `En` / `Ja` / `Vi`。
    *   例: `3626-QD-DHQGHN_Decision Promulgating The Regulation On Undergraduate Training At Vietnam National University Hanoi_Q1-53_transcription.md`
    *   **Readability Rule**: Use **Title Case** with **Spaces** (e.g., "Ke Hoach Trien Khai") instead of Snake_Case.
    *   **Underscore Usage**: Use underscores `_` **ONLY** to separate the 3 major components (ID, Title, Language). Do NOT use them between words in the title.
    *   **Title Priority**:
        1.  **Use Metadata Field**: `Title (Translation Suggestion)` (if EN/JA mode) or `Title` (Original).
        2.  **Fallback**: If empty, extract 1st `# Header` from content.
            *   **Ignored Headers**: Ignore "Vietnam Japan University", "VNU", "Socialist Republic of Vietnam".
    *   **Sanitization**: ASCII Only for filename. Remove accents. Keep spaces as spaces.
*   **Export Logic (Hidden)**:
    *   **Word (.docx)**:
        *   **CRITICAL SAFETY (Anti-Corruption)**:
            *   **Sanitize Text**: You **MUST** strip all XML-invalid control characters from ALL string inputs (Headers, Paragraphs, Table Cells) before creating `TextRun`.
                *   *Regex*: `text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")`
                *   *Reason*: characters like Vertical Tab (`\v`) or Null (`\0`) cause "Unreadable Content" errors in Word.
            *   **Image Validation (CRITICAL)**:
                *   **Source Truth**: Since `pdfService` enforces `image/jpeg` (80% quality), the Export Service **MUST** treat all PDF-extracted images as `.jpeg` by default if MIME detection is ambiguous.
                *   **MIME Check**: strictly validate `data:image/jpeg;base64` header. If missing, **APPEND IT** before processing.
                *   **Extension Logic**: Map `image/jpeg` -> `.jpeg`, `image/png` -> `.png`.
                *   **Fallback**: If image data is corrupt (non-base64), insert `[IMAGE LOAD ERROR]` paragraph. **Never** allow `undefined` extension in XML.
        *   **Pre-processing (Markdown -> HTML)**:
            *   **Requirement**: Before generating the Docx, the App MUST convert **Markdown Tables** (`| ... |`) into **HTML Tables** (`<table>`).
            *   **Tool**: Use a library like `marked` or `showdown`.
            *   **Reason**: The Docx generator's `DOMParser` only understands HTML tags. It does not natively parse GFM table syntax.
        *   **Table Strategy (Robust)**:
        *   **DOCX Generation Method (JSON -> DOCX)**:
            *   **Concept**: Since we now receive structured JSON from AI, we skip fragile Markdown parsing.
            *   **Mapping**:
                *   `block.type == "header"` -> `new Paragraph({ text: block.text, heading: HeadingLevel.HEADING_X })`
                *   `block.type == "paragraph"` -> `new Paragraph({ text: block.text, alignment: ... })`
                *   `block.type == "table"` -> `new Table({ rows: block.rows.map(...) })`
            *   **Advantages**:
                *   **Zero Ambiguity**: No more "is this a list or a paragraph?" guessing.
                *   **Table Stability**: 2D Arrays map perfectly to Docx tables. No "Unreadable Content" from bad HTML tags.
                *   **Formatting**: We apply styles programmatically.
            *   **Header Mapping (CRITICAL)**:
                *   The parser MUST support deep levels.
                *   `#` -> `Heading 1`
                *   `##` -> `Heading 2`
                *   `###` -> `Heading 3`
                *   `####` -> `Heading 4` (Often missed, ensure explicit support)
                *   `#####` -> `Heading 5`
                *   `######` -> `Heading 6`
            *   **Paragraphs**: Standard text.
        *   **Style Configuration (CRITICAL OVERRIDE)**:
            *   **Problem**: Word defaults to **Blue** for headings.
            *   **Solution**: You MUST explicitly define the `styles` object in `new Document()`.
            *   **Required Config**:
                ```typescript
                styles: {
                  paragraphStyles: [
                    {
                      id: "Normal", name: "Normal", run: { color: "000000" } // DEFAULT TEXT
                    },
                    {
                      id: "ListParagraph", name: "List Paragraph", run: { color: "000000" } // BULLETS/NUMBERS
                    },
                    {
                       id: "Quote", name: "Quote", 
                       run: { color: "000000", italics: true },
                       paragraph: {
                         shading: { type: "clear", fill: "FFFACD" }, // Light Yellow Background
                         border: { left: { color: "FFD700", space: 5, size: 12, style: "single" } }, // Gold Border
                         indent: { left: 720 } // Indent
                       }
                    },
                    {
                      id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                      run: { color: "000000", bold: true, size: 32 } // Size in half-points (16pt)
                    },
                    {
                      id: "Heading2", name: "Heading 2", run: { color: "000000", bold: true, size: 28 } // 14pt
                    },
                    {
                      id: "Heading3", name: "Heading 3", run: { color: "000000", bold: true, size: 24 } // 12pt
                    },
                    {
                      id: "Heading4", name: "Heading 4", run: { color: "000000", bold: true, size: 24 }
                    },
                    {
                      id: "Heading5", name: "Heading 5", run: { color: "000000", bold: true, size: 22 } // 11pt
                    },
                    {
                      id: "Heading6", name: "Heading 6", run: { color: "000000", bold: true, size: 22 }
                    },
                    {
                      id: "Title", name: "Title", run: { color: "000000", bold: true, size: 56 } // 28pt
                    },
                    {
                      id: "Subtitle", name: "Subtitle", run: { color: "000000", italics: true }
                    }
                  ]
                }
                ```
            *   **Result**: All text `Title` -> `Heading 6` must be STRICTLY BLACK `#000000`.
*   **Navigation**:
    *   **Top Bar**: `[← Start Over]` (Clears Session).

### 4. Work Log (Footer / Debug Console)
*   **Placement**: Absolute bottom of the page (below Step 3).
*   **UI**: Collapsible Accordion (Default: **Collapsed**).
*   **Style**: Dark theme (`bg-slate-900`, `text-green-400`, Monospace).
*   **Content**:
    1.  **System Logs**: "Started Chunk 1...", "Validation Failed: Missing space...", "Rate Limit hit, waiting 2s...".
    2.  **AI Repair Logs**:
        *   `[Repair Attempt] Chunk X: Sending error '...' to AI.`
        *   `[Repair Success] Chunk X: Replaced content. Re-validation result: PASS.`
    3.  **API Errors**: Full JSON response if 4xx/5xx occurs.
    4.  **Validation Details**: Specific line numbers/reasons for validation failures.
*   **Purpose**: Essential for diagnosing "why did validation fail?" or "why is it stuck?".

---

## 🧠 System Prompts (Hardcoded)

### 1. `METADATA_PROMPT` (Step 1 analysis)
```text
Analyze this image (Page 1 of a document). Return a JSON object with:
{
  "is_vju_document": boolean,
  "doc_id": string | null, // See ID RULES below.
  "part_id": string | null, // language/part specific identifier
  "issuer": string | null, // FORCE ENGLISH ABBREVIATION. (e.g. "VJU" not "Vietnam Japan University", "VNU")
  "doc_title_original": string, // Title in source language
  "doc_title_translated": string | null, // Title in target language (English/Japanese)
  "doc_type": string | null, // e.g., "Decision", "Regulation", "Plan", "Report"
  "signed_date": string | null, // Format YYYY-MM-DD
  "signer": string | null, // Name of the person signing
  "original_lang": "vi" | "en" | "ja",
  "related_ids": string[], // Internal compatibility list; final export should prioritize relations.
  "relations": [{ "type": "replaces" | "references" | "related" | "replaced_by" | "parent_of" | "child_of", "target_doc_id": string }],
  "tags": string[] 
}

ID RULES:
1. CHARACTERS: Use Uppercase [A-Z], Numbers [0-9], and Symbols [-/._].
2. CASE: Prefer UPPERCASE. Only use lowercase if strictly necessary for the code format.
3. SEPARATORS: Maintain original separators (e.g., "123/QD-DHQGHN"). Do NOT concatenate numbers and letters (Avoid "123QD").

TAGGING RULES:
1. TOPIC TAGS (Strict): Use the following list: [INSERT_DYNAMIC_TAG_LIST].
   (Default if empty: "Academic", "Admissions", "HR", "Finance", "Student Affairs", "Research", "Facilities", "International", "Quality Assurance", "Education Testing").
2. ISSUER TAGS (Strict): 
   - VNU System: Use "VNU" (Headquarters) or "VNU-[Abbreviation]" (e.g., "VNU-VJU", "VNU-ULIS", "VNU-UET").
3. RELATED IDS: Extract any Document IDs cited in "Pursuant to..." (Basis) or "Replacing..." (Superseded) into `related_ids` array (internal compatibility).
4. RELATIONS: Build `relations` from extracted IDs and explicit replacement statements; prioritize `relations` in exported metadata.
4. NO MATCH: If no tags fit, return empty array []. DO NOT CREATE NEW TAGS.
```

### 2. `SYSTEM_PROMPT` (Step 2 generation)
```text
You are an advanced VJU Regulatory Document Converter, powered by Gemini 3.0 Flash.

YOUR GOAL: Extract content into a STRUCTURED JSON format optimized for DOCX generation.
DO NOT OUTPUT MARKDOWN. OUTPUT STRICT JSON.

JSON STRUCTURE:
Return an array of "Blocks":
type Block =
  | { type: "header", level: 1|2|3|4|5|6, text: string }
  | { type: "paragraph", text: string, align?: "left"|"center"|"right"|"justify" }
  | { type: "list", items: string[], ordered: boolean }
  | { type: "table", rows: string[][] } // First row is header
  | { type: "quote", text: string } // For disclaimers

STRICT RULES:
1. **VERBATIM**: Transcribe text exactly.
2. **TABLES**: Output as 2D Arrays in `rows`. Do NOT use HTML/Markdown.
   - If a cell spans columns, repeat the text or leave empty (logic will handle it).
   - Actually, for Merged Cells, use HTML-like markers inside the string if absolutely needed, but prefer simple 2D arrays for stability.
3. **IMAGES/FIGURES**:
   - Do NOT output OCR text for messy diagrams.
   - If a page has a visual, the system handles it. You focus on TEXT.
4. **NO MARKDOWN SYNTAX**:
   - `text` fields should be plain strings.
   - Do NOT use `**bold**` or `| table |`.

EXAMPLE OUTPUT:
[
  { "type": "header", "level": 1, "text": "DECISION" },
  { "type": "paragraph", "text": "Pursuant to...", "align": "justify" },
  { "type": "table", "rows": [["ID", "Name"], ["1", "John"]] }
]
```

1. VERBATIM EXTRACTION:
   - Transcribe every word exactly.

2. TABLES (CRITICAL):
   - **COMPLEX TABLES**: Use HTML `<table>` tags to preserve Merged Cells.
   - **PAGE-SPLIT TABLES**:
     - If a table continues across pages, **MERGE** it into a single HTML table.
     - **REMOVE** the repeated headers on the new page. Do not create two separate tables.
   - **Style**: `<table border="1" style="border-collapse: collapse; width: 100%;">`
   - **Content**: Use `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.
   - **NO MARKDOWN IN HTML**: Do not use `**bold**` inside HTML tags, use `<b>`.

3. TRANSLATION (If Active):
   - **PRIMARY DIRECTIVE**: Translate the verbatim extraction into the Target Language ([English] or [Japanese]). 
   - **Structure**: Maintain the exact original Markdown structure (tables, headers, lists).
   - Use VJU Glossary if enabled.
   - **GLOSSARY STRUCTURE MAPPING**:
     - **Organization Tab**: Use for Department/Entity names.
       - EN: `Official Name` | JA: `Japanese` | VI: `Vietnamese`.
     - **Personal Name Tab**: Use for Staff/Faculty names.
       - EN: `Passport Name` | JA: `Legal Name`.

4. HEADINGS & STRUCTURE:
   - Ensure a BLANK LINE exists before every Header (`#`).
   - **Hierarchy**: Use `H1` (#) for Doc Title, `H2` (##) for main sections, `H3` (###) for subsections.
   - **DO NOT USE BOLD for HEADINGS**:
     - BAD: `**1. Introduction**`
     - GOOD: `## 1. Introduction` or `### 1.1 Background`
   - Do NOT use valid Markdown headers inside HTML tables (Use `<b>` or `<th>` instead).
   - Do NOT use valid Markdown headers inside HTML tables (Use `<b>` or `<th>` instead).

6. SCANNED/SIGNED DOCUMENTS:
   - **Red Stamps/Seals**: Ignore the red overlay. Transcribe the text *underneath* the stamp.
   - **Signatures**: If a signature exists, write `[Signature: Name]` if legible, or `[Signature]` if not. Do not hallucinate names.
   - **Handwritten Notes**: Transcribe only if they are official corrections. Ignore random scribbles.
   - **Image Artifacts**: Do not output text like "Scanned by CamScanner".

7. FIGURES & IMAGES:
   - **Pure Text Extraction**: Your JOB is to extract TEXT and DATA.
   - **Visuals**: DO NOT output `[[INSERT_IMAGE...]]` tags yourself.
   - **Clean Output**: Do NOT output any Page Markers (e.g. `[PAGE X]`). Just flow the text naturally.

### 3. `VISUAL_CLASSIFICATION_PROMPT` (Step 1b analysis)
```text
Analyze the following pages. For EACH page, determine if it contains "Visual Elements" that require the user to see the Original Image (e.g., Diagrams, Charts, Complex Tables, Signatures, Seals, Hand-written notes, or Non-text drawings).

Return a JSON Object:
{
  "results": [
    { "page": 1, "has_visuals": boolean },
    { "page": 2, "has_visuals": boolean }
    ...
  ]
}

CRITERIA for "has_visuals = true":
- Contains ANY Chart, Graph, Diagram, or Figure.
- Contains text wrapped in boxes or non-standard layout.
- If UNSURE, return TRUE.

CRITERIA for "has_visuals = false":
- ONLY Pure text paragraphs and standard headers.
- Simple bullet point lists.
```

### 6. `REPAIR_PROMPT` (Syntax Fixer)
```text
Task: Fix the Markdown Syntax Error in the text below.
Error: {{errorMessage}}
Constraint:
1. MINIMAL EDIT: Fix ONLY the syntax error (e.g., add missing space count table tags).
2. CONTENT PRESERVATION: Do NOT change any words, numbers, or translations.
3. OUTPUT: Return ONLY the fixed Markdown string. No JSON, no "Here is the fixed text".
Text to Fix:
{{malformedText}}
```

## 🪜 Operational Steps (Implementation Guide)tails

1.  **`store.ts` (Persistence)**:
    *   `saveSession`: Store state + `timestamp` to `idb`.
    *   `saveTags`: Store custom tag array to `idb` (key: `vju_tags`).
    *   `loadSession`: Check expiry (> 3h) -> Load or Delete.
2.  **`pdfService.ts`**:
    *   `optimizeImage`: return `canvas.toDataURL('image/jpeg', 0.8)`. Resize to max 2000px.
    *   **Post-Processor (Mandatory Sanitizer)**: 
        *   Implement `cleanMarkdown(text)` function.
        *   **Order**: Call this *before* `validateMarkdown` and *before* saving to state.
        *   **Code**:
            ```typescript
            function cleanMarkdown(text: string): string {
                let cleaned = text;
                // 1. Fix missing space after hash (#H -> # H). Handle CRLF and Tabs.
                cleaned = cleaned.replace(/(^|[\n\r])(#+)([^ \t\n\r#])/g, '$1$2 $3');
                // 2. Remove trailing hashes (Title ## -> Title)
                cleaned = cleaned.replace(/(#+)\s*$/gm, '');
                return cleaned;
            }
            ```
    *   `validateMarkdown(text)`: Returns `{ isValid: boolean, error?: string }`.
    *   Checks: `(match(/<table/g) || []).length === (match(/<\/table/g) || []).length`.
4.  **`exportService.ts`**:
    *   **STYLE RULES (Strict but Configurable)**:
        *   **Fonts**: `ascii: selectedEnFont`, `eastAsia: selectedJaFont`, `hAnsi: selectedEnFont`.
        *   **Color**: Use `color: "000000"` (Black) for ALL text (Headings & Body).
        *   **TableBorders**: `top/bottom/left/right` style `Result.SINGLE`, color `000000`.

---

## ⚠️ Important Rules
1.  **Client-Side Only**: Use `pdfjs` and `Gemini REST API` directly.
2.  **Strict Tagging**: Valid list Only.
3.  **Optimization**: Always optimize images.
4.  **Verification**: Always run Syntax Validator after generation.

## 7. Future Roadmap: Client-Side Computer Vision (OpenCV.js)
To automate the "Figure Isolation" process without server costs, the app will eventually integrate **OpenCV.js**.

### 7.1 Technical Approach (Method 1: Contour Detection)
*   **Library**: `opencv.js` (WebAssembly version).
*   **Process Flow**:
    1.  **Hidden Render**: Render the PDF page to an off-screen `<canvas>`.
    2.  **Preprocessing**:
        *   Convert to Grayscale (`cv.cvtColor`).
        *   Apply Gaussian Blur (`cv.GaussianBlur`) to reduce text noise.
        *   Apply Thresholding (`cv.threshold`) to binarize.
        *   Dilate (`cv.dilate`) to merge nearby text/shape elements into blobs.
    3.  **Detection**:
        *   Run `cv.findContours`.
        *   Filter contours by **Area** (Ignore small text blocks).
        *   Filter by **Aspect Ratio** (Look for rectangular figure-like shapes).
    4.  **UX Integration**:
        *   When User opens "Crop UI", overlay the **Suggested Bounding Boxes** (Yellow dashed lines).
        *   User can "One-Click" select a suggestion to snap the crop area.


### 8. TECHNICAL IMPLEMENTATION CONSTRAINTS (CRITICAL)

#### A. PDF Processing & Memory Safety
1.  **Worker Communication (ArrayBuffer Safety)**:
    *   **Issue**: `pdf.js` workers may detach the `ArrayBuffer` upon transfer.
    *   **Rule**: When passing PDF data to workers or functions, you **MUST CLONE** the `ArrayBuffer` (e.g., `buffer.slice(0)`) if the main thread needs to retain access.
    *   **Prevention**: Never pass a raw buffer to multiple consumers without cloning.
    *   **Error Target**: Fixes `Failed to execute 'postMessage' on 'Worker': ArrayBuffer ... is already detached`.



#### B. Visual Classification (Aggressive Mode)
1.  **Prompting**: Use the "Aggressive" criteria (If unsure, assume Visual).
2.  **Visual Map**: Must be generated *before* text extraction to guide Post-Hoc Injection.

#### C. RESTRICTED LIBRARIES (Google AI Studio Compatibility)
1.  **NO FFMPEG / HEAVY WASM**: Do NOT use `ffmpeg.wasm`, `mpg123`, or similar heavy video processing binaries. They are incompatible with the lightweight preview environment.
2.  **BUILD-DEPENDENT RUNTIMES**: 
    *   **Issue**: Code causing `react/jsx-runtime` errors implies a dependency on a Node.js Build Step (Vite/Webpack) which may not be available in the target environment.
    *   **Rule**: If the user indicates "No Build Step" or "AI Studio Preview Only", prefer **Vanilla JS** or **CDN-based Vue/React** (UMD build) over `npm install` workflows.
    *   *Note*: The current codebase is React/Vite. The error is solved by `npm install`, but for future generation, respect environment limits.
3.  **STRICT CLIENT-SIDE ONLY**: No `fs` (Node File System), no `child_process`, no `python` bridges. Everything must run in a standard browser context.

## 11. メタデータ正規化ルール (Metadata Normalization Rules)

文書リポジトリの整合性を保つため、以下の正規化ルールを適用する。

### 11.1 ASCII正規化 (ASCII Only)
- **対象フィールド**: `doc_id`, `part_id`, `replace_id`, `related_ids`, `signer`, `issuer`, `tags`
- **内容**: 
  - すべての非ASCII文字（キリル文字、アクセント付き文字、ベトナム語特有文字等）は ASCII 互換文字に変換するか、除去する。
  - **ベトナム語変換例**: `Đ` -> `D`, `đ` -> `d`
  - **NFKC正規化**: 全角英数字、記号（`１`, `／`, `－`）は半角（`1`, `/`, `-`）に変換する。

### 11.2 空白処理 (Whitespace)
- **識別子 (`id` 系)**: 内部にスペースを含めない (例: `123 / QD` -> `123/QD`)。
- **署名者 (`signer`)**: 姓名間のスペースは保持するが、前後の空白はトリムする。

### 11.3 大文字・小文字 (Casing)
- **識別子 (`id` 系)**: すべて大文字 [A-Z] とする。
- **タグ (`tags`)**:
  - 保存・内部処理時: すべて小文字、単語間はハイフン連結 (例: `quality-assurance`)。
  - 表示時: UI上では各単語の先頭を大文字（Title Case）とする。

### 11.4 日付形式 (Date Format)
- **対象**: `signed_date`, `issue_date`, `effective_date`
- **形式**: `YYYY-MM-DD` (例: `2026-02-13`)。

### 11.5 組織略称 (Abbreviations & Issuer Rules)
- **対象**: `issuer`, `id` に含まれる組織名
- **優先順位**: 英語の標準的な略称を最優先で使用する。
- **ルール**: 
  - 可能な限り標準的な最短の略称を使用する。
    - `Vietnam National University, Hanoi` -> `VNU`
    - `Vietnam Japan University` -> `VJU`
    - `Ministry of Education and Training` -> `MOET`
  - **VNUメンバー大学の表記**: VJU 以外の VNU メンバー大学の規定である場合、`VNU-[略称]` の形式を使用する。
    - 例: 外国語大学 (University of Languages and International Studies) -> `VNU-ULIS`
    - 例: 工科大学 (University of Engineering and Technology) -> `VNU-UET`
    - 例: 科学大学 (University of Science) -> `VNU-HUS`
