package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Follow;
import gtu.codybuilders.shareneat.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {
        // Method to find all followers of a specific user
        List<Follow> findAllByFollowed(User followed);

        // Method to find all users that a specific user is following
        List<Follow> findAllByFollower(User follower);
}
