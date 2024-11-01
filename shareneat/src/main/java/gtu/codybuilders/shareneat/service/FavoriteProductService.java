package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.model.FavoriteProduct;

import java.util.List;

public interface FavoriteProductService {

    void addFavoriteProduct(Long productId, Long userId);

    void removeFavoriteProduct(Long productId, Long userId);

    List<FavoriteProduct> getFavoriteProductsOfUser(Long userId);
}
