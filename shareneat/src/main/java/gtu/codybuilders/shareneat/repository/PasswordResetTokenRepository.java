package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.PasswordResetToken;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    // Find a token by the token string
    Optional<PasswordResetToken> findByToken(String token);

    // Find a token by the user
    Optional<PasswordResetToken> findByUser(User user);
}
