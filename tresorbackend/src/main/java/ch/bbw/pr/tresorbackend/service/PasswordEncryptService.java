package ch.bbw.pr.tresorbackend.service;

import org.springframework.stereotype.Service;

/**
 * PasswordEncryptService
 *   used to hash password and verify match
 * @author Peter Rutschmann
 * @author Sabina Teleskumar
 */
@Service
public class PasswordEncryptService {
   //todo add implementation here
   private String pepper;

   public PasswordEncryptService() {
      //todo add implementation here
      this.pepper = "CHANGE_ME";
   }

   public String hashPassword(String password, String salt) {
      //todo add implementation here
      String combined = password + salt + pepper;
      return String.valueOf(combined.hashCode());
   }

   //Todo add password match function: password vs hashedPassword
   public boolean doPasswordMatch(String password, String salt, String hashedPassword) {
      String newHash = hashedPassword(password, salt);
      return newHash.equals(hashedPassword);
   }
}