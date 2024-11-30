package gtu.codybuilders.shareneat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gtu.codybuilders.shareneat.model.Like;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long>{
    boolean existsByLikedUserAndLikedPost(User likedUser, Post likedPost);

    Optional<Like> findByLikedUserAndLikedPost(User likedUser, Post likedPost);

    List<Like> findAllByLikedUser(User likedUser);
}
