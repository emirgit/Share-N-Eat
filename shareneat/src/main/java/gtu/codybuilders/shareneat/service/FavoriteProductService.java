package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.ProductResponseDTO;

import java.util.List;

public interface FavoriteProductService {

    void addFavoriteProduct(Long productId);

    void removeFavoriteProduct(Long productId);

    List<ProductResponseDTO> getFavoriteProductsOfUser();
}
