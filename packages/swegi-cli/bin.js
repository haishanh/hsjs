#!/usr/bin/env node
'use strict';
// no scope taobao
// "http://registry.npm.taobao.org/nanoid/download/nanoid-1.0.1.tgz#58a8e0577d9db07ae4f231a3afa59af94e4fc439"
// scoped moudle taobao
// "http://registry.npm.taobao.org/@types/node/download/@types/node-8.0.53.tgz#396b35af826fa66aad472c8cb7b8d5e277f4e6d8"
// no scope yarn
// "https://registry.yarnpkg.com/nanoid/-/nanoid-1.0.1.tgz#58a8e0577d9db07ae4f231a3afa59af94e4fc439"
// scoped moudle yarn
// "https://registry.yarnpkg.com/@types/node/-/node-7.0.39.tgz#8aced4196387038113f6f9aa4014ab4c51edab3c"

const fs = require('fs');
const path = require('path');
const prog = require('commander');
const pkg = require('./package.json');

// $1 scope name
// $2 moudle name
const patYarn = /"https:\/\/registry\.yarnpkg\.com\/((@[\S]*?)\/)?([\S]*?)\/-\//g;

const patTaobao = /"http:\/\/registry\.npm\.taobao\.org\/((@[\S]*?)\/)?([\S]*?)\/download\/((@[\S]*?)\/)?/g;

let counter = 0;

function yarnToTaobaoReplacer(match, _scopeName, scopeName, moduleName) {
  counter++;
  if (scopeName) {
    // with scope
    return (
      '"http://registry.npm.taobao.org/' +
      _scopeName +
      moduleName +
      '/download/' +
      _scopeName
    );
  } else {
    // wo scope
    return '"http://registry.npm.taobao.org/' + moduleName + '/download/';
  }
}

function taobaoToYarnReplacer(match, _scopeName, scopeName, moduleName) {
  counter++;
  if (scopeName) {
    // with scope
    return '"https://registry.yarnpkg.com/' + _scopeName + moduleName + '/-/';
  } else {
    // wo scope
    return '"https://registry.yarnpkg.com/' + moduleName + '/-/';
  }
}

function yarnToTaobao(str) {
  return str.replace(patYarn, yarnToTaobaoReplacer);
}

function taobaoToYarn(str) {
  return str.replace(patTaobao, taobaoToYarnReplacer);
}

function getInput(val) {
  if (val) return path.resolve(val);
}

prog
  .version(pkg.version)
  .option(
    '-i, --input <file>',
    'input filename default to ./yarn.lock',
    getInput
  )
  .option('-t, --taobao', 'switch to taobao')
  .option('-y, --yarn', 'switch to yarn')
  .parse(process.argv);

function main() {
  const input = prog.input ? prog.input : path.resolve('./yarn.lock');
  fs.readFile(input, 'utf8', (err, content) => {
    if (err) throw err;

    let x;
    if (prog.taobao) {
      x = yarnToTaobao(content);
    } else if (prog.yarn) {
      x = taobaoToYarn(content);
    }

    fs.writeFile('./yarn.lock.new', x, 'utf8', err => {
      if (err) throw err;
      console.log('done %s', counter);
    });
  });
}

main();
