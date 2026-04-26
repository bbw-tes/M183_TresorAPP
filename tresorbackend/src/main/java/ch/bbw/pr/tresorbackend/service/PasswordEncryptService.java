package ch.bbw.pr.tresorbackend.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Value;

/**
 * PasswordEncryptService
 *   used to hash password and verify match
 *   Uses Bycrpt (includes Salt automatically) + Pepper for extra security.
 *
 * @author Peter Rutschmann
 * @author Sabina Teleskumar
 */
@Service
public class PasswordEncryptService {

   //Pepper: secret value from application.properties, never stroed in DB
   @Value("${PASSWORD_PEPPER}")
   private String pepper;

   private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

   public PasswordEncryptService() {
      //todo add implementation here
   }
// temporär
   @jakarta.annotation.PostConstruct
   public void init() {
      System.out.println("DEBUG Pepper loaded: " + pepper);
   }

   public String hashPassword(String password) {
      //todo add implementation here
      String pepperedPassword = password + pepper;
      System.out.println("DEBUG hashPassword peppered: " + pepperedPassword);
      return encoder.encode(pepperedPassword);
   }

   //Todo add password match function: password vs hashedPassword
   public boolean doPasswordMatch(String password, String hashPassword) {
      String pepperedPassword = password + pepper;
      System.out.println("DEBUG doPasswordMatch peppered: " + pepperedPassword); //Delete this
      return encoder.matches(pepperedPassword, hashPassword);
   }
}