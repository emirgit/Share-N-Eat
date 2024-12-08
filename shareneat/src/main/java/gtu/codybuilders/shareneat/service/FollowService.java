package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.FollowDto;
import java.util.List;

public interface FollowService {

    // Method to create a follow relationship using usernames
    void createFollow(FollowDto followDto);

    // Method to delete a follow relationship using usernames
    void deleteFollow(FollowDto followDto);

    // Method to get a list of all followers as FollowDto of the current user
    List<FollowDto> getFollowersOfUser();

    // Method to get a list of all followings as FollowDto of the current user
    List<FollowDto> getFollowedsOfUser();

    // Method to get followers by a specific username
    List<FollowDto> getFollowersByUsername(String username);

    // Method to get followeds by a specific username
    List<FollowDto> getFollowedsByUsername(String username);

    // Method to check if the current user is a follower of a specific user by username
    boolean isCurrentUserFollower(String username);

    // Method to check if the current user is following a specific user by username
    boolean isCurrentUserFollowing(String username);
}
