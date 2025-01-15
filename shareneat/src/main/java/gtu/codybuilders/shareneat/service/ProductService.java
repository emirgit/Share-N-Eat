package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.AdminProductRequestRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.dto.UploadProductDTO;
import gtu.codybuilders.shareneat.model.Product;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ProductService {

    List<ProductResponseDTO> getAll();

    void createProduct(ProductRequestDTO productRequestDTO, MultipartFile file);
    void adminCreateProduct(Product product);
    void deleteProduct(long productId);

    void updateProduct(ProductRequestDTO productRequestDTO, long productId);

    ProductResponseDTO getProductById(long productId);

    List<ProductResponseDTO> getSortedProducts(String criteria, String asc);

    Page<ProductResponseDTO> searchProducts(String keyword, Pageable pageable);

    List<ProductResponseDTO> filterProducts(Map<String, String> filters);

    Resource getImage(Long productId);

    void createAddProductRequest(UploadProductDTO uploadProductDTO, MultipartFile image, MultipartFile contentImage, MultipartFile macrotableImage);

    Long getProductsCount();
    Long getDailyProductCount();
}
