package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;

import java.util.List;

public interface ProductService {

    List<ProductResponseDTO> getAll();

    void createProduct(ProductRequestDTO productRequestDTO);

    void deleteProduct(long productId);

    void updateProduct(ProductRequestDTO productRequestDTO, long productId);

    ProductResponseDTO getProductById(long productId);

    List<ProductResponseDTO> getSortedProducts(String criteria, String asc);
}
