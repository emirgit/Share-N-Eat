package gtu.codybuilders.shareneat.service.abstracts;

import gtu.codybuilders.shareneat.service.DTO.request.ProductCreateDTO;
import gtu.codybuilders.shareneat.service.DTO.response.ProductGetAllDTO;

import java.util.List;

public interface ProductService {

    List<ProductGetAllDTO> getAll();

    void createProduct(ProductCreateDTO productCreateDTO);


}
