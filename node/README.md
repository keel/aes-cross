# AES/CBC/PKCS5Padding - nodeJs

## Installation
```javascript
npm install aes-cross --save
```

## Usage
* default keySize : 128;
* default iv : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
* default text inputEncoding : 'utf-8';
* default text outputEncoding : 'base64';

```javascript
var aes = require('aes-cross');
var testTxt = 'asdfW  #)(ssff234';
var key = new Buffer([1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6]);
/**
 * encText/decText : text encription
 * @param  {string} text
 * @param  {Buffer} key         the length must be 16 or 32
 * @param  {Buffer} [newIv]       optional,default is [0,0...0]
 * @param  {string} [input_encoding]  optional,"utf8" -default,"ascii","base64","binary"...(https://nodejs.org/api/buffer.html#buffer_buffer)
 * @param  {string} [output_encoding] optional,"base64" -default,"hex"...
 * @return {string}                 encription result
 */
var enc = aes.encText(testTxt,key);
console.log('enc:%s',enc);
var dec = aes.decText(enc,key);
console.log('dec:%s',dec);

// for buffer
var testBuff = new Buffer([23,42,55,11,33,45,55]);
/**
 * encBytes/decBytes: buffer/bytes encription
 * @param  {Buffer} buff
 * @param  {Buffer} key  the length must be 16 or 32
 * @param  {Buffer} [newIv]   optional,default is [0,0...0]
 * @return {Buffer}
 */
var encBuff = aes.encBytes(testBuff,key);
console.dir(encBuff);
var decBuff = aes.decBytes(encBuff,key);
console.dir(decBuff);
```

## Custom keysize,iv,encoding
```javascript
var iv = new Buffer([1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6]);
var key = new Buffer([1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6]);
var enc = aes.encText(testTxt,key,iv);
console.log('enc:%s',enc);

//change key size ,default is 128
aes.setKeySize(256);

//change input encoding
enc = aes.encText(testTxt,key,iv,'ascii');
dec = aes.decText(encTxt,key,iv,'ascii');

//change output encoding
enc = aes.encText(testTxt,key,null,'utf-8','hex');
dec = aes.decText(enc,key,null,'utf-8','hex');
```
