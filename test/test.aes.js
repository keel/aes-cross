'use strict';

var expect = require('chai').expect;
var aes = require('../nodejs/aes');

describe('aes.js', function() {


    const orgText = 'asdfW  #)(ssff234';
    const key128 = Buffer.from([12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44, 22, 2]);
    const key256 = Buffer.concat([key128, key128]);
    const enc128Base64 = 'uYv/qTkb9BctlAbkru5Php1Hw4dAied3gj/S5UszX7s=';
    const enc256Base64 = 'ami2Py9ilKBDh359kq5ZkzgAQuaJthzeb4zPYNAOnv0=';
    const ecb128Enced = 'uYv/qTkb9BctlAbkru5Phmi0rWYz4TyIACvZeu7qM30=';
    describe('#enc', function() {
        it('should match CBC 128 base64 encription result', function() {
            expect(enc128Base64).to.be.eql(aes.enc(orgText, key128));
        });
        it('aes-128-ecb encription', function() {
            expect(ecb128Enced).to.be.eql(aes.enc(orgText, key128, aes.emptyIV, 'utf-8', 'base64', 'aes-128-ecb'));
        });
        it('should match CBC 256 base64 encription result', function() {
            expect(enc256Base64).to.be.eql(aes.enc(orgText, key256, aes.zero16IV, 'utf-8', 'base64', 'aes-256-cbc'));
        });
    });
    describe('#dec', function() {
        it('should match CBC 128 base64 decription result', function() {
            expect(orgText).to.be.eql(aes.dec(enc128Base64, key128));
        });
        it('aes-128-ecb decription', function() {
            expect(orgText).to.be.eql(aes.dec(ecb128Enced, key128, aes.emptyIV, 'base64', 'utf-8', 'aes-128-ecb'));
        });
        it('should match CBC 256 base64 decription result', function() {
            expect(orgText).to.be.eql(aes.dec(enc256Base64, key256, aes.zero16IV, 'base64', 'utf-8', 'aes-256-cbc'));
        });
    });
});