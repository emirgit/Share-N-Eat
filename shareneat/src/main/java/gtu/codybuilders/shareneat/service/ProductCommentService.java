package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;

import java.util.List;

public interface ProductCommentService {

    List<ProductCommentResponseDTO> getAllProductCommentsOfProduct(long productId);

    void createProductComment(ProductRequestDTO productRequestDTO);

    void deleteProductComment(long productId);

    void updateProductComment(long productId, ProductRequestDTO productRequestDTO);



}
