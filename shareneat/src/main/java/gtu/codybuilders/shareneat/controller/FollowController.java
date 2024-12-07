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
    @DeleteMapping("/unfollow/{followId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long followId) {
        followService.deleteFollow(followId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/current-user/{userId}/is-follower")
    public ResponseEntity<Boolean> isCurrentUserFollower(@PathVariable Long userId) {
        boolean isFollower = followService.isCurrentUserFollower(userId);
        return ResponseEntity.ok(isFollower);
    }

    @GetMapping("/current-user/{userId}/is-following")
    public ResponseEntity<Boolean> isCurrentUserFollowing(@PathVariable Long userId) {
        boolean isFollowing = followService.isCurrentUserFollowing(userId);
        return ResponseEntity.ok(isFollowing);
    }

    // Get all followers of a user
    @GetMapping("/current-user/followers")
    public ResponseEntity<List<FollowDto>> getFollowers() {
        List<FollowDto> followers = followService.getFollowersOfUser();
        return ResponseEntity.ok(followers);
    }

    // Get all followeds of a user
    @GetMapping("/current-user/followed")
    public ResponseEntity<List<FollowDto>> getFollowed() {
        List<FollowDto> followed = followService.getFollowedsOfUser();
        return ResponseEntity.ok(followed); 
    }

    @GetMapping("/user/{userId}/followers")
    public ResponseEntity<List<FollowDto>> getFollowersByUserId(@PathVariable Long userId) {
        List<FollowDto> followers = followService.getFollowersByUserId(userId);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/user/{userId}/followed")
    public ResponseEntity<List<FollowDto>> getFollowedsByUserId(@PathVariable Long userId) {
        List<FollowDto> followed = followService.getFollowedsByUserId(userId);
        return ResponseEntity.ok(followed);
    }
}
