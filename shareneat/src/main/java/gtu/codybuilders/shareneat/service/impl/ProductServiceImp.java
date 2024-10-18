package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductDeleteDTO;
import gtu.codybuilders.shareneat.dto.ProductUpdateDTO;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.dto.ProductCreateDTO;
import gtu.codybuilders.shareneat.dto.ProductGetAllDTO;
import gtu.codybuilders.shareneat.service.ProductService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImp implements ProductService {

    private ProductRepository productRepository;

    //@Autowired
    private final ModelMapper modelMapper;

    @Override
    public List<ProductGetAllDTO> getAll() {
        List<Product> products = productRepository.findAll();

        List<ProductGetAllDTO> productGetAllDTOList = products.stream()
                .map(product -> modelMapper.map(product, ProductGetAllDTO.class))
                .collect(Collectors.toList());

        return productGetAllDTOList;
    }

    @Override
    public void createProduct(ProductCreateDTO productCreateDTO) {
        Product product = modelMapper.map(productCreateDTO, Product.class);
        productRepository.save(product);
    }

    @Override
    public void deleteProduct(ProductDeleteDTO productDeleteDTO){
        Product product = modelMapper.map(productDeleteDTO, Product.class);
        productRepository.delete(product);
    }

    @Override
    public void updateProduct(ProductUpdateDTO productUpdateDTO) {

        Product product = productRepository.findById(productUpdateDTO.getId()).orElseThrow();

        product.setName(productUpdateDTO.getName());
        product.setBrand(productUpdateDTO.getBrand());

        if (productUpdateDTO.getNutrition() != null) {
            //
            product.getNutrition().setProteinGrams(productUpdateDTO.getNutrition().getProteinGrams());
            product.getNutrition().setCarbohydrateGrams(productUpdateDTO.getNutrition().getCarbohydrateGrams());
            product.getNutrition().setFatGrams(productUpdateDTO.getNutrition().getFatGrams());
            product.getNutrition().setCalories(productUpdateDTO.getNutrition().getCalories());
        }

        productRepository.save(product);
    }



}
