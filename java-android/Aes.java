package com.k99k.tools.enc;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * AES static function for different key and iv
 * mode: AES/CBC/PKCS5Padding
 * text input encoding: utf-8
 * text output encoding: base64
 *
 */
public class Aes {

	private Aes() {
	}

//	public static final String bytesPrint(byte[] in) {
//		StringBuilder sb = new StringBuilder();
//		for (int i = 0; i < in.length; i++) {
//			sb.append(in[i]).append(",");
//		}
//		String out = sb.toString();
//		System.out.println(out);
//		return out;
//	}

	public static final byte[] encBytes(byte[] srcBytes, byte[] key,
			byte[] newIv) throws Exception {
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
		IvParameterSpec iv = new IvParameterSpec(newIv);
		cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
		byte[] encrypted = cipher.doFinal(srcBytes);
		return encrypted;
	}

	public static final String encText(String sSrc, byte[] key, byte[] newIv)
			throws Exception {
		byte[] srcBytes = sSrc.getBytes("utf-8");
		byte[] encrypted = encBytes(srcBytes, key, newIv);
		return Base64.encode(encrypted);
	}

	public static final byte[] decBytes(byte[] srcBytes, byte[] key,
			byte[] newIv) throws Exception {
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
		IvParameterSpec iv = new IvParameterSpec(newIv);
		cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
		byte[] encrypted = cipher.doFinal(srcBytes);
		return encrypted;
	}

	public static final String decText(String sSrc, byte[] key, byte[] newIv)
			throws Exception {
		byte[] srcBytes = Base64.decode(sSrc);
		byte[] decrypted = decBytes(srcBytes, key, newIv);
		return new String(decrypted, "utf-8");
	}

	public static void main(String[] args) {
		String s = "asdfW  #)(ssff234";
		byte[] key = { 1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6 };
		byte[] ivk = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

		try {
			String enc = encText(s, key, ivk);
			System.out.println(enc);
			String dec = decText(enc, key, ivk);
			System.out.println(dec);

			// If there is only one key and one iv, use AesInstance for better performance

			AesInstance ai = AesInstance.getInstance(key, ivk);
			enc = ai.encText(s);
			System.out.println(enc);
			dec = ai.decText(enc);
			System.out.println(dec);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
