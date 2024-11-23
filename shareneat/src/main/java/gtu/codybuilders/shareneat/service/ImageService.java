package gtu.codybuilders.shareneat.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {
    String saveImage(MultipartFile file) throws IOException;
    Resource loadImage(String filename);
    void deleteImage(String filename);
}