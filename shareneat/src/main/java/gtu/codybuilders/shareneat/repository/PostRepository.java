package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> , JpaSpecificationExecutor<Post> {
    List<Post> findByUser(User user);
    List<Post> findAllByUser(User user);

    @Query("SELECT p FROM Post p WHERE p.user.userId IN (SELECT f.followed.userId FROM Follow f WHERE f.follower.userId = :userId)")
    List<Post> findPostsByFollowedUsers(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.averageRateRegular DESC")
    List<Post> findTop20ByOrderByAverageRateRegularDesc(Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.averageRateExpert DESC")
    List<Post> findTop20ByOrderByAverageRateExpertDesc(Pageable pageable);

    List<Post> findTop100ByOrderByCreatedDateDesc();

    Page<Post> findByPostNameContainingIgnoreCase(String postName, Pageable pageable);

    List<Post> findByUserOrderByCreatedDateDesc(User user, Pageable pageable);

    @Modifying
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + :delta WHERE p.id = :postId")
    void updateLikeCount(@Param("postId") Long postId, @Param("delta") int delta);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.createdDate BETWEEN :startDate AND :endDate")
    long countPostsCreatedBetween(Instant startDate, Instant endDate);

}
