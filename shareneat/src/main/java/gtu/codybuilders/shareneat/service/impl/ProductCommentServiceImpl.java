package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductCommentRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;
import gtu.codybuilders.shareneat.exception.ProductCommentNotFoundException;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.model.ProductComment;
import gtu.codybuilders.shareneat.repository.ProductCommentRepository;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.service.ProductCommentService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductCommentServiceImpl implements ProductCommentService {

    private final ProductCommentRepository productCommentRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductCommentResponseDTO> getAllProductCommentsOfProduct(long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));

        return productCommentRepository.findAllByProduct(product).stream()
                .map(productComment -> modelMapper.map(productComment, ProductCommentResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void createProductComment(ProductCommentRequestDTO productCommentRequestDTO) {
        ProductComment productComment = modelMapper.map(productCommentRequestDTO, ProductComment.class);
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
