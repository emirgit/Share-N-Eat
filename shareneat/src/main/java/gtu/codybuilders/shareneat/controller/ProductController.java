package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.DTO.request.ProductCreateDTO;
import gtu.codybuilders.shareneat.DTO.response.ProductGetAllDTO;
import gtu.codybuilders.shareneat.service.abstracts.ProductService;
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
    @GetMapping()
    public ResponseEntity<List<ProductGetAllDTO>> getAll(){
        List<ProductGetAllDTO> productGetAllDTOS = productService.getAll();
        return ResponseEntity.ok(productGetAllDTOS);
    }

    //saves a new product into database
    @PostMapping()
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createProduct(@RequestBody ProductCreateDTO productCreateDTO) {
        productService.createProduct(productCreateDTO);
    }

}
