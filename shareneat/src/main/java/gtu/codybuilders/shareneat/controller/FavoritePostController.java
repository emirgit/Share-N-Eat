package gtu.codybuilders.shareneat.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import gtu.codybuilders.shareneat.dto.FavoritePostDto;
import gtu.codybuilders.shareneat.service.FavoritePostService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/favoritePosts")
@AllArgsConstructor
public class FavoritePostController {
    private final FavoritePostService favoritePostService;

    @PostMapping("/add/{postId}")
    public ResponseEntity<Void> addFavoritePost(@PathVariable Long postId) {
        favoritePostService.addFavoritePost(postId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{postId}")
    public ResponseEntity<Void> removeFavoritePost(@PathVariable Long postId) {
        favoritePostService.removeFavoritePost(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/current-user")
    public ResponseEntity<List<FavoritePostDto>> getFavoritePost() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(favoritePostService.getFavoritePostsOfUser());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoritePostDto>> getFavoritePostsByUserId(@PathVariable Long userId) {
        List<FavoritePostDto> favoritePosts = favoritePostService.getFavoritePostsByUserId(userId);
        return ResponseEntity.ok(favoritePosts);
    }

}
