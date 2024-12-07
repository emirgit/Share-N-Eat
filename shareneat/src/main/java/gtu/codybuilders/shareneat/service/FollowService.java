package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.FollowDto;
import java.util.List;

public interface FollowService {

    // Method to create a follow relationship
    void createFollow(FollowDto followDto);

    // Method to delete a follow relationship
    void deleteFollow(Long followId);

    // Method to get a list of all followers as FollowDto of a specific user
    List<FollowDto> getFollowersOfUser();

    // Method to get a list of all followings as FollowDto of a specific user
    List<FollowDto> getFollowedsOfUser();

    List<FollowDto> getFollowersByUserId(Long userId);
    List<FollowDto> getFollowedsByUserId(Long userId);

    // Method to check if the current user is a follower of a specific user
    boolean isCurrentUserFollower(Long userId);
    // Method to check if the current user is following a specific user
    boolean isCurrentUserFollowing(Long userId);
}
