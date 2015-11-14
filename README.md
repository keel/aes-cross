# A real cross platform AES encryption-decryption solution. Support Java,C,nodeJs,Android,IOS...

## Why AES?
* Simple: aymmetric encryption
* Secure: better than 3DES and others
* Fast: faster than others on same security level
* Binary support: not only texts

## How to cross platform?
The AES algorithm is same on all platform, but there are some factors make it difficult to do so:
* **cipher mode**: ECB,CBC,CFB,OFB,CTR,XTS...
* **key size**: 128, 192, 256
* **iv**: need to set it besides key
* **padding**: NoPadding,ZeroPadding,PKCS5Padding,PKCS7Padding,ISO10126Padding,ANSI X.923,SSL3Padding...
* **key**: the key for encription and decryption
Only all these 5 things are exactly the same can the AES encription and decryption be used anywhere.
Most language surppots ECB,CBC,CFB cipher mode (CBC is used widely), and all key sizes(128 is used widely).
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
2. **AES/CBC**
  Good choice! **SSL,IPSec** use it too! And **PKCS5Padding** is well support for most platform like JAVA, IOS(PKCS7Padding),C#(PKCS7Padding),so we choose that for padding.
  There're some platform need **PKCS5Padding** supported, That's this project to resolve it.

(PKCS7Padding = PKCS5Padding on AES,don't worry about it.)

Some cross platform solution choose NoPadding or ZeroPadding, it's OK on CFB/OFB/CTR mode(the result is original size). But on other mode, the decryption result may have some unnecessary bytes, because the decryption result bytes must be multiple of 16, and it's hard to be cut because the original plaintext size is unknown.

# The key point!
If you find a way to **AES/CBC/PKCS5Padding** on a platform, you have already got the AES solution cross it.


