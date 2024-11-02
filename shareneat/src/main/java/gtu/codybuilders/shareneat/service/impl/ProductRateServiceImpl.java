package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.ProductRateService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductRateServiceImpl implements ProductRateService {

    private final ProductRateService productRateService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    @Transactional
    public void rateProduct(ProductRateRequestDTO productRateRequestDTO) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        Product product = productRepository.findById(productRateRequestDTO.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found with ID - " + productRateRequestDTO.getProductId()));






    }




}
