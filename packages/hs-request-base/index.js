'use strict';

const fetch = require('node-fetch');
const withRetry = require('hs-with-retry');
const { Request, Headers } = fetch;

const HEADERS_DEFAULT = { 'Content-Type': 'application/json' };
const RETRY_OPTIONS = { attemptsTotal: 5, firstRetryDelay: 10 };

class RequestBase {
  constructor(baseUrl, { timeout = 20000 } = {}) {
    this.baseUrl = baseUrl;
    this.init = { timeout };
  }

  async request(o) {
    const fn0 = () => this._request(o);
    return await withRetry(RETRY_OPTIONS)(fn0);
  }

  async _request({ url = '', method = 'GET', headers = {}, payload } = {}) {
    let tmp;
    let headersTmp;
    let initTmp = {};
    const { baseUrl, init } = this;

    tmp = Object.assign({}, HEADERS_DEFAULT, headers);
    headersTmp = new Headers(tmp);

    initTmp = {
      method: method.toUpperCase(),
      headers: headersTmp
    };

    const options = Object.assign({}, init, initTmp);

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const fullUrl = `${baseUrl}${url}`;
    const req = new Request(fullUrl, options);
    const res = await fetch(req);
    if (res.ok !== true) {
      const err = new Error(res.statusText);
      err.status = res.status;
      throw err;
    }
    return res;
  }
}

module.exports = RequestBase;
