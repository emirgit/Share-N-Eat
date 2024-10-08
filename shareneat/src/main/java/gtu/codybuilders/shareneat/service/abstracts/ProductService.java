package gtu.codybuilders.shareneat.service.abstracts;

import gtu.codybuilders.shareneat.entity.Product;
import gtu.codybuilders.shareneat.service.DTO.ProductCreateDTO;
import gtu.codybuilders.shareneat.service.DTO.ProductGetAllDTO;

import java.util.List;

public interface ProductService {

    List<ProductGetAllDTO> getAll();

    ProductCreateDTO createProduct(String name, String brand);


}
