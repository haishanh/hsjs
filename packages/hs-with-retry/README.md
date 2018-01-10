
## Install

```bash
yarn add hs-with-retry
```

## Usage

```js
const withRetry = require('hs-with-retry');

const someThingAsync  = () => { /* some async operations */ };

async function main() {
  try {
    const ret = await withRetry({ attemptsTotal: 10, firstRetryDelay: 1000 })(someThingAsync);
    // `ret` will be the fullfilled result of someThingAsync
  } catch (err) {
    // `err` will be the error throwed in someThingAsync if it throws
  }
}

main();
```
