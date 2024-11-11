package gtu.codybuilders.shareneat.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.service.impl.PostServiceImpl;
import lombok.AllArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("api/posts")
@AllArgsConstructor
public class PostController {

    private final PostServiceImpl postService;

    @PostMapping
    public ResponseEntity<Void> createPost(@RequestBody PostRequest postRequest) {
        postService.save(postRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.delete(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Void> updatePost(@PathVariable Long postId, @RequestBody PostRequest postRequest) {
        postService.update(postId, postRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        PostResponse postResponse = postService.getPostById(postId);
        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @GetMapping("/by-user/{username}")
    public ResponseEntity<List<PostResponse>> getPostsByUsername(@PathVariable String username) {
        List<PostResponse> posts = postService.getAllPostsByUser(username);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/current-user/range")
    public ResponseEntity<List<PostResponse>> getPostsForCurrentUserInRange(@RequestParam int start, @RequestParam int end) {
        List<PostResponse> posts = postService.getPostsForCurrentUserInRange(start, end);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/current-user")
    public ResponseEntity<List<PostResponse>> getPostsForUser() {
        List<PostResponse> posts = postService.getPostsForUser();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
}
