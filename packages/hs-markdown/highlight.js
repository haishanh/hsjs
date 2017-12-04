'use strict';

const Prism = require('prismjs');
const visit = require('unist-util-visit');
const langMap = require('./lang.json');

function loadLang(lang) {
  const l = langMap(lang);
  if (l.require) {
    if (Array.isArray(l.require)) {
      l.require.map(loadLang);
    } else {
      loadLang(l.require);
    }
  }
  const m = `prismjs/components/prism-${lang}`;
  return require(m);
}

function highlightCode(code, lang) {

  if (!Prism.languages[lang]) {
    try {
      loadLang(lang);
    } catch (err) {
      return code;
    }
  }

  const language = Prism.languages[lang];
  return Prism.highlight(code, language);
}

function highlight(markdownAST, classPrefix = 'language-') {
  visit(markdownAST, 'code', node => {
    const { lang, value } = node;
    const className = `${classPrefix}${lang}`;
    const highlighted = highlightCode(value, lang);

    node.type = 'html';
    node.value = `<div class="highlight">
      <pre class="${className}"><code>${highlighted}</code></pre>
      </div>`;
  });

  return markdownAST;
}

module.exports = highlight;
