package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.UserProfileDTO;
import gtu.codybuilders.shareneat.dto.UserProfileRequestDTO;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.service.UserService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Value("${default.profile.picture.url}")
    private String defaultProfilePictureUrl;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/my-account")
    public ResponseEntity<UserProfileDTO> getUser() {
        Optional<User> user = userService.findUserById(AuthUtil.getUserId());
        return user.map(u -> ResponseEntity.ok(userService.convertToUserProfileDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/my-account")
    public ResponseEntity<UserProfileDTO> updateUser(@RequestBody UserProfileRequestDTO userProfileRequestDTO) {

        User updatedUser = userService.updateUserProfile(userProfileRequestDTO, AuthUtil.getUserId());
        UserProfileDTO updatedUserProfileDTO = userService.convertToUserProfileDTO(updatedUser);
        return ResponseEntity.ok(updatedUserProfileDTO);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> getUser(@PathVariable Long userId) {
        Optional<User> user = userService.findUserById(userId);
        return user.map(u -> ResponseEntity.ok(userService.convertToUserProfileDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-account/profile-picture")
    public ResponseEntity<Resource> getUserProfilePictureOfCurrentUser() {

        Resource image = userService.getProfilePhoto(AuthUtil.getUserId());
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // Adjust media type if needed
                .body(image);
    }


    @GetMapping("/{userId}/profile-picture")
    public ResponseEntity<Resource> getUserProfilePicture(@PathVariable Long userId) {
        Optional<User> userOptional = userService.findUserById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource image = userService.getProfilePhoto(userId);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // Adjust media type if needed
                .body(image);
    }

    @PutMapping("/my-account/upload-photo")
    public ResponseEntity<String> uploadProfilePhoto(@RequestParam("profilePhoto") MultipartFile file) {
        Optional<User> userOptional = userService.findUserById(AuthUtil.getUserId());
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            String filePath = userService.saveProfilePhoto(userOptional.get(), file);
            return ResponseEntity.ok(filePath); // Return the path or URL of the saved photo
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving profile photo");
        }
    }
}
