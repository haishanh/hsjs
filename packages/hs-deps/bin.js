#!/usr/bin/env node
'use strict';

const fs = require('fs');
const sade = require('sade');
const pkg = require('./package.json');

const prog = sade('deps', true);

let ignorePats = [];

prog
  .version(pkg.version)
  .option('-f, --file', 'filepath of package.json', 'package.json')
  .option('-i, --ignore', 'pattern of package name to ignore, e.g. "webpack*"')
  .action(handler)
  .parse(process.argv);

function handler(opts) {
  if (opts.ignore) {
    // just like bash shell expansion
    ignorePats = opts.ignore
      .split(',')
      .map((a) => a.trim().replace('*', '[\\SS]*'))
      .map((a) => new RegExp('^' + a));
  }
  const content = fs.readFileSync(opts.file);
  const json = JSON.parse(content);
  printIt('yarn add', 'dependencies', json);
  printIt('yarn add -D', 'devDependencies', json);
}

function shouldKeyIgnore(key) {
  if (ignorePats.length === 0) return false;

  for (let i = 0; i < ignorePats.length; i++) {
    if (ignorePats[i].test(key)) return true;
  }
  return false;
}

function printIt(prefix, name, json) {
  const o = json[name];
  if (!o) return;

  const keys = Object.keys(o).sort();
  const total = keys.length;

  let s = prefix;
  let ignored = 0;
  for (let k of keys) {
    if (shouldKeyIgnore(k)) {
      ignored++;
      continue;
    }
    s += ` ${k}@${o[k]}`;
  }
  console.log('\n# ' + name + ': total(%s) ignored(%s)\n', total, ignored);

  if (s === prefix) s = '# NONE';
  console.log(s);
}
