package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.exception.PostNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.mapper.PostMapper;
import gtu.codybuilders.shareneat.model.Post;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.PostRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.PostService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class PostServiceImpl implements PostService{

    private final PostMapper postMapper;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ImageServiceImpl imageService;

    @Override
    public void save(PostRequest postRequest, MultipartFile image) {
        Long userId = AuthUtil.getUserId();
    
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
    
        String imageUrl = null;
    
        if (image != null && !image.isEmpty()) {
            try {
                imageUrl = imageService.saveImage(image, PathConstants.UPLOAD_DIR_POST);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image for post", e);
            }
        } else {
            imageUrl = PathConstants.defaultPostImage;
        }
    
        Post createdPost = postMapper.mapToPost(postRequest, user, imageUrl);
    
        // Increment postsCount
        user.setPostsCount((user.getPostsCount() == null ? 0 : user.getPostsCount()) + 1);
        userRepository.save(user); // Save the updated user
    
        postRepository.save(createdPost); // Save the new post
    }
    
    @Override
    public void delete(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
    
        User user = post.getUser(); // Get the user who owns the post
    
        // Decrement postsCount
        if (user.getPostsCount() != null && user.getPostsCount() > 0) {
            user.setPostsCount(user.getPostsCount() - 1);
        }
        userRepository.save(user); // Save the updated user
    
        postRepository.delete(post); // Delete the post
    }
    

    @Override
    public void update(Long postId, PostRequest postRequest) {
        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));

        existingPost.setPostName(postRequest.getPostName());
        existingPost.setDescription(postRequest.getDescription());
        existingPost.setFat(postRequest.getFat());
        existingPost.setCarbs(postRequest.getCarbs());
        existingPost.setProtein(postRequest.getProtein());
        existingPost.setCalories(postRequest.getCalories());

        postRepository.save(existingPost);
    }

@Override
    public Resource getImage(Long postId){
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id : " + postId));
        return imageService.loadImage(post.getImageUrl(), PathConstants.UPLOAD_DIR_POST);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                             .stream()
                             .map(postMapper::mapToPostResponse)
                             .toList();
    }

    @Override
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId.toString()));
        return postMapper.mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllPostsByUser(String userName) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new UsernameNotFoundException(userName));
        return postRepository.findAllByUser(user)
                             .stream()
                             .map(postMapper::mapToPostResponse)
                             .toList();
    }

    @Override
    public List<PostResponse> getPostsForCurrentUserInRange(int start, int end) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        List<Post> posts = postRepository.findByUserOrderByCreatedDateDesc(user, PageRequest.of(start, end - start));
        return posts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }

    
    @Override
    public List<PostResponse> getPostsForUser() {
        Long userId = AuthUtil.getUserId();
    
        // Step 1: Get the current user
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
        // Step 2: Fetch posts from followeds (limit 2)
        List<Post> followedPosts = postRepository.findPostsByFollowedUsers(currentUser.getUserId(), PageRequest.of(0, 2));
    
        // Step 3: Track selected post IDs to avoid duplicates across all sources
        Set<Long> selectedPostIds = followedPosts.stream()
                .map(Post::getPostId)
                .collect(Collectors.toSet());
    
        // Step 4: Fetch the top 20 highest-rated posts for both regular and expert ratings, and ensure no overlap with followedPosts
        List<Post> topRatedRegularPosts = postRepository.findTop20ByOrderByAverageRateRegularDesc(PageRequest.of(0, 20));
        List<Post> topRatedExpertPosts = postRepository.findTop20ByOrderByAverageRateExpertDesc(PageRequest.of(0, 20));
    
        Collections.shuffle(topRatedRegularPosts);
        Collections.shuffle(topRatedExpertPosts);
    
        List<Post> randomTopRatedRegularPosts = topRatedRegularPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId())) // Only add unique posts
                .limit(2)
                .collect(Collectors.toList());
    
        List<Post> randomTopRatedExpertPosts = topRatedExpertPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId())) // Only add unique posts
                .limit(2)
                .collect(Collectors.toList());
    
        // Step 5: Fetch remaining random posts from the last 100, ensuring no duplicates
        List<Post> recentPosts = postRepository.findTop100ByOrderByCreatedDateDesc();
        Collections.shuffle(recentPosts);
    
        int remainingCount = 10 - followedPosts.size() - randomTopRatedRegularPosts.size() - randomTopRatedExpertPosts.size();
        List<Post> randomPosts = recentPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId())) // Only add unique posts
                .limit(remainingCount)
                .collect(Collectors.toList());
    
        // Combine all posts into a single list
        List<Post> selectedPosts = new ArrayList<>(followedPosts);
        selectedPosts.addAll(randomTopRatedRegularPosts);
        selectedPosts.addAll(randomTopRatedExpertPosts);
        selectedPosts.addAll(randomPosts);
    
        // Map posts to response DTOs
        return selectedPosts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponse> searchPosts(String query) {
        return postRepository.findByPostNameContainingIgnoreCase(query)
                                .stream()
                                .map(postMapper::mapToPostResponse)
                                .collect(Collectors.toList());
    }

    @Override
    public String returnProfilePhoto(){
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        return user.getProfilePictureUrl();
    }
    

}
