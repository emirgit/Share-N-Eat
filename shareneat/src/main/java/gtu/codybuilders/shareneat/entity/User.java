package gtu.codybuilders.shareneat.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @NotBlank(message = "Username is required.")
    private String username;
    @NotBlank(message = "Password is required.")
    private String password;
    @OneToMany(fetch = FetchType.LAZY)
    private List<Post> posts;
    @Email
    @NotBlank(message = "Email is required.")
    private String email;
    private Instant created;
    private boolean enabled;
}

