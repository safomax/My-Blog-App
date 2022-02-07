package com.msafo.blogapp.controllers;

import com.msafo.blogapp.models.authentication.ConfirmationToken;
import com.msafo.blogapp.models.authentication.Role;
import com.msafo.blogapp.models.authentication.RoleName;
import com.msafo.blogapp.models.authentication.User;
import com.msafo.blogapp.payload.requests.SignInRequest;
import com.msafo.blogapp.payload.requests.SignUpRequest;
import com.msafo.blogapp.repository.ConfirmationTokenRepository;
import com.msafo.blogapp.repository.RoleRepository;
import com.msafo.blogapp.repository.UserRepository;
import com.msafo.blogapp.utilities.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @PostMapping("/sign-in")
    public ResponseEntity<?> signInUser(@Valid @RequestBody SignInRequest signinRequest) {

        User user =  userRepository.findByUsername(signinRequest.getUsername());

        if (user.getEnabled().equals("false") || user.getEnabled().equals("")) {
            return ResponseEntity.badRequest().body("User has not been verified.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinRequest.getUsername(), signinRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ResponseEntity<>(authentication.getPrincipal(), HttpStatus.OK);
    }

    @GetMapping("/sign-out")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void signOutUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        SecurityContextHolder.clearContext();
        if (session != null) {
            session.invalidate();
        }
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUpUser(@Valid @RequestBody SignUpRequest signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email is already in use.");
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();

        Role admin = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow(()-> new RuntimeException("Error: Role is not found"));

        roles.add(admin);

        user.setRole(roles);

        // This will only be true when user verifies his account. Too bad.
        user.setEnabled("false");

        userRepository.save(user);

        ConfirmationToken confirmationToken = new ConfirmationToken(user);

        confirmationTokenRepository.save(confirmationToken);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getUsername());
        mailMessage.setSubject("Verify Account");
        mailMessage.setFrom("safomax02@gmail.com");
        mailMessage.setText("Please click the link below to verify your account.");

        mailMessage.setText("To confirm your account, please click here : "
                + "http://localhost:3000/verify-account?token=" + confirmationToken.getConfirmationToken());

        emailSenderService.sendEmail(mailMessage);

        return ResponseEntity.ok("User registered successfully.");
    }

    @GetMapping("/verify-account")
    public void confirmUserAccount(@RequestParam("token") String confirmationToken) {
        ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);

        User user = userRepository.findByUsername(token.getUser().getUsername());
        user.setEnabled("true");
        userRepository.save(user);

    }

    @GetMapping("/current-user")
    public ResponseEntity<User> getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        User currentUser = userRepository.findByUsername(email);

        return ResponseEntity.ok(currentUser);
    }

}
