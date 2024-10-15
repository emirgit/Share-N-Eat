package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

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
    private String nickname;
    private String password;
    private String email;
    private Instant created;
    private boolean enabled;
    @Enumerated(EnumType.STRING)
    private Role role;


    // New fields for social media features
    private String profilePictureUrl; // URL to the user's profile picture
    private String bio; // Short biography or description of the user
    private Integer followersCount; // Number of followers
    private Integer followingCount; // Number of accounts the user follows
    private Integer postsCount; // Number of posts the user has made
    private String location; // Optional location field for user location

    private Instant lastLogin; // Track last login time


}
