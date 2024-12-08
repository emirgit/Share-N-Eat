package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.FollowDto;
import gtu.codybuilders.shareneat.service.FollowService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@AllArgsConstructor
public class FollowController {

    private final FollowService followService;

    // Create a follow relationship
    @PostMapping("/follow")
    public ResponseEntity<Void> followUser(@RequestBody FollowDto followDto) {
        followService.createFollow(followDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Delete a follow relationship
    @DeleteMapping("/unfollow")
    public ResponseEntity<Void> unfollowUser(@RequestBody FollowDto followDto) {
        followService.deleteFollow(followDto);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Check if the current user is a follower of a specific user by username
    @GetMapping("/current-user/{username}/is-follower")
    public ResponseEntity<Boolean> isCurrentUserFollower(@PathVariable String username) {
        boolean isFollower = followService.isCurrentUserFollower(username);
        return ResponseEntity.ok(isFollower);
    }

    // Check if the current user is following a specific user by username
    @GetMapping("/current-user/{username}/is-following")
    public ResponseEntity<Boolean> isCurrentUserFollowing(@PathVariable String username) {
        boolean isFollowing = followService.isCurrentUserFollowing(username);
        return ResponseEntity.ok(isFollowing);
    }

    // Get all followers of the current user
    @GetMapping("/current-user/followers")
    public ResponseEntity<List<FollowDto>> getFollowers() {
        List<FollowDto> followers = followService.getFollowersOfUser();
        return ResponseEntity.ok(followers);
    }

    // Get all followeds of the current user
    @GetMapping("/current-user/followed")
    public ResponseEntity<List<FollowDto>> getFollowed() {
        List<FollowDto> followed = followService.getFollowedsOfUser();
        return ResponseEntity.ok(followed);
    }

    // Get all followers of a specific user by username
    @GetMapping("/user/{username}/followers")
    public ResponseEntity<List<FollowDto>> getFollowersByUsername(@PathVariable String username) {
        List<FollowDto> followers = followService.getFollowersByUsername(username);
        return ResponseEntity.ok(followers);
    }

    // Get all followeds of a specific user by username
    @GetMapping("/user/{username}/followed")
    public ResponseEntity<List<FollowDto>> getFollowedsByUsername(@PathVariable String username) {
        List<FollowDto> followed = followService.getFollowedsByUsername(username);
        return ResponseEntity.ok(followed);
    }
}
