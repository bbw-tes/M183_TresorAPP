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

   public PasswordEncryptService() {
      //todo add implementation here
   }

   public String hashPassword(String password, String salt) {
      //todo add implementation here

      return password;
   }
   // Pepper
   private String pepper;
   //Todo add password match function: password vs hashedPassword

}