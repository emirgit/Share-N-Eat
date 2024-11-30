package gtu.codybuilders.shareneat.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.LikeDoneBeforeException;
import gtu.codybuilders.shareneat.exception.LikeNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.Like;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.LikeRepository;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.LikeService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class LikeServiceImpl implements LikeService{

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    @Override
    public void save(Long postId) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        if (likeRepository.existsByLikedUserAndLikedPost(user, post)) {
            throw new LikeDoneBeforeException("Post already liked by this user.");
        }

        postRepository.updateLikeCount(postId, 1);

        Like like = Like.builder()
                .likedUser(user)
                .likedPost(post)
                .build();

        likeRepository.save(like);
    }

    @Override
    public void delete(Long postId) {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        Like like = likeRepository.findByLikedUserAndLikedPost(user, post)
                .orElseThrow(() -> new LikeNotFoundException("Like not found for this user and post."));

        postRepository.updateLikeCount(postId, -1);

        likeRepository.delete(like);
    }

    @Override
    public List<PostResponse> getAllLikesCurrentUser() {
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        List<Like> likes = likeRepository.findAllByLikedUser(user);

        return likes.stream()
                .map(like -> postMapper.mapToPostResponse(like.getLikedPost()))
                .toList();
    }

    @Override
    public List<PostResponse> getAllLikesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        List<Like> likes = likeRepository.findAllByLikedUser(user);

        return likes.stream()
                .map(like -> postMapper.mapToPostResponse(like.getLikedPost()))
                .toList();
    }
    
}
