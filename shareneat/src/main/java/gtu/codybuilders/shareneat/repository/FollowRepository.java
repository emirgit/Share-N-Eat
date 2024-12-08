package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Follow;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
        // Find all followers of a specific user
        List<Follow> findAllByFollowed(User followed);

        // Find all users that a specific user is following
        List<Follow> findAllByFollower(User follower);

        // Check if a follow relationship exists between follower and followed
        boolean existsByFollowerAndFollowed(User follower, User followed);

        // Find a specific follow relationship
        Optional<Follow> findByFollowerAndFollowed(User follower, User followed);
}
