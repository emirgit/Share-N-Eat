package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.service.DTO.ProductGetAllDTO;
import gtu.codybuilders.shareneat.service.abstracts.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
