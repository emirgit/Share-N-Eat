package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.ProductRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/products")
@AllArgsConstructor
public class ProductController {

    private ProductService productService;

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

    @GetMapping("/sortedBy{criteria}{asc}") // "asc" or "desc" expected
    public ResponseEntity<List<ProductResponseDTO>> getSortedProducts(@PathVariable String criteria, @PathVariable String asc){
        List<ProductResponseDTO> productResponseDTOS = productService.getSortedProducts(criteria, asc);
        return ResponseEntity.ok(productResponseDTOS);
    }

    //saves a new product into database
    @PostMapping()
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createProduct(@RequestBody ProductRequestDTO productRequestDTO) {
        productService.createProduct(productRequestDTO);
    }

    @DeleteMapping("/{productId}")
    //@ResponseStatus()
    public void delete(@PathVariable long productId){
        productService.deleteProduct(productId);
    }

    @PutMapping("/{productId}")
    public void update(@RequestBody ProductRequestDTO productRequestDTO, @PathVariable long productId){
        productService.updateProduct(productRequestDTO, productId);
    }

}
