package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.FavoritePost;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritePostRepository extends JpaRepository<FavoritePost, Long>{
    Optional<FavoritePost> findByUserAndPost(User user, Post post);
    List<FavoritePost> findByUser(User user); 
}
