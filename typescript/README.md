# Pure typescript AES

Zero dependencies, but typescript 'TextEncoder,TextDecoder','atob,btoa' needed.

## USEAGE

```javascript
AES.create(key:string|Uint8Array).encString(srcString:string, options?:any);
AES.create(key:string|Uint8Array).decString(decString:string, options?:any);

options = {
    mode: 'cbc', // cbc(default)/ecb/cfb
    iv: new Uint8Array(16), // Uint8Array[16](default) | string : length is 16
    padding: 'pkcs5', //only pkcs5(default)
    output: 'base64', //base64(default)/binary/hex
};
```

Test:
```javascript
const aesEnc = AES.create('abcdefg123456611').encString('test aes测试 一下。 有没有',{'mode':'cbc','iv':new Uint8Array(16),'output': 'base64'});
console.log('AES测试 aesEnc', aesEnc);
const aesDec = AES.create('abcdefg123456611').decString(aesEnc);
console.log('AES测试 aesDec', aesDec);
```

