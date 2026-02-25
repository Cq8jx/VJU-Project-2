#!/usr/bin/env node
/**
 * build-search-index.js
 *
 * Scans data/*_transcription*.md files and generates data/search-index.json
 * for the client-side search engine.
 *
 * Usage: node scripts/build-search-index.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'search-index.json');
const BODY_LIMIT = 500; // max chars for body snippet

// ---------------------------------------------------------------------------
// YAML front matter parser (simple key: value only, no nested structures)
// ---------------------------------------------------------------------------
function parseYaml(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = {};
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    // Skip array items, empty lines, and continuation lines
    if (!trimmed || trimmed.startsWith('-') || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx < 1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Skip array/object values
    if (value === '[]' || value === '{}') continue;
    yaml[key] = value;
  }
  return yaml;
}

// ---------------------------------------------------------------------------
// Extract body text: strip YAML, HTML tags, markdown formatting
// ---------------------------------------------------------------------------
function extractBody(text) {
  // Remove YAML front matter
  let body = text.replace(/^---[\s\S]*?---\r?\n?/, '');

  // Remove disclaimer blockquotes (support canonical + localized labels)
  body = body.replace(/^>\s*\*\*\[(?:DISCLAIMER|免責事項|TUYÊN BỐ TỪ CHỐI TRÁCH NHIỆM)\]\*\*[\s\S]*?(?=\n[^>]|\n\n)/m, '');

  // Remove HTML tags
  body = body.replace(/<[^>]+>/g, '');

  // Remove markdown images
  body = body.replace(/!\[[^\]]*\]\([^)]*\)/g, '');

  // Remove markdown links, keep text
  body = body.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Remove markdown bold/italic markers
  body = body.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
  body = body.replace(/_{1,3}([^_]+)_{1,3}/g, '$1');

  // Remove markdown headings markers
  body = body.replace(/^#{1,6}\s+/gm, '');

  // Remove horizontal rules
  body = body.replace(/^[-*_]{3,}\s*$/gm, '');

  // Remove blockquote markers
  body = body.replace(/^>\s?/gm, '');

  // Collapse whitespace
  body = body.replace(/\r\n/g, '\n');
  body = body.replace(/\n{3,}/g, '\n\n');
  body = body.trim();

  // Take first N characters
  if (body.length > BODY_LIMIT) {
    body = body.slice(0, BODY_LIMIT).replace(/\s+\S*$/, '') + '…';
  }

  return body;
}

// ---------------------------------------------------------------------------
// Derive the registry key from a filename base
// e.g. "3626-QD-DHQGHN_Regulation on Undergraduate Training" → "3626-QD-DHQGHN"
// The doc ID is the first underscore-delimited segment (always hyphens/numbers/CAPS)
// ---------------------------------------------------------------------------
function deriveRegistryKey(base) {
  const firstUnderscore = base.indexOf('_');
  if (firstUnderscore < 0) return base;
  return base.slice(0, firstUnderscore);
}

// ---------------------------------------------------------------------------
// Parse a single MD file: returns { title, body } or null if file missing
// ---------------------------------------------------------------------------
function parseFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const text = fs.readFileSync(filePath, 'utf8');
  const yaml = parseYaml(text);
  const title = yaml.title || '';
  const body = extractBody(text);
  return { title, body, yaml };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  // 1. Find all Vietnamese transcription files (no language suffix)
  const allFiles = fs.readdirSync(DATA_DIR);
  const viFiles = allFiles
    .filter(f => f.endsWith('_transcription.md'))
    .sort();

  console.log(`Found ${viFiles.length} Vietnamese transcription files`);

  const index = {};

  for (const viFile of viFiles) {
    // Derive the base (everything before _transcription.md)
    const base = viFile.replace(/_transcription\.md$/, '');
    const registryKey = deriveRegistryKey(base);

    // Parse VI file
    const viPath = path.join(DATA_DIR, viFile);
    const vi = parseFile(viPath);
    if (!vi) {
      console.warn(`  WARN: could not parse ${viFile}`);
      continue;
    }

    // Check for EN and JA variants
    const enFile = `${base}_transcription_en.md`;
    const jaFile = `${base}_transcription_ja.md`;
    const en = parseFile(path.join(DATA_DIR, enFile));
    const ja = parseFile(path.join(DATA_DIR, jaFile));

    // Build titles object
    const titles = { vi: vi.title };
    if (en) titles.en = en.title;
    if (ja) titles.ja = ja.title;

    // Build body object
    const body = { vi: vi.body };
    if (en) body.en = en.body;
    if (ja) body.ja = ja.body;

    // Extract doc_id from YAML (try doc_id first, then id)
    const docId = vi.yaml.doc_id || vi.yaml.id || registryKey;

    // Extract additional metadata (filter out literal "null" strings from YAML)
    const clean = (v) => (!v || v === 'null') ? '' : v;
    const date = clean(vi.yaml.date || vi.yaml.issue_date);
    const department = clean(vi.yaml.department || vi.yaml.issuer);
    const type = clean(vi.yaml.type || vi.yaml.category);

    index[base] = {
      titles,
      body,
      doc_id: docId,
      registry_key: registryKey,
      date,
      department,
      type
    };

    const langs = ['vi', en ? 'en' : null, ja ? 'ja' : null].filter(Boolean).join(', ');
    console.log(`  ${registryKey} [${langs}]`);
  }

  // 2. Write output
  const json = JSON.stringify(index, null, 2);
  fs.writeFileSync(OUTPUT_FILE, json, 'utf8');
  console.log(`\nWrote ${Object.keys(index).length} entries to ${OUTPUT_FILE}`);
  console.log(`File size: ${(Buffer.byteLength(json) / 1024).toFixed(1)} KB`);
}

main();
