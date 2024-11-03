package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.ProductResponseDTO;
import gtu.codybuilders.shareneat.service.FavoriteProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/favoriteProducts")
@AllArgsConstructor
public class FavoriteProductController {

    private final FavoriteProductService favoriteProductService;

    @GetMapping()
    public ResponseEntity<List<ProductResponseDTO>> getFavoriteProducts() {
        List<ProductResponseDTO> favoriteProducts = favoriteProductService.getFavoriteProductsOfUser();
        return ResponseEntity.ok(favoriteProducts);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Void> addFavoriteProduct(@PathVariable Long productId) {
        favoriteProductService.addFavoriteProduct(productId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFavoriteProduct(@PathVariable Long productId) {
        favoriteProductService.removeFavoriteProduct(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
