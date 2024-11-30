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
import gtu.codybuilders.shareneat.service.impl.ShareServiceImpl;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/shares")
@AllArgsConstructor
public class ShareController {

    private final ShareServiceImpl shareService;

    @PostMapping("/{postId}")
    public ResponseEntity<Void> createShare(@PathVariable Long postId) {
        shareService.save(postId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deleteShare(@PathVariable Long postId) {
        shareService.delete(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getSharesCurrentUser() {
        List<PostResponse> posts = shareService.getAllSharesCurrentUser();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<PostResponse>> getSharesByUser(@PathVariable Long userId) {
        List<PostResponse> posts = shareService.getAllSharesByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

}
