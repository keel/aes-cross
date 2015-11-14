'use strict';
var crypto = require('crypto');
// var buff = require('buffer');

var rootKey = new Buffer([12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44, 22, 2]);
var iv = new Buffer([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
// var encode = 'utf8';
var algorithm = 'aes-128-cbc';
var cipherEncoding = 'base64';
var clearEncoding = 'utf8';

var pkcs5PaddingBytes = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
var pkcs5Padding = function(str) {
  var buf = new Buffer(str);
  var len = buf.length;
  var padding = len % 16;
  var padLen = 16;
  if (padding !== 0) {
    padLen = 16 - padding;
  }
  var newLen = len + padLen;
  var outBuff = new Buffer(newLen);
  buf.copy(outBuff, 0, 0, len);
  outBuff.fill(pkcs5PaddingBytes[padLen - 1], len);
  // console.log('outBuff:%s',printBuf(outBuff));
  return outBuff;
};


function base64(str) {
  var re = new Buffer(str).toString('base64');
  return re.replace(/\=/gm, '_').replace(/\+/gm, '.').replace(/\//gm, '@');
}

function enc(data, key) {
  if (key) {
    if (key.length != 16) {
      //console.log('enc err:'+key);
      return null;
    }
  } else {
    key = rootKey;
  }
  //key = (key) ? key : rootKey;

  try {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    cipher.setAutoPadding(false);
    var re = cipher.update(pkcs5Padding(data), clearEncoding, cipherEncoding) + cipher.final(cipherEncoding);
    // return re.replace(/\=/gm, '_').replace(/\+/gm, '.').replace(/\//gm, '@');
    return re;
  } catch (e) {
    //console.log(e);
    return null;
  }
}

var pkcs5PaddingClear = function(buff) {
  var len = buff.length;
  var e = buff[len - 1];
  return buff.slice(0, len - e);
};

function dec(data, key) {
  if (key) {
    if (key.length != 16) {
      return null;
    }
  } else {
    key = rootKey;
  }
  try {
    // data = data.replace(/\_/gm, '=').replace(/\./gm, '+').replace(/\@/gm, '/');
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAutoPadding(false);
    var out1 = decipher.update(data, cipherEncoding);
    out1 = pkcs5PaddingClear(out1);
    // console.log('dec out1:%s',printBuf(out1));
    var out2 = decipher.final(clearEncoding);
    // console.log('dec out2:%s',printBuf(out2));
    return out1.toString(clearEncoding) + out2;
  } catch (e) {
    //console.log(e);
    return null;
  }
}

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var charsLength = chars.length;

function randomStr(len) {
  var randomBytes = crypto.randomBytes(len);
  var result = new Array(len);

  var cursor = 0;
  for (var i = 0; i < len; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % charsLength];
  }

  return result.join('');
}

exports.enc = enc;
exports.dec = dec;
exports.base64 = base64;
exports.randomStr = randomStr;

// var test = 'asdfW  #)(ssff234';
// var org = new Buffer(test);
// console.log('org:%s',printBuf(org));
// var enced = enc(test);
// var deced = dec(enced);
// console.log('dec:%s',deced);