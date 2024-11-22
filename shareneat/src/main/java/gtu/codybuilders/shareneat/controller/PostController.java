package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.PostRequest;
import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.service.impl.PostServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping(PathConstants.API_POST)
@AllArgsConstructor
public class PostController {

    private final PostServiceImpl postService;

    @PostMapping("/create")
    public ResponseEntity<String> createPost(
            @Valid @ModelAttribute PostRequest postRequest,
            @RequestParam("image") MultipartFile image) {
        postService.save(postRequest, image);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully!");
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
        return ResponseEntity.ok(posts); // Return 200 OK with the list of posts
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get(System.getProperty("user.dir"), "shareneat", "src", "main", "resources", "static", "images", filename);
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Adjust based on file type
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
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
