#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!filePath.endsWith('.md')) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    const today = new Date().toISOString().split('T')[0];

    // 1. Add or update last_updated in frontmatter
    if (content.includes('last_updated:')) {
        content = content.replace(/last_updated:\s*".*"/g, `last_updated: "${today}"`);
    } else {
        content = content.replace(/(replaces:\s*\[\]\nreplaced_by:\s*\[\]\nrevision_history:\s*\[\]\n)(tags:)/g, `$1last_updated: "${today}"\n$2`);
    }

    // Process line by line for indentation rules to avoid affecting frontmatter
    const lines = content.split('\n');
    let inFrontmatter = false;
    let frontmatterHyphens = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle frontmatter boundary
        if (line.trim() === '---') {
            frontmatterHyphens++;
            if (frontmatterHyphens === 1) {
                inFrontmatter = true;
            } else if (frontmatterHyphens === 2) {
                inFrontmatter = false;
            }
            continue;
        }

        if (!inFrontmatter) {
            // 2. Fix numbered list indentation (e.g. "   1. " -> "1. ")
            if (/^[ \t]+(\d+\.\s+)/.test(line)) {
                lines[i] = line.replace(/^[ \t]+(\d+\.\s+)/, '$1');
            }
            
            // 3. Fix dash lists (force 2 spaces indent for standard top-level dash lists)
            // If it starts with 0 or 1 space then a dash, convert to 2 spaces
            if (/^[ \t]{0,1}-\s+(.*)/.test(lines[i])) {
                lines[i] = lines[i].replace(/^[ \t]{0,1}-\s+(.*)/, '  - $1');
            }
        }
    }
    content = lines.join('\n');

    // 4. Safe markdown corruption repairs (outside frontmatter)
    // Fix accidental inline heading token breaks seen in EN files: "...this\n### Article." -> "...this Article."
    content = content.replace(/([^\n])\n### Article\./g, '$1 Article.');

    // Unescape pipes only on table-like lines to avoid corrupting prose/code.
    content = content.split('\n').map((line) => {
        if (!line.includes('\\|')) return line;
        const pipeishCount = (line.match(/\|/g) || []).length + (line.match(/\\\|/g) || []).length;
        return pipeishCount >= 2 ? line.replace(/\\\|/g, '|') : line;
    }).join('\n');

    // 5. Fix *** separator spacing
    // Ensure proper blank line before and after ***
    content = content.replace(/([^\n])\n\*\*\*\n([^\n])/g, '$1\n\n***\n\n$2');
    content = content.replace(/\n\n\*\*\*\n([^\n])/g, '\n\n***\n\n$1');
    content = content.replace(/([^\n])\n\*\*\*\n\n/g, '$1\n\n***\n\n');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`[UPDATED] ${filePath}`);
    } else {
        console.log(`[SKIPPED] ${filePath} (No changes needed)`);
    }
}

function main() {
    const target = process.argv[2];
    if (!target) {
        console.log('Usage: node preprocess_md.js <file_or_directory>');
        console.log('Example: node preprocess_md.js ../data/New_Document.md');
        process.exit(1);
    }

    const targetPath = path.resolve(target);
    
    if (!fs.existsSync(targetPath)) {
        console.error(`Error: Path not found: ${targetPath}`);
        process.exit(1);
    }

    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
        const files = fs.readdirSync(targetPath);
        for (const file of files) {
            const filePath = path.join(targetPath, file);
            if (fs.statSync(filePath).isFile()) {
                processFile(filePath);
            }
        }
    } else if (stat.isFile()) {
        processFile(targetPath);
    }
}

main();
