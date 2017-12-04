'use strict';

const unified = require('unified');
const markdown = require('remark-parse');
const remarkToc = require('remark-toc');
const parseToc = require('mdast-util-toc');
const toHAST = require('mdast-util-to-hast');
const hastToHTML = require('hast-util-to-html');

const autolinkHeaders = require('./autolink-headers');
const highlight = require('./highlight');

const markdownOpts = {
  commonmark: true,
  footnotes: true,
  pedantic: true
};

const parser = unified().use(markdown, markdownOpts);

/**
 * @param {string} str
 */
function render(str) {
  const astMarkdown = parser.parse(str);
  const parsedToc = parseToc(astMarkdown);
  const hastToc = toHAST(parsedToc.map);

  autolinkHeaders(astMarkdown);
  highlight(astMarkdown);
  const hastBody = toHAST(astMarkdown);

  const toc = hastToHTML(hastToc);
  const body = hastToHTML(hastBody);
  return { toc, body };
}

module.exports.render = render;
