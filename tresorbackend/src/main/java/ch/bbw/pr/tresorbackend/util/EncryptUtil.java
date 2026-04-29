package ch.bbw.pr.tresorbackend.util;

import ch.bbw.pr.tresorbackend.model.Secret;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.spec.KeySpec;
import java.util.Base64;

/**
 * EncryptUtil
 * Used to encrypt and decrypt secret content using AES256.
 * Not implemented yet.
 * @author Peter Rutschmann
 * @author Sabina Teleskumar
 */
public class EncryptUtil {
   //todo ergänzen!
   private final SecretKey secretKey;

   public EncryptUtil(String password, String salt) {
      //todo ergänzen!
      this.secretKey = buildKey(password, salt);
   }

   // Builds AES Secreat Key from Password + Salt
   private SecretKey buildKey(String password, String salt) {
      try {
         SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
         KeySpec spec = new PBEKeySpec(password.toCharArray(), salt.getBytes(), 65536, 256);
         byte[] keyBytes = factory.generateSecret(spec).getEncoded();
         return new SecretKeySpec(keyBytes, "AES");
      }catch (Exception e) {
         throw new RuntimeException("Error building key", e);
      }
   }

   public String encrypt(String data) {
      //todo anpassen!
      try {
         Cipher cipher = Cipher.getInstance("AES/ECB/PKCS%Padding");
         cipher.init(Cipher.ENCRYPT_MODE, secretKey);
         byte[] encrypted = cipher.doFinal(data.getBytes());
         return Base64.getEncoder().encodeToString(encrypted);
      } catch  (Exception e) {
         throw new RuntimeException("Error encrypting data", e);
      }
   }

   public String decrypt(String data) {
      //todo anpassen!
      try {
         Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
         cipher.init(Cipher.DECRYPT_MODE, secretKey);
         byte[] decoded = Base64.getDecoder().decode(data);
         return new String(cipher.doFinal(decoded));
      } catch  (Exception e) {
         throw new RuntimeException("Error decrypting data", e);
      }
   }
}
