'use strict';

const markdown = require('.');
const input0 = '# hello\n\none\n\ntwo\n\n## three\n```js\nconsole.log("four");\n```';

const ret0 = markdown.render(input0);

console.log(ret0);
