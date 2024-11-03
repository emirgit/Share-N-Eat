package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.UserService;
import gtu.codybuilders.shareneat.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@AllArgsConstructor
public class SearchController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping
    public ResponseEntity<?> getUserOrPost(@RequestParam String param, @RequestParam String query) {
        if ("user".equalsIgnoreCase(param)) {
            // Call user search method
            List<User> users = userService.searchUsers(query);
            return ResponseEntity.ok(users);
        } else if ("post".equalsIgnoreCase(param)) {
            // Call post search method
            List<PostResponse> posts = postService.searchPosts(query);
            return ResponseEntity.ok(posts);
        } else {
            return ResponseEntity.badRequest().body("Invalid search parameter. Use 'user' or 'post'.");
        }
    }
}
