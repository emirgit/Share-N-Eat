package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.model.AdminProductRequest;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.repository.AdminProductRequestRepository;
import gtu.codybuilders.shareneat.service.AdminProductRequestService;
import gtu.codybuilders.shareneat.service.ImageService;
import gtu.codybuilders.shareneat.service.ProductService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AdminProductRequestServiceImpl implements AdminProductRequestService {

    private final AdminProductRequestRepository adminProductRequestRepository;
    private final ImageService imageService;
    private final ModelMapper modelMapper;
    private final ProductService productService;

    @Override
    public List<AdminProductRequest> getAll() {
        return adminProductRequestRepository.findAll();
    }

    @Override
    public Resource getImage(Long requestId) {
        AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
        return imageService.loadImage(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
    }

    @Override
    public List<Resource> getImages(Long requestId) {
        AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
        List<Resource> images = new ArrayList<>();
        images.add(imageService.loadImage(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST));
        images.add(imageService.loadImage(adminProductRequest.getContentImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST));
        images.add(imageService.loadImage(adminProductRequest.getMacrotableImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST));
        return images;
    }

    @Override
    public List<byte[]> getImagesAsBytes(Long requestId) {
        AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
        List<byte[]> images = List.of(
                imageService.loadImageAsBytes(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST),
                imageService.loadImageAsBytes(adminProductRequest.getContentImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST),
                imageService.loadImageAsBytes(adminProductRequest.getMacrotableImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST)
        );
        return images;
    }

    @Override
    public List<String> getImagesAsBase64(Long requestId) {
        AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
        List<byte[]> images = List.of(
                imageService.loadImageAsBytes(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST),
                imageService.loadImageAsBytes(adminProductRequest.getContentImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST),
                imageService.loadImageAsBytes(adminProductRequest.getMacrotableImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST)
        );
        return images.stream()
                .map(Base64.getEncoder()::encodeToString)
                .collect(Collectors.toList());
    }

    @Override
    public void rejectProductRequestAndDelete(Long requestId) {
        AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
        imageService.deleteImage(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
        imageService.deleteImage(adminProductRequest.getContentImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
        imageService.deleteImage(adminProductRequest.getMacrotableImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
        adminProductRequestRepository.deleteById(requestId);
    }

    @Override
    public void approveProductRequestAndCreateProduct(ProductRequestDTO productRequestDTO, MultipartFile file, Long requestId) {

        if (file == null) {
            try {
                AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
                String imageUrl = imageService.moveImage(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST, PathConstants.UPLOAD_DIR_PRODUCT);
                imageService.deleteImage(adminProductRequest.getContentImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
                imageService.deleteImage(adminProductRequest.getMacrotableImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
                productRequestDTO.setImageUrl(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Error saving image", e);
            }
        }else {
            try {
                String fileName = imageService.saveImage(file, PathConstants.UPLOAD_DIR_PRODUCT);
                productRequestDTO.setImageUrl(fileName);
            } catch (Exception e) {
                throw new RuntimeException("Error saving image", e);
            }
        }
        productService.adminCreateProduct(modelMapper.map(productRequestDTO, Product.class));
        adminProductRequestRepository.deleteById(requestId);
    }


}
