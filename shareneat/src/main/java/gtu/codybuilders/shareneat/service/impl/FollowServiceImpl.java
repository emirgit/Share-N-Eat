package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.FollowDto;
import gtu.codybuilders.shareneat.exception.FollowNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.mapper.FollowMapper;
import gtu.codybuilders.shareneat.model.Follow;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.FollowRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.FollowService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final FollowMapper followMapper;

    @Override
    public void createFollow(FollowDto followDto) {
        // Get current user's ID
        Long userId = AuthUtil.getUserId();

        // Retrieve current user (follower) by ID
        User follower = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Follower not found!"));

        // Retrieve followed user by username
        User followed = userRepository.findByUsername(followDto.getFollowedUsername())
                .orElseThrow(() -> new UserNotFoundException("Followed user not found!"));

        // Prevent users from following themselves
        if (follower.getUsername().equals(followed.getUsername())) {
            throw new IllegalArgumentException("Users cannot follow themselves.");
        }

        // Check if the follow relationship already exists
        boolean alreadyFollowing = followRepository.existsByFollowerAndFollowed(follower, followed);
        if (alreadyFollowing) {
            throw new IllegalStateException("You are already following this user.");
        }

        // Increment counters
        follower.setFollowingCount((follower.getFollowingCount() == null ? 0 : follower.getFollowingCount()) + 1);
        followed.setFollowersCount((followed.getFollowersCount() == null ? 0 : followed.getFollowersCount()) + 1);

        userRepository.save(follower); // Save updated follower
        userRepository.save(followed); // Save updated followed user

        // Map DTO to Follow entity
        Follow follow = followMapper.mapToFollow(followDto, follower, followed);
        followRepository.save(follow);
    }

    @Override
    public void deleteFollow(FollowDto followDto) {
        // Get current user's ID
        Long userId = AuthUtil.getUserId();

        // Retrieve current user (follower) by ID
        User follower = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Follower not found!"));

        // Retrieve followed user by username
        User followed = userRepository.findByUsername(followDto.getFollowedUsername())
                .orElseThrow(() -> new UserNotFoundException("Followed user not found!"));

        // Find the follow relationship
        Follow follow = followRepository.findByFollowerAndFollowed(follower, followed)
                .orElseThrow(() -> new FollowNotFoundException("Follow relationship not found."));

        // Decrement counters
        if (follower.getFollowingCount() != null && follower.getFollowingCount() > 0) {
            follower.setFollowingCount(follower.getFollowingCount() - 1);
        }
        if (followed.getFollowersCount() != null && followed.getFollowersCount() > 0) {
            followed.setFollowersCount(followed.getFollowersCount() - 1);
        }

        userRepository.save(follower); // Save updated follower
        userRepository.save(followed); // Save updated followed user

        followRepository.delete(follow);
    }

    @Override
    public List<FollowDto> getFollowersOfUser() {
        // Get current user's ID
        Long userId = AuthUtil.getUserId();

        // Retrieve current user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        // Fetch followers
        return followRepository.findAllByFollowed(user)
                .stream()
                .map(followMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowDto> getFollowedsOfUser() {
        // Get current user's ID
        Long userId = AuthUtil.getUserId();

        // Retrieve current user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        // Fetch followeds (users the current user is following)
        return followRepository.findAllByFollower(user)
                .stream()
                .map(followMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowDto> getFollowersByUsername(String username) {
        // Retrieve user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        // Fetch followers
        return followRepository.findAllByFollowed(user)
                .stream()
                .map(followMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowDto> getFollowedsByUsername(String username) {
        // Retrieve user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        // Fetch followeds
        return followRepository.findAllByFollower(user)
                .stream()
                .map(followMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isCurrentUserFollower(String username) {
        // Get current user's ID
        Long currentUserId = AuthUtil.getUserId();

        // Retrieve current user by ID
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UserNotFoundException("Current user not found!"));

        // Retrieve target user by username
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Target user not found!"));

        // Check if current user is a follower of the target user
        return followRepository.existsByFollowerAndFollowed(currentUser, targetUser);
    }

    @Override
    public boolean isCurrentUserFollowing(String username) {
        // Get current user's ID
        Long currentUserId = AuthUtil.getUserId();

        // Retrieve current user by ID
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UserNotFoundException("Current user not found!"));

        // Retrieve target user by username
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Target user not found!"));

        // Check if current user is following the target user
        return followRepository.existsByFollowerAndFollowed(currentUser, targetUser);
    }

}
