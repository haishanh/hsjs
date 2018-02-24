'use strict';

const RequestBase = require('..');

class HttpBin extends RequestBase {
  constructor(baseUrl, options) {
    super(baseUrl, options);
  }

  async uuid() {
    const res = await this.request({ url: '/uuid' });
    return await res.json();
  }

  async teapot() {
    const res = await this.request({ url: '/status/418' });
    return await res.json();
  }
}

async function main() {
  const httpBin = new HttpBin('http://httpbin.org');
  let ret;

  try {
    ret = await httpBin.uuid();
    console.log({ ret });

    ret = await httpBin.teapot();
    console.log({ ret });
  } catch (err) {
    console.log(' == error == ');
    console.error(err);
  }
}

main();
