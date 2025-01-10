package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.model.AdminProductRequest;
import org.springframework.core.io.Resource;

import java.util.List;

public interface AdminProductRequestService {

    List<AdminProductRequest> getAll();

    Resource getImage(Long requestId);
    List<Resource> getImages(Long requestId);
    List<byte[]> getImagesAsBytes(Long requestId);

    void rejectProductRequestAndDelete(Long requestId);

}
