package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.exception.FavoriteProductNotFoundException;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.FavoriteProduct;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.User;
import gtu.codybuilders.shareneat.repository.FavoriteProductRepository;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.FavoriteProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FavoriteProductServiceImpl implements FavoriteProductService {

    private final FavoriteProductRepository favoriteProductRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public void addFavoriteProduct(Long productId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
        favoriteProductRepository.save(new FavoriteProduct(user, product));
    }

    @Override
    public void removeFavoriteProduct(Long productId, Long userId) {
        FavoriteProduct favoriteProduct = findFavoriteProduct(productId, userId);
        favoriteProductRepository.delete(favoriteProduct);
    }

    @Override
    public List<FavoriteProduct> getFavoriteProductsOfUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return favoriteProductRepository.findByUser(user).orElseThrow(() -> new FavoriteProductNotFoundException("Favorite product not found with user id: " + userId));
    }

    //helper function
    private FavoriteProduct findFavoriteProduct(Long productId, Long userId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return favoriteProductRepository.findByUserAndProduct(user, product).orElseThrow(() -> new FavoriteProductNotFoundException("Favorite product not found with user id: " + userId + " and product id: " + productId));

    //  User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    //  List<FavoriteProduct> favoriteProducts = favoriteProductRepository.findByUser(user).orElseThrow(() -> new FavoriteProductNotFoundException("Favorite product not found with user id: " + userId));
    //  for (FavoriteProduct favoriteProduct : favoriteProducts)) {
    //  if (favoriteProduct.getProduct().getId().equals(productId)) return favoriteProduct;
    //  }
    }
}
