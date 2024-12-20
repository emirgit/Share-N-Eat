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
import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static gtu.codybuilders.shareneat.constant.FunctionalConstants.*;

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
    public List<PostResponse> getPostsByUsernameInRange(String username, int page) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<Post> posts = postRepository.findByUserOrderByCreatedDateDesc(user, PageRequest.of(page, PROFILE_PAGE_POST_LOAD_SIZE));

        return posts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponse> getPostsForCurrentUserInRange(int page) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        List<Post> posts = postRepository.findByUserOrderByCreatedDateDesc(user, PageRequest.of(page, PROFILE_PAGE_POST_LOAD_SIZE));
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
        List<Post> followedPosts = postRepository.findPostsByFollowedUsers(currentUser.getUserId(), PageRequest.of(0, MAIN_PAGE_POST_LOAD_FROM_FOLLOWED_SIZE));
    
        // Step 3: Track selected post IDs to avoid duplicates across all sources
        Set<Long> selectedPostIds = followedPosts.stream()
                .map(Post::getPostId)
                .collect(Collectors.toSet());
    
        // Step 4: Fetch the top 20 highest-rated posts for both regular and expert ratings, and ensure no overlap with followedPosts
        List<Post> topRatedRegularPosts = postRepository.findTop20ByOrderByAverageRateRegularDesc(PageRequest.of(0, 20)); //HARD CODED 20 FOR NOW
        List<Post> topRatedExpertPosts = postRepository.findTop20ByOrderByAverageRateExpertDesc(PageRequest.of(0, 20)); //HARD CODED 20 FOR NOW
    
        Collections.shuffle(topRatedRegularPosts);
        Collections.shuffle(topRatedExpertPosts);
    
        List<Post> randomTopRatedRegularPosts = topRatedRegularPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId())) // Only add unique posts
                .limit(MAIN_PAGE_POST_LOAD_RANDOM_MOST_RATED_REGULAR_SIZE)
                .collect(Collectors.toList());
    
        List<Post> randomTopRatedExpertPosts = topRatedExpertPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId())) // Only add unique posts
                .limit(MAIN_PAGE_POST_LOAD_RANDOM_MOST_RATED_EXPERT_SIZE)
                .collect(Collectors.toList());
    
        // Step 5: Fetch remaining random posts from the last 100, ensuring no duplicates
        List<Post> recentPosts = postRepository.findTop100ByOrderByCreatedDateDesc();
        Collections.shuffle(recentPosts);
    
        int remainingCount = MAIN_PAGE_POST_LOAD_SIZE - followedPosts.size() - randomTopRatedRegularPosts.size() - randomTopRatedExpertPosts.size();
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

    public Page<PostResponse> searchPosts(String query, Pageable pageable) {
        return postRepository.findByPostNameContainingIgnoreCase(query, pageable)
                .map(postMapper::mapToPostResponse);
    }

    @Override
    public String returnProfilePhoto(){
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));
        return user.getProfilePictureUrl();
    }

    @Override
    public Long getPostsCount(){
        return postRepository.count();
    }

    /*
        the same algorithm with filterProducts method in ProductServiceImpl.
        but only the difference is the mapper object, postMapper instead of modelMapper.
        so, filterProduct method in ProductServiceImpl tested and filterPosts method should work correctly.
        note: if it is not working correctly, the problem is not about the algorithm probably, it is about the mapper object.

        THIS IS THE EXACT MATCH FILTER

    @Override
    public List<PostResponse> filterPosts(Map<String, String> filters){
        Specification<Post> spec = Specification.where(null);

        for (Map.Entry<String, String> filter : filters.entrySet()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(filter.getKey()), filter.getValue()));
        }

        List<Post> posts = postRepository.findAll(spec);
        return posts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }
    */

    //THIS IS THE ENCHANTED FILTER
    @Override
    public List<PostResponse> filterPosts(Map<String, String> filters) {
        Specification<Post> spec = Specification.where(null);

        for (Map.Entry<String, String> filter : filters.entrySet()) {
            switch (filter.getKey()) {
                case "trending":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThan(root.get("likeCount"), Integer.parseInt(filter.getValue())));
                    break;
                case "following":
                    Long userId = AuthUtil.getUserId();
                    spec = spec.and((root, query, criteriaBuilder) -> {
                        Join<Post, User> userJoin = root.join("user");
                        return criteriaBuilder.equal(userJoin.get("userId"), userId);
                    });
                    break;
                case "mostRecent":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThan(root.get("createdDate"), Instant.now().minusSeconds(Long.parseLong(filter.getValue()))));
                    break;
                case "minCarbs":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(root.get("carbs"), Integer.parseInt(filter.getValue())));
                    break;
                case "maxCarbs":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.lessThanOrEqualTo(root.get("carbs"), Integer.parseInt(filter.getValue())));
                    break;
                case "minProtein":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(root.get("protein"), Integer.parseInt(filter.getValue())));
                    break;
                case "minFat":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(root.get("fat"), Integer.parseInt(filter.getValue())));
                    break;
                case "maxFat":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.lessThanOrEqualTo(root.get("fat"), Integer.parseInt(filter.getValue())));
                    break;
                case "minCalories":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(root.get("calories"), Integer.parseInt(filter.getValue())));
                    break;
                case "maxCalories":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.lessThanOrEqualTo(root.get("calories"), Integer.parseInt(filter.getValue())));
                    break;
                case "minAverageRateExpert":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(root.get("averageRateExpert"), Double.parseDouble(filter.getValue())));
                    break;
                case "minAverageRateRegular":
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.greaterThanOrEqualTo(root.get("averageRateRegular"), Double.parseDouble(filter.getValue())));
                    break;

                default:
                    spec = spec.and((root, query, criteriaBuilder) ->
                            criteriaBuilder.equal(root.get(filter.getKey()), filter.getValue()));
                    break;
            }
        }

        List<Post> posts = postRepository.findAll(spec);
        return posts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }

    

}
