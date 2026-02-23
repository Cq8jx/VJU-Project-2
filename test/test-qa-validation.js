// =============================================================
// test-qa-validation.js
// Tests for QA validation helper functions
// =============================================================

// === QA Validation Helper Functions ===

function validateYamlFrontMatter(md) {
  var errors = [];
  var requiredFields = ['doc_id', 'title', 'date', 'department', 'type', 'restricted', 'last_updated'];
  var validDepartments = ['Academic Affairs', 'Quality Assurance', 'Financial Affairs', 'General Affairs', 'Student Affairs', 'International Cooperation', 'Science and Technology', 'Organization and Personnel'];
  var validTypes = ['Regulation', 'Circular', 'Guideline', 'Notification', 'Decree', 'Decision', 'Report'];

  var match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) { errors.push('No YAML front matter found'); return { errors: errors }; }

  var yaml = match[1];
  var fields = {};
  yaml.split('\n').forEach(function (line) {
    var m = line.match(/^(\w+):\s*(.+)/);
    if (m) fields[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });

  requiredFields.forEach(function (field) {
    if (!fields[field]) errors.push('Missing required field: ' + field);
  });

  if (fields.department && !validDepartments.includes(fields.department)) {
    errors.push('Invalid department: ' + fields.department);
  }
  if (fields.type && !validTypes.includes(fields.type)) {
    errors.push('Invalid type: ' + fields.type);
  }
  if (fields.date && !/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
    errors.push('Invalid date format: ' + fields.date + ' (expected YYYY-MM-DD)');
  }

  return { errors: errors, fields: fields };
}

function validateDocId(docId) {
  var valid = /\//.test(docId) && /[\u0111\u0110]/.test(docId);
  return { valid: valid, docId: docId };
}

function validateIndentation(text) {
  var warnings = [];
  var lines = text.split('\n');
  lines.forEach(function (line, i) {
    // khoan starting with number at column 0 should have indent
    if (/^\d+\.\s/.test(line)) {
      warnings.push('Line ' + (i + 1) + ': khoan "' + line.substring(0, 30) + '..." has no indentation (expected 4 spaces)');
    }
  });
  return { warnings: warnings };
}

function validateHtmlMarkdownMix(text) {
  var errors = [];
  // Detect *...* or **...** inside HTML tags
  var htmlBlocks = text.match(/<(p|div|span)[^>]*>[\s\S]*?<\/\1>/g) || [];
  htmlBlocks.forEach(function (block) {
    if (/\*[^*]+\*/.test(block) && !/<em>|<strong>/.test(block)) {
      errors.push('Markdown emphasis inside HTML: ' + block.substring(0, 60) + '...');
    }
  });
  return { errors: errors };
}

// === Tests ===

describe('QA Validation Helpers', function () {

  it('validateYamlFrontMatter detects missing required fields', function () {
    var incomplete = '---\ntitle: Test\n---\nBody';
    var result = validateYamlFrontMatter(incomplete);
    assert(result.errors.length > 0, 'Should detect missing fields');
    assert(result.errors.some(function (e) { return e.includes('doc_id'); }), 'Should flag missing doc_id');
  });

  it('validateYamlFrontMatter passes valid front matter', function () {
    var valid = '---\ndoc_id: "3626/Q\u0110-\u0110HQGHN"\ntitle: Test\ndate: 2024-01-01\ndepartment: Academic Affairs\ntype: Regulation\nrestricted: false\nlast_updated: 2024-01-01\n---\nBody';
    var result = validateYamlFrontMatter(valid);
    assertEqual(result.errors.length, 0, 'Should have no errors, got: ' + result.errors.join('; '));
  });

  it('validateYamlFrontMatter detects invalid department', function () {
    var bad = '---\ndoc_id: "test"\ntitle: Test\ndate: 2024-01-01\ndepartment: Fake Department\ntype: Regulation\nrestricted: false\nlast_updated: 2024-01-01\n---\nBody';
    var result = validateYamlFrontMatter(bad);
    assert(result.errors.some(function (e) { return e.includes('Invalid department'); }), 'Should flag invalid department');
  });

  it('validateYamlFrontMatter detects invalid date format', function () {
    var bad = '---\ndoc_id: "test"\ntitle: Test\ndate: 01/01/2024\ndepartment: Academic Affairs\ntype: Regulation\nrestricted: false\nlast_updated: 2024-01-01\n---\nBody';
    var result = validateYamlFrontMatter(bad);
    assert(result.errors.some(function (e) { return e.includes('Invalid date format'); }), 'Should flag invalid date');
  });

  it('validateYamlFrontMatter detects missing front matter', function () {
    var result = validateYamlFrontMatter('No front matter here');
    assert(result.errors.some(function (e) { return e.includes('No YAML front matter found'); }), 'Should detect missing front matter');
  });

  it('validateDocId detects diacritical presence', function () {
    assert(validateDocId('3626/Q\u0110-\u0110HQGHN').valid === true, 'Original should be valid');
  });

  it('validateDocId rejects sanitized ID without diacriticals', function () {
    assert(validateDocId('3626-QD-DHQGHN').valid === false, 'Sanitized ID should be invalid (no slash or diacriticals)');
  });

  it('validateIndentation detects incorrect khoan indent', function () {
    var bad = '1. No indent khoan';
    var result = validateIndentation(bad);
    assert(result.warnings.length > 0, 'Should warn about indentation');
  });

  it('validateIndentation passes properly indented khoan', function () {
    var good = '    1. Properly indented khoan';
    var result = validateIndentation(good);
    assertEqual(result.warnings.length, 0, 'Should have no warnings');
  });

  it('validateHtmlMarkdownMix detects asterisks inside HTML tags', function () {
    var bad = '<p align="center">*(Ban h\u00E0nh k\u00E8m theo)*</p>';
    var result = validateHtmlMarkdownMix(bad);
    assert(result.errors.length > 0, 'Should detect markdown inside HTML');
  });

  it('validateHtmlMarkdownMix passes HTML with proper tags', function () {
    var good = '<p align="center"><em>(Ban h\u00E0nh k\u00E8m theo)</em></p>';
    var result = validateHtmlMarkdownMix(good);
    assertEqual(result.errors.length, 0, 'Should pass with HTML tags');
  });

  it('validateHtmlMarkdownMix passes plain text without HTML', function () {
    var plain = 'Just some *italic* text outside HTML';
    var result = validateHtmlMarkdownMix(plain);
    assertEqual(result.errors.length, 0, 'Should pass for non-HTML text');
  });
});
