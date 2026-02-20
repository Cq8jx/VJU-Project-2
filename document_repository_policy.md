# 文書リポジトリ方針（固定）

このファイルは、PDF_Converter_App で扱う文書メタデータ方針の固定ドキュメントです。  
将来の実装差分が発生した場合でも、この方針を基準に判断します。

## 1. 保存方針
1. 原本ファイル（PDF/DOCX/MD 等）はフォルダ分割せず、単一保存領域に集約する。
2. 分類は保存場所ではなくメタデータ（`category`, `lang`, `tags`, `relations`）で行う。
3. 表示時にインデックスを生成し、検索・絞り込み・関連リンク表示を行う。

## 2. メタデータ方針
1. 規定本体識別子は `doc_id` を使用する。
2. 部分識別子（別紙/付録/翻訳差分）は `part_id` を使用する。
3. 出力メタデータでは `id` は使用せず、`doc_id` に統一する。
4. 関連規定は `relations[]` で保持し、`type` は `replaces/replaced_by/related/references` のみ許可する。
5. `related_ids[]` は内部互換用に保持し、`relations[]` へ自動展開する。外部出力は `relations[]` を優先する。
6. タグは小文字・ハイフン形式へ正規化する（例: `quality assurance` -> `quality-assurance`）。
7. メタデータ全般の正規化（ASCII化、空白除去等）は [Spec_PDF_Converter_App.md](Spec_PDF_Converter_App.md#11-メタデータ正規化ルール-metadata-normalization-rules) の規定に従う。

## 3. 必須・推奨キー
1. 必須: `doc_id`, `part_id`, `title`, `lang`, `tags`, `document_status`
   - `document_status` の既定値は `active`。失効・改廃は手動で更新する。
2. 推奨: `source_url`, `source_hash_sha256`, `storage_path`, `issue_date`, `effective_date`

## 4. UI 方針
1. タグはクリック可能表示にし、将来の絞り込み導線へ接続する。
2. 関連規定IDはクリック可能表示にし、`doc_id` ベースの遷移導線へ接続する。
3. 失効・置換済みは `document_status` を使って視覚的に明示する。

## 5. 合意事項（2026-02-08）
1. 初期コストより将来保守性を優先する。
2. 保存場所は一箇所に集約する。
3. 表示タイミングでメタデータから整理する。
4. タグと関連規定は将来クリック可能リンクとして扱える設計を維持する。
