package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.exception.UserAlreadyExistsException;
import gtu.codybuilders.shareneat.model.PasswordResetToken;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.PasswordResetTokenRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.UserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;


    @Override
    public User saveUser(User user) {
        if (repository.existsByEmail(user.getEmail())) {
            logger.warn("Attempt to register with existing email: {}", user.getEmail());
            throw new UserAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = repository.save(user);

        logger.info("User registered successfully: {}", savedUser.getEmail());
        return savedUser;
    }

    //temp function for initiliazing data
    public void deleteUser(String email){
        Optional<User> user =  repository.findByEmail(email);

        if (user.isEmpty())
            return;

        repository.delete(user.get());
    }


    @Override
    public Optional<User> findUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public Optional<User> findUserById(Long id) {
        return repository.findById(id);
    }

    @Override
    public boolean isUserExists(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public boolean isUsernameExists(String username) {
        return repository.existsByUsername(username);
    }


    @Override
    public String createPasswordResetToken(String email) {
        Optional<User> optionalUser = repository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            logger.warn("Password reset requested for non-existing email.");
            return ""; // Optionally return an empty string or handle silently to avoid enumeration
        }

        User user = optionalUser.get();

        // Check for an existing token and delete it if found
        Optional<PasswordResetToken> existingToken = tokenRepository.findByUser(user);
        existingToken.ifPresent(tokenRepository::delete); // Delete any existing token for the user

        // Generate a new token
        String newToken = UUID.randomUUID().toString();

        // Create and save the new password reset token
        PasswordResetToken passwordResetToken = new PasswordResetToken(newToken, user);
        tokenRepository.save(passwordResetToken);

        return newToken;
    }



    @Override
    public PasswordResetToken validateToken(String token) {
        Optional<PasswordResetToken> optionalToken = tokenRepository.findByToken(token);

        if (optionalToken.isEmpty() || optionalToken.get().isExpired()) {
            logger.warn("Attempt to reset password with invalid or expired token.");
            throw new IllegalArgumentException("Invalid or expired password reset token");
        }

        return optionalToken.get();
    }

    @Override
    public User resetPassword(String token, String newPassword) {

        PasswordResetToken passwordResetToken = validateToken(token);

        User user = passwordResetToken.getUser();
        User savedUser = changePassword(user, newPassword);

        // Invalidate the token after successful password reset
        tokenRepository.delete(passwordResetToken);

        logger.info("User registered successfully: {}", savedUser.getEmail());
        return savedUser;
    }

    private User changePassword(User user, String newPassword){
        user.setPassword(passwordEncoder.encode(newPassword));
        return repository.save(user);
    }

    // Added for SearchController
    @Override
    public List<User> searchUsers(String query) {
        return repository.findByUsernameContainingIgnoreCase(query);
    }
}
