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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    public List<PostResponse> getPostsByUsernameInRange(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Fetch posts for the specified user with pagination
        List<Post> posts = postRepository.findByUserOrderByCreatedDateDesc(user, PageRequest.of(page, size));

        // Map posts to PostResponse objects
        return posts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<PostResponse> getPostsForCurrentUserInRange(int page, int size) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        // Fetch posts for the user with pagination
        List<Post> posts = postRepository.findByUserOrderByCreatedDateDesc(user, PageRequest.of(page, size));

        // Map posts to PostResponse objects
        return posts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }

/* 
    @Override
    public List<PostResponse> getPostsForUserTrendings(Pageable pageable) {
        Long userId = AuthUtil.getUserId();
    
        // Step 1: Get the current user
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));
    
        // Track selected post IDs to avoid duplicates
        Set<Long> selectedPostIds = new HashSet<>();
        
        //Track the posts that are already selected based on pageable
        int mainPageSize = pageable.getPageSize();
        int mainPageNumber = pageable.getPageNumber();

        // Step 2: Fetch most liked posts
        // Calculate the offset dynamically based on the main pageable's pageNumber
        Pageable mostLikedPageable = PageRequest.of(mainPageNumber, 20); // Offset depends on main pageable
        List<Post> mostLikedPosts = postRepository.findTop20ByOrderByLikeCountDesc(mostLikedPageable);
    
        Collections.shuffle(mostLikedPosts);
        List<Post> selectedMostLikedPosts = mostLikedPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId()))
                .limit(MAIN_PAGE_POST_LOAD_RANDOM_MOST_LIKED_SIZE) // Pick 2 posts
                .collect(Collectors.toList());
    
        // Step 3: Fetch top rated posts (regular and expert)
        Pageable topRatedPageable = PageRequest.of(mainPageNumber, 20); // Adjusted based on main pageable
        List<Post> topRatedRegularPosts = postRepository.findTop20ByOrderByAverageRateRegularDesc(topRatedPageable);
        List<Post> topRatedExpertPosts = postRepository.findTop20ByOrderByAverageRateExpertDesc(topRatedPageable);
    
        Collections.shuffle(topRatedRegularPosts);
        Collections.shuffle(topRatedExpertPosts);
    
        List<Post> randomTopRatedRegularPosts = topRatedRegularPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId()))
                .limit(MAIN_PAGE_POST_LOAD_RANDOM_MOST_RATED_REGULAR_SIZE) // Pick 2 post
                .collect(Collectors.toList());
    
        List<Post> randomTopRatedExpertPosts = topRatedExpertPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId()))
                .limit(MAIN_PAGE_POST_LOAD_RANDOM_MOST_RATED_EXPERT_SIZE) // Pick 2 post
                .collect(Collectors.toList());
    
        // Step 4: Fetch remaining random posts
        List<Post> recentPosts = postRepository.findTop100ByOrderByCreatedDateDesc();
        Collections.shuffle(recentPosts);
    
        int totalSelectedSize = selectedMostLikedPosts.size() + randomTopRatedRegularPosts.size() + randomTopRatedExpertPosts.size();
        int remainingCount = mainPageSize - totalSelectedSize;
    
        List<Post> randomPosts = recentPosts.stream()
                .filter(post -> selectedPostIds.add(post.getPostId()))
                .limit(Math.max(remainingCount, 0)) // Ensure no negative limit
                .collect(Collectors.toList());
    
        // Combine all posts
        List<Post> selectedPosts = new ArrayList<>(selectedMostLikedPosts);
        selectedPosts.addAll(randomTopRatedRegularPosts);
        selectedPosts.addAll(randomTopRatedExpertPosts);
        selectedPosts.addAll(randomPosts);
        Collections.shuffle(selectedPosts);
    
        // Map posts to response DTOs
        return selectedPosts.stream()
                .map(postMapper::mapToPostResponse)
                .collect(Collectors.toList());
    }
*/

    @Override
    public Page<PostResponse> getPostsForUserTrendings(Pageable pageable) {
        Long userId = AuthUtil.getUserId();
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found!"));

        // Fetch posts sorted by likeCount, averageRateRegular, and averageRateExpert
        Page<Post> posts = postRepository.findAllByOrderByLikeCountDescAverageRateRegularDescAverageRateExpertDesc(pageable);

        // Map to PostResponse DTOs
        List<PostResponse> postResponses = posts.getContent().stream()
            .map(postMapper::mapToPostResponse)
            .collect(Collectors.toList());

        // Return as Page
        return new PageImpl<>(postResponses, pageable, posts.getTotalElements());
    }


    @Override
    public Page<PostResponse> getPostsForUserFollowings(Pageable pageable) {
        Long userId = AuthUtil.getUserId();
        User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return postRepository.findPostsByFollowedUsers(userId, pageable)
                .map(postMapper::mapToPostResponse);
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

    @Override
    public Long getDailyPostCount(){
        Instant startOfDay = Instant.now().truncatedTo(ChronoUnit.DAYS); // Start of today
        Instant endOfDay = startOfDay.plus(1, ChronoUnit.DAYS); // End of today
        return postRepository.countPostsCreatedBetween(startOfDay, endOfDay);
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
