package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.model.AdminProductRequest;
import gtu.codybuilders.shareneat.repository.AdminProductRequestRepository;
import gtu.codybuilders.shareneat.service.AdminProductRequestService;
import gtu.codybuilders.shareneat.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminProductRequestServiceImpl implements AdminProductRequestService {

    private final AdminProductRequestRepository adminProductRequestRepository;
    private final ImageService imageService;

    @Override
    public List<AdminProductRequest> getAll() {
        return adminProductRequestRepository.findAll();
    }

    @Override
    public Resource getImage(Long requestId) {
        AdminProductRequest adminProductRequest = adminProductRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Admin product request not found with id : " + requestId));
        return imageService.loadImage(adminProductRequest.getImageUrl(), PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
    }


}
