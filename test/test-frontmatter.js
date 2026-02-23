// =============================================================
// test-frontmatter.js
// Tests for stripFrontMatter() and parseFrontMatter()
// =============================================================

describe('stripFrontMatter', function () {
  it('removes YAML front matter', function () {
    var input = '---\ntitle: Test\ndate: 2024-01-01\n---\n# Content';
    assertEqual(stripFrontMatter(input), '# Content');
  });

  it('returns original text when no front matter', function () {
    var input = '# No front matter here';
    assertEqual(stripFrontMatter(input), input);
  });

  it('handles empty string', function () {
    assertEqual(stripFrontMatter(''), '');
  });

  it('handles front matter with empty body', function () {
    var input = '---\ntitle: Test\n---\n';
    assertEqual(stripFrontMatter(input), '');
  });

  it('handles multiline values in front matter', function () {
    var input = '---\ntitle: Test\ndoc_id: "3626/Q\u0110-\u0110HQGHN"\n---\n# Content';
    var result = stripFrontMatter(input);
    assert(!result.includes('---'), 'Should not contain ---');
    assert(result.includes('# Content'), 'Should contain body');
  });

  it('does not strip --- that appears later in the document', function () {
    var input = '---\ntitle: Test\n---\n# Content\n---\nThis is a horizontal rule';
    var result = stripFrontMatter(input);
    assert(result.includes('---'), 'Should preserve --- in body');
    assert(result.includes('# Content'), 'Should contain body');
  });

  it('strips trailing newlines after front matter delimiter', function () {
    var input = '---\ntitle: Test\n---\n\n\n# Content';
    var result = stripFrontMatter(input);
    assertEqual(result, '# Content');
  });
});

describe('parseFrontMatter', function () {
  it('parses basic key-value pairs', function () {
    var input = '---\ntitle: Test Document\ndate: 2024-01-01\n---\nBody';
    var result = parseFrontMatter(input);
    assertEqual(result.title, 'Test Document');
    assertEqual(result.date, '2024-01-01');
  });

  it('converts restricted boolean true', function () {
    var input = '---\nrestricted: true\n---\nBody';
    var result = parseFrontMatter(input);
    assert(result.restricted === true, 'restricted should be boolean true');
  });

  it('converts restricted boolean false', function () {
    var input = '---\nrestricted: false\n---\nBody';
    var result = parseFrontMatter(input);
    assert(result.restricted === false, 'restricted should be boolean false');
  });

  it('handles quoted strings', function () {
    var input = '---\ndoc_id: "3626/Q\u0110-\u0110HQGHN"\n---\nBody';
    var result = parseFrontMatter(input);
    assertEqual(result.doc_id, '3626/Q\u0110-\u0110HQGHN');
  });

  it('returns empty object when no front matter', function () {
    var result = parseFrontMatter('No front matter');
    assertDeepEqual(result, {});
  });

  it('handles empty input', function () {
    var result = parseFrontMatter('');
    assertDeepEqual(result, {});
  });

  it('preserves Vietnamese diacriticals in values', function () {
    var input = '---\ndoc_id: "4668/Q\u0110-\u0110HQGHN"\ntitle: Quy ch\u1EBF \u0111\u00E0o t\u1EA1o\n---\nBody';
    var result = parseFrontMatter(input);
    assertEqual(result.doc_id, '4668/Q\u0110-\u0110HQGHN');
    assert(result.title.includes('\u0111\u00E0o t\u1EA1o'), 'Should preserve diacriticals');
  });

  it('handles single-quoted strings', function () {
    var input = "---\ntitle: 'Quoted Title'\n---\nBody";
    var result = parseFrontMatter(input);
    // Single quotes are not stripped by the parser — this documents current behavior
    assertEqual(result.title, "'Quoted Title'");
  });

  it('handles values with colons', function () {
    var input = '---\ntitle: Part A: Overview\n---\nBody';
    var result = parseFrontMatter(input);
    // The regex captures everything after the first ": "
    assertEqual(result.title, 'Part A: Overview');
  });
});
