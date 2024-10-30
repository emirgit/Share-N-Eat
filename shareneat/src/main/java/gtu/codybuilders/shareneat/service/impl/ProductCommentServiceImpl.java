package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.repository.ProductCommentRepository;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
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
    private final UserRepository userRepository;
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
    public void createProductComment(ProductRequestDTO productRequestDTO) {

    }

    @Override
    public void deleteProductComment(long productId) {

    }

    @Override
    public void updateProductComment(long productId, ProductRequestDTO productRequestDTO) {

    }
}
