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
    private final FollowMapper followmapper;

    @Override
    public void createFollow(FollowDto followDto) {
        Long userId = AuthUtil.getUserId();
    
        User follower = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Follower not found !"));
        User followed = userRepository.findById(followDto.getFollowedId())
                .orElseThrow(() -> new UserNotFoundException("Followed not found !"));
    
        // Increment counters
        follower.setFollowingCount((follower.getFollowingCount() == null ? 0 : follower.getFollowingCount()) + 1);
        followed.setFollowersCount((followed.getFollowersCount() == null ? 0 : followed.getFollowersCount()) + 1);
    
        userRepository.save(follower); // Save updated follower
        userRepository.save(followed); // Save updated followed user
    
        Follow follow = followmapper.mapToFollow(followDto, follower, followed);
        followRepository.save(follow);
    }

    @Override
    public void deleteFollow(Long followId) {
        Follow follow = followRepository.findById(followId)
                .orElseThrow(() -> new FollowNotFoundException("Follow not found with id: " + followId));
        
        User follower = follow.getFollower();
        User followed = follow.getFollowed();
    
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
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return followRepository.findAllByFollowed(user)
                                .stream()
                                .map(followmapper::mapToDto)
                                .collect(Collectors.toList());
    }

    @Override
    public List<FollowDto> getFollowedsOfUser() {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return followRepository.findAllByFollower(user)
                                .stream()
                                .map(followmapper::mapToDto)
                                .collect(Collectors.toList());
    }

    @Override
    public List<FollowDto> getFollowersByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return followRepository.findAllByFollowed(user)
                                .stream()
                                .map(followmapper::mapToDto)
                                .collect(Collectors.toList());
    }

    @Override
    public List<FollowDto> getFollowedsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return followRepository.findAllByFollower(user)
                                .stream()
                                .map(followmapper::mapToDto)
                                .collect(Collectors.toList());
    }

}
