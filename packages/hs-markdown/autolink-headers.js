'use strict';

const nodeToString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const slugs = require('github-slugger')();

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value;
  }
  return context[key];
}

// come from
// https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-autolink-headers
function autolinkHeaders(markdownAST) {
  slugs.reset();

  visit(markdownAST, 'heading', node => {
    const id = slugs.slug(nodeToString(node));
    const data = patch(node, 'data', {});

    patch(data, 'id', id);
    patch(data, 'htmlAttributes', {});
    patch(data, 'hProperties', {});
    patch(data.htmlAttributes, 'id', id);
    patch(data.hProperties, 'id', id);

    node.children.unshift({
      type: 'link',
      url: `#${id}`,
      title: null,
      data: {
        hProperties: {
          'aria-hidden': true,
          class: 'anchor'
        },
        hChildren: [
          {
            type: 'raw',
            value: '#'
          }
        ]
      }
    });
  });

  return markdownAST;
}

module.exports = autolinkHeaders;
