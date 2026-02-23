// =============================================================
// test-doc-registry.js
// Tests for DOC_REGISTRY data integrity
// =============================================================

describe('DOC_REGISTRY integrity', function () {

  it('all entries have required fields', function () {
    Object.keys(DOC_REGISTRY).forEach(function (key) {
      var entry = DOC_REGISTRY[key];
      assert(entry.prefix, key + ': missing prefix');
      assert(entry.title, key + ': missing title');
      assert(Array.isArray(entry.tags), key + ': tags should be array');
    });
  });

  it('keys use sanitized format (no slash, no diacriticals)', function () {
    Object.keys(DOC_REGISTRY).forEach(function (key) {
      assert(!key.includes('/'), key + ': should not contain /');
      assert(!/[\u0111\u0110]/.test(key), key + ': should not contain diacriticals');
    });
  });

  it('prefix matches key pattern', function () {
    Object.keys(DOC_REGISTRY).forEach(function (key) {
      var entry = DOC_REGISTRY[key];
      // Annex sub-documents use parent key as prefix base (e.g. key "X-Annex" -> prefix "X_Annex...")
      var baseKey = key.replace(/-Annex$/, '');
      assert(entry.prefix.startsWith(baseKey), key + ': prefix "' + entry.prefix + '" should start with base key "' + baseKey + '"');
    });
  });

  it('relations reference existing entries', function () {
    var warnings = [];
    Object.keys(DOC_REGISTRY).forEach(function (key) {
      var entry = DOC_REGISTRY[key];
      if (entry.relations) {
        entry.relations.forEach(function (rel) {
          if (!DOC_REGISTRY[rel.id]) {
            warnings.push(key + ': relation "' + rel.id + '" not found in registry');
          }
        });
      }
    });
    // All current relations should resolve — fail if any are missing
    assertEqual(warnings.length, 0, 'Unresolved relations: ' + warnings.join('; '));
  });

  it('relations have required fields (id, type, label)', function () {
    Object.keys(DOC_REGISTRY).forEach(function (key) {
      var entry = DOC_REGISTRY[key];
      if (entry.relations) {
        entry.relations.forEach(function (rel, i) {
          assert(rel.id, key + ' relation[' + i + ']: missing id');
          assert(rel.type, key + ' relation[' + i + ']: missing type');
          assert(rel.label, key + ' relation[' + i + ']: missing label');
        });
      }
    });
  });

  it('has at least 10 entries', function () {
    var count = Object.keys(DOC_REGISTRY).length;
    assert(count >= 10, 'Expected at least 10 entries, got ' + count);
  });

  it('tags are non-empty arrays of strings', function () {
    Object.keys(DOC_REGISTRY).forEach(function (key) {
      var entry = DOC_REGISTRY[key];
      assert(entry.tags.length > 0, key + ': tags should not be empty');
      entry.tags.forEach(function (tag, i) {
        assert(typeof tag === 'string', key + ' tags[' + i + ']: should be string');
        assert(tag.length > 0, key + ' tags[' + i + ']: should not be empty string');
      });
    });
  });
});
