// =============================================================
// test-markdown-preprocessing.js
// Tests for the markdown preprocessing logic
// =============================================================

// Helper: simplified version of preprocessLegalMd for testing.
// This extracts the core logic without DOM dependencies.
function preprocessForTest(md) {
  // Escape numbered lists: "1. " at line start -> "1\. "
  md = md.replace(/^(\d+)\. /gm, '$1\\. ');
  return md;
}

describe('Markdown Preprocessing', function () {

  it('escapes numbered list markers', function () {
    var input = '1. First item\n2. Second item';
    var result = preprocessForTest(input);
    assert(result.includes('1\\. '), 'Should escape "1. " to "1\\. "');
    assert(result.includes('2\\. '), 'Should escape "2. " to "2\\. "');
  });

  it('does not escape numbers mid-line', function () {
    var input = 'See section 1. for details';
    var result = preprocessForTest(input);
    // Only line-start numbers are escaped
    assertEqual(result, input, 'Mid-line "1. " should not be escaped');
  });

  it('preserves diem letters (a), b), etc.)', function () {
    var input = 'a) First point\nb) Second point';
    var result = preprocessForTest(input);
    assert(result.includes('a)'), 'Should preserve a)');
    assert(result.includes('b)'), 'Should preserve b)');
  });

  it('handles mixed khoan and diem', function () {
    var input = '1. Khoan text\n    a) Diem text\n    b) Diem text\n2. Next khoan';
    var result = preprocessForTest(input);
    assert(result.includes('1\\. '), 'Should contain escaped khoan 1');
    assert(result.includes('2\\. '), 'Should contain escaped khoan 2');
    assert(result.includes('a)'), 'Should contain diem a');
  });

  it('escapes multi-digit numbers', function () {
    var input = '10. Tenth item\n25. Twenty-fifth';
    var result = preprocessForTest(input);
    assert(result.includes('10\\. '), 'Should escape 10.');
    assert(result.includes('25\\. '), 'Should escape 25.');
  });

  it('handles empty input', function () {
    assertEqual(preprocessForTest(''), '');
  });

  it('handles text with no numbered lists', function () {
    var input = 'Just a paragraph.\nAnother line.';
    assertEqual(preprocessForTest(input), input);
  });
});
