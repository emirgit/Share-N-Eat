package gtu.codybuilders.shareneat.controller;


import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.ProductService;
import gtu.codybuilders.shareneat.service.impl.UserServiceImpl;
import gtu.codybuilders.shareneat.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserServiceImpl userService;
    private final ProductService productService;

    public AdminController(UserServiceImpl userService, ProductService productService) {
        this.userService = userService;
        this.productService = productService;
    }

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

    //admin product operations

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequestDTO productRequest) {
        productService.createProduct(productRequest);
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


}
