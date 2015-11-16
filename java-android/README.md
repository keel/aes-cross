# AES/CBC/PKCS5Padding - java / Android


## Usage
* keySize : 16 (aes-cbc-128);
* iv : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
* text inputEncoding : 'utf-8';
* text outputEncoding : 'base64';

```java
public static void main(String[] args) {
  String s = "asdfW  #)(ssff234";

  // key size must be 16
  byte[] key = { 1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6 };

  // iv size must be 16
  byte[] ivk = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

  try {
    String enc = encText(s, key, ivk);
    System.out.println(enc);
    String dec = decText(enc, key, ivk);
    System.out.println(dec);

    //If there is only one key and one iv, use AesInstance for better performance

    AesInstance ai = AesInstance.getInstance(key, ivk);
    enc = ai.encText(s);
    System.out.println(enc);
    dec = ai.decText(enc);
    System.out.println(dec);
  } catch (Exception e) {
    e.printStackTrace();
  }

}
```
