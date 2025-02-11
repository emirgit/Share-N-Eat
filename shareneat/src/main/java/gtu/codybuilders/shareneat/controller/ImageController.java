package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@AllArgsConstructor
public class ImageController {

    private final ImageService imageService;


    //will be removed later for security reasons
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageName = imageService.saveImage(file, PathConstants.UPLOAD_DIR_DEFAULT);
            return ResponseEntity.ok(imageName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving image");
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        Resource image = imageService.loadImage(filename,PathConstants.UPLOAD_DIR_DEFAULT);

        if (image.exists() && image.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Adjust media type if needed
                    .body(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<Void> deleteImage(@PathVariable String filename) {
        imageService.deleteImage(filename,PathConstants.UPLOAD_DIR_DEFAULT);
        return ResponseEntity.ok().build();
    }
}