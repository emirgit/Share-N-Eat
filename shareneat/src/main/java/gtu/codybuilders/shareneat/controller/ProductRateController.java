package gtu.codybuilders.shareneat.controller;


import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;
import gtu.codybuilders.shareneat.service.ProductRateService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product-rate")
@AllArgsConstructor
public class ProductRateController {

    private final ProductRateService productRateService;

    @PostMapping
    public ResponseEntity<Void> rateProduct(ProductRateRequestDTO productRateRequestDTO) {
        productRateService.rateProduct(productRateRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> unrateProduct(@PathVariable Long productId) {
        productRateService.unrateProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
