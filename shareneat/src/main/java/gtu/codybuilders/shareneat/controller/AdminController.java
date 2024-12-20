package gtu.codybuilders.shareneat.controller;


import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.AdminProductRequestService;
import gtu.codybuilders.shareneat.service.ProductService;
import gtu.codybuilders.shareneat.service.impl.UserServiceImpl;
import gtu.codybuilders.shareneat.util.AuthUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {

    private final UserServiceImpl userService;
    private final ProductService productService;
    private final AdminProductRequestService adminProductRequestService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSomething() {

        return ResponseEntity.ok("Trial by combat.");
    }

    @PutMapping("/upgrade/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> upgradeUserToAdmin() {
        Long userId = AuthUtil.getUserId();
        Optional<User> userOptional = userService.findUserById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        if (user.getRole() != Role.ROLE_ADMIN) {
            user.setRole(Role.ROLE_ADMIN);
            userService.saveUser(user);
        }

        return ResponseEntity.ok("User upgraded to admin");
    }


    // Endpoint to upgrade a user to admin
    /*
    @PutMapping("/upgrade/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> upgradeUserToAdmin(@PathVariable Long userId) {
        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        if (user.getRole() != Role.ROLE_ADMIN) {
            user.setRole(Role.ROLE_ADMIN);
            userService.saveUser(user);
        }

        return ResponseEntity.ok("User upgraded to admin");
    }
    */

    //admin product request operations
    @GetMapping("/product-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllProductRequests() {
        return ResponseEntity.ok(adminProductRequestService.getAll());
    }

    //admin product operations
    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequestDTO productRequest, MultipartFile file) {
        productService.createProduct(productRequest,file);
        return ResponseEntity.ok("Product added successfully");
    }

    @PutMapping("/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editProduct(@PathVariable Long productId, @RequestBody ProductRequestDTO productRequest) {
        productService.updateProduct(productRequest, productId);
        return ResponseEntity.ok("Product updated successfully");
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product removed successfully");
    }

    @GetMapping("user/username_{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userService.searchUsers(username, pageable);

        Page<UserProfileDTO> userProfileDTOPage = userPage.map(userService::convertToUserProfileDTO);

        return ResponseEntity.ok(userProfileDTOPage);
    }

    @GetMapping("user/userId_{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.findUserById(userId));
    }

    @GetMapping("users/role_{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(userService.findByRole(role));
    }

    @GetMapping("users/status_{enabled}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByStatus(@PathVariable Boolean enabled) {
        return ResponseEntity.ok(userService.findByEnabled(enabled));
    }

    @PutMapping("user/enable/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> enableUser(@PathVariable Long userId) {
        userService.enableUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("user/disable/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> disableUser(@PathVariable Long userId) {
        userService.disableUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("user/change-role/{userId}/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeUserRole(@PathVariable Long userId, @PathVariable Role role) {
        userService.changeUserRole(userId, role);
        return ResponseEntity.ok().build();
    }

}
