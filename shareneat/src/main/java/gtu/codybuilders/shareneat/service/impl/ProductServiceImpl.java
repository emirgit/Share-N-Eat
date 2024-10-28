package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.model.Product;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.service.ProductService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;

    //@Autowired
    private final ModelMapper modelMapper;

    @Override
    public List<ProductResponseDTO> getAll() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO getProductById(long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));
        return modelMapper.map(product, ProductResponseDTO.class);
    }

    @Override
    public List<ProductResponseDTO> searchProducts(String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);

        return products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDTO> filterProducts(Map<String, String> filters) {
        Specification<Product> spec = Specification.where(null);

        for (Map.Entry<String, String> filter : filters.entrySet()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(filter.getKey()), filter.getValue()));
        }

        List<Product> products = productRepository.findAll(spec);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDTO> getSortedProducts(String criteria, String asc) {

        Comparator<Product> comparator = switch (criteria.toLowerCase()) {
            case "name" -> Comparator.comparing(Product::getName);
            case "brand" -> Comparator.comparing(Product::getBrand);
            case "calories" -> Comparator.comparing(Product::getCalories);
            case "protein" -> Comparator.comparing(Product::getProteinGrams);
            case "carbohydrates" -> Comparator.comparing(Product::getCarbohydrateGrams);
            case "fat" -> Comparator.comparing(Product::getFatGrams);
            case "fiber" -> Comparator.comparing(Product::getFiberGrams);
            case "sugar" -> Comparator.comparing(Product::getSugarGrams);
            case "rating" -> Comparator.comparing(Product::getRating);
            case "created" -> Comparator.comparing(Product::getCreated);
            default -> throw new IllegalArgumentException("Invalid sorting criteria: " + criteria);
        };

        if (asc.equals("desc")) {
            comparator = comparator.reversed();
        }

        List<Product> products = productRepository.findAll();

        List<Product> sortedProducts = products.stream()
                .sorted(comparator)
                .toList();

        return sortedProducts.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void createProduct(ProductRequestDTO productRequestDTO) {
        Product product = modelMapper.map(productRequestDTO, Product.class);
        productRepository.save(product);
    }

    @Override
    public void deleteProduct(long productId){
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));
        productRepository.delete(product);
    }

    @Override
    public void updateProduct(ProductRequestDTO productRequestDTO, long productId) {

        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));

        product.setName(productRequestDTO.getName());
        product.setBrand(productRequestDTO.getBrand());

        product.setCalories(product.getCalories());
        product.setCarbohydrateGrams(productRequestDTO.getCarbohydrateGrams());
        product.setFatGrams(productRequestDTO.getFatGrams());
        product.setProteinGrams(productRequestDTO.getProteinGrams());

        productRepository.save(product);
    }



}
