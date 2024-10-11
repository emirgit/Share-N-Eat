package gtu.codybuilders.shareneat.service.abstracts;

import gtu.codybuilders.shareneat.DTO.request.ProductCreateDTO;
import gtu.codybuilders.shareneat.DTO.request.ProductDeleteDTO;
import gtu.codybuilders.shareneat.DTO.request.ProductUpdateDTO;
import gtu.codybuilders.shareneat.DTO.response.ProductGetAllDTO;

import java.util.List;

public interface ProductService {

    List<ProductGetAllDTO> getAll();

    void createProduct(ProductCreateDTO productCreateDTO);

    void deleteProduct(ProductDeleteDTO productDeleteDTO);

    void updateProduct(ProductUpdateDTO productUpdateDTO);

}
