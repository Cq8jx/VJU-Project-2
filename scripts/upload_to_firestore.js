#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.length < 4) {
  console.error('Usage: node scripts/upload_to_firestore.js <docId> <viFile> <enFile> <jaFile>');
  console.error('Example: node scripts/upload_to_firestore.js "106-QD-DHVN" tmp/vi.md tmp/en.md tmp/ja.md');
  process.exit(1);
}

const [docId, viFile, enFile, jaFile] = args;

// ---------------------------------------------------------------------------
// Validate input files exist before loading Firestore SDK
// ---------------------------------------------------------------------------
const langs = [
  { code: 'vi', file: viFile },
  { code: 'en', file: enFile },
  { code: 'ja', file: jaFile },
];

for (const { code, file } of langs) {
  if (!fs.existsSync(file)) {
    console.error(`Error: ${code} file not found: ${file}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Load Firestore SDK (with friendly error if not installed)
// ---------------------------------------------------------------------------
let Firestore;
try {
  ({ Firestore } = require('@google-cloud/firestore'));
} catch (err) {
  console.error('Error: @google-cloud/firestore is not installed.');
  console.error('Run: cd scripts && npm install');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  let db;
  try {
    db = new Firestore({ projectId: 'vju-project2' });
  } catch (err) {
    if (err.message && err.message.includes('Could not load the default credentials')) {
      console.error('Error: Application Default Credentials not found.');
      console.error('Run: gcloud auth application-default login');
      process.exit(1);
    }
    throw err;
  }

  console.log(`Uploading document: ${docId}`);

  for (const { code, file } of langs) {
    const label = `  ${code}`;
    process.stdout.write(`${label} ... `);

    const text = fs.readFileSync(file, 'utf-8');
    const docRef = db.doc(`docs/${docId}/content/${code}`);

    try {
      await docRef.set({ text });
      console.log(`done (${text.length} chars)`);
    } catch (err) {
      console.log('FAILED');
      if (
        err.code === 16 ||
        (err.message && err.message.includes('Could not load the default credentials'))
      ) {
        console.error('\nError: Authentication failed.');
        console.error('Run: gcloud auth application-default login');
        process.exit(1);
      }
      throw err;
    }
  }

  console.log('All uploads complete.');
}

main().catch((err) => {
  console.error('Unexpected error:', err.message || err);
  process.exit(1);
});
