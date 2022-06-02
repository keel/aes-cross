/**
 * AES by nodejs
 * @author Keel
 */
'use strict';

const crypto = require('crypto');


const emptyIV = Buffer.alloc(0); //empty IV,only for ECB
const zero16IV = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //default 16 zero IV

const autoIV = function(iv, algorithm) {
    if (algorithm.indexOf('ecb') > 0) {
        return emptyIV;
    }
    return iv || zero16IV;
};

const strToBytes = function(key, strEncode = 'utf-8') {
    if (typeof key === 'object' && Buffer.isBuffer(key)) {
        return key;
    }
    return Buffer.from(key, strEncode);
};

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
const enc = function(target, key, iv = zero16IV, inputEncoding = 'utf-8', outputEncoding = 'base64', algorithm = 'aes-128-cbc', autoPadding = true) {
    const cipher = crypto.createCipheriv(algorithm, strToBytes(key), autoIV(strToBytes(iv), algorithm));
    cipher.setAutoPadding(autoPadding);
    const inBuff = strToBytes(target, inputEncoding);
    const outBuff = Buffer.concat([cipher.update(inBuff), cipher.final()]);
    return outBuff.toString(outputEncoding);
};

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
const dec = function(target, key, iv = zero16IV, inputEncoding = 'base64', outputEncoding = 'utf-8', algorithm = 'aes-128-cbc', autoPadding = true) {
    const cipher = crypto.createDecipheriv(algorithm, strToBytes(key), autoIV(strToBytes(iv), algorithm));
    cipher.setAutoPadding(autoPadding);
    const inBuff = strToBytes(target, inputEncoding);
    const outBuff = Buffer.concat([cipher.update(inBuff), cipher.final()]);
    return outBuff.toString(outputEncoding);
};

exports.emptyIV = emptyIV;
exports.zero16IV = zero16IV;
exports.enc = enc;
exports.dec = dec;
exports.encText = enc; //for old version
exports.encBytes = enc; //for old version
exports.decText = dec; //for old version
exports.decBytes = dec; //for old version


//tests:
/*
const key = 'b9da49a54f15324d';
const src = 'abcde';

const key128iv = Buffer.from([12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44, 22, 2]);
const key256iv = Buffer.concat([key128iv, key128iv]);


// aes-128-cbc
let enced = enc(src, key, key128iv);
console.log('enced:', enced);
let deced = dec(enced, key, key128iv);
console.log('deced:', deced);


// aes-128-ecb
let algorithm = 'aes-128-ecb';

enced = enc(src, key, emptyIV, 'utf-8', 'base64', algorithm);
console.log('enced:', enced);
deced = dec(enced, key, emptyIV, 'base64', 'utf-8', algorithm);
console.log('deced:', deced);


// aes-256-cbc
algorithm = 'aes-256-cbc';
const orgText = 'asdfW  #)(ssff234';

enced = enc(orgText, key256iv, zero16IV, 'utf-8', 'base64', algorithm);
console.log('enced:', enced);
deced = dec(enced, key256iv, zero16IV, 'base64', 'utf-8', algorithm);
console.log('deced:', deced);
*/