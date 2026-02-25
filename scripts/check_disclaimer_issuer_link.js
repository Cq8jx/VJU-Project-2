#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/_transcription(?:_(en|ja))?\.md$/.test(entry.name)) out.push(p);
  }
}

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return {};
  const end = content.indexOf('\n---\n', 4);
  if (end < 0) return {};
  const fm = content.slice(4, end).split('\n');
  const map = {};
  for (const line of fm) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    map[m[1]] = v;
  }
  return map;
}

function getDisclaimerRange(content) {
  const lines = content.split('\n');
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^>\s*\*\*(?:\[(?:DISCLAIMER|MIỄN TRỪ TRÁCH NHIỆM)\]|【免責事項】)\*\*/.test(line)) {
      const start = offset;
      let j = i;
      let endOffset = offset + line.length + 1;
      while (j + 1 < lines.length && /^>/.test(lines[j + 1])) {
        j += 1;
        endOffset += lines[j].length + 1;
      }
      return { start, end: endOffset };
    }
    offset += line.length + 1;
  }
  return null;
}

function isLikelyVjuDoc(filePath, fm) {
  const sig = [
    filePath,
    fm.doc_id || '',
    fm.id || '',
    fm.issuer || '',
    fm.department || '',
    fm.source_pdf || '',
    fm.title || '',
  ].join('\n');
  return /(VJU|Vietnam Japan University|ĐHVN|DHVN|KT&ĐBCL|KTDBCL)/i.test(sig);
}

function hasVjuDisclaimerTarget(disclaimer) {
  return /(Vietnam Japan University|ベトナム日本大学)/i.test(disclaimer) &&
    /(vju\.ac\.vn|vju\.vnu\.edu\.vn)/i.test(disclaimer);
}

function hasVnuGenericTarget(disclaimer) {
  return /(Vietnam National University,\s*Hanoi|ベトナム国家大学ハノイ校)/i.test(disclaimer) &&
    /vnu\.edu\.vn/i.test(disclaimer) &&
    !/vju\.vnu\.edu\.vn/i.test(disclaimer);
}

function fixDisclaimer(disclaimer) {
  let next = disclaimer;
  next = next.replace(
    /Vietnam National University,\s*Hanoi\s*\(__https?:\/\/vnu\.edu\.vn\/?__\)/g,
    'Vietnam Japan University (__https://vju.ac.vn__)'
  );
  next = next.replace(
    /Vietnam National University,\s*Hanoi\s*\(https?:\/\/vnu\.edu\.vn\/?\)/g,
    'Vietnam Japan University (https://vju.ac.vn)'
  );
  next = next.replace(
    /発行機関（ベトナム国家大学ハノイ校\s*__https?:\/\/vnu\.edu\.vn\/?__）/g,
    '発行機関（ベトナム日本大学 __https://vju.ac.vn__）'
  );
  next = next.replace(
    /ベトナム国家大学ハノイ校\s*__https?:\/\/vnu\.edu\.vn\/?__/g,
    'ベトナム日本大学 __https://vju.ac.vn__'
  );
  return next;
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const roots = args.filter(a => !a.startsWith('--'));
  const scanRoots = roots.length ? roots : ['data', 'confidential'];

  const files = [];
  for (const root of scanRoots) {
    if (!fs.existsSync(root)) continue;
    const st = fs.statSync(root);
    if (st.isDirectory()) walk(root, files);
    else files.push(root);
  }

  const results = [];
  for (const filePath of files.sort()) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);
    const range = getDisclaimerRange(content);
    if (!range) continue;
    const disclaimer = content.slice(range.start, range.end);
    if (!isLikelyVjuDoc(filePath, fm)) continue;

    const mismatch = hasVnuGenericTarget(disclaimer) && !hasVjuDisclaimerTarget(disclaimer);
    if (!mismatch) continue;

    let fixed = false;
    let updated = content;
    if (apply) {
      const patched = fixDisclaimer(disclaimer);
      if (patched !== disclaimer) {
        updated = content.slice(0, range.start) + patched + content.slice(range.end);
        fs.writeFileSync(filePath, updated, 'utf8');
        fixed = true;
      }
    }

    results.push({
      file: filePath,
      doc_id: fm.doc_id || fm.id || null,
      mismatch: true,
      fixed,
    });
  }

  console.log(JSON.stringify({
    scanned_files: files.length,
    mismatches: results.length,
    fixed: results.filter(r => r.fixed).length,
    results,
  }, null, 2));

  process.exit(results.length > 0 && !apply ? 2 : 0);
}

main();
