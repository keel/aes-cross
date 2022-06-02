# A real cross platforms AES encryption-decryption solution. Support Java,C,nodeJs,Android,IOS...
[![Build Status](https://travis-ci.org/keel/aes-cross.svg?branch=master)](https://travis-ci.org/keel/aes-cross)

[中文说明](https://github.com/keel/aes-cross/tree/master/info-cn)

# How to use AES cross platforms
Make these paras to be same in all platforms.

* **cipher mode**: ECB,CBC,CFB,OFB,CTR,XTS...
* **key size**: 128, 256
* **iv**: init vector
* **padding**: NoPadding,ZeroPadding,PKCS5Padding,PKCS7Padding,ISO10126Padding,ANSI X.923...
* **key**: the key for encription and decryption

[more information](https://github.com/keel/aes-cross/blob/master/AES.md)

## nodejs api
```javascript
const aes = require('aes-cross');
/**
 * AES encription
 * @param  {string/bytes} [target]
 * @param  {string/bytes} [key]         the length must be 16 or 32
 * @param  {string/bytes} [iv]       default is zero16IV
 * @param  {string} [inputEncoding]  ["utf8" -default,"ascii","base64","binary"...](https://nodejs.org/api/buffer.html#buffer_buffer)
 * @param  {string} [outputEncoding] ["base64" -default,"hex"...]
 * @param  {string} [algorithm] ["aes-128-cbc" -default]
 * @return {string}                 encription result
 */
 aes.enc(target, key, iv = zero16IV, inputEncoding = 'utf-8', outputEncoding = 'base64', algorithm = 'aes-128-cbc', autoPadding = true);

 /**
  * AES decription
  * @param  {string/bytes} [target]
  * @param  {string/bytes} [key]         the length must be 16 or 32
  * @param  {string/bytes} [iv]       default is zero16IV
  * @param  {string} [input_encoding]  ["utf8" - default,"ascii","base64","binary"...](https://nodejs.org/api/buffer.html#buffer_buffer)
  * @param  {string} [output_encoding] ["base64"- default ,"hex"...]
  * @param  {string} [algorithm] ["aes-128-cbc" -default]
  * @return {string}                 decription result
  */
  aes.dec(target, key, iv = zero16IV, inputEncoding = 'base64', outputEncoding = 'utf-8', algorithm = 'aes-128-cbc', autoPadding = true);

```

## nodejs USEAGE

```javascript
const aes = require('aes-cross');

const key = 'b9da49a54f15324d';
const src = 'abcde';

const key128iv = Buffer.from([12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44, 22, 2]);
const key256iv = Buffer.concat([key128iv, key128iv]);


// aes-128-cbc
let enced = aes.enc(src, key, key128iv);
console.log('enced:', enced);
let deced = aes.dec(enced, key, key128iv);
console.log('deced:', deced);


// aes-128-ecb, ECB must use emptyIV
let algorithm = 'aes-128-ecb';

enced = aes.enc(src, key, aes.emptyIV, 'utf-8', 'base64', algorithm);
console.log('enced:', enced);
deced = aes.dec(enced, key, aes.emptyIV, 'base64', 'utf-8', algorithm);
console.log('deced:', deced);


// aes-256-cbc
algorithm = 'aes-256-cbc';
const orgText = 'asdfW  #)(ssff234';

enced = aes.enc(orgText, key256iv, aes.zero16IV, 'utf-8', 'base64', algorithm);
console.log('enced:', enced);
deced = aes.dec(enced, key256iv, aes.zero16IV, 'base64', 'utf-8', algorithm);
console.log('deced:', deced);

```
