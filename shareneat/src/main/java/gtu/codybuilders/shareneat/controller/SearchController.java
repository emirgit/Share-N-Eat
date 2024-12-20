package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.PostResponse;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.PostService;
import gtu.codybuilders.shareneat.service.ProductService;
import gtu.codybuilders.shareneat.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@AllArgsConstructor
public class SearchController {

    private final UserService userService;
    private final PostService postService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> getUserOrPostOrProduct(
            @RequestParam String param,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        if ("user".equalsIgnoreCase(param)) {
            Page<User> userPage = userService.searchUsers(query, pageable);
            Page<UserProfileDTO> userProfileDTOPage = userPage.map(userService::convertToUserProfileDTO);
            return ResponseEntity.ok(userProfileDTOPage);

        } else if ("post".equalsIgnoreCase(param)) {
            Page<PostResponse> postPage = postService.searchPosts(query, pageable);
            return ResponseEntity.ok(postPage);

        } else if ("product".equalsIgnoreCase(param)) {
            Page<ProductResponseDTO> productPage = productService.searchProducts(query, pageable);
            return ResponseEntity.ok(productPage);

        } else {
            return ResponseEntity.badRequest().body("Invalid search parameter. Use 'user', 'post', or 'product'.");
        }
    }

}
