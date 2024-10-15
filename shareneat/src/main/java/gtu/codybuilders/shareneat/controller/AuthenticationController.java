// AuthenticationController.java
package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.UserRequestDto;
import gtu.codybuilders.shareneat.dto.UserResponseDto;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.impl.JwtServiceImpl;
import gtu.codybuilders.shareneat.service.impl.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;

    private final UserServiceImpl userService;
    private final JwtServiceImpl jwtService;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    UserServiceImpl userService,
                                    JwtServiceImpl jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/login")
    public ResponseEntity<String> login() {

        return ResponseEntity.status(401).body("Testing the security!");
    }



    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(@RequestBody UserRequestDto request) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

//            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//            List<String> roles = authorities.stream()
//                    .map(GrantedAuthority::getAuthority)
//                    .collect(Collectors.toList());

            // Generate JWT token
            final String jwt = jwtService.generateToken(request.getEmail());

            // Return the token
            return ResponseEntity.ok(new UserResponseDto(jwt));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new UserResponseDto("Invalid credentials"));
        }
    }

    // Registration endpoint
// Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRequestDto request) {
        // Check if the user already exists
        if (userService.isUserExists(request.getEmail())) {
            return ResponseEntity.status(409).body("User already exists");
        }

        // Create a new User object
        User user = new User();
        user.setEmail(request.getEmail());
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

}
