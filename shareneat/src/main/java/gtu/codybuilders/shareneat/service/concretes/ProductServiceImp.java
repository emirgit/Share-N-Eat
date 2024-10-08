package gtu.codybuilders.shareneat.service.concretes;

import gtu.codybuilders.shareneat.dataAccess.ProductRepository;
import gtu.codybuilders.shareneat.entity.Product;
import gtu.codybuilders.shareneat.service.DTO.ProductCreateDTO;
import gtu.codybuilders.shareneat.service.DTO.ProductGetAllDTO;
import gtu.codybuilders.shareneat.service.abstracts.ProductService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImp implements ProductService {

    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ProductGetAllDTO> getAll() {
        List<Product> products = productRepository.findAll();

        List<ProductGetAllDTO> productGetAllDTOList = products.stream()
                .map(product -> modelMapper.map(product, ProductGetAllDTO.class))
                .collect(Collectors.toList());

        return productGetAllDTOList;
    }

    @Override
    public ProductCreateDTO createProduct(String name, String brand) {
        return null;
    }
}
