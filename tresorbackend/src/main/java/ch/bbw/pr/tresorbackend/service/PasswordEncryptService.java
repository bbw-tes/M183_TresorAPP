package ch.bbw.pr.tresorbackend.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * PasswordEncryptService
 *   used to hash password and verify match
 * @author Peter Rutschmann
 * @author Sabina Teleskumar
 */
@Service
public class PasswordEncryptService {
   //todo add implementation here
   private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

   public PasswordEncryptService() {
      //todo add implementation here
   }

   public String hashPassword(String password, String salt) {
      //todo add implementation here
      return encoder.encode(password);
   }

   //Todo add password match function: password vs hashedPassword
   public boolean doPasswordMatch(String password, String hashPassword) {
      return encoder.matches(password, hashPassword);
   }
}