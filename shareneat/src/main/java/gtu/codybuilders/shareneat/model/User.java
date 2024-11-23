package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "app_user")
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String fullName;
    @Column(unique = true)
    private String username;
    @Email
    @NotBlank(message = "Email is required.")
    @Column(unique = true)
    private String email;
    @NotBlank(message = "password is required.")
    private String password;
    private Instant created;
    private boolean enabled;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FavoriteProduct> favoriteProducts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductComment> productComments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Rate> rates;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FavoritePost> favoritePosts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Post> posts;

    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Follow> followers; // Users following this user
    
    @OneToMany(mappedBy = "followed", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Follow> following; // Users this user is following

    @OneToMany(mappedBy = "sharedUser", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Share> shares;

    


    // New fields for social media features
    private String profilePictureUrl; // URL to the user's profile picture
    private String bio; // Short biography or description of the user
    private Integer followersCount; // Number of followers
    private Integer followingCount; // Number of accounts the user follows
    private Integer postsCount; // Number of posts the user has made
    private String location; // Optional location field for user location

    private Instant lastLogin; // Track last login time

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private PasswordResetToken passwordResetToken;
}
