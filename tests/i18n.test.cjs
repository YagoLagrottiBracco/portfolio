/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner and isolated CommonJS loader for TypeScript fixtures. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadTS(file) {
  const filename = path.resolve(file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  const localRequire = (id) => id.startsWith('@/') ? loadTS('src/' + id.slice(2) + '.ts') : id.startsWith('.') ? loadTS(path.resolve(path.dirname(filename), id) + '.ts') : require(id);
  new Function('require', 'module', 'exports', source)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
function leaves(value, prefix = '') {
  return Object.entries(value).flatMap(([key, val]) => typeof val === 'string' ? [prefix + key] : leaves(val, prefix + key + '.')).sort();
}
test('Spanish dictionary covers every Portuguese and English UI key', () => {
  const es = JSON.parse(fs.readFileSync('src/messages/es.json', 'utf8'));
  for (const locale of ['pt', 'en']) {
    assert.deepEqual(leaves(es), leaves(JSON.parse(fs.readFileSync('src/messages/' + locale + '.json', 'utf8'))));
  }
});
test('all localized portfolio content has a nonempty Spanish translation', () => {
  const { personalData, projectCategories } = loadTS('src/data/personal.ts');
  let count = 0;
  function walk(value, name) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.pt === 'string' && typeof value.en === 'string') {
      assert.equal(typeof value.es, 'string', name);
      assert.ok(value.es.trim(), name);
      count++;
    }
    for (const [key, child] of Object.entries(value)) walk(child, name + '.' + key);
  }
  walk({ personalData, projectCategories }, 'portfolio');
  assert.ok(count >= 228);
});
test('each article is available in Spanish and can be switched from any translated slug', () => {
  const { getAllPosts, getPostBySlug } = loadTS('src/lib/blog.ts');
  assert.ok(getAllPosts('es').length > 0);
  assert.equal(getAllPosts('es').length, getAllPosts('pt').length);
  for (const post of getAllPosts()) {
    for (const locale of ['pt', 'en', 'es']) {
      const translated = getPostBySlug(post.slug, locale);
      assert.ok(translated, post.slug + ' -> ' + locale);
      assert.equal(translated.locale, locale);
      assert.ok(translated.content.length > 100);
    }
  }
  assert.equal(getPostBySlug('missing-post', 'es'), null);
});
test('locale selection respects saved preferences and recognizes regional Spanish', () => {
  const { resolveLocale, isLocale, localeTags } = loadTS('src/lib/i18n.ts');
  assert.equal(resolveLocale('es', undefined, 'pt-BR'), 'es');
  assert.equal(resolveLocale(null, undefined, 'es-MX'), 'es');
  assert.equal(resolveLocale(null, undefined, 'es-ES'), 'es');
  assert.equal(resolveLocale('invalid', undefined, 'en-US'), 'en');
  assert.equal(resolveLocale(null, 'es', 'pt-BR'), 'es');
  assert.equal(resolveLocale(null, undefined, 'fr-FR'), 'pt');
  assert.equal(isLocale('es'), true);
  assert.equal(isLocale('fr'), false);
  assert.equal(localeTags.es, 'es');
});

test('all UI translation references resolve in every language', () => {
  const dictionaries = ['pt', 'en', 'es'].map(locale => JSON.parse(fs.readFileSync('src/messages/' + locale + '.json', 'utf8')));
  function scan(directory) {
    for (const file of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, file.name);
      if (file.isDirectory()) { scan(filename); continue; }
      if (!filename.endsWith('.tsx')) continue;
      const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function walk(node) {
        if (ts.isCallExpression(node) && node.expression.getText(source) === 't' && ts.isStringLiteral(node.arguments[0])) {
          const key = node.arguments[0].text;
          for (const dictionary of dictionaries) {
            assert.equal(typeof key.split('.').reduce((value, segment) => value?.[segment], dictionary), 'string', filename + ': ' + key);
          }
        }
        if (ts.isObjectLiteralExpression(node)) {
          const keys = node.properties.map(property => property.name?.getText(source));
          if (keys.includes('pt') && keys.includes('en')) assert.ok(keys.includes('es'), filename + ': incomplete locale object');
        }
        ts.forEachChild(node, walk);
      }
      walk(source);
    }
  }
  scan('src');
});
test('courses, metric descriptions and skill labels are translated without changing technology names', () => {
  const { personalData } = loadTS('src/data/personal.ts');
  const { localizeLabel } = loadTS('src/data/content-labels.ts');
  for (const group of personalData.specializations) {
    for (const course of group.courses) assert.notEqual(localizeLabel(course, 'es'), course);
  }
  for (const label of ['Independente', 'Freelancer', '~3M events/day', 'Multi-tenant SaaS', 'Team leadership', '500+ customers', 'Multi-channel alerts', '100+ customers', 'Sole engineer', 'Full product ownership', 'Event-Driven Architecture', 'Microservices', 'Clean Architecture', 'Automação']) {
    assert.notEqual(localizeLabel(label, 'es'), label);
  }
  for (const tech of ['Python', 'Django', 'FastAPI', 'Next.js', 'Kafka + ClickHouse']) {
    assert.equal(localizeLabel(tech, 'es'), tech);
  }
});
