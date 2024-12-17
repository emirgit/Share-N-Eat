package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.AdminProductRequestRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ProductService {

    List<ProductResponseDTO> getAll();

    void createProduct(ProductRequestDTO productRequestDTO, MultipartFile file);

    void deleteProduct(long productId);

    void updateProduct(ProductRequestDTO productRequestDTO, long productId);

    ProductResponseDTO getProductById(long productId);

    List<ProductResponseDTO> getSortedProducts(String criteria, String asc);

    List<ProductResponseDTO> searchProducts(String keyword);

    List<ProductResponseDTO> filterProducts(Map<String, String> filters);

    Resource getImage(Long productId);

    void createAddProductRequest(AdminProductRequestRequestDTO adminProductRequestRequestDTO,  List<MultipartFile> files);

}
