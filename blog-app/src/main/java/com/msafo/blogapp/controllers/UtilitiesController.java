package com.msafo.blogapp.controllers;

import com.msafo.blogapp.models.authentication.ConfirmationToken;
import com.msafo.blogapp.models.authentication.NewUsernameRequest;
import com.msafo.blogapp.models.authentication.UpdatedUsername;
import com.msafo.blogapp.models.authentication.User;
import com.msafo.blogapp.repository.ConfirmationTokenRepository;
import com.msafo.blogapp.repository.UpdatedUsernameRepository;
import com.msafo.blogapp.repository.UserRepository;
import com.msafo.blogapp.utilities.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class UtilitiesController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private UpdatedUsernameRepository updatedUsernameRepository;

    // Password change
    @PostMapping("/check-old-password")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_USER')")
    public ResponseEntity<?> checkIfOldPassExists(@Valid @RequestBody User user) throws Exception {

        User currentUser = getUser();

        if (encoder.matches(user.getPassword(), currentUser.getPassword())){
            return new ResponseEntity<>(HttpStatus.OK);
        }

        return ResponseEntity
                .badRequest()
                .body("Old password does not exist!");
    }

    @PutMapping("/user/update-password")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_USER')")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody User userCurrent) throws Exception {

        User user = getUser();

        user.setPassword(encoder.encode(userCurrent.getPassword()));

        User updatedUser = userRepository.save(user);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(updatedUser.getUsername());
        mailMessage.setSubject("Your password has been changed");
        mailMessage.setFrom("safomax02@gmail.com");
        mailMessage.setText("Your password has been changed. ");

        emailSenderService.sendEmail(mailMessage);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/user/update-username")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_USER')")
    public ResponseEntity<?> updateUsername(@Valid @RequestBody NewUsernameRequest newUsernameRequest) throws Exception {

        User user = getUser();

        ConfirmationToken confirmationToken = new ConfirmationToken(user);

        confirmationTokenRepository.save(confirmationToken);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(newUsernameRequest.getNewUsername());
        mailMessage.setSubject("Verify your email address");
        mailMessage.setFrom("safomax02@gmail.com");
        mailMessage.setText("To change your email, please click here : "
                + "http://localhost:3000/change-email?token=" + confirmationToken.getConfirmationToken());

        UpdatedUsername updatedUsername = new UpdatedUsername(newUsernameRequest.getNewUsername(), confirmationToken.getConfirmationToken());

        updatedUsernameRepository.save(updatedUsername);

        emailSenderService.sendEmail(mailMessage);

        return ResponseEntity.ok(newUsernameRequest);
    }

    @GetMapping("/change-username")
    public void confirmChangeUsername(@RequestParam("token") String confirmationToken) throws Exception {
        ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);

        UpdatedUsername updatedUsername = updatedUsernameRepository.findByConfirmationToken(confirmationToken);

        if (token != null) {
            User user = userRepository.findByUsername(token.getUser().getUsername());

            user.setUsername(updatedUsername.getNewUsername());

            userRepository.save(user);

            updatedUsernameRepository.delete(updatedUsername);

        } else {
            throw new Exception("Invalid or broken link!");
        }
    }

    public User getUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return userRepository.findByUsername(email);
    }

}
