package gtu.codybuilders.shareneat.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface ImageService {
    //returns the filename of the saved image
    String saveImage(MultipartFile file, Path directory) throws IOException;
    Resource loadImage(String filename, Path directory);
    void deleteImage(String filename, Path directory);
}