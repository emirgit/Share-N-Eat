package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/products")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    //returns all products stored in database, without ids
    @GetMapping("/getAll")
    public ResponseEntity<List<ProductResponseDTO>> getAll(){
        List<ProductResponseDTO> productResponseDTOS = productService.getAll();
        return ResponseEntity.ok(productResponseDTOS);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable long productId){
        ProductResponseDTO productResponseDTO = productService.getProductById(productId);
        return ResponseEntity.ok(productResponseDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        List<ProductResponseDTO> productResponseDTOS = productService.searchProducts(keyword);
        return ResponseEntity.ok(productResponseDTOS);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponseDTO>> filterProducts(@RequestParam Map<String, String> filters) {
        List<ProductResponseDTO> productResponseDTOS = productService.filterProducts(filters);
        return ResponseEntity.ok(productResponseDTOS);
    }


    @GetMapping("/sortedBy{criteria}/{asc}") // "asc" or "desc" expected, "criteria" can be "name", "brand", "calories", "protein", "carbohydrates", "fat", "fiber" or "sugar"
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

    @DeleteMapping("/{productId}")
    //@ResponseStatus()
    public ResponseEntity<Void> delete(@PathVariable long productId){
        productService.deleteProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //IMAGE UPDATE WILL BE IMPLEMENTED LATER
    @PutMapping("/{productId}")
    public ResponseEntity<Void> update(@RequestBody ProductRequestDTO productRequestDTO, @PathVariable long productId){
        productService.updateProduct(productRequestDTO, productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
