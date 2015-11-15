'use strict';

var printBuf = function(buf){
  var out = '';
  for (var i = 0; i < buf.length; i++) {
    out += buf[i]+',';
  }
  return out;
};

var aes = require('./nodeJs/aes');
var testTxt = 'asdfW  #)(ssff234';
var key = new Buffer([1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6]);
var enc = aes.encText(testTxt,key);
console.log('enc:%s',enc);
var dec = aes.decText(enc,key);
console.log('dec:%s',dec);

// for buffer
var testBuff = new Buffer([23,42,55,11,33,45,55]);
var encBuff = aes.encBytes(testBuff,key);
var decBuff = aes.decBytes(encBuff,key);
console.dir(encBuff);
console.dir(decBuff);