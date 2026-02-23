// =============================================================
// test-pure-functions.js
// Tests for isVjuMember(), langPrefix(), getDocPrefix()
// =============================================================

// === isVjuMember() ===
describe('isVjuMember', function () {
  it('returns true for @vju.ac.vn email', function () {
    currentUser = { email: 'test@vju.ac.vn' };
    assert(isVjuMember() === true);
  });

  it('returns false for @gmail.com email', function () {
    currentUser = { email: 'test@gmail.com' };
    assert(isVjuMember() === false);
  });

  it('returns falsy when currentUser is null', function () {
    currentUser = null;
    // isVjuMember accesses currentUser?.email, returns undefined (falsy)
    assert(!isVjuMember());
  });

  it('returns false for empty email', function () {
    currentUser = { email: '' };
    assert(isVjuMember() === false);
  });

  it('returns false for similar domain @vju.ac.vn.evil.com', function () {
    currentUser = { email: 'test@vju.ac.vn.evil.com' };
    assert(isVjuMember() === false);
  });

  it('returns falsy when email is undefined', function () {
    currentUser = {};
    // optional chaining returns undefined (falsy) when email is missing
    assert(!isVjuMember());
  });

  it('returns true for uppercase @VJU.AC.VN email (endsWith is case-sensitive)', function () {
    currentUser = { email: 'test@VJU.AC.VN' };
    // endsWith is case-sensitive, so uppercase should NOT match
    assert(isVjuMember() === false);
  });
});

// === langPrefix() ===
describe('langPrefix', function () {
  it('returns vi-sec- for vi', function () {
    assertEqual(langPrefix('vi'), 'vi-sec-');
  });

  it('returns ja-sec- for ja', function () {
    assertEqual(langPrefix('ja'), 'ja-sec-');
  });

  it('returns en-sec- for en', function () {
    assertEqual(langPrefix('en'), 'en-sec-');
  });

  it('returns en-sec- for unknown language (default)', function () {
    assertEqual(langPrefix('ko'), 'en-sec-');
  });

  it('returns en-sec- for empty string', function () {
    assertEqual(langPrefix(''), 'en-sec-');
  });
});

// === getDocPrefix() ===
describe('getDocPrefix', function () {
  it('returns prefix from registry object entry', function () {
    DOC_REGISTRY['test-doc'] = { prefix: 'test-doc_Test Document', title: 'Test' };
    assertEqual(getDocPrefix('test-doc'), 'test-doc_Test Document');
    delete DOC_REGISTRY['test-doc'];
  });

  it('returns docId as fallback for unregistered doc', function () {
    assertEqual(getDocPrefix('nonexistent-doc'), 'nonexistent-doc');
  });

  it('returns correct prefix for 3626-QD-DHQGHN', function () {
    assertEqual(getDocPrefix('3626-QD-DHQGHN'), '3626-QD-DHQGHN_Regulation on Undergraduate Training');
  });

  it('handles string-type registry entry (legacy format)', function () {
    DOC_REGISTRY['legacy-doc'] = 'legacy-doc_Some Title';
    assertEqual(getDocPrefix('legacy-doc'), 'legacy-doc_Some Title');
    delete DOC_REGISTRY['legacy-doc'];
  });
});
