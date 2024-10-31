package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.ProductCommentRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;

import java.util.List;

public interface ProductCommentService {

    List<ProductCommentResponseDTO> getAllProductCommentsOfProduct(long productId);

    void createProductComment(ProductCommentRequestDTO productCommentRequestDTO);

    void deleteProductComment(long productCommentId);

    void updateProductComment(long productId, ProductCommentRequestDTO productCommentRequestDTO);

}
