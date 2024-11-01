package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.model.PasswordResetToken;
import gtu.codybuilders.shareneat.model.User;

import java.util.Optional;

public interface UserService {

    User saveUser(User user);
    boolean isUserExists(String email);
    Optional<User> findUserByEmail(String email);

    public Optional<User> findUserById(Long id);

    boolean isUsernameExists(String username);

    String createPasswordResetToken(String email);

    PasswordResetToken validateToken(String token);
    User resetPassword(String token, String newPassword);

    public void deleteUser(String email);
}
