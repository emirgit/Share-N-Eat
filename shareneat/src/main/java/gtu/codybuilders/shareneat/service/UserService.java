package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.dto.UserProfileRequestDTO;
import gtu.codybuilders.shareneat.model.PasswordResetToken;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User saveUser(User user);
    boolean isUserExists(String email);
    Optional<User> findUserByEmail(String email);

    public Optional<User> findUserById(Long id);

    boolean isUsernameExists(String username);

    void changeEmail(String newEmail);

    String createPasswordResetToken(String email);
    String createEmailVerificationToken(String email);

    PasswordResetToken validateToken(String token);
    User resetPassword(String token, String newPassword);

    void deleteUser(String email);
    void deleteCurrentUser();
    void deleteUserByUsername(String username);

    List<User> searchUsers(String query); // Added for SearchController

    public UserProfileDTO convertToUserProfileDTO(User user);

    User updateUserProfile(UserProfileRequestDTO userRequestDTO, Long userId);

    String saveProfilePhoto(User user, MultipartFile file) throws IOException;

    Resource getProfilePhoto(Long userId);

    List<User> findByRole(Role role);

    List<User> findByEnabled(Boolean enabled);

    void enableUser(Long userId);

    void disableUser(Long userId);

    void changeUserRole(Long userId, Role role);

    Optional<User> findUserByUsername(String username);

    void banUser(String username);
    void unbanUser(String username);
    Long getUsersCount();
}
