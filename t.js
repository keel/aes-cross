'use strict';

console.log('t.js:%s',__dirname);

var aes = require('./node/aes');

var orgText = 'asdfasdfaf';
var key = new Buffer([12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44, 22, 2]);
console.log(aes.encText(orgText,key));