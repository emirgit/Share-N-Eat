package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.service.FavoriteProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/favoriteProducts")
@AllArgsConstructor
public class FavoriteProductController {

    private final FavoriteProductService favoriteProductService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getFavoriteProducts(@PathVariable Long userId) {
        return new ResponseEntity<>(favoriteProductService.getFavoriteProductsOfUser(userId), HttpStatus.OK);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Void> addFavoriteProduct(@PathVariable Long productId,@RequestBody Long userId) {
        favoriteProductService.addFavoriteProduct(productId, userId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFavoriteProduct(@PathVariable Long productId,@RequestBody Long userId) {
        favoriteProductService.removeFavoriteProduct(productId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
