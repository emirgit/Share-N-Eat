package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.UserAddressDto;
import gtu.codybuilders.shareneat.dto.UserManagementDTO;
import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.dto.UserProfileRequestDTO;
import gtu.codybuilders.shareneat.model.PasswordResetToken;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    String getEmail();

    void deleteUser(String email);
    void deleteCurrentUser(String rawPassword);
    void deleteUserByUsername(String username);

    void changePasswordByChecking(String currentPassword, String newPassword, String newPasswordtoConfirm);

    void updateUserAddress(UserAddressDto userAddressDto, String password);
    UserAddressDto getAddressInfo();

    Page<User> searchUsers(String query, Pageable pageable); // Added for SearchController

    UserProfileDTO convertToUserProfileDTO(User user);

    User updateUserProfile(UserProfileRequestDTO userRequestDTO, Long userId);

    String saveProfilePhoto(User user, MultipartFile file) throws IOException;

    Resource getProfilePhoto(Long userId);

    List<User> findByRole(Role role);

    List<User> findByEnabled(Boolean enabled);

    void changeUserRole(String username, Role role);

    Optional<User> findUserByUsername(String username);

    void banUser(String username);
    void unbanUser(String username);
    Long getUsersCount();
    Long getDailyUserCount();

    Page<UserManagementDTO> getUsersForManagement(String search, String role, String status, Pageable pageable);
    UserManagementDTO convertToUserManagementDTO(User user);
}
