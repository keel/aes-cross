/**
 * "AES/cbc/pkcs5Padding" encription and decription.
 * setAutoPadding(true) is actually pkcs5Padding,.
 */
'use strict';

var crypto = require('crypto');

var IV = new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var keySize = 128;
var algorithm = 'aes-' + keySize + '-cbc';
var outputEncoding = 'base64';
var inputEncoding = 'utf8';

var setKeySize = function(size) {
    if (size !== 128 && size !== 256) {
        throw ('AES.setKeySize error: ' + size);
    }
    keySize = size;
    algorithm = 'aes-' + keySize + '-cbc';
    // console.log('setkeySize:%j',keySize);
};


// var pkcs5PaddingBytes = new Buffer([
//   0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
//   0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
// ]);
// /**
//  * pkcs5Padding for encription = autoPadding
//  * @param  {bytes} buff plaintext bytes
//  * @return {bytes} after padding bytes
//  */
// var pkcs5Padding = function(buff) {
//   var len = buff.length;
//   var padLen = (keySize / 8);
//   var padding = len % padLen;
//   if (padding !== 0) {
//     padLen = padLen - padding;
//   }
//   var appendBuf = new Buffer(padLen);
//   appendBuf.fill(pkcs5PaddingBytes[padLen - 1]);
//   var outBuff = Buffer.concat([buff, appendBuf]);
//   // console.log('after padding:%s,len:%d',printBuf(outBuff),outBuff.length);
//   return outBuff;
// };

// /**
//  * pkcs5PaddingClear after decription
//  * @param  {Buffer} buff decription result
//  * @return {Buffer}      original plaintext
//  */
// var pkcs5PaddingClear = function(buff) {
//   var len = buff.length;
//   var e = buff[len - 1];
//   // console.log('clear padding:%s,len:%d,e:%d',printBuf(buff),len,e);
//   return buff.slice(0, len - e);
// };

/**
 * the key must match the keySize/8 , like:16 ,32
 * @param  {Buffer} key
 * @return {}
 */
var checkKey = function(key) {
    if (!key) {
        throw 'AES.checkKey error: key is null ';
    }
    if (key.length !== (keySize / 8)) {
        throw 'AES.checkKey error: key length is not ' + (keySize / 8) + ': ' + key.length;
    }
};

/**
 * buffer/bytes encription
 * @param  {Buffer} buff
 * @param  {Buffer} key  the length must be 16 or 32
 * @param  {Buffer} [newIv]   default is [0,0...0]
 * @return {encripted Buffer}
 */
var encBytes = function(buff, key, newIv) {
    checkKey(key);
    var iv = newIv || IV;
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    // cipher.setAutoPadding(false);
    // var re = Buffer.concat([cipher.update(pkcs5Padding(buff)), cipher.final()]);
    cipher.setAutoPadding(true);
    var re = Buffer.concat([cipher.update(buff), cipher.final()]);
    // console.log('enc re:%s,len:%d', printBuf(re), re.length);
    return re;

};

/**
 * text encription
 * @param  {string} text
 * @param  {Buffer} key         the length must be 16 or 32
 * @param  {Buffer} [newIv]       default is [0,0...0]
 * @param  {string} [input_encoding]  ["utf8" -default,"ascii","base64","binary"...](https://nodejs.org/api/buffer.html#buffer_buffer)
 * @param  {string} [output_encoding] ["base64" -default,"hex"]
 * @return {string}                 encription result
 */
var encText = function(text, key, newIv, input_encoding, output_encoding) {
    checkKey(key);
    var iv = newIv || IV;
    var inEncoding = input_encoding || inputEncoding;
    var outEncoding = output_encoding || outputEncoding;
    var buff = new Buffer(text, inEncoding);
    var out = encBytes(buff, key, iv);
    var re = new Buffer(out).toString(outEncoding);
    return re;
};


/**
 * buffer/bytes decription
 * @param  {Buffer} buff
 * @param  {Buffer} key  the length must be 16 or 32
 * @param  {Buffer} [newIv] default is [0,0...0]
 * @return {encripted Buffer}
 */
var decBytes = function(buff, key, newIv) {
    checkKey(key);
    var iv = newIv || IV;
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    // decipher.setAutoPadding(false);
    decipher.setAutoPadding(true);
    var out = Buffer.concat([decipher.update(buff), decipher.final()]);
    // return pkcs5PaddingClear(out);
    return out;
};
/**
 * text decription
 * @param  {string} text
 * @param  {Buffer} key         the length must be 16 or 32
 * @param  {Buffer} [newIv]       default is [0,0...0]
 * @param  {string} [input_encoding]  ["utf8" - default,"ascii","base64","binary"...](https://nodejs.org/api/buffer.html#buffer_buffer)
 * @param  {string} [output_encoding] ["base64"- default ,"hex"]
 * @return {string}                 decription result
 */
var decText = function(text, key, newIv, input_encoding, output_encoding) {
    checkKey(key);
    var iv = newIv || IV;
    var inEncoding = input_encoding || inputEncoding;
    var outEncoding = output_encoding || outputEncoding;
    var buff = new Buffer(text, outEncoding);
    var re = new Buffer(decBytes(buff, key, iv)).toString(inEncoding);
    return re;
};


exports.setKeySize = setKeySize;
exports.encText = encText;
exports.encBytes = encBytes;
exports.decText = decText;
exports.decBytes = decBytes;
