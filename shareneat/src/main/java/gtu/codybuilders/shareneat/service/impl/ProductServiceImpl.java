package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.controller.AdminController;
import gtu.codybuilders.shareneat.dto.AdminProductRequestRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.dto.UploadProductDTO;
import gtu.codybuilders.shareneat.exception.ProductNotFoundException;
import gtu.codybuilders.shareneat.exception.UserNotFoundException;
import gtu.codybuilders.shareneat.model.*;
import gtu.codybuilders.shareneat.repository.AdminProductRequestRepository;
import gtu.codybuilders.shareneat.repository.ProductRepository;
import gtu.codybuilders.shareneat.repository.UserRepository;
import gtu.codybuilders.shareneat.service.ImageProcessingService;
import gtu.codybuilders.shareneat.service.ImageService;
import gtu.codybuilders.shareneat.service.ProductService;
import gtu.codybuilders.shareneat.util.AuthUtil;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);
    private UserRepository userRepository;
    private ProductRepository productRepository;
    private ImageService imageService;
    private AdminProductRequestRepository adminProductRequestRepository;

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
    public Resource getImage(Long productId){
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));
        return imageService.loadImage(product.getImageUrl(), PathConstants.UPLOAD_DIR_PRODUCT);
    }

    @Override
    public Page<ProductResponseDTO> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable)
                .map(product -> modelMapper.map(product, ProductResponseDTO.class));
    }

    @Override
    public List<ProductResponseDTO> searchProductsForProductPage(String keyword) {
        List<Product> products = productRepository.searchProductsForProductPage(keyword);

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
            case "carbonhydrates" -> Comparator.comparing(Product::getCarbonhydrateGrams);
            case "fat" -> Comparator.comparing(Product::getFatGrams);
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

    private void bindImageWithProduct(Product product, MultipartFile file) {

        if (file == null) {
            product.setImageUrl(PathConstants.defaultProductImage);
            return;
        }
        try {
            String fileName = imageService.saveImage(file, PathConstants.UPLOAD_DIR_PRODUCT);
            product.setImageUrl(fileName);
        }catch (IOException e) {
            System.out.println("Error saving image");
        }

    }

    @Override
    public void createProduct(ProductRequestDTO productRequestDTO, MultipartFile file) {
        Product product = modelMapper.map(productRequestDTO, Product.class);
        product.setCreated(Instant.now());

        this.bindImageWithProduct(product,file);
        productRepository.save(product);
    }

    @Override
    public void adminCreateProduct(Product product) {
        product.setCreated(Instant.now());
        productRepository.save(product);
    }


    @Override
    public void createAddProductRequest(UploadProductDTO uploadProductDTO,
                                        MultipartFile image,
                                        MultipartFile contentImage,
                                        MultipartFile macrotableImage) {

        AdminProductRequest adminProductRequest = new AdminProductRequest();
        adminProductRequest.setName(uploadProductDTO.getName());
        adminProductRequest.setBrand(uploadProductDTO.getBrand());
        adminProductRequest.setCategory(uploadProductDTO.getCategory());
        adminProductRequest.setRequestTime(Instant.now());
        //User user = userRepository.findById(AuthUtil.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found"));
        //adminProductRequest.setUser(user);

        try {
            String imageUrl = imageService.saveImage(image, PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
            String contentImageUrl = imageService.saveImage(contentImage, PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);
            String macrotableImageUrl = imageService.saveImage(macrotableImage, PathConstants.UPLOAD_DIR_ADMIN_PRODUCT_REQUEST);

            adminProductRequest.setImageUrl(imageUrl);
            adminProductRequest.setContentImageUrl(contentImageUrl);
            adminProductRequest.setMacrotableImageUrl(macrotableImageUrl);

            try {
                ImageProcessingService imageProcessingService = new ImageProcessingServiceImpl();
                NutritionInfo nutritionInfo = imageProcessingService.parseImages(macrotableImageUrl, contentImageUrl);

                adminProductRequest.setDescription(nutritionInfo.getContent());
                adminProductRequest.setCalories(nutritionInfo.getCalories());
                adminProductRequest.setProteinGrams(nutritionInfo.getProteinGrams());
                adminProductRequest.setCarbonhydrateGrams(nutritionInfo.getCarbonhydrateGrams());
                adminProductRequest.setFatGrams(nutritionInfo.getFatGrams());
            } catch (Exception ex) {
                logger.error("An exception occured when trying to process image");
            }

            adminProductRequest.setQuantity(100.0);

        } catch (IOException e) {
            System.out.println("Error saving image");
        }

        adminProductRequestRepository.save(adminProductRequest);
    }

    @Override
    public void deleteProduct(long productId){
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));
        imageService.deleteImage(product.getImageUrl(), PathConstants.UPLOAD_DIR_PRODUCT);
        productRepository.delete(product);
    }

    @Override
    public void updateProduct(ProductRequestDTO productRequestDTO, long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id : " + productId));

        // Update the fields of the existing product
        product.setName(productRequestDTO.getName());
        product.setBrand(productRequestDTO.getBrand());
        product.setCategory(productRequestDTO.getCategory());
        product.setContent(productRequestDTO.getContent());
        //product.setImageUrl(productRequestDTO.getImageUrl());
        product.setQuantity(productRequestDTO.getQuantity());
        product.setCalories(productRequestDTO.getCalories());
        product.setProteinGrams(productRequestDTO.getProteinGrams());
        product.setCarbonhydrateGrams(productRequestDTO.getCarbonhydrateGrams());
        product.setFatGrams(productRequestDTO.getFatGrams());

        productRepository.save(product);
    }

    @Override
    public Long getProductsCount(){
        return productRepository.count();
    }

    @Override
    public Long getDailyProductCount(){
        Instant startOfDay = Instant.now().truncatedTo(ChronoUnit.DAYS); // Start of today
        Instant endOfDay = startOfDay.plus(1, ChronoUnit.DAYS); // End of today
        return productRepository.countProductsCreatedBetween(startOfDay, endOfDay);
    }

}