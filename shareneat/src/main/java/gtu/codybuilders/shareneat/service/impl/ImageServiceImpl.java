package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@AllArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "src", "main", "resources", "static", "images");

    @Override
    public String saveImage(MultipartFile file) throws IOException {
        Files.createDirectories(UPLOAD_DIR);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = UPLOAD_DIR.resolve(fileName);

        Files.write(filePath, file.getBytes());

        return fileName;
    }

    @Override
    public Resource loadImage(String filename) {
        try {
            Path filePath = UPLOAD_DIR.resolve(filename);
            return new UrlResource(filePath.toUri());
        } catch (IOException e) {
            return null;
        }
    }

    @Override
    public void deleteImage(String filename) {
        try {
            Path filePath = UPLOAD_DIR.resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Handle error
        }
    }
}