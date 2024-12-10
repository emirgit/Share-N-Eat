package gtu.codybuilders.shareneat.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class EmailVerificationToken {

    private static final int EXPIRATION = 30; // Token valid for 24 hours

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Instant expiryDate;

    public EmailVerificationToken(String token, User user) {
        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    private Instant calculateExpiryDate(int expiryTimeInMinutes) {
        return Instant.now().plusSeconds(expiryTimeInMinutes * 60);
    }

    public boolean isExpired() {
        return Instant.now().isAfter(this.expiryDate);
    }
}

