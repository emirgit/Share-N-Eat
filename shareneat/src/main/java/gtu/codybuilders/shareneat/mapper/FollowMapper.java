package gtu.codybuilders.shareneat.mapper;

import gtu.codybuilders.shareneat.dto.FollowDto;
import gtu.codybuilders.shareneat.model.Follow;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class FollowMapper {

    public Follow mapToFollow(FollowDto followDto, User follower, User followed){
        return Follow.builder()
                .follower(follower)
                .followed(followed)
                .followedAt(Instant.now())
                .build();
    }

    public FollowDto mapToDto(Follow follow){
        return FollowDto.builder()
                .followerUsername(follow.getFollower().getUsername())
                .followedUsername(follow.getFollowed().getUsername())
                .build();
    }

}
