# AES/CBC/PKCS5Padding - java / Android


## Usage
* keySize : 128;
* iv : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
* text inputEncoding : 'utf-8';
* text outputEncoding : 'base64';

```java
public static void main(String[] args) {
  String s = "asdfW  #)(ssff234";

  // key size must be 16
  byte[] key = { 12, 13, 12, 33, 33, 44, 3, 34, 44, 44, 9, 45, 28, 44,
      22, 2 };

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
