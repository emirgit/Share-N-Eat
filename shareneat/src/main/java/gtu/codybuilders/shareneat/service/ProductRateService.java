package gtu.codybuilders.shareneat.service;


import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;

import java.util.List;

public interface ProductRateService {

    void rateProduct(ProductRateRequestDTO productRateRequestDTO);

    Double getCurrentUserRate(Long productId);

    void unrateProduct(Long productId);

    List<String> getProductRatersListUsernames(Long productId);
}
