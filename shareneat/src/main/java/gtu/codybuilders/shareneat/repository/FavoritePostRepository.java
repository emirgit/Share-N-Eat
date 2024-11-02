package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.FavoritePost;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritePostRepository extends JpaRepository<FavoritePost, Long>{
    Optional<FavoritePost> findByUserAndPost(User user, Post post);
    List<FavoritePost> findByUser(User user); 
}
