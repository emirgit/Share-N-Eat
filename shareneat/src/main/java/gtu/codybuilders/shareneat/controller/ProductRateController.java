package gtu.codybuilders.shareneat.controller;


import gtu.codybuilders.shareneat.dto.ProductRateRequestDTO;
import gtu.codybuilders.shareneat.service.ProductRateService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/product-rate")
@AllArgsConstructor
public class ProductRateController {

    private final ProductRateService productRateService;

    @PostMapping
    public ResponseEntity<Void> rateProduct(ProductRateRequestDTO productRateRequestDTO) {
        productRateService.rateProduct(productRateRequestDTO);
        return ResponseEntity.ok().build();
    }

}
