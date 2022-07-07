# Pure typescript AES

Zero dependencies, but typescript 'TextEncoder,TextDecoder','atob,btoa' needed.

## USEAGE

```javascript
AES.create(key:string|Uint8Array, options?:any).encString(srcString:string);
AES.create(key:string|Uint8Array, options?:any).decString(decString:string);

options = {
    mode: 'cbc', // cbc(default)/ecb/cfb
    iv: new Uint8Array(16), // Uint8Array[16](default) | string : length is 16
    padding: 'pkcs5', //only pkcs5(default)
    output: 'base64', //base64(default)/binary/hex
};
```

Test:
```javascript
const aesEnc = AES.create('abcdefg123456611',{'mode':'cbc','iv':new Uint8Array(16),'output': 'base64'}).encString('test aes测试 一下。 有没有');
console.log('aesEnc', aesEnc);
const aesDec = AES.create('abcdefg123456611').decString(aesEnc);
console.log('aesDec', aesDec);
```

