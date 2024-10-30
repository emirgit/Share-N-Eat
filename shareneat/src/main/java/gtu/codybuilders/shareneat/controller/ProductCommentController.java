package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.ProductCommentRequestDTO;
import gtu.codybuilders.shareneat.dto.ProductCommentResponseDTO;
import gtu.codybuilders.shareneat.service.ProductCommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/product-comments")
@AllArgsConstructor
public class ProductCommentController {

    private final ProductCommentService productCommentService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductCommentResponseDTO>> getAllProductCommentsOfProduct(long productId) {
        return ResponseEntity.ok(productCommentService.getAllProductCommentsOfProduct(productId));
    }

    @PostMapping()
    public ResponseEntity<Void> createProductComment(@RequestBody ProductCommentRequestDTO productCommentRequestDTO) {
        //eksik
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


}
