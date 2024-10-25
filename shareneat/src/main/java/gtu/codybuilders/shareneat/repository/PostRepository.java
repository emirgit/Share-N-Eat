package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    List<Post> findAllByUser(User user);
}
