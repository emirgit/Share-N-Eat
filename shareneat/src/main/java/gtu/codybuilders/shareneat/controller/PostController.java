package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.service.impl.PostServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
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
    public ResponseEntity<Void> updatePost(@PathVariable Long postId, @RequestBody PostRequest postRequest) {
        postService.update(postId, postRequest);
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
    public ResponseEntity<List<PostResponse>> getPostsForCurrentUserInRange(@RequestParam int page) {
        List<PostResponse> posts = postService.getPostsForCurrentUserInRange(page);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    //user profile page feed
    @GetMapping(PathConstants.BY_USER_USERNAME_RANGE)
    public ResponseEntity<List<PostResponse>> getPostsByUsernameInRange(@PathVariable String username, @RequestParam int page) {
        List<PostResponse> posts = postService.getPostsByUsernameInRange(username, page);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


    @GetMapping(PathConstants.CURRENT_USER)
    public ResponseEntity<List<PostResponse>> getPostsForUser() {
        List<PostResponse> posts = postService.getPostsForUser();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping(PathConstants.FILTER)
    public ResponseEntity<List<PostResponse>> filterPosts(@RequestParam Map<String, String> filters){
        List<PostResponse> posts = postService.filterPosts(filters);
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
