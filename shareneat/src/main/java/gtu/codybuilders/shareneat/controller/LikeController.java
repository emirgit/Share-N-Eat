package gtu.codybuilders.shareneat.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.service.impl.LikeServiceImpl;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/likes")
@AllArgsConstructor
public class LikeController {

    private final LikeServiceImpl likeService;

    @PostMapping("/{postId}")
    public ResponseEntity<Void> createLike(@PathVariable Long postId) {
        likeService.save(postId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deleteLike(@PathVariable Long postId) {
        likeService.delete(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getLikesCurrentUser() {
        List<PostResponse> posts = likeService.getAllLikesCurrentUser();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<PostResponse>> getLikesByUser(@PathVariable Long userId) {
        List<PostResponse> posts = likeService.getAllLikesByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
}
