# A real cross platform AES encryption-decryption solution. Support Java,C,nodeJs,Android,IOS...

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
* **padding**: NoPadding,ZeroPadding,PKCS5Padding,PKCS7Padding,ISO10126Padding,ANSI X.923...
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
  you don't need any extra code on these platforms, just make sure using **AES/CBC/PKCS5Padding** ,and same iv, same key, the encription and decription will cross platform.
  There're some platform don't support **PKCS5Padding** , that's the project to resolve it.

> PKCS7Padding = PKCS5Padding on AES,don't worry about it.

> [What is PKCS5Padding?](https://en.wikipedia.org/wiki/Padding_%28cryptography%29#PKCS7)

Some cross platform solution choose ZeroPadding on CBC mode.The decryption result may have some unnecessary bytes, because the decryption result bytes must be multiple of 16, and it's hard to be cut because the original plaintext size is unknown.

# The key point!
If you find a way to **AES/CBC/PKCS5Padding** on a platform, you have already got the cross-platform AES solution on it.


