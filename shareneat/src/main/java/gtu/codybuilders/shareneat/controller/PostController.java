package gtu.codybuilders.shareneat.controller;

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
@RequestMapping("api/posts")
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

    @GetMapping("/getImage/{posttId}")
    public ResponseEntity<Resource> getImage(@PathVariable Long postId){
        Resource image = postService.getImage(postId);
        return ResponseEntity.ok(image);
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

    @GetMapping("/filter")
    public ResponseEntity<List<PostResponse>> filterPosts(@RequestParam Map<String, String> filters){
        List<PostResponse> posts = postService.filterPosts(filters);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


}
