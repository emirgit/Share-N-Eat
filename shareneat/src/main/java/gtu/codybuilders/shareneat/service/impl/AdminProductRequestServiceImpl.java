package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.model.AdminProductRequest;
import gtu.codybuilders.shareneat.repository.AdminProductRequestRepository;
import gtu.codybuilders.shareneat.service.AdminProductRequestService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminProductRequestServiceImpl implements AdminProductRequestService {

    private final AdminProductRequestRepository adminProductRequestRepository;

    @Override
    public List<AdminProductRequest> getAll() {
        return adminProductRequestRepository.findAll();
    }



}
