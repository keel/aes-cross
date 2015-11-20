'use strict';

var expect = require('chai').expect;
// var rewire = require('rewire');
// var _aes = rewire('../nodejs/aes');
var aes = require('../node/aes');

describe('aes.js', function() {
  // var orgBuffer1 = new Buffer('test');
  // var orgBuffer2 = new Buffer('testtesttesttest');
  // var afterPaddingBuff1 = new Buffer([116, 101, 115, 116, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]);
  // var afterPaddingBuff2 = new Buffer([116, 101, 115, 116, 116, 101, 115, 116, 116, 101, 115, 116, 116, 101, 115, 116, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]);
  // describe('#pkcs5Padding', function() {
  //   var _pkcs5Padding = _aes.__get__('pkcs5Padding');
  //   it('should append last 12 bytes', function() {
  //     expect(_pkcs5Padding(orgBuffer1)).to.be.eql(afterPaddingBuff1);
  //   });
  //   it('should append 16 bytes', function() {
  //     expect(_pkcs5Padding(orgBuffer2)).to.be.eql(afterPaddingBuff2);
  //   });
  // });
  // describe('#pkcs5PaddingClear', function() {
  //   var _pkcs5PaddingClear = _aes.__get__('pkcs5PaddingClear');
  //   it('should clear last 12 bytes', function() {
  //     expect(_pkcs5PaddingClear(afterPaddingBuff1)).to.be.eql(orgBuffer1);
  //   });
  //   it('should clear 16 bytes', function() {
  //     expect(_pkcs5PaddingClear(afterPaddingBuff2)).to.be.eql(orgBuffer2);
  //   });
  // });

  var orgText = 'asdfW  #)(ssff234';
  var key128 = new Buffer([12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44, 22, 2]);
  var key256 = Buffer.concat([key128, key128]);
  var enc128Base64 ='uYv/qTkb9BctlAbkru5Php1Hw4dAied3gj/S5UszX7s=';
  var enc256Base64 ='ami2Py9ilKBDh359kq5ZkzgAQuaJthzeb4zPYNAOnv0=';
  describe('#encText', function () {
    it('should match 128 base64 encription result', function () {
      aes.setKeySize(128);
      expect(enc128Base64).to.be.eql(aes.encText(orgText,key128));
    });
    it('should match 256 base64 encription result', function () {
      aes.setKeySize(256);
      expect(enc256Base64).to.be.eql(aes.encText(orgText,key256));
    });
  });
  describe('#decText', function () {

    it('should match 128 base64 decription result', function () {
      aes.setKeySize(128);
      expect(orgText).to.be.eql(aes.decText(enc128Base64,key128));
    });
    it('should match 256 base64 decription result', function () {
      aes.setKeySize(256);
      expect(orgText).to.be.eql(aes.decText(enc256Base64,key256));
    });
  });
});