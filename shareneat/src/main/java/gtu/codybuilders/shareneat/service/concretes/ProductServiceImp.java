package gtu.codybuilders.shareneat.service.concretes;

import gtu.codybuilders.shareneat.DTO.request.ProductDeleteDTO;
import gtu.codybuilders.shareneat.DTO.request.ProductUpdateDTO;
import gtu.codybuilders.shareneat.dataAccess.ProductRepository;
import gtu.codybuilders.shareneat.entity.Product;
import gtu.codybuilders.shareneat.DTO.request.ProductCreateDTO;
import gtu.codybuilders.shareneat.DTO.response.ProductGetAllDTO;
import gtu.codybuilders.shareneat.service.abstracts.ProductService;
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
        // Mevcut ürünü veritabanından bul
        Product product = productRepository.findById(productUpdateDTO.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Güncellenmesi gereken alanları DTO'dan alıp mevcut ürüne aktar
        product.setName(productUpdateDTO.getName());
        product.setBrand(productUpdateDTO.getBrand());

        // Eğer Nutrition güncelleniyorsa, bunu da güncelleyebilirsiniz
        if (productUpdateDTO.getNutrition() != null) {
            product.getNutrition().setProteinGrams(productUpdateDTO.getNutrition().getProteinGrams());
            product.getNutrition().setCarbohydrateGrams(productUpdateDTO.getNutrition().getCarbohydrateGrams());
            product.getNutrition().setFatGrams(productUpdateDTO.getNutrition().getFatGrams());
        }

        // Güncellenmiş ürünü kaydet
        productRepository.save(product);
    }



}
