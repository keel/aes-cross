# 真正跨平台的AES加密/解密方案. 支持 Java,C,nodeJs,Android,IOS...

## 为什么用AES?
* 简单: 对称加密算法
* 安全: 比 3DES 等其他对称算法更安全
* 快速: 在相同安全性下比其他算法速度更快
* 二进制: 支持二进制加密,也同时支持文本

## 怎样实现跨平台?
AES的算法本身是跨平台的,只不过以下这些要素决定了跨平台不是那么简单:
* **加密模式**: ECB,CBC,CFB,OFB,CTR,XTS...
* **密钥长度**: 128, 256
* **iv向量**: 需要与密钥同时设置
* **padding**: NoPadding,ZeroPadding,PKCS5Padding,ISO10126Padding,ANSI X.923,SSL3Padding...
* **密钥**: 用于加解密的key

只有当这5个要素都完全一致时,AES的加密和解密才可以在任何地方通用,也就是实现跨平台.
一般的编程语言会支持ECB,CBC,CFB这几种常见的加密模式,以及128的密钥长度,但在padding的处理方式上,各个语言的区别就太大了,而且这个padding与加密模式也存在紧密的关联.

## 处理Padding问题
AES的一些加密模式需要原文的bytes数是16的倍数,以下是信息表:
[更多信息可以点击查WIKI](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_codebook_.28ECB.29)

算法/模式/填充            |16字节加密后数据长度|不满16字节加密后长度
-------------------------|---------------|-------------------
AES/CBC/NoPadding        |     16        |   不支持
AES/CBC/PKCS5Padding     |     32        |   16
AES/CBC/ISO10126Padding  |     32        |   16
AES/CFB/NoPadding        |     16        |   原始数据长度
AES/CFB/PKCS5Padding     |     32        |   16
AES/CFB/ISO10126Padding  |     32        |   16
AES/ECB/NoPadding        |     16        |   不支持
AES/ECB/PKCS5Padding     |     32        |   16
AES/ECB/ISO10126Padding  |     32        |   16
AES/OFB/NoPadding        |     16        |   原始数据长度
AES/OFB/PKCS5Padding     |     32        |   16
AES/OFB/ISO10126Padding  |     32        |   16
AES/PCBC/NoPadding       |     16        |   不支持
AES/PCBC/PKCS5Padding    |     32        |   16
AES/PCBC/ISO10126Padding |     32        |   16

## 解决方案
1. AES/CFB/NoPadding or AES/OFB/NoPadding or AES/CTR/NoPadding

  可以用,但安全性堪忧,且不利于并行计算,不建议采用.
2. **AES/CBC/PKCS5Padding**

  不错!,**SSL,IPSec**也在用这种方式,然后我们选择 **PKCS5Padding** 做为padding,因为几个大的语言直接支持这种方式,如:
  * JAVA/Android (PKCS5Padding)
  * ObjectC/IOS (PKCS7Padding)
  * C# (PKCS7Padding)
  * nodeJs (AutoPadding)
  * Python (pycrypto)
  * PHP (mcrypt)

  以上这些语言配置**PKCS5Padding**后,使用**相同的iv和key**即可在不同平台间通用.

  一些语言可能没有直接的支持方式,所以本项目来实现了这些平台的 **PKCS5Padding** ,以此来支持AES的跨平台.

  (注:**PKCS7Padding** 与 **PKCS5Padding** 在AES算法中是相同的)

  [什么是PKCS5Padding?](https://en.wikipedia.org/wiki/Padding_%28cryptography%29#PKCS7)


另外,有一些AES跨平台的算法使用了非CFB/OFB/CTR模式,而且同时使用zeroPadding方案,这会导致解密出来的结果比真正的原文多几个字节,因为解密的结果肯定是16的倍数,而原文不一定是.而这些多余的字节没有办法去除,因为解密的一方是不知道原文的bytes长度的.

# 跨平台的关键!
只要你实现了 **AES/CBC/PKCS5Padding** , 你就能够在这个语言/平台上畅通无阻的实现与其他平台/语言的AES通用的加解密能力.



