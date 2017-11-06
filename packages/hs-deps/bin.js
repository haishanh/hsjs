#!/usr/bin/env node
'use strict';

const fs = require('fs');
const prog = require('commander');
const pkg = require('./package.json');

prog
  .version(pkg.version)
  .option('-f, --file <filename>', 'package.json filepath')
  .option(
    '-i, --ignore <pattern>',
    'pattern of package name to ignore, e.g. "webpack*"'
  )
  .parse(process.argv);

const { file = 'package.json' } = prog;

let ignorePats = [];
if (prog.ignore) {
  // just like bash shell expansion
  ignorePats = prog.ignore
    .split(',')
    .map(a => a.trim().replace('*', '[\\SS]*'))
    .map(a => new RegExp('^' + a));
}

const content = fs.readFileSync(file);
const json = JSON.parse(content);

// const d = json.dependencies;
const dd = json.devDependencies;

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

printIt('yarn add', 'dependencies', json)
printIt('yarn add -D', 'devDependencies', json)
