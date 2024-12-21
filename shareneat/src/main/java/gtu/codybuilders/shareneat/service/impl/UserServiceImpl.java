package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.dto.UserProfileRequestDTO;
import gtu.codybuilders.shareneat.exception.UserAlreadyExistsException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.EmailVerificationToken;
import gtu.codybuilders.shareneat.model.PasswordResetToken;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.EmailVerificationTokenRepository;
import gtu.codybuilders.shareneat.repository.PasswordResetTokenRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.ImageService;
import gtu.codybuilders.shareneat.service.UserService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
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
    private final ImageService imageService;
    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

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
    public void deleteCurrentUser(){
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
    
        userRepository.delete(user);
    }

    @Override
    public void deleteUserByUsername(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
    
        userRepository.delete(user);
    }


    @Override
    public Optional<User> findUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public Optional<User> findUserByUsername(String username) {
        return repository.findByUsername(username);
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
    public void changeEmail(String newEmail){
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        
        user.setEmail(newEmail);
        userRepository.save(user);
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

        if (existingToken.isPresent()){
            // User was not saved to database again, the bidirectional relationship deleted manually
            existingToken.get().getUser().setPasswordResetToken(null);
            tokenRepository.delete(existingToken.get());
        }

        // Generate a new token
        String newToken = UUID.randomUUID().toString();

        // Create and save the new password reset token
        PasswordResetToken passwordResetToken = new PasswordResetToken(newToken, user);
        tokenRepository.save(passwordResetToken);

        return newToken;
    }

    @Override
    public String createEmailVerificationToken(String email) {
        Optional<User> optionalUser = repository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            logger.warn("Email Verification is requested for non-existing email.");
            return ""; // Optionally return an empty string or handle silently to avoid enumeration
        }

        User user = optionalUser.get();

        // Check for an existing token and delete it if found
        Optional<EmailVerificationToken> existingToken = emailVerificationTokenRepository.findByUser(user);

        if (existingToken.isPresent()){
            // User was not saved to database again, the bidirectional relationship deleted manually
            existingToken.get().getUser().setEmailVerificationToken(null);
            emailVerificationTokenRepository.delete(existingToken.get());
        }

        // Generate a new token
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken(token, user);
        emailVerificationTokenRepository.save(verificationToken);

        return token;
    }

    public void verifyEmailToken(String token) {
        // Fetch the token from the repository
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        // Check expiration
        if (verificationToken.getExpiryDate().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        // Mark user as verified
        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        // Optionally delete the token after verification
        emailVerificationTokenRepository.delete(verificationToken);
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
        // change the password, break the relationship and save the user
        user.setPassword(passwordEncoder.encode(newPassword));
        passwordResetToken.getUser().setPasswordResetToken(null);
        User savedUser = repository.save(user);

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
    public Page<User> searchUsers(String query, Pageable pageable) {
        return repository.findByUsernameContainingIgnoreCase(query, pageable);
    }

    public UserProfileDTO convertToUserProfileDTO(User user) {
        return UserProfileDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .followersCount(user.getFollowersCount())
                .followingCount(user.getFollowingCount())
                .postsCount(user.getPostsCount())
                .role(user.getRole())
                //.posts(user.getPosts().stream().map(this::convertToPostResponse).toList()) // Assuming you have a method to convert each post
                .build();
    }

    public User updateUserProfile(UserProfileRequestDTO userRequestDTO, Long userId) {

        Optional<User> userOptional = findUserById(userId);

        return userOptional.map(user -> {
            user.setBio(userRequestDTO.getBio());
            user.setUsername(userRequestDTO.getUsername());
            return repository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));

    }

    @Override
    public String saveProfilePhoto(User user, MultipartFile file) throws IOException {

        String imageName = imageService.saveImage(file, PathConstants.UPLOAD_DIR_USER);
        user.setProfilePictureUrl(imageName); // Save only the file name
        repository.save(user);

        // Return the file path or URL if needed
        return imageName;
    }

    @Override
    public Resource getProfilePhoto(Long userId){
        User user = repository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        String imageName = user.getProfilePictureUrl();
        return imageService.loadImage(imageName, PathConstants.UPLOAD_DIR_USER);

    }

    @Override
    public List<User> findByRole(Role role) {
        return repository.findByRole(role).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> findByEnabled(Boolean enabled) {
        return repository.findByEnabled(enabled).orElseThrow(() -> new RuntimeException("User not found"));
    }


    @Override
    public void changeUserRole(String username, Role role) {
        User user = repository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setRole(role);
        repository.save(user);
    }

    @Override
    public void banUser(String username){
        User user = repository.findByUsername(username)
                        .orElseThrow(() -> new UserNotFoundException("User not found !"));
        user.setBanned(true);
        repository.save(user);
    }

    @Override
    public void unbanUser(String username){
        User user = repository.findByUsername(username)
                        .orElseThrow(() -> new UserNotFoundException("User not found !"));
        user.setBanned(false);
        repository.save(user);
    }

    @Override
    public Long getUsersCount(){
        return userRepository.count();
    }
}
