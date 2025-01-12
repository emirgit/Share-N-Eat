package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.model.AdminProductRequest;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminProductRequestService {

    List<AdminProductRequest> getAll();

    Resource getImage(Long requestId);
    List<Resource> getImages(Long requestId);
    List<byte[]> getImagesAsBytes(Long requestId);
    List<String> getImagesAsBase64(Long requestId);
    void rejectProductRequestAndDelete(Long requestId);
    void approveProductRequestAndCreateProduct(ProductRequestDTO productRequestDTO, MultipartFile file, Long requestId);
}
