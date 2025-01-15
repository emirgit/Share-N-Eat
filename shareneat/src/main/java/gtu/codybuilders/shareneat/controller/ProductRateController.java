package gtu.codybuilders.shareneat.controller;


import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;
import gtu.codybuilders.shareneat.service.ProductRateService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-rate")
@AllArgsConstructor
public class ProductRateController {

    private final ProductRateService productRateService;

    @GetMapping("/current-user-rate/{productId}")
    public ResponseEntity<Double> getCurrentUserRate(@PathVariable("productId") Long productId) {
        Double rate = productRateService.getCurrentUserRate(productId);
        if (rate == null) {
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(rate, HttpStatus.OK);
    }

    @GetMapping("product-raters-list-usernames/{productId}")
    public ResponseEntity<List<String>> getProductRatersListUsernames(@PathVariable("productId") Long productId) {
        List<String> usernames = productRateService.getProductRatersListUsernames(productId);
        return new ResponseEntity<>(usernames, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> rateProduct(@RequestBody ProductRateRequestDTO productRateRequestDTO) {
        productRateService.rateProduct(productRateRequestDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> unrateProduct(@PathVariable Long productId) {
        productRateService.unrateProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
