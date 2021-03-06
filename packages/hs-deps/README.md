# deps

## Usage

```bash
yarn global add hs-deps
```

```text

  Usage: deps [options]


  Options:

    -V, --version           output the version number
    -f, --file <filename>   package.json filepath
    -i, --ignore <pattern>  pattern of package name to ignore, e.g. "webpack*"
    -h, --help              output usage information
```

## Example

given `package.json` as:

```json
{
  "scripts": {
    "test": "ava"
  },
  "dependencies": {
    "axios": "^0.17.0",
    "js-yaml": "^3.10.0",
    "lodash.get": "^4.4.2",
    "lodash.merge": "^4.6.0",
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "react-redux": "^5.0.5",
    "react-router-dom": "^4.1.1",
    "react-router-redux": "next",
    "react-transition-group": "^2.0.2",
    "redux": "^3.7.1",
    "redux-logger": "^3.0.6",
    "redux-thunk": "^2.2.0",
    "styled-components": "^2.1.1"
  },
  "devDependencies": {
    "babel-core": "^6.24.1",
    "babel-loader": "^7.1.1",
    "babel-plugin-react-intl": "^2.3.1",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-es2015-classes": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.23.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-1": "^6.24.1",
    "babili-webpack-plugin": "^0.1.2",
    "css-loader": "^0.28.0",
    "devtron": "^1.4.0",
    "electron": "^1.6.11",
    "electron-builder": "^19.15.5",
    "electron-packager": "^8.6.0",
    "electron-rebuild": "^1.5.7",
    "eslint": "^3.19.0",
    "file-loader": "^0.11.1",
    "intl-messageformat-parser": "^1.3.0",
    "node-loader": "^0.6.0",
    "node-pre-gyp": "^0.6.34",
    "node-sass": "^4.5.3",
    "prettier": "^1.2.2",
    "react-hot-loader": "next",
    "sass-loader": "^6.0.2",
    "style-loader": "^0.18.2",
    "svg-sprite-loader": "^3.0.5",
    "webpack": "^3.2.0",
    "webpack-dev-server": "^2.5.1"
  },
  "version": "0.0.5",
  "license": "MIT"
}
```


```bash
$ deps -i "babel-plugin*,babel-preset*"
```

will yield:

```bash
# dependencies: total(14) ignored(0)

yarn add axios@^0.17.0 js-yaml@^3.10.0 lodash.get@^4.4.2 lodash.merge@^4.6.0 react@^16.0.0 react-dom@^16.0.0 react-redux@^5.0.5 react-router-dom@^4.1.1 react-router-redux@next react-transition-group@^2.0.2 redux@^3.7.1 redux-logger@^3.0.6 redux-thunk@^2.2.0 styled-components@^2.1.1

# devDependencies: total(30) ignored(8)

yarn add -D babel-core@^6.24.1 babel-loader@^7.1.1 babili-webpack-plugin@^0.1.2 css-loader@^0.28.0 devtron@^1.4.0 electron@^1.6.11 electron-builder@^19.15.5 electron-packager@^8.6.0 electron-rebuild@^1.5.7 eslint@^3.19.0 file-loader@^0.11.1 intl-messageformat-parser@^1.3.0 node-loader@^0.6.0 node-pre-gyp@^0.6.34 node-sass@^4.5.3 prettier@^1.2.2 react-hot-loader@next sass-loader@^6.0.2 style-loader@^0.18.2 svg-sprite-loader@^3.0.5 webpack@^3.2.0 webpack-dev-server@^2.5.1
```
