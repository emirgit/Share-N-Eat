package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.NutritionFilterDto;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.service.impl.PostServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(PathConstants.POSTS)
@AllArgsConstructor
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    private final PostServiceImpl postService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> createPost(
        @Valid @ModelAttribute PostRequest postRequest,  // JSON part
        @RequestParam("image") MultipartFile image             // File part
    ) {
        postService.save(postRequest, image);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
    @DeleteMapping(PathConstants.POST_ID)
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.delete(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(PathConstants.POST_ID)
    public ResponseEntity<Void> updatePost(
        @PathVariable Long postId, 
        @Valid @ModelAttribute PostRequest postRequest, 
        @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        postService.update(postId, postRequest, image);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(PathConstants.GET_IMAGE_BY_POST_ID)
    public ResponseEntity<Resource> getImage(@PathVariable Long postId){
        Resource image = postService.getImage(postId);
        return ResponseEntity.ok(image);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping(PathConstants.POST_ID)
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        PostResponse postResponse = postService.getPostById(postId);
        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @GetMapping(PathConstants.BY_USER_USERNAME)
    public ResponseEntity<List<PostResponse>> getPostsByUsername(@PathVariable String username) {
        List<PostResponse> posts = postService.getAllPostsByUser(username);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    //current user profile page feed
    @GetMapping(PathConstants.CURRENT_USER_RANGE)
    public ResponseEntity<List<PostResponse>> getPostsForCurrentUserInRange(
            @RequestParam int page,
            @RequestParam int size) {
        List<PostResponse> posts = postService.getPostsForCurrentUserInRange(page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


    //user profile page feed
    @GetMapping(PathConstants.BY_USER_USERNAME_RANGE)
    public ResponseEntity<List<PostResponse>> getPostsByUsernameInRange(
            @PathVariable String username,
            @RequestParam int page,
            @RequestParam int size) {
        List<PostResponse> posts = postService.getPostsByUsernameInRange(username, page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


    @GetMapping(PathConstants.CURRENT_USER_TRENDINGS)
    public ResponseEntity<Page<PostResponse>> getPostsForUserTrendings(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
            Pageable pageable = PageRequest.of(page, size);
            Page<PostResponse> posts = postService.getPostsForUserTrendings(pageable);
            return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping(PathConstants.CURRENT_USER_FOLLOWINGS)
    public ResponseEntity<Page<PostResponse>> getPostsForUserFollowings(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
            Page<PostResponse> posts = postService.getPostsForUserFollowings(pageable);
            return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping(PathConstants.FILTER)
    public ResponseEntity<List<PostResponse>> filterPosts(@RequestParam Map<String, String> filters){
        List<PostResponse> posts = postService.filterPosts(filters);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping(PathConstants.FIND_YOUR_MEAL)
    public ResponseEntity<Page<PostResponse>> findYourMeal(
        @Valid @ModelAttribute NutritionFilterDto nutritionFilterDto,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        logger.info(nutritionFilterDto.toString());
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<PostResponse> posts = postService.findYourMeal(nutritionFilterDto, pageable);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping(PathConstants.COUNT)
    public ResponseEntity<Long> getPostsCount() {
        Long postCount = postService.getPostsCount();
        return new ResponseEntity<>(postCount, HttpStatus.OK);
    }

    @GetMapping(PathConstants.DAILY_COUNT)
    public ResponseEntity<Long> getDailyPostsCount() {
        Long postCount = postService.getDailyPostCount();
        return new ResponseEntity<>(postCount, HttpStatus.OK);
    }
}
