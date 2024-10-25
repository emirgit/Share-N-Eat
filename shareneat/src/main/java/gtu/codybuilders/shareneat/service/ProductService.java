package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.ProductCreateDTO;
import gtu.codybuilders.shareneat.dto.ProductDeleteDTO;
import gtu.codybuilders.shareneat.dto.ProductUpdateDTO;
import gtu.codybuilders.shareneat.dto.ProductGetAllDTO;

import java.util.List;

public interface ProductService {

    List<ProductGetAllDTO> getAll();

    void createProduct(ProductCreateDTO productCreateDTO);

    void deleteProduct(ProductDeleteDTO productDeleteDTO);

    void updateProduct(ProductUpdateDTO productUpdateDTO);

}
