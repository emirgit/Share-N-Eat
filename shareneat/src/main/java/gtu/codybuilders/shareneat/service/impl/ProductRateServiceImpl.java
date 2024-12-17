package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.ProductRate;
import gtu.codybuilders.shareneat.model.Role;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.ProductRateRepository;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.ProductRateService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductRateServiceImpl implements ProductRateService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductRateRepository productRateRepository;

    @Override
    public Double getCurrentUserRate(Long productId) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found with ID - " + productId));

        Optional<ProductRate> existingRate = productRateRepository.findByProductAndUser(product, user);

        return existingRate.map(ProductRate::getRating).orElse(null);
    }


    @Transactional
    public void rateProduct(ProductRateRequestDTO productRateRequestDTO) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        Product product = productRepository.findById(productRateRequestDTO.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found with ID - " + productRateRequestDTO.getProductId()));


        Optional<ProductRate> existingRate = productRateRepository.findByProductAndUser(product, user);

        if (existingRate.isPresent()) {
            ProductRate productRate = existingRate.get();
            double oldRating = productRate.getRating();
            productRate.setRating(productRateRequestDTO.getRating());

            productRateRepository.save(productRate);

            if (user.getRole() == Role.ROLE_USER) {
                product.setAverageRateRegular(calculateUpdatedAverage(product.getAverageRateRegular(), product.getTotalRatersRegular(), oldRating, productRateRequestDTO.getRating()));
            } else {
                product.setAverageRateExpert(calculateUpdatedAverage(product.getAverageRateExpert(), product.getTotalRatersExpert(), oldRating, productRateRequestDTO.getRating()));
            }

        } else {
            ProductRate newRate = mapToProductRate(productRateRequestDTO, product);
            productRateRepository.save(newRate);

            if (user.getRole() == Role.ROLE_USER) {
                product.setTotalRatersRegular(product.getTotalRatersRegular() + 1);
                product.setAverageRateRegular(calculateNewAverage(product.getAverageRateRegular(), product.getTotalRatersRegular(), productRateRequestDTO.getRating()));
            } else {
                product.setTotalRatersExpert(product.getTotalRatersExpert() + 1);
                product.setAverageRateExpert(calculateNewAverage(product.getAverageRateExpert(), product.getTotalRatersExpert(), productRateRequestDTO.getRating()));
            }
        }
        productRepository.save(product);
    }

    @Transactional
    public void unrateProduct(Long productId) {
        Long userId = AuthUtil.getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product Not Found with ID - " + productId));

        Optional<ProductRate> existingRate = productRateRepository.findByProductAndUser(product, user);

        if (existingRate.isPresent()) {
            ProductRate productRate = existingRate.get();
            double oldRating = productRate.getRating();
            productRateRepository.delete(productRate);

            if (user.getRole() == Role.ROLE_USER) {
                product.setTotalRatersRegular(product.getTotalRatersRegular() - 1);
                product.setAverageRateRegular(calculateUpdatedAverageOnUnrate(product.getAverageRateRegular(), product.getTotalRatersRegular(), oldRating));
            } else {
                product.setTotalRatersExpert(product.getTotalRatersExpert() - 1);
                product.setAverageRateExpert(calculateUpdatedAverageOnUnrate(product.getAverageRateExpert(), product.getTotalRatersExpert(), oldRating));
            }
        }
        productRepository.save(product);
    }


    private double calculateUpdatedAverageOnUnrate(Double currentAverage, Integer totalRaters, double oldRating) {
        if (totalRaters == 0) {
            return 0.0; // Reset to 0 if no raters left
        }

        return ((currentAverage * (totalRaters + 1)) - oldRating) / totalRaters;
    }

    private double calculateNewAverage(Double currentAverage, Integer totalRaters, double newRating) {
        if (totalRaters == 1) {
            return newRating;
        }
        return ((currentAverage * (totalRaters - 1)) + newRating) / totalRaters;
    }

    private double calculateUpdatedAverage(Double currentAverage, Integer totalRaters, double oldRating, double newRating) {
        return ((currentAverage * totalRaters) - oldRating + newRating) / totalRaters;
    }

    private ProductRate mapToProductRate(ProductRateRequestDTO productRateRequestDTO, Product product) {
        return ProductRate.builder()
                .rating(productRateRequestDTO.getRating())
                .product(product)
                .user(userRepository.findById(AuthUtil.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found !")))
                .build();
    }


}
