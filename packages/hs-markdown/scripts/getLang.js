// disable strict mode
// 'use strict';

const fs = require('fs');
const path = require('path');
const f = require.resolve('prismjs/components.js');
const s = fs.readFileSync(f, 'utf8');
const outFile = path.resolve(__dirname, '../lang.json');
function main() {
  eval(s);
  const o = JSON.stringify(components.languages, null, 2);
  fs.writeFileSync(outFile, o, 'utf8');
}

main();
