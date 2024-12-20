package gtu.codybuilders.shareneat.service;


import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;

public interface ProductRateService {

    void rateProduct(ProductRateRequestDTO productRateRequestDTO);

    Double getCurrentUserRate(Long productId);

    void unrateProduct(Long productId);
}
