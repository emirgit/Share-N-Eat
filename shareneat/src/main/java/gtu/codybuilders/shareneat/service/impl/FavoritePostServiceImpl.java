package gtu.codybuilders.shareneat.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import gtu.codybuilders.shareneat.dto.FavoritePostDto;
import gtu.codybuilders.shareneat.exception.FavoritePostNotFound;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.FavoritePost;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.FavoritePostRepository;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.FavoritePostService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class FavoritePostServiceImpl implements FavoritePostService{
    
    private final FavoritePostRepository favoritePostRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public void addFavoritePost(Long postId){
        Long userId = AuthUtil.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Follower not found !"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found !"));

        favoritePostRepository.save(new FavoritePost(user, post));
    }

    @Override
    public void removeFavoritePost(Long favoritePostId) {
        FavoritePost favoritePost = favoritePostRepository.findById(favoritePostId)
                .orElseThrow(() -> new FavoritePostNotFound("Favorite post not found for the specified user and post ID!"));
        favoritePostRepository.delete(favoritePost);
    }       

        
    @Override
    public List<FavoritePostDto> getFavoritePostsOfUser() {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        
        return favoritePostRepository.findByUser(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FavoritePostDto> getFavoritePostsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        
        return favoritePostRepository.findByUser(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private FavoritePostDto mapToDto(FavoritePost favoritePost) {
        return FavoritePostDto.builder()
                .postId(favoritePost.getPost().getPostId())
                .username(favoritePost.getUser().getUsername())
                .build();
    }

}
