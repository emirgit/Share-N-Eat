package gtu.codybuilders.shareneat.repository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Share;
import gtu.codybuilders.shareneat.model.User;

@Repository
public interface ShareRepository extends JpaRepository<Share, Long>{
    boolean existsBySharedUserAndSharedPost(User sharedUser, Post sharedPost);

    Optional<Share> findBySharedUserAndSharedPost(User sharedUser, Post sharedPost);

    List<Share> findAllBySharedUser(User sharedUser);
}
