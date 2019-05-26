#!/usr/bin/env node
'use strict';

const fs = require('fs');
const prog = require('commander');
const escapeStringRegexp = require('escape-string-regexp');
const pkg = require('./package.json');

function collect(value, previous) {
  return previous.concat([value]);
}

prog
  .version(pkg.version)
  .option('-f, --file <filename>', 'package.json filepath')
  .option(
    '-i, --include <regexp>',
    'regexp of package name to include (if multiple include options are provided, one match will get the corresponding name to be included)',
    collect,
    []
  )
  .option(
    '-e, --exclude <regexp>',
    'regexp of package name to exclude (if multiple exclude options are provided, one match will get the corresponding name to be excluded)',
    collect,
    []
  )
  .option('--no-pkg-version', 'do not include package version in result')
  .parse(process.argv);

const { file = 'package.json', include, exclude, pkgVersion } = prog;

const includeRegExps = [];
for (let i = 0; i < include.length; i++) {
  includeRegExps.push(new RegExp(escapeStringRegexp(include[i])));
}
const excludeRegExps = [];
for (let i = 0; i < exclude.length; i++) {
  excludeRegExps.push(new RegExp(escapeStringRegexp(exclude[i])));
}

const content = fs.readFileSync(file);
const json = JSON.parse(content);

function printIt(prefix, name, json) {
  const o = json[name];
  if (!o) return;

  const keys = Object.keys(o).sort();
  const total = keys.length;

  let s = prefix;

  let includedKeys = [];
  // has include
  if (include.length > 0) {
    for (let k of keys) {
      for (let r of includeRegExps) {
        if (r.test(k)) {
          includedKeys.push(k);
          continue;
        }
      }
    }
  } else {
    includedKeys = keys;
  }

  const includedKeys2 = [];
  for (let k of includedKeys) {
    let match = false;
    for (let r of excludeRegExps) {
      if (r.test(k)) {
        match = true;
        continue;
      }
    }
    if (!match) {
      includedKeys2.push(k);
    }
  }

  if (pkgVersion) {
    for (let k of includedKeys2) {
      s += ` ${k}@${o[k]}`;
    }
  } else {
    for (let k of includedKeys2) {
      s += ` ${k}`;
    }
  }

  console.log(
    '\n# ' + name + ': total(%s) included(%s) excluded(%s)\n',
    total,
    includedKeys2.length,
    total - includedKeys2.length
  );

  if (s === prefix) s = '# NONE';
  console.log(s);
}

printIt('yarn add', 'dependencies', json);
printIt('yarn add -D', 'devDependencies', json);
