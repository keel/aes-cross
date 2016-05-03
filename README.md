# A real cross platform AES encryption-decryption solution. Support Java,C,nodeJs,Android,IOS...
[![Build Status](https://travis-ci.org/keel/aes-cross.svg?branch=master)](https://travis-ci.org/keel/aes-cross)

[中文说明](https://github.com/keel/aes-cross/tree/master/info-cn)

## Why AES?
* Simple: aymmetric encryption
* Secure: better than 3DES and others
* Fast: faster than others on same security level
* Binary support: not only texts

## How to cross platform?
The AES algorithm is same on all platform, but there are some factors make it difficult to do so:
* **cipher mode**: ECB,CBC,CFB,OFB,CTR,XTS...
* **key size**: 128, 256
* **iv**: init vector
* **padding**: NoPadding,ZeroPadding,PKCS5Padding,ISO10126Padding,ANSI X.923...
* **key**: the key for encription and decryption

Only all these 5 things are exactly the same can the AES encription and decryption be used anywhere.
Most language supports ECB,CBC,CFB cipher mode (CBC is used widely), and all key sizes(128 is used widely).
But the padding mode is different in different platforms, and it's also effected by cipher mode.

## Figure out the Padding
Some cipher mode only support bytes multiple of 16, so there are paddings to fix it.
[WIKI for more](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_codebook_.28ECB.29)

encription/cipher/padding|multiple of 16 encryption result size|not multiple of 16 encryption result size
-------------------------|---------------|-------------------
AES/CBC/NoPadding        |     16        |   not support
AES/CBC/PKCS5Padding     |     32        |   16
AES/CBC/ISO10126Padding  |     32        |   16
AES/CFB/NoPadding        |     16        |   original size
AES/CFB/PKCS5Padding     |     32        |   16
AES/CFB/ISO10126Padding  |     32        |   16
AES/ECB/NoPadding        |     16        |   not support
AES/ECB/PKCS5Padding     |     32        |   16
AES/ECB/ISO10126Padding  |     32        |   16
AES/OFB/NoPadding        |     16        |   original size
AES/OFB/PKCS5Padding     |     32        |   16
AES/OFB/ISO10126Padding  |     32        |   16
AES/PCBC/NoPadding       |     16        |   not support
AES/PCBC/PKCS5Padding    |     32        |   16
AES/PCBC/ISO10126Padding |     32        |   16

## The Solution
1. AES/CFB/NoPadding or AES/OFB/NoPadding or AES/CTR/NoPadding

  It works,but the security is a question and not good for concurrent computation, so passed.
2. **AES/CBC/PKCS5Padding**

  Good choice! **SSL,IPSec** use it too! And **PKCS5Padding** is well supported for most big platforms, such as:
  * JAVA/Android (PKCS5Padding)
  * ObjectC/IOS (PKCS7Padding)
  * C# (PKCS7Padding)
  * nodeJs (AutoPadding)
  * Python (pycrypto)
  * PHP (mcrypt)

  You don't need any extra code on these platforms, just make sure using **AES/CBC/PKCS5Padding** ,and **same iv, same key**, the encription and decription will cross platforms.
  There're some platform don't support **PKCS5Padding** , that's the project to resolve it.

> PKCS7Padding = PKCS5Padding on AES,don't worry about it.

> [What is PKCS5Padding?](https://en.wikipedia.org/wiki/Padding_%28cryptography%29#PKCS7)

Some cross platform solution choose ZeroPadding on CBC mode.The decryption result may have some unnecessary bytes, because the decryption result bytes must be multiple of 16, and it's hard to be cut because the original plaintext size is unknown.

# The key point!
If you find a way to **AES/CBC/PKCS5Padding** on a platform, you have already got the cross-platform AES solution on it.


# NodeJs

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
key = Buffer.concat([key,key]);
aes.setKeySize(256);

//change input encoding
enc = aes.encText(testTxt,key,iv,'ascii');
dec = aes.decText(encTxt,key,iv,'ascii');

//change output encoding
enc = aes.encText(testTxt,key,null,'utf-8','hex');
dec = aes.decText(enc,key,null,'utf-8','hex');
```
