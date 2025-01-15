package gtu.codybuilders.shareneat.controller;


import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.UserManagementDTO;
import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.model.AdminProductRequest;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.AdminProductRequestService;
import gtu.codybuilders.shareneat.service.ProductService;
import gtu.codybuilders.shareneat.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(PathConstants.ADMIN)
@AllArgsConstructor
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserServiceImpl userService;
    private final ProductService productService;
    private final AdminProductRequestService adminProductRequestService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSomething() {
        return ResponseEntity.ok("Trial by combat.");
    }

    //admin product request operations
    @GetMapping("/product-requests")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<AdminProductRequest>> getAllProductRequests() {
        return ResponseEntity.ok(adminProductRequestService.getAll());
    }

    @GetMapping("/product-requests/getImage/{requestId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Resource> getProductRequestImage(@PathVariable Long requestId) {
        return ResponseEntity.ok(adminProductRequestService.getImage(requestId));
    }

    @DeleteMapping("/product-requests/reject/{requestId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> rejectProductRequest(@PathVariable Long requestId) {
        adminProductRequestService.rejectProductRequestAndDelete(requestId);
        return ResponseEntity.ok("Product request rejected successfully");
    }


//    @GetMapping("/product-requests/getImages/{requestId}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<List<Resource>> getProductRequestImages(@PathVariable Long requestId) {
//        List<Resource> images = adminProductRequestService.getImages(requestId);
//        return ResponseEntity.ok(images);
//    }

//    @GetMapping("/product-requests/getImages/{requestId}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<List<byte[]>> getProductRequestImages(@PathVariable Long requestId) {
//        List<Resource> images = adminProductRequestService.getImages(requestId);
//        List<byte[]> imageBytes = images.stream()
//                .map(resource -> {
//                    try {
//                        return resource.getInputStream().readAllBytes();
//                    } catch (IOException e) {
//                        throw new RuntimeException("Error reading image", e);
//                    }
//                })
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(imageBytes);
//    }

//    @GetMapping("/product-requests/getImages/{requestId}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    public ResponseEntity<List<byte[]>> getProductRequestImages(@PathVariable Long requestId) {
//        List<byte[]> images = adminProductRequestService.getImagesAsBytes(requestId);
//        return ResponseEntity.ok(images);
//    }

    @GetMapping("/product-requests/getImages/{requestId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<String>> getProductRequestImages(@PathVariable Long requestId) {
        List<String> images = adminProductRequestService.getImagesAsBase64(requestId);
        return ResponseEntity.ok(images);
    }


    //admin product operations
    @PostMapping(path = "/products", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequestDTO productRequest, MultipartFile file) {
        productService.createProduct(productRequest,file);
        return ResponseEntity.ok("Product added successfully");
    }

    @PostMapping(path = "/approve-product-request/{requestId}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseStatus(code = HttpStatus.CREATED)
    public ResponseEntity<?> approveProductRequest(@Valid @ModelAttribute ProductRequestDTO productRequestDTO,@RequestPart(value = "file", required = false) MultipartFile file, @PathVariable Long requestId) {
        adminProductRequestService.approveProductRequestAndCreateProduct(productRequestDTO, file, requestId);
        return ResponseEntity.ok("Product request approved successfully");
    }


    @PutMapping("/products/{productId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> editProduct(@PathVariable Long productId, @RequestBody ProductRequestDTO productRequest) {
        productService.updateProduct(productRequest, productId);
        return ResponseEntity.ok("Product updated successfully");
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> removeProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product removed successfully");
    }

    @GetMapping("user/username_{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.findUserById(userId));
    }

    @GetMapping("users/role_{role}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(userService.findByRole(role));
    }

    @GetMapping("users/status_{enabled}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByStatus(@PathVariable Boolean enabled) {
        return ResponseEntity.ok(userService.findByEnabled(enabled));
    }

    @PutMapping("user/change-role/{username}/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeUserRole(@PathVariable String username, @PathVariable String role) {
        Role mappedRole;
        switch (role.toLowerCase()) {
            case "admin":
                mappedRole = Role.ROLE_ADMIN;
                break;
            case "expert":
                mappedRole = Role.ROLE_EXPERT;
                break;
            case "user":
                mappedRole = Role.ROLE_USER;
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid role: " + role);
        }

        userService.changeUserRole(username, mappedRole);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("user/delete/{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String username){
        userService.deleteUserByUsername(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/user/ban/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> banUser(@PathVariable String username) {
        userService.banUser(username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/unban/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unbanUser(@PathVariable String username) {
        userService.unbanUser(username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset/password/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> forgotPassword(@PathVariable String email) {
        try {

            // Generate a password reset token
            String token = userService.createPasswordResetToken(email);

            System.out.println(token);
            String resetLink = "http://localhost:3000/auth/reset/password?token=" + token;
            return ResponseEntity.ok(resetLink);

        }
        catch (Exception e) {
            // Log any unexpected errors
            logger.error("An unexpected error occurred during password reset request for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred. Please try again later.");
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserManagementDTO>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<UserManagementDTO> users = userService.getUsersForManagement(search, role, status, pageable);
        return ResponseEntity.ok(users);
    }
}
