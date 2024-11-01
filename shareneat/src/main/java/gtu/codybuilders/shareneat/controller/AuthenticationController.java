// AuthenticationController.java
package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.LoginRequestDto;
import gtu.codybuilders.shareneat.dto.PasswordResetRequest;
import gtu.codybuilders.shareneat.dto.UserRequestDto;
import gtu.codybuilders.shareneat.dto.UserResponseDto;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.impl.EmailSenderServiceImpl;
import gtu.codybuilders.shareneat.service.impl.JwtServiceImpl;
import gtu.codybuilders.shareneat.service.impl.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;


@RestController
@RequestMapping(PathConstants.AUTH)
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userService;
    private final JwtServiceImpl jwtService;

    private final EmailSenderServiceImpl emailSenderService;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    UserServiceImpl userService,
                                    JwtServiceImpl jwtService,
                                    EmailSenderServiceImpl emailSenderService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailSenderService = emailSenderService;
    }

    @GetMapping(PathConstants.LOGIN)
    public ResponseEntity<String> login() {
        return ResponseEntity.status(401).body("Testing the security!");
    }

    // Login endpoint
    @PostMapping(PathConstants.LOGIN)
    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto request) {

        try {
            // Authenticate using email or username
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            // Generate JWT token
            final String jwt = jwtService.generateToken(request.getEmail());

            // Return the token
            return ResponseEntity.ok(new UserResponseDto(jwt));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new UserResponseDto("Invalid credentials"));
        }
    }

    // Registration endpoint
    @PostMapping(PathConstants.REGISTER)
    public ResponseEntity<String> register(@RequestBody UserRequestDto request) {
        // Check if the user already exists by email or username
        if (userService.isUserExists(request.getEmail()) || userService.isUsernameExists(request.getUsername())) {
            return ResponseEntity.status(409).body("User with this email or username already exists");
        }

        // Create a new User object
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setCreated(Instant.now());
        user.setEnabled(true);
        user.setRole(Role.ROLE_USER); // Assign ROLE_USER

        // Set default values for other fields if necessary
        user.setFollowersCount(0);
        user.setFollowingCount(0);
        user.setPostsCount(0);
        user.setLastLogin(Instant.now());

        // Save the user
        userService.saveUser(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping(PathConstants.FORGOT_PASSWORD_EMAIL_VAR)
    public ResponseEntity<String> forgotPassword(@PathVariable String email) {
        try {
            // Generate a password reset token
            String token = userService.createPasswordResetToken(email);

            if (token.isEmpty()) {
                // Mask response to avoid email enumeration
                return ResponseEntity.ok("If you don’t see the email in your inbox, check your spam folder. " +
                        "If it’s not there, the email address may not be confirmed, or it may not match an existing account.");
            }

            // Create a reset link including the token
            String resetLink = "http://localhost:8080/reset-password?token=" + token;

            // Send the reset link to the user's email
            emailSenderService.sendPasswordResetEmail(email, resetLink);

            return ResponseEntity.ok("If you don’t see the email in your inbox, check your spam folder. " +
                    "If it’s not there, the email address may not be confirmed, or it may not match an existing account.");

        }
        catch (UserNotFoundException e) {
            // Log and respond if email is not found
            logger.warn("Password reset requested for non-existing email: {}", email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unable to process request. Please try again later.");

        }
        catch (Exception e) {
            // Log any unexpected errors
            logger.error("An unexpected error occurred during password reset request for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred. Please try again later.");
        }
    }


    @GetMapping(PathConstants.RESET_PASSWORD)
    public ResponseEntity<String> showResetPasswordForm(@RequestParam("token") String token) {
        try {
            userService.validateToken(token);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }

        return ResponseEntity.ok("Password reset form here");
    }

    @PostMapping(PathConstants.RESET_PASSWORD)
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}
