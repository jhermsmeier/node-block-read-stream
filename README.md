# BlockReadStream
[![npm](https://img.shields.io/npm/v/block-read-stream.svg?style=flat-square)](https://npmjs.com/package/block-read-stream)
[![npm license](https://img.shields.io/npm/l/block-read-stream.svg?style=flat-square)](https://npmjs.com/package/block-read-stream)
[![npm downloads](https://img.shields.io/npm/dm/block-read-stream.svg?style=flat-square)](https://npmjs.com/package/block-read-stream)

Read a file in blocks of a specified size

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save block-read-stream
```

## Usage

```js
var BlockReadStream = require( 'block-read-stream' )
```

```js
var readStream = new BlockReadStream({
  path: 'somefile.img',
  flags: 'r',
  blockSize: 256 * 1024, // 256KB
})
```
