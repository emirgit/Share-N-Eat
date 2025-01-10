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

@Service
@AllArgsConstructor
public class ImageServiceImpl implements ImageService {

    // THE DIRECTORY MUST BE SPECIFIED WHEN USED IN ANOTHER SERVICE
    @Override
    public String saveImage(MultipartFile file, Path directory) throws IOException {
        Files.createDirectories(directory);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = directory.resolve(fileName);

        Files.write(filePath, file.getBytes());

        return fileName;
    }

    @Override
    public Resource loadImage(String filename, Path directory) {
        try {
            Path filePath = directory.resolve(filename);
            return new UrlResource(filePath.toUri());
        } catch (IOException e) {
            throw new RuntimeException("Could not load image: " + filename);
        }
    }

    @Override
    public byte[] loadImageAsBytes(String filename, Path uploadDir) {
        try {
            Path imagePath = uploadDir.resolve(filename);
            return Files.readAllBytes(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not read image file: " + filename, e);
        }
    }

    @Override
    public void deleteImage(String filename, Path directory) {
        try {
            Path filePath = directory.resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Handle error
        }
    }
}