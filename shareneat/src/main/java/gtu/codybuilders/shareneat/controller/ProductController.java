package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.constant.PathConstants;
import gtu.codybuilders.shareneat.dto.AdminProductRequestRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.dto.UploadProductDTO;
import gtu.codybuilders.shareneat.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(PathConstants.PRODUCTS)
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    //returns all products stored in database, without ids
    @GetMapping(PathConstants.PRODUCTS_GET_ALL)
    public ResponseEntity<List<ProductResponseDTO>> getAll(){
        List<ProductResponseDTO> productResponseDTOS = productService.getAll();
        return ResponseEntity.ok(productResponseDTOS);
    }

    @GetMapping(PathConstants.PRODUCT_ID)
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable long productId){
        ProductResponseDTO productResponseDTO = productService.getProductById(productId);
        return ResponseEntity.ok(productResponseDTO);
    }

    @GetMapping(PathConstants.PRODUCT_GET_IMAGE)
    public ResponseEntity<Resource> getImage(@PathVariable Long productId){
        Resource image = productService.getImage(productId);
        return ResponseEntity.ok(image);
    }

    @GetMapping(PathConstants.SEARCH)
    public ResponseEntity<Page<ProductResponseDTO>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponseDTO> productPage = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/searchForProductPage")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        List<ProductResponseDTO> productResponseDTOS = productService.searchProductsForProductPage(keyword);
        return ResponseEntity.ok(productResponseDTOS);
    }

    @GetMapping(PathConstants.FILTER)
    public ResponseEntity<List<ProductResponseDTO>> filterProducts(@RequestParam Map<String, String> filters) {
        List<ProductResponseDTO> productResponseDTOS = productService.filterProducts(filters);
        return ResponseEntity.ok(productResponseDTOS);
    }


    @GetMapping(PathConstants.SORTED_BY) // "asc" or "desc" expected, "criteria" can be "name", "brand", "calories", "protein", "carbohydrates", "fat", "fiber" or "sugar"
    public ResponseEntity<List<ProductResponseDTO>> getSortedProducts(@PathVariable String criteria, @PathVariable String asc){
        List<ProductResponseDTO> productResponseDTOS = productService.getSortedProducts(criteria, asc);
        return ResponseEntity.ok(productResponseDTOS);
    }

    //saves a new product into database
    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createProduct(@Valid @ModelAttribute ProductRequestDTO productRequestDTO, @RequestPart("file") MultipartFile file) {
        productService.createProduct(productRequestDTO, file);
    }

//    @PostMapping(PathConstants.PRODUCT_REQUEST)
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public void createAddProductRequest(@Valid @ModelAttribute AdminProductRequestRequestDTO adminProductRequestRequestDTO, @RequestPart("file") MultipartFile file){
//        productService.createAddProductRequest(adminProductRequestRequestDTO, file);
//    }

    @PostMapping(PathConstants.PRODUCT_REQUEST)
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createAddProductRequest(@Valid @ModelAttribute UploadProductDTO uploadProductDTO,
                                        @RequestPart("image1") MultipartFile image,
                                        @RequestPart("image2") MultipartFile contentImage,
                                        @RequestPart("image3") MultipartFile macrotableImage){
        productService.createAddProductRequest(uploadProductDTO, image, contentImage, macrotableImage);
    }


    @DeleteMapping(PathConstants.PRODUCT_ID)
    //@ResponseStatus()
    public ResponseEntity<Void> delete(@PathVariable long productId){
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //IMAGE UPDATE WILL BE IMPLEMENTED LATER
    @PutMapping(PathConstants.PRODUCT_ID)
    public ResponseEntity<Void> update(@RequestBody ProductRequestDTO productRequestDTO, @PathVariable long productId){
        productService.updateProduct(productRequestDTO, productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(PathConstants.COUNT)
    public ResponseEntity<Long> getProductsCount() {
        Long productCount = productService.getProductsCount();
        return new ResponseEntity<>(productCount, HttpStatus.OK);
    }

    @GetMapping(PathConstants.DAILY_COUNT)
    public ResponseEntity<Long> getDailyProductCount() {
        Long dailyProductCount = productService.getDailyProductCount();
        return new ResponseEntity<>(dailyProductCount, HttpStatus.OK);
    }
}
