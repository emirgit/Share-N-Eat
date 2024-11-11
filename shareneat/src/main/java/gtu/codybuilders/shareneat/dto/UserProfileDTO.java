package gtu.codybuilders.shareneat.dto;

import gtu.codybuilders.shareneat.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private Long userId;
    private String username;
    private String email;
    private String bio;
    private Integer followersCount;
    private Integer followingCount;
    private Integer postsCount;
    private Role role;

    // List of posts to show on the profile page, for example
    //private List<PostResponse> posts;
}
