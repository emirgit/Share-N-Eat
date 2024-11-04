package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductCommentRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;
import gtu.codybuilders.shareneat.exception.ProductCommentNotFoundException;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.ProductComment;
import gtu.codybuilders.shareneat.repository.ProductCommentRepository;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.ProductCommentService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductCommentServiceImpl implements ProductCommentService {

    private final ProductCommentRepository productCommentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    @Override
    public List<ProductCommentResponseDTO> getAllProductCommentsOfProduct(long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));
        List<ProductComment> productComments = productCommentRepository.findAllByProduct(product);

        return productComments.stream().map(productComment -> {
            ProductCommentResponseDTO productCommentResponseDTO = new ProductCommentResponseDTO();
            productCommentResponseDTO.setId(productComment.getId());
            productCommentResponseDTO.setText(productComment.getText());
            productCommentResponseDTO.setProductId(productComment.getProduct().getId());
            productCommentResponseDTO.setUserId(productComment.getUser().getUserId());
            productCommentResponseDTO.setCreatedDate(productComment.getCreatedDate());
            return productCommentResponseDTO;
        }).toList();
    }

    @Override
    public void createProductComment(ProductCommentRequestDTO productCommentRequestDTO) {

        Product product = productRepository.findById(productCommentRequestDTO.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productCommentRequestDTO.getProductId()));

        ProductComment productComment = new ProductComment();
        productComment.setText(productCommentRequestDTO.getText());
        productComment.setProduct(product);
        productComment.setUser(userRepository.findById(AuthUtil.getUserId()).orElseThrow());
        productComment.setCreatedDate(productCommentRequestDTO.getCreatedDate());

        productCommentRepository.save(productComment);
    }

    @Override
    public void deleteProductComment(long productCommentId) {
        ProductComment productComment = productCommentRepository.findById(productCommentId).orElseThrow(() -> new ProductCommentNotFoundException("Product comment not found with id : " + productCommentId));
        productCommentRepository.delete(productComment);
    }

    @Override
    public void updateProductComment(long productCommentId, ProductCommentRequestDTO productCommentRequestDTO) {
        ProductComment productComment = productCommentRepository.findById(productCommentId).orElseThrow(() -> new ProductCommentNotFoundException("Product comment not found with id : " + productCommentId));
        productComment.setText(productCommentRequestDTO.getText());
        productCommentRepository.save(productComment);
    }
}
